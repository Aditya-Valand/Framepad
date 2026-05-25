import { sql } from '@/lib/db';
import { ok, err, userId } from '@/lib/api';
import { getRazorpay } from '@/lib/razorpay';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const uid = userId(req);
  if (!uid) return err('Unauthorized', 401);
  const { id } = await params;

  const [order] = await sql`
    SELECT id, order_number, total_paise, status
    FROM orders WHERE id = ${id} AND user_id = ${uid}`;

  if (!order) return err('Order not found', 404);
  if (order.status !== 'pending_payment') return err('Order already paid', 400);

  const rzpOrder = await getRazorpay().orders.create({
    amount: order.total_paise,
    currency: 'INR',
    receipt: order.order_number,
  });

  // Save razorpay order id for webhook verification
  await sql`
    INSERT INTO payments (order_id, provider_order_id, amount_paise, status)
    VALUES (${id}, ${rzpOrder.id}, ${order.total_paise}, 'created')`;

  return ok({
    razorpayOrderId: rzpOrder.id,
    amount: order.total_paise,
    currency: 'INR',
    orderNumber: order.order_number,
    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
  });
}
