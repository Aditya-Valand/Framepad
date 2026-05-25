import { sql } from '@/lib/db';
import { ok, err, userId } from '@/lib/api';
import { NextRequest } from 'next/server';

// A01 — Admin Orders Dashboard
// GET /api/admin/orders?status=&search=&page=&limit=&dateFrom=&dateTo=&orderType=
export async function GET(req: NextRequest) {
  const adminId = userId(req);
  if (!adminId) return err('Unauthorized', 401);

  const { searchParams } = req.nextUrl;
  const status = searchParams.get('status');
  const search = searchParams.get('search');
  const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20')));
  const dateFrom = searchParams.get('dateFrom');
  const dateTo = searchParams.get('dateTo');
  const orderType = searchParams.get('orderType');
  const offset = (page - 1) * limit;

  try {
    // Build dynamic query with safe tagged templates
    const orders = await sql`
      SELECT
        o.id,
        o.order_number,
        o.status,
        o.order_type,
        o.total_paise,
        o.discount_paise,
        o.is_gift,
        o.confirmed_at,
        o.created_at,
        o.updated_at,
        o.internal_notes,
        up.full_name AS customer_name,
        u.email AS customer_email,
        u.id AS customer_id,
        COUNT(oi.id)::int AS item_count,
        COALESCE(SUM(oi.quantity), 0)::int AS total_prints,
        p.status AS payment_status,
        p.payment_method,
        s.tracking_number,
        s.carrier,
        a.city AS shipping_city,
        a.state AS shipping_state
      FROM orders o
      JOIN users u ON u.id = o.user_id
      LEFT JOIN user_profiles up ON up.user_id = o.user_id
      LEFT JOIN order_items oi ON oi.order_id = o.id
      LEFT JOIN LATERAL (
        SELECT status, payment_method FROM payments WHERE order_id = o.id ORDER BY created_at DESC LIMIT 1
      ) p ON true
      LEFT JOIN LATERAL (
        SELECT tracking_number, carrier FROM shipments WHERE order_id = o.id ORDER BY created_at DESC LIMIT 1
      ) s ON true
      LEFT JOIN addresses a ON a.id = o.shipping_address_id
      WHERE u.deleted_at IS NULL
        ${status ? sql`AND o.status = ${status}` : sql``}
        ${search ? sql`AND (o.order_number ILIKE ${'%' + search + '%'} OR u.email ILIKE ${'%' + search + '%'} OR up.full_name ILIKE ${'%' + search + '%'})` : sql``}
        ${dateFrom ? sql`AND o.created_at >= ${dateFrom}::timestamptz` : sql``}
        ${dateTo ? sql`AND o.created_at <= ${dateTo}::timestamptz` : sql``}
        ${orderType ? sql`AND o.order_type = ${orderType}` : sql``}
      GROUP BY o.id, up.full_name, u.email, u.id,
               p.status, p.payment_method,
               s.tracking_number, s.carrier,
               a.city, a.state
      ORDER BY o.created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `;

    // Get total count for pagination
    const [countResult] = await sql`
      SELECT COUNT(DISTINCT o.id)::int AS total
      FROM orders o
      JOIN users u ON u.id = o.user_id
      LEFT JOIN user_profiles up ON up.user_id = o.user_id
      WHERE u.deleted_at IS NULL
        ${status ? sql`AND o.status = ${status}` : sql``}
        ${search ? sql`AND (o.order_number ILIKE ${'%' + search + '%'} OR u.email ILIKE ${'%' + search + '%'} OR up.full_name ILIKE ${'%' + search + '%'})` : sql``}
        ${dateFrom ? sql`AND o.created_at >= ${dateFrom}::timestamptz` : sql``}
        ${dateTo ? sql`AND o.created_at <= ${dateTo}::timestamptz` : sql``}
        ${orderType ? sql`AND o.order_type = ${orderType}` : sql``}
    `;

    // Get status counts for pills
    const statusCounts = await sql`
      SELECT status, COUNT(*)::int AS count
      FROM orders
      GROUP BY status
    `;

    return ok({
      orders,
      pagination: {
        page,
        limit,
        total: countResult?.total || 0,
        totalPages: Math.ceil((countResult?.total || 0) / limit),
      },
      statusCounts: statusCounts.reduce(
        (acc: Record<string, number>, row: Record<string, unknown>) => {
          acc[row.status as string] = row.count as number;
          return acc;
        },
        {} as Record<string, number>
      ),
    });
  } catch (error) {
    console.error('Admin orders fetch error:', error);
    return err('Failed to fetch orders', 500);
  }
}
