import { sql } from '@/lib/db';
import { ok, err, userId } from '@/lib/api';
import { verifyPaymentSignature } from '@/lib/razorpay';

export async function POST(req: Request) {
  const uid = userId(req);
  if (!uid) return err('Unauthorized', 401);

  const { razorpayPaymentId, razorpayOrderId, razorpaySignature, orderId } = await req.json();

  if (!razorpayPaymentId || !razorpayOrderId || !razorpaySignature || !orderId)
    return err('Missing payment details', 400);

  // Verify signature
  if (!verifyPaymentSignature(razorpayOrderId, razorpayPaymentId, razorpaySignature)) {
    return err('Invalid payment signature', 401);
  }

  // Idempotency check
  const [existing] = await sql`
    SELECT id FROM payments WHERE provider_payment_id = ${razorpayPaymentId} AND status = 'captured'`;
  if (existing) return ok({ message: 'Already processed', orderId });

  // Verify order belongs to user
  const [order] = await sql`
    SELECT id, total_paise FROM orders WHERE id = ${orderId} AND user_id = ${uid} AND status = 'pending_payment'`;
  if (!order) return err('Order not found or already paid', 404);

  try {
    await sql`BEGIN`;

    // Update payment record
    await sql`
      UPDATE payments SET
        provider_payment_id = ${razorpayPaymentId},
        status = 'captured',
        payment_method = 'razorpay',
        updated_at = NOW()
      WHERE order_id = ${orderId} AND provider_order_id = ${razorpayOrderId}`;

    // Confirm order
    await sql`
      UPDATE orders SET status = 'confirmed', confirmed_at = NOW(), updated_at = NOW()
      WHERE id = ${orderId}`;

    // Mark designs as ordered
    await sql`
      UPDATE designs SET status = 'ordered', updated_at = NOW()
      WHERE id IN (SELECT design_id FROM order_items WHERE order_id = ${orderId})`;

    // Update user profile stats
    await sql`
      UPDATE user_profiles SET
        total_orders = total_orders + 1,
        total_spent_paise = total_spent_paise + ${order.total_paise}
      WHERE user_id = ${uid}`;

    await sql`COMMIT`;
    return ok({ message: 'Payment confirmed', orderId });
  } catch (e) {
    await sql`ROLLBACK`;
    console.error('[POST /api/payments/verify]', e);
    return err('Payment verification failed', 500);
  }
}
