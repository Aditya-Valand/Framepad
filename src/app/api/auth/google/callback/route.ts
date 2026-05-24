import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { sql } from '@/lib/db';
import { signAccessToken, signRefreshToken } from '@/lib/jwt';

interface GoogleTokenResponse {
  access_token: string;
  id_token: string;
  error?: string;
}

interface GoogleUserInfo {
  sub: string;
  email: string;
  name: string;
  picture: string;
  email_verified: boolean;
}

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code');
  const state = req.nextUrl.searchParams.get('state') ?? '/editor';
  const oauthError = req.nextUrl.searchParams.get('error');

  if (oauthError || !code) {
    return NextResponse.redirect(new URL('/auth?error=oauth_cancelled', req.url));
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI;

  if (!clientId || !clientSecret || !redirectUri) {
    return NextResponse.redirect(new URL('/auth?error=oauth_misconfigured', req.url));
  }

  try {
    // Exchange code for tokens
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });

    const tokens = (await tokenRes.json()) as GoogleTokenResponse;
    if (tokens.error || !tokens.access_token) {
      console.error('[google/callback] token exchange failed', tokens);
      return NextResponse.redirect(new URL('/auth?error=oauth_failed', req.url));
    }

    // Fetch user info
    const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });
    const googleUser = (await userInfoRes.json()) as GoogleUserInfo;

    if (!googleUser.email) {
      return NextResponse.redirect(new URL('/auth?error=oauth_no_email', req.url));
    }

    const normalizedEmail = googleUser.email.toLowerCase();

    // Upsert user
    const existing = await sql`
      SELECT id, role, is_banned FROM users WHERE email = ${normalizedEmail} LIMIT 1
    `;

    let userId: string;
    let role: string;

    if (existing.length > 0) {
      if (existing[0].is_banned) {
        return NextResponse.redirect(new URL('/auth?error=suspended', req.url));
      }
      userId = existing[0].id;
      role = existing[0].role;
      await sql`
        UPDATE users SET last_login_at = NOW(), email_verified_at = COALESCE(email_verified_at, NOW())
        WHERE id = ${userId}
      `;
    } else {
      const [newUser] = await sql`
        INSERT INTO users (email, email_verified_at)
        VALUES (${normalizedEmail}, NOW())
        RETURNING id, role
      `;
      userId = newUser.id;
      role = newUser.role;

      await sql`
        INSERT INTO user_profiles (user_id, full_name, avatar_url)
        VALUES (${userId}, ${googleUser.name ?? ''}, ${googleUser.picture ?? ''})
      `;
    }

    const sessionId = crypto.randomUUID();
    const accessToken = signAccessToken({ userId, email: normalizedEmail, role: role as 'customer' | 'admin', is_banned: false });
    const refreshToken = signRefreshToken(userId, sessionId);
    const refreshHash = await bcrypt.hash(refreshToken, 8);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await sql`
      INSERT INTO user_sessions (id, user_id, refresh_token_hash, expires_at)
      VALUES (${sessionId}, ${userId}, ${refreshHash}, ${expiresAt})
    `;

    const redirectTarget = state.startsWith('/') ? state : '/editor';
    const res = NextResponse.redirect(new URL(redirectTarget, req.url));

    res.cookies.set('access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3600,
      path: '/',
    });
    res.cookies.set('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 604800,
      path: '/api/auth/refresh',
    });

    return res;
  } catch (e) {
    console.error('[google/callback]', e);
    return NextResponse.redirect(new URL('/auth?error=server_error', req.url));
  }
}
