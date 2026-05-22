import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { sql } from '@/lib/db';
import { verifyRefreshToken, signAccessToken } from '@/lib/jwt';
import { err } from '@/lib/api';

export async function GET(req: NextRequest) {
  const next = req.nextUrl.searchParams.get('next') ?? '/editor';
  const refreshToken = req.cookies.get('refresh_token')?.value;

  if (!refreshToken) {
    return NextResponse.redirect(new URL(`/auth?redirect=${next}`, req.url));
  }

  try {
    const payload = verifyRefreshToken(refreshToken);

    const sessions = await sql`
      SELECT id, refresh_token_hash, user_id FROM user_sessions
      WHERE user_id = ${payload.userId}
        AND expires_at > NOW()
    ` as Array<{ id: string; refresh_token_hash: string; user_id: string }>;

    let matchedSession: { id: string; user_id: string } | null = null;
    for (const session of sessions) {
      const match = await bcrypt.compare(refreshToken, session.refresh_token_hash);
      if (match) {
        matchedSession = session;
        break;
      }
    }

    if (!matchedSession) {
      const res = NextResponse.redirect(new URL(`/auth?redirect=${next}`, req.url));
      res.cookies.set('access_token', '', { maxAge: 0, path: '/' });
      res.cookies.set('refresh_token', '', { maxAge: 0, path: '/api/auth/refresh' });
      return res;
    }

    const [user] = await sql`
      SELECT id, email, role FROM users WHERE id = ${matchedSession.user_id} LIMIT 1
    `;

    if (!user) {
      return NextResponse.redirect(new URL(`/auth?redirect=${next}`, req.url));
    }

    const newAccessToken = signAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    const res = NextResponse.redirect(new URL(next, req.url));
    res.cookies.set('access_token', newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3600,
      path: '/',
    });

    return res;
  } catch {
    const res = NextResponse.redirect(new URL(`/auth?redirect=${next}`, req.url));
    res.cookies.set('access_token', '', { maxAge: 0, path: '/' });
    res.cookies.set('refresh_token', '', { maxAge: 0, path: '/api/auth/refresh' });
    return res;
  }
}
