import { sql } from '@/lib/db';
import { ok, err, userId } from '@/lib/api';
import { NextRequest } from 'next/server';

// A14 — Unban User
// PUT /api/admin/users/[id]/unban
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const adminId = userId(req);
  if (!adminId) return err('Unauthorized', 401);

  const { id } = await params;

  try {
    const [user] = await sql`
      SELECT id, is_banned FROM users WHERE id = ${id} AND deleted_at IS NULL
    `;

    if (!user) return err('User not found', 404);
    if (!user.is_banned) return err('User is not banned', 400);

    // Unban the user
    await sql`
      UPDATE users
      SET is_banned = FALSE, ban_reason = NULL, banned_at = NULL, banned_by = NULL, updated_at = NOW()
      WHERE id = ${id}
    `;

    // Log the action
    await sql`
      INSERT INTO admin_activity_logs (admin_user_id, action, entity_type, entity_id, new_value)
      VALUES (${adminId}, 'user.unbanned', 'user', ${id}, '{}')
    `;

    return ok({ success: true, message: 'User unbanned' });
  } catch (error) {
    console.error('Unban user error:', error);
    return err('Failed to unban user', 500);
  }
}
