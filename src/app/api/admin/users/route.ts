import { sql } from '@/lib/db';
import { ok, err, userId } from '@/lib/api';
import { NextRequest } from 'next/server';

// A12 — Admin Users List
// GET /api/admin/users?search=&banned=&page=&limit=
export async function GET(req: NextRequest) {
  const adminId = userId(req);
  if (!adminId) return err('Unauthorized', 401);

  const { searchParams } = req.nextUrl;
  const search = searchParams.get('search') || '';
  const banned = searchParams.get('banned'); // 'true' | 'false' | null
  const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '20')));
  const offset = (page - 1) * limit;

  try {
    // Get counts
    const [counts] = await sql`
      SELECT
        COUNT(*) AS total,
        COUNT(*) FILTER (WHERE is_banned = FALSE) AS active,
        COUNT(*) FILTER (WHERE is_banned = TRUE) AS banned_count
      FROM users
      WHERE deleted_at IS NULL AND role = 'customer'
    `;

    // Get users
    const users = await sql`
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
        up.total_spent_paise
      FROM users u
      LEFT JOIN user_profiles up ON up.user_id = u.id
      WHERE u.deleted_at IS NULL
        AND u.role = 'customer'
        ${banned === 'true' ? sql`AND u.is_banned = TRUE` : banned === 'false' ? sql`AND u.is_banned = FALSE` : sql``}
        ${search ? sql`AND (
          up.full_name ILIKE ${'%' + search + '%'}
          OR u.email ILIKE ${'%' + search + '%'}
          OR up.city ILIKE ${'%' + search + '%'}
        )` : sql``}
      ORDER BY u.created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `;

    return ok({
      users,
      counts: {
        total: Number(counts.total),
        active: Number(counts.active),
        banned: Number(counts.banned_count),
      },
      pagination: {
        page,
        limit,
        total: Number(counts.total),
        pages: Math.ceil(Number(counts.total) / limit),
      },
    });
  } catch (error) {
    console.error('Admin users list error:', error);
    return err('Failed to fetch users', 500);
  }
}
