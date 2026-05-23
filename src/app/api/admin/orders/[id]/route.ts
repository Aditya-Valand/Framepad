import { sql } from '@/lib/db';
import { ok, err, userId } from '@/lib/api';
import { NextRequest } from 'next/server';

// A02 — Admin Order Detail View
// GET /api/admin/orders/:id
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const adminId = userId(req);
  if (!adminId) return err('Unauthorized', 401);

  const { id } = await params;

  try {
    // Get order with customer info
    const [order] = await sql`
      SELECT
        o.*,
        up.full_name AS customer_name,
        up.phone AS customer_phone,
        up.avatar_url AS customer_avatar,
        u.email AS customer_email,
        u.id AS customer_id,
        u.created_at AS customer_since
      FROM orders o
      JOIN users u ON u.id = o.user_id
      LEFT JOIN user_profiles up ON up.user_id = o.user_id
      WHERE o.id = ${id}
    `;

    if (!order) return err('Order not found', 404);

    // Get order items with design + product details
    const items = await sql`
      SELECT
        oi.*,
        d.title AS design_title,
        d.thumbnail_url AS design_thumbnail,
        d.frame_style,
        d.caption_text,
        d.has_spotify_code,
        d.spotify_uri,
        d.filter_preset,
        pt.name AS product_name,
        pt.slug AS product_slug,
        pt.quantity AS product_quantity,
        pf.name AS finish_name,
        pf.slug AS finish_slug,
        ps.name AS size_name,
        ps.slug AS size_slug
      FROM order_items oi
      LEFT JOIN designs d ON d.id = oi.design_id
      JOIN product_types pt ON pt.id = oi.product_type_id
      JOIN print_finishes pf ON pf.id = oi.print_finish_id
      JOIN print_sizes ps ON ps.id = oi.print_size_id
      WHERE oi.order_id = ${id}
      ORDER BY oi.created_at
    `;

    // Get payment info
    const payments = await sql`
      SELECT *
      FROM payments
      WHERE order_id = ${id}
      ORDER BY created_at DESC
    `;

    // Get shipment info
    const shipments = await sql`
      SELECT *
      FROM shipments
      WHERE order_id = ${id}
      ORDER BY created_at DESC
    `;

    // Get shipping address
    let address = null;
    if (order.shipping_address_id) {
      const [addr] = await sql`
        SELECT * FROM addresses WHERE id = ${order.shipping_address_id}
      `;
      address = addr;
    }

    // Get gift message if gift order
    let giftMessage = null;
    if (order.is_gift) {
      const [msg] = await sql`
        SELECT * FROM gift_messages WHERE order_id = ${id}
      `;
      giftMessage = msg;
    }

    // Get coupon info if used
    let coupon = null;
    if (order.coupon_id) {
      const [c] = await sql`
        SELECT code, type, value, description
        FROM coupons WHERE id = ${order.coupon_id}
      `;
      coupon = c;
    }

    // Build timeline from order events
    const timeline = buildTimeline(order, payments, shipments);

    return ok({
      order,
      items,
      payments,
      shipments,
      address,
      giftMessage,
      coupon,
      timeline,
    });
  } catch (error) {
    console.error('Admin order detail error:', error);
    return err('Failed to fetch order detail', 500);
  }
}

function buildTimeline(
  order: Record<string, unknown>,
  payments: Record<string, unknown>[],
  shipments: Record<string, unknown>[]
) {
  const events: { event: string; timestamp: string | null; done: boolean }[] = [];

  events.push({
    event: 'Order placed',
    timestamp: order.created_at as string,
    done: true,
  });

  const payment = payments[0];
  if (payment && payment.status === 'captured') {
    events.push({
      event: 'Payment confirmed',
      timestamp: payment.created_at as string,
      done: true,
    });
  }

  if (order.confirmed_at) {
    events.push({
      event: 'Confirmed by admin',
      timestamp: order.confirmed_at as string,
      done: true,
    });
  }

  const statuses = ['processing', 'printing', 'shipped', 'delivered'];
  const statusLabels: Record<string, string> = {
    processing: 'Processing',
    printing: 'Sent to print',
    shipped: 'Shipped',
    delivered: 'Delivered',
  };

  const currentIndex = statuses.indexOf(order.status as string);

  for (let i = 0; i < statuses.length; i++) {
    const s = statuses[i];
    let timestamp: string | null = null;

    if (s === 'shipped' && shipments[0]?.shipped_at) {
      timestamp = shipments[0].shipped_at as string;
    } else if (s === 'delivered' && shipments[0]?.delivered_at) {
      timestamp = shipments[0].delivered_at as string;
    } else if (s === 'delivered' && order.delivered_at) {
      timestamp = order.delivered_at as string;
    }

    events.push({
      event: statusLabels[s],
      timestamp,
      done: i <= currentIndex,
    });
  }

  return events;
}
