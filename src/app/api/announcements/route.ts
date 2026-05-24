import { sql } from '@/lib/db';
import { ok, err } from '@/lib/api';
import { NextRequest } from 'next/server';

// Public — Active Announcements
// GET /api/announcements?loggedIn=true|false
export async function GET(req: NextRequest) {
  try {
    const loggedIn = req.nextUrl.searchParams.get('loggedIn') === 'true';

    const rows = await sql`
      SELECT id, title, message, type, target, starts_at, ends_at
      FROM admin_announcements
      WHERE is_active = TRUE
        AND (starts_at IS NULL OR starts_at <= NOW())
        AND (ends_at   IS NULL OR ends_at   >= NOW())
        AND target IN ('all', ${loggedIn ? 'logged_in' : 'all'})
      ORDER BY created_at DESC
    `;

    return ok({ announcements: rows });
  } catch (error) {
    console.error('Public announcements error:', error);
    return err('Failed to fetch announcements', 500);
  }
}
