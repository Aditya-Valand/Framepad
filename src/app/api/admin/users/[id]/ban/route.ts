import { sql } from '@/lib/db';
import { ok, err, userId } from '@/lib/api';
import { NextRequest } from 'next/server';

// A14 — Ban User
// PUT /api/admin/users/[id]/ban
// Body: { reason: string }
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const adminId = userId(req);
  if (!adminId) return err('Unauthorized', 401);

  const { id } = await params;
  const body = await req.json();
  const { reason } = body as { reason?: string };

  if (!reason || !reason.trim()) {
    return err('Ban reason is required', 400);
  }

  try {
    const [user] = await sql`
      SELECT id, is_banned, role FROM users WHERE id = ${id} AND deleted_at IS NULL
    `;

    if (!user) return err('User not found', 404);
    if (user.role === 'admin') return err('Cannot ban an admin', 403);
    if (user.is_banned) return err('User is already banned', 400);

    // Ban the user
    await sql`
      UPDATE users
      SET is_banned = TRUE, ban_reason = ${reason.trim()}, banned_at = NOW(), banned_by = ${adminId}, updated_at = NOW()
      WHERE id = ${id}
    `;

    // Delete all active sessions (force logout)
    await sql`DELETE FROM user_sessions WHERE user_id = ${id}`;

    // Log the action
    await sql`
      INSERT INTO admin_activity_logs (admin_user_id, action, entity_type, entity_id, new_value)
      VALUES (${adminId}, 'user.banned', 'user', ${id}, ${JSON.stringify({ reason: reason.trim() })})
    `;

    return ok({ success: true, message: 'User banned' });
  } catch (error) {
    console.error('Ban user error:', error);
    return err('Failed to ban user', 500);
  }
}
