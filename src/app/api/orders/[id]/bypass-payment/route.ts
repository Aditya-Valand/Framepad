import { sql } from '@/lib/db';
import { ok, err, userId } from '@/lib/api';
import { NextRequest } from 'next/server';

// DEV ONLY — Bypass payment and confirm order directly
// POST /api/orders/[id]/bypass-payment
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const uid = userId(req);
  if (!uid) return err('Unauthorized', 401);

  const { id: orderId } = await params;

  // Verify order belongs to user and is pending
  const [order] = await sql`
    SELECT id, status, total_paise FROM orders
    WHERE id = ${orderId} AND user_id = ${uid}`;
  if (!order) return err('Order not found', 404);
  if (order.status === 'confirmed') return ok({ message: 'Already confirmed', orderId });

  try {
    await sql`BEGIN`;

    // Confirm order directly
    await sql`
      UPDATE orders SET status = 'confirmed', confirmed_at = NOW(), updated_at = NOW()
      WHERE id = ${orderId}`;

    // Backfill design_snapshot_url from designs table where missing
    await sql`
      UPDATE order_items oi SET
        design_snapshot_url = COALESCE(oi.design_snapshot_url, d.export_url, d.thumbnail_url),
        updated_at = NOW()
      FROM designs d
      WHERE d.id = oi.design_id
        AND oi.order_id = ${orderId}
        AND oi.design_snapshot_url IS NULL`;

    // Mark order items as pending print
    await sql`
      UPDATE order_items SET print_status = 'pending', updated_at = NOW()
      WHERE order_id = ${orderId}`;

    // Mark designs as ordered
    await sql`
      UPDATE designs SET status = 'ordered', updated_at = NOW()
      WHERE id IN (SELECT design_id FROM order_items WHERE order_id = ${orderId})`;

    await sql`COMMIT`;
    return ok({ message: 'Order confirmed (payment bypassed)', orderId });
  } catch (e) {
    await sql`ROLLBACK`;
    console.error('[bypass-payment]', e);
    return err('Failed to bypass payment', 500);
  }
}
