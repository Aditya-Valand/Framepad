import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export const ok = (data: unknown, status = 200) =>
  NextResponse.json(data, { status });

export const err = (message: string, status = 400) =>
  NextResponse.json({ error: message }, { status });

export const userId = (req: Request): string =>
  req.headers.get('x-user-id') ?? '';

export const userRole = (req: Request): string =>
  req.headers.get('x-user-role') ?? '';

export const userEmail = (req: Request): string =>
  req.headers.get('x-user-email') ?? '';

/**
 * Live DB ban check — call this in sensitive API routes to close the
 * window between ban action and access-token expiry (max 1h).
 * Returns a 403 NextResponse if banned, or null if the user is fine.
 */
export async function assertNotBanned(req: Request): Promise<NextResponse | null> {
  const uid = userId(req);
  if (!uid) return err('Unauthorized', 401);
  const [row] = await sql`
    SELECT is_banned FROM users WHERE id = ${uid} AND deleted_at IS NULL LIMIT 1
  ` as Array<{ is_banned: boolean }>;
  if (!row || row.is_banned) return err('Account suspended', 403);
  return null;
}