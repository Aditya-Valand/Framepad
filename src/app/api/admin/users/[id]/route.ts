import { sql } from '@/lib/db';
import { ok, err, userId } from '@/lib/api';
import { NextRequest } from 'next/server';

// A13 — Admin User Detail
// GET /api/admin/users/[id]
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const adminId = userId(req);
  if (!adminId) return err('Unauthorized', 401);

  const { id } = await params;

  try {
    // Get user profile
    const [user] = await sql`
      SELECT
        u.id,
        u.email,
        u.role,
        u.is_active,
        u.is_banned,
        u.ban_reason,
        u.banned_at,
        u.last_login_at,
        u.created_at,
        up.full_name,
        up.phone,
        up.city,
        up.state,
        up.total_designs,
        up.total_orders,
        up.total_spent_paise,
        up.preferred_finish
      FROM users u
      LEFT JOIN user_profiles up ON up.user_id = u.id
      WHERE u.id = ${id} AND u.deleted_at IS NULL
    `;

    if (!user) return err('User not found', 404);

    // Get recent orders
    const orders = await sql`
      SELECT
        o.id,
        o.order_number,
        o.status,
        o.total_paise,
        o.created_at
      FROM orders o
      WHERE o.user_id = ${id}
      ORDER BY o.created_at DESC
      LIMIT 10
    `;

    // Get recent designs
    const designs = await sql`
      SELECT
        d.id,
        d.title,
        d.thumbnail_url,
        d.status,
        d.created_at
      FROM designs d
      WHERE d.user_id = ${id} AND d.deleted_at IS NULL
      ORDER BY d.created_at DESC
      LIMIT 10
    `;

    // Get stats
    const [stats] = await sql`
      SELECT
        (SELECT COUNT(*) FROM designs WHERE user_id = ${id} AND deleted_at IS NULL) AS design_count,
        (SELECT COUNT(*) FROM orders WHERE user_id = ${id}) AS order_count,
        (SELECT COALESCE(SUM(total_paise), 0) FROM orders WHERE user_id = ${id} AND status NOT IN ('cancelled', 'refunded')) AS total_spent_paise
    `;

    return ok({
      user,
      orders,
      designs,
      stats: {
        designCount: Number(stats.design_count),
        orderCount: Number(stats.order_count),
        totalSpentPaise: Number(stats.total_spent_paise),
      },
    });
  } catch (error) {
    console.error('Admin user detail error:', error);
    return err('Failed to fetch user detail', 500);
  }
}
