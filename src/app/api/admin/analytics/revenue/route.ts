import { sql } from '@/lib/db';
import { ok, err, userId } from '@/lib/api';
import { NextRequest } from 'next/server';

// A16 — Revenue Dashboard
// GET /api/admin/analytics/revenue?period=7d|30d|90d|all
export async function GET(req: NextRequest) {
  const adminId = userId(req);
  if (!adminId) return err('Unauthorized', 401);

  const period = req.nextUrl.searchParams.get('period') || '30d';

  const days =
    period === '7d'  ? 7  :
    period === '30d' ? 30 :
    period === '90d' ? 90 : null; // null = all time

  try {
    const interval = days ? `${days} days` : '3650 days'; // 10yr cap for "all"
    const prevInterval = days ? `${days * 2} days` : null;

    // Current period daily breakdown
    const dailyRevenue = await sql`
      SELECT
        day,
        order_count,
        revenue_paise,
        avg_order_paise
      FROM v_daily_revenue
      WHERE day >= NOW() - ${interval}::INTERVAL
      ORDER BY day ASC
    `;

    // Current period totals
    const [current] = await sql`
      SELECT
        COALESCE(SUM(revenue_paise), 0)                    AS revenue_paise,
        COALESCE(SUM(order_count), 0)                      AS order_count,
        COALESCE(AVG(avg_order_paise)::BIGINT, 0)          AS avg_order_paise
      FROM v_daily_revenue
      WHERE day >= NOW() - ${interval}::INTERVAL
    `;

    // Previous period totals (for delta)
    let previous = { revenue_paise: 0, order_count: 0, avg_order_paise: 0 };
    if (prevInterval) {
      const [prev] = await sql`
        SELECT
          COALESCE(SUM(revenue_paise), 0)           AS revenue_paise,
          COALESCE(SUM(order_count), 0)             AS order_count,
          COALESCE(AVG(avg_order_paise)::BIGINT, 0) AS avg_order_paise
        FROM v_daily_revenue
        WHERE day >= NOW() - ${prevInterval}::INTERVAL
          AND day <  NOW() - ${interval}::INTERVAL
      `;
      previous = prev as typeof previous;
    }

    // New users in current period
    const [newUsers] = await sql`
      SELECT COUNT(*) AS count
      FROM users
      WHERE created_at >= NOW() - ${interval}::INTERVAL
        AND role = 'customer'
        AND deleted_at IS NULL
    `;

    // New users in previous period
    let prevNewUsers = { count: 0 };
    if (prevInterval) {
      const [p] = await sql`
        SELECT COUNT(*) AS count
        FROM users
        WHERE created_at >= NOW() - ${prevInterval}::INTERVAL
          AND created_at <  NOW() - ${interval}::INTERVAL
          AND role = 'customer'
          AND deleted_at IS NULL
      `;
      prevNewUsers = p as typeof prevNewUsers;
    }

    return ok({
      period,
      current: {
        revenuePaise:  Number(current.revenue_paise),
        orderCount:    Number(current.order_count),
        avgOrderPaise: Number(current.avg_order_paise),
        newUsers:      Number(newUsers.count),
      },
      previous: {
        revenuePaise:  Number(previous.revenue_paise),
        orderCount:    Number(previous.order_count),
        avgOrderPaise: Number(previous.avg_order_paise),
        newUsers:      Number(prevNewUsers.count),
      },
      dailyRevenue: dailyRevenue.map((r: Record<string, unknown>) => ({
        day:           r.day,
        revenuePaise:  Number(r.revenue_paise),
        orderCount:    Number(r.order_count),
        avgOrderPaise: Number(r.avg_order_paise),
      })),
    });
  } catch (error) {
    console.error('Analytics revenue error:', error);
    return err('Failed to fetch revenue analytics', 500);
  }
}
