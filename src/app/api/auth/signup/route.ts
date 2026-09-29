import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { sql } from '@/lib/db';
import { signAccessToken, signRefreshToken } from '@/lib/jwt';
import { signupSchema } from '@/lib/validations';
import { err } from '@/lib/api';
import { earnCoins, hasReceivedBonus, COIN_BONUSES } from '@/lib/coins';

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return err('Invalid request body', 400);
  }

  const parsed = signupSchema.safeParse(body);
  if (!parsed.success) {
    return err(parsed.error.issues[0].message, 400);
  }

  const { email, fullName, password, referralCode } = parsed.data;
  const normalizedEmail = email.toLowerCase().trim();

  try {
    const existing = await sql`
      SELECT id FROM users WHERE email = ${normalizedEmail} LIMIT 1
    `;
    if (existing.length > 0) {
      return err('Email already registered', 409);
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const [user] = await sql`
      INSERT INTO users (email, password_hash)
      VALUES (${normalizedEmail}, ${passwordHash})
      RETURNING id, email, role
    `;

    await sql`
      INSERT INTO user_profiles (user_id, full_name)
      VALUES (${user.id}, ${fullName})
    `;

    const sessionId = crypto.randomUUID();
    const accessToken = signAccessToken({ userId: user.id, email: normalizedEmail, role: user.role });
    const refreshToken = signRefreshToken(user.id, sessionId);
    const refreshHash = await bcrypt.hash(refreshToken, 8);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await sql`
      INSERT INTO user_sessions (id, user_id, refresh_token_hash, expires_at)
      VALUES (${sessionId}, ${user.id}, ${refreshHash}, ${expiresAt})
    `;

    // Grant signup bonus (idempotent via hasReceivedBonus check)
    const alreadyBonused = await hasReceivedBonus(user.id, 'signup_bonus');
    if (!alreadyBonused) {
      await earnCoins(user.id, COIN_BONUSES.signup, 'signup_bonus');
    }

    // Handle referral: credit referrer +25 coins
    if (referralCode) {
      const [referrer] = await sql`
        SELECT id FROM user_profiles WHERE referral_code = ${referralCode} LIMIT 1
      ` as Array<{ id: string }>;
      if (referrer && referrer.id !== user.id) {
        await sql`
          INSERT INTO referrals (referrer_id, referred_id)
          VALUES (${referrer.id}, ${user.id})
          ON CONFLICT (referred_id) DO NOTHING
        `;
        await earnCoins(referrer.id, COIN_BONUSES.referral, 'referral', user.id);
      }
    }

    const res = NextResponse.json(
      { user: { id: user.id, email: normalizedEmail, role: user.role } },
      { status: 201 }
    );

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
    console.error('[signup]', e);
    return err('Something went wrong. Please try again.', 500);
  }
}
