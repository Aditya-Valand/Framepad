import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import { sql } from '@/lib/db';
import { verifyRefreshToken } from '@/lib/jwt';

export async function POST() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get('refresh_token')?.value;

  if (refreshToken) {
    try {
      // Decode JWT to get userId — lets us scope the scan to one user's sessions only
      const payload = verifyRefreshToken(refreshToken);

      const sessions = await sql`
        SELECT id, refresh_token_hash FROM user_sessions
        WHERE user_id = ${payload.userId}
          AND expires_at > NOW()
      ` as Array<{ id: string; refresh_token_hash: string }>;

      for (const session of sessions) {
        const match = await bcrypt.compare(refreshToken, session.refresh_token_hash);
        if (match) {
          await sql`DELETE FROM user_sessions WHERE id = ${session.id}`;
          break;
        }
      }
    } catch {
      // Token already expired or invalid — still clear cookies below
    }
  }

  const res = NextResponse.json({ success: true }, { status: 200 });
  res.cookies.set('access_token', '', { maxAge: 0, path: '/' });
  res.cookies.set('refresh_token', '', { maxAge: 0, path: '/api/auth/refresh' });
  return res;
}
