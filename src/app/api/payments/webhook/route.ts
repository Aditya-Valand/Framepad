import { sql } from '@/lib/db';
import { NextResponse } from 'next/server';
import { verifyWebhookSignature } from '@/lib/razorpay';

export async function POST(req: Request) {
  const rawBody = await req.text();
  const signature = req.headers.get('x-razorpay-signature');

  if (!signature || !verifyWebhookSignature(rawBody, signature)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  const event = JSON.parse(rawBody);

  if (event.event === 'payment.captured') {
    const payment = event.payload.payment.entity;
    const rzpOrderId = payment.order_id;
    const rzpPaymentId = payment.id;

    // Idempotency — already processed?
    const [existingCaptured] = await sql`
      SELECT id FROM payments WHERE provider_payment_id = ${rzpPaymentId} AND status = 'captured'`;
    if (existingCaptured) {
      return NextResponse.json({ message: 'Already processed' });
    }

    // Find the payment record we created when initiating payment
    const [paymentRecord] = await sql`
      SELECT p.id, p.order_id, o.user_id, o.total_paise, o.status as order_status
      FROM payments p
      JOIN orders o ON o.id = p.order_id
      WHERE p.provider_order_id = ${rzpOrderId}`;

    if (!paymentRecord) {
      console.error('[Webhook] No payment record for rzp order:', rzpOrderId);
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }

    // Only process if order is still pending
    if (paymentRecord.order_status === 'pending_payment') {
      try {
        await sql`BEGIN`;

        await sql`
          UPDATE payments SET
            provider_payment_id = ${rzpPaymentId},
            status = 'captured',
            payment_method = ${payment.method || 'razorpay'},
            provider_payload = ${JSON.stringify(payment)},
            updated_at = NOW()
          WHERE id = ${paymentRecord.id}`;

        await sql`
          UPDATE orders SET status = 'confirmed', confirmed_at = NOW(), updated_at = NOW()
          WHERE id = ${paymentRecord.order_id}`;

        await sql`
          UPDATE designs SET status = 'ordered', updated_at = NOW()
          WHERE id IN (SELECT design_id FROM order_items WHERE order_id = ${paymentRecord.order_id})`;

        await sql`
          UPDATE user_profiles SET
            total_orders = total_orders + 1,
            total_spent_paise = total_spent_paise + ${paymentRecord.total_paise}
          WHERE user_id = ${paymentRecord.user_id}`;

        await sql`COMMIT`;
      } catch (e) {
        await sql`ROLLBACK`;
        console.error('[Webhook] Failed to confirm order:', e);
        return NextResponse.json({ error: 'Processing failed' }, { status: 500 });
      }
    }
  }

  if (event.event === 'payment.failed') {
    const payment = event.payload.payment.entity;
    const rzpOrderId = payment.order_id;

    await sql`
      UPDATE payments SET
        status = 'failed',
        failure_code = ${payment.error_code || null},
        failure_reason = ${payment.error_description || null},
        provider_payload = ${JSON.stringify(payment)},
        updated_at = NOW()
      WHERE provider_order_id = ${rzpOrderId} AND status != 'captured'`;

    await sql`
      UPDATE orders SET status = 'payment_failed', updated_at = NOW()
      WHERE id = (SELECT order_id FROM payments WHERE provider_order_id = ${rzpOrderId} LIMIT 1)
        AND status = 'pending_payment'`;
  }

  return NextResponse.json({ received: true });
}
