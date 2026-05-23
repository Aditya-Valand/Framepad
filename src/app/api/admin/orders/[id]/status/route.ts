import { sql } from '@/lib/db';
import { ok, err, userId } from '@/lib/api';
import { NextRequest } from 'next/server';

// A03 — Update Order Status
// PUT /api/admin/orders/:id/status
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const adminId = userId(req);
  if (!adminId) return err('Unauthorized', 401);

  const { id } = await params;

  try {
    const body = await req.json();
    const { status, internalNote } = body;

    if (!status) return err('Status is required', 400);

    const validStatuses = [
      'pending_payment', 'payment_failed', 'confirmed',
      'processing', 'printing', 'shipped', 'delivered',
      'cancelled', 'refunded', 'partially_refunded',
    ];

    if (!validStatuses.includes(status)) {
      return err(`Invalid status. Must be one of: ${validStatuses.join(', ')}`, 400);
    }

    // Get current order
    const [order] = await sql`SELECT id, status, order_number FROM orders WHERE id = ${id}`;
    if (!order) return err('Order not found', 404);

    const oldStatus = order.status;

    // Update order status
    await sql`BEGIN`;

    try {
      // Update the order
      const updates: Record<string, unknown> = { status };
      if (status === 'confirmed') {
        await sql`
          UPDATE orders
          SET status = ${status}, confirmed_at = NOW(), updated_at = NOW()
          WHERE id = ${id}
        `;
      } else if (status === 'cancelled') {
        await sql`
          UPDATE orders
          SET status = ${status}, cancelled_at = NOW(), updated_at = NOW()
          WHERE id = ${id}
        `;
      } else if (status === 'delivered') {
        await sql`
          UPDATE orders
          SET status = ${status}, delivered_at = NOW(), updated_at = NOW()
          WHERE id = ${id}
        `;
      } else {
        await sql`
          UPDATE orders
          SET status = ${status}, updated_at = NOW()
          WHERE id = ${id}
        `;
      }

      // Add internal note if provided
      if (internalNote) {
        await sql`
          UPDATE orders
          SET internal_notes = CASE
            WHEN internal_notes IS NULL THEN ${internalNote}
            ELSE internal_notes || E'\n---\n' || ${internalNote}
          END
          WHERE id = ${id}
        `;
      }

      // Log the admin action
      await sql`
        INSERT INTO admin_activity_logs (admin_user_id, action, entity_type, entity_id, old_value, new_value, notes)
        VALUES (
          ${adminId},
          'order.status_changed',
          'order',
          ${id},
          ${JSON.stringify({ status: oldStatus })},
          ${JSON.stringify({ status })},
          ${internalNote || null}
        )
      `;

      await sql`COMMIT`;
    } catch (e) {
      await sql`ROLLBACK`;
      throw e;
    }

    return ok({
      success: true,
      order: { id, status, previousStatus: oldStatus },
    });
  } catch (error) {
    console.error('Admin update order status error:', error);
    return err('Failed to update order status', 500);
  }
}
