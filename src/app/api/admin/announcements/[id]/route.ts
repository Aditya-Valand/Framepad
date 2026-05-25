import { sql } from '@/lib/db';
import { ok, err, userId } from '@/lib/api';
import { NextRequest } from 'next/server';

// A24 — Update Announcement
// PUT /api/admin/announcements/:id
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const adminId = userId(req);
  if (!adminId) return err('Unauthorized', 401);

  const { id } = await params;

  try {
    const body = await req.json();
    const {
      title,
      message,
      type,
      target,
      isActive,
      startsAt,
      endsAt,
    } = body;

    const [existing] = await sql`SELECT id FROM admin_announcements WHERE id = ${id}`;
    if (!existing) return err('Announcement not found', 404);

    const [updated] = await sql`
      UPDATE admin_announcements SET
        title     = COALESCE(${title   ?? null}, title),
        message   = COALESCE(${message ?? null}, message),
        type      = COALESCE(${type    ?? null}, type),
        target    = COALESCE(${target  ?? null}, target),
        is_active = COALESCE(${isActive != null ? Boolean(isActive) : null}, is_active),
        starts_at = CASE WHEN ${startsAt !== undefined} THEN ${startsAt ?? null} ELSE starts_at END,
        ends_at   = CASE WHEN ${endsAt   !== undefined} THEN ${endsAt   ?? null} ELSE ends_at   END
      WHERE id = ${id}
      RETURNING id, title, is_active, type, updated_at
    ` as Array<{ id: string; title: string; is_active: boolean; type: string; updated_at: unknown }>;

    return ok(updated);
  } catch (error) {
    console.error('Announcement update error:', error);
    return err('Failed to update announcement', 500);
  }
}

// A24 — Delete Announcement
// DELETE /api/admin/announcements/:id
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const adminId = userId(req);
  if (!adminId) return err('Unauthorized', 401);

  const { id } = await params;

  try {
    const [existing] = await sql`SELECT id FROM admin_announcements WHERE id = ${id}`;
    if (!existing) return err('Announcement not found', 404);

    await sql`DELETE FROM admin_announcements WHERE id = ${id}`;
    return ok({ deleted: true });
  } catch (error) {
    console.error('Announcement delete error:', error);
    return err('Failed to delete announcement', 500);
  }
}
