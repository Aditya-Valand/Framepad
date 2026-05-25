import { sql } from '@/lib/db';
import { ok, err, userId } from '@/lib/api';
import { NextRequest } from 'next/server';

// A04 — Add Tracking Number / Ship Order
// POST /api/admin/orders/:id/ship
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const adminId = userId(req);
  if (!adminId) return err('Unauthorized', 401);

  const { id } = await params;

  try {
    const body = await req.json();
    const { trackingNumber, carrier, trackingUrl } = body;

    if (!trackingNumber) return err('Tracking number is required', 400);

    // Verify order exists and is in a shippable state
    const [order] = await sql`
      SELECT id, status, order_number
      FROM orders WHERE id = ${id}
    `;
    if (!order) return err('Order not found', 404);

    const shippableStatuses = ['confirmed', 'processing', 'printing'];
    if (!shippableStatuses.includes(order.status) && order.status !== 'shipped') {
      return err(`Cannot ship order with status: ${order.status}`, 400);
    }

    await sql`BEGIN`;

    try {
      // Create or update shipment
      const [existingShipment] = await sql`
        SELECT id FROM shipments WHERE order_id = ${id} LIMIT 1
      `;

      if (existingShipment) {
        // Update existing shipment
        await sql`
          UPDATE shipments
          SET tracking_number = ${trackingNumber},
              carrier = ${carrier || null},
              tracking_url = ${trackingUrl || null},
              status = 'in_transit',
              shipped_at = COALESCE(shipped_at, NOW()),
              updated_at = NOW()
          WHERE order_id = ${id}
        `;
      } else {
        // Create new shipment
        await sql`
          INSERT INTO shipments (order_id, tracking_number, carrier, tracking_url, status, shipped_at)
          VALUES (${id}, ${trackingNumber}, ${carrier || null}, ${trackingUrl || null}, 'in_transit', NOW())
        `;
      }

      // Update order status to shipped
      await sql`
        UPDATE orders
        SET status = 'shipped', updated_at = NOW()
        WHERE id = ${id}
      `;

      // Log admin action
      await sql`
        INSERT INTO admin_activity_logs (admin_user_id, action, entity_type, entity_id, old_value, new_value)
        VALUES (
          ${adminId},
          'order.tracking_added',
          'order',
          ${id},
          ${JSON.stringify({ status: order.status })},
          ${JSON.stringify({ status: 'shipped', trackingNumber, carrier })}
        )
      `;

      await sql`COMMIT`;
    } catch (e) {
      await sql`ROLLBACK`;
      throw e;
    }

    return ok({
      success: true,
      message: 'Tracking number added and order marked as shipped',
      shipment: { trackingNumber, carrier, trackingUrl },
    });
  } catch (error) {
    console.error('Admin ship order error:', error);
    return err('Failed to add tracking number', 500);
  }
}
