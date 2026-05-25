import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { sql } from '@/lib/db';
import { verifyRefreshToken, signAccessToken, signRefreshToken } from '@/lib/jwt';

const ACCESS_MAX_AGE  = 3600;           // 1 hour
const REFRESH_MAX_AGE = 7 * 24 * 3600; // 7 days

function setAuthCookies(res: NextResponse, accessToken: string, refreshToken: string) {
  const secure = process.env.NODE_ENV === 'production';
  res.cookies.set('access_token', accessToken, {
    httpOnly: true, secure, sameSite: 'strict',
    maxAge: ACCESS_MAX_AGE, path: '/',
  });
  res.cookies.set('refresh_token', refreshToken, {
    httpOnly: true, secure, sameSite: 'strict',
    maxAge: REFRESH_MAX_AGE, path: '/api/auth/refresh',
  });
}

function clearAuthCookies(res: NextResponse) {
  res.cookies.set('access_token',  '', { maxAge: 0, path: '/' });
  res.cookies.set('refresh_token', '', { maxAge: 0, path: '/api/auth/refresh' });
}

async function rotateSession(refreshToken: string): Promise<{
  accessToken: string;
  newRefreshToken: string;
} | null> {
  let payload: { userId: string; sessionId: string };
  try {
    payload = verifyRefreshToken(refreshToken);
  } catch {
    return null;
  }

  const sessions = await sql`
    SELECT id, refresh_token_hash, user_id
    FROM user_sessions
    WHERE user_id = ${payload.userId} AND expires_at > NOW()
  ` as Array<{ id: string; refresh_token_hash: string; user_id: string }>;

  let matchedSession: { id: string; user_id: string } | null = null;
  for (const session of sessions) {
    if (await bcrypt.compare(refreshToken, session.refresh_token_hash)) {
      matchedSession = session;
      break;
    }
  }
  if (!matchedSession) return null;

  const [user] = await sql`
    SELECT id, email, role FROM users
    WHERE id = ${matchedSession.user_id} AND is_banned = false
    LIMIT 1
  ` as Array<{ id: string; email: string; role: string }>;
  if (!user) return null;

  // Rotate: invalidate old session, create new one atomically
  const newSessionId     = crypto.randomUUID();
  const newRefreshToken  = signRefreshToken(user.id, newSessionId);
  const newRefreshHash   = await bcrypt.hash(newRefreshToken, 8);
  const newExpiry        = new Date(Date.now() + REFRESH_MAX_AGE * 1000);

  await sql`DELETE FROM user_sessions WHERE id = ${matchedSession.id}`;
  await sql`
    INSERT INTO user_sessions (id, user_id, refresh_token_hash, expires_at)
    VALUES (${newSessionId}, ${user.id}, ${newRefreshHash}, ${newExpiry})
  `;

  const accessToken = signAccessToken({ userId: user.id, email: user.email, role: user.role as 'admin' | 'customer', is_banned: false });
  return { accessToken, newRefreshToken };
}

// GET — used by middleware when a page-level access token expires; redirects back
export async function GET(req: NextRequest) {
  const next = req.nextUrl.searchParams.get('next') ?? '/';
  const refreshToken = req.cookies.get('refresh_token')?.value;

  if (!refreshToken) {
    return NextResponse.redirect(new URL(`/auth?redirect=${encodeURIComponent(next)}`, req.url));
  }

  try {
    const result = await rotateSession(refreshToken);
    if (!result) {
      const res = NextResponse.redirect(new URL(`/auth?redirect=${encodeURIComponent(next)}`, req.url));
      clearAuthCookies(res);
      return res;
    }
    const res = NextResponse.redirect(new URL(next, req.url));
    setAuthCookies(res, result.accessToken, result.newRefreshToken);
    return res;
  } catch {
    const res = NextResponse.redirect(new URL(`/auth?redirect=${encodeURIComponent(next)}`, req.url));
    clearAuthCookies(res);
    return res;
  }
}

// POST — used by client-side code for silent token refresh on 401 responses
export async function POST(req: NextRequest) {
  const refreshToken = req.cookies.get('refresh_token')?.value;

  if (!refreshToken) {
    return NextResponse.json({ error: 'No session' }, { status: 401 });
  }

  try {
    const result = await rotateSession(refreshToken);
    if (!result) {
      const res = NextResponse.json({ error: 'Session expired. Please log in again.' }, { status: 401 });
      clearAuthCookies(res);
      return res;
    }
    const res = NextResponse.json({ ok: true });
    setAuthCookies(res, result.accessToken, result.newRefreshToken);
    return res;
  } catch (e) {
    console.error('[refresh POST]', e);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
