import { sql } from '@/lib/db';
import { ok, err, userId } from '@/lib/api';
import { NextRequest } from 'next/server';

// A24 — Announcement List
// GET /api/admin/announcements
export async function GET(req: NextRequest) {
  const adminId = userId(req);
  if (!adminId) return err('Unauthorized', 401);

  try {
    const rows = await sql`
      SELECT
        id, title, message, type, target,
        is_active, starts_at, ends_at, created_at,
        CASE
          WHEN NOT is_active                               THEN 'disabled'
          WHEN ends_at IS NOT NULL AND ends_at < NOW()     THEN 'expired'
          WHEN starts_at IS NOT NULL AND starts_at > NOW() THEN 'scheduled'
          ELSE 'active'
        END AS current_status
      FROM admin_announcements
      ORDER BY created_at DESC
    `;

    return ok({ announcements: rows });
  } catch (error) {
    console.error('Announcements GET error:', error);
    return err('Failed to fetch announcements', 500);
  }
}

// A24 — Create Announcement
// POST /api/admin/announcements
export async function POST(req: NextRequest) {
  const adminId = userId(req);
  if (!adminId) return err('Unauthorized', 401);

  try {
    const body = await req.json();
    const {
      title,
      message,
      type      = 'info',
      target    = 'all',
      isActive  = true,
      startsAt  = null,
      endsAt    = null,
    } = body;

    if (!title?.trim())   return err('Title is required', 400);
    if (!message?.trim()) return err('Message is required', 400);

    const validTypes   = ['info', 'warning', 'success', 'promo'];
    const validTargets = ['all', 'logged_in', 'admin'];
    if (!validTypes.includes(type))     return err('Invalid type', 400);
    if (!validTargets.includes(target)) return err('Invalid target', 400);

    const [row] = await sql`
      INSERT INTO admin_announcements (title, message, type, target, is_active, starts_at, ends_at, created_by)
      VALUES (
        ${title.trim()},
        ${message.trim()},
        ${type},
        ${target},
        ${Boolean(isActive)},
        ${startsAt ?? null},
        ${endsAt   ?? null},
        ${adminId}
      )
      RETURNING id, title, type, is_active, created_at
    `;

    return ok(row, 201);
  } catch (error) {
    console.error('Announcement create error:', error);
    return err('Failed to create announcement', 500);
  }
}
