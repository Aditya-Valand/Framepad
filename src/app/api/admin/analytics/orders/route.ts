import { sql } from '@/lib/db';
import { ok, err, userId } from '@/lib/api';
import { NextRequest } from 'next/server';

// A17 — Orders by Status
// GET /api/admin/analytics/orders
export async function GET(req: NextRequest) {
  const adminId = userId(req);
  if (!adminId) return err('Unauthorized', 401);

  try {
    const rows = await sql`
      SELECT
        status,
        COUNT(*)             AS count,
        COALESCE(SUM(total_paise), 0) AS total_paise
      FROM orders
      WHERE confirmed_at IS NOT NULL
        OR status = 'pending_payment'
      GROUP BY status
      ORDER BY count DESC
    `;

    const total = rows.reduce((sum: number, r: Record<string, unknown>) => sum + Number(r.count), 0);

    return ok({
      statuses: rows.map((r: Record<string, unknown>) => ({
        status:     r.status,
        count:      Number(r.count),
        totalPaise: Number(r.total_paise),
        pct:        total > 0 ? Math.round((Number(r.count) / total) * 1000) / 10 : 0,
      })),
      total,
    });
  } catch (error) {
    console.error('Analytics orders error:', error);
    return err('Failed to fetch order analytics', 500);
  }
}
