import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { sql } from '@/lib/db';
import { signAccessToken, signRefreshToken } from '@/lib/jwt';
import { loginSchema } from '@/lib/validations';
import { err } from '@/lib/api';

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return err('Invalid request body', 400);
  }

  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return err(parsed.error.issues[0].message, 400);
  }

  const { email, password } = parsed.data;
  const normalizedEmail = email.toLowerCase().trim();

  try {
    const rows = await sql`
      SELECT id, email, password_hash, role, is_active, is_banned
      FROM users
      WHERE email = ${normalizedEmail}
      LIMIT 1
    `;

    if (rows.length === 0) {
      // Constant-time fake compare to prevent user enumeration timing attacks
      await bcrypt.compare(password, '$2b$10$invalidhashpadding1234567890123456789012');
      return err('Invalid email or password', 401);
    }

    const user = rows[0];

    if (user.is_banned) {
      return err('Account suspended. Contact support.', 403);
    }

    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      return err('Invalid email or password', 401);
    }

    await sql`
      UPDATE users SET last_login_at = NOW() WHERE id = ${user.id}
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

    const res = NextResponse.json(
      { user: { id: user.id, email: normalizedEmail, role: user.role } },
      { status: 200 }
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
    console.error('[login]', e);
    return err('Something went wrong. Please try again.', 500);
  }
}
