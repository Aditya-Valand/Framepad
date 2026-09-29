import { sql } from '@/lib/db';
import { ok, err, userId } from '@/lib/api';
import { getRazorpay, verifyPaymentSignature } from '@/lib/razorpay';
import { COIN_PACKS, earnCoins, getBalance } from '@/lib/coins';
import type { PackType } from '@/lib/coins';

export async function POST(req: Request) {
  const uid = userId(req);
  if (!uid) return err('Unauthorized', 401);

  const body = await req.json();
  const { action, pack } = body;

  if (!pack || !(pack in COIN_PACKS)) return err('Invalid pack type', 400);
  const packConfig = COIN_PACKS[pack as PackType];

  // ── Create Razorpay order ─────────────────────────────────
  if (action === 'create_order') {
    const rzp = getRazorpay();
    const order = await rzp.orders.create({
      amount: packConfig.pricePaise,
      currency: 'INR',
      receipt: `coins_${pack}_${uid.slice(0, 8)}_${Date.now()}`,
      notes: { user_id: uid, pack, coins: packConfig.coins },
    });

    // Record pending purchase
    await sql`
      INSERT INTO coin_purchases (user_id, pack_type, coins_granted, amount_paise, razorpay_order_id, status)
      VALUES (${uid}, ${pack}, ${packConfig.coins}, ${packConfig.pricePaise}, ${order.id}, 'pending')
    `;

    return ok({
      razorpay_order_id: order.id,
      amount: packConfig.pricePaise,
      currency: 'INR',
      coins: packConfig.coins,
      key: process.env.RAZORPAY_KEY_ID,
    });
  }

  // ── Verify payment ────────────────────────────────────────
  if (action === 'verify') {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return err('Missing payment fields', 400);
    }

    const valid = verifyPaymentSignature(razorpay_order_id, razorpay_payment_id, razorpay_signature);
    if (!valid) return err('Invalid payment signature', 400);

    // Idempotency: check if already processed
    const [existing] = await sql`
      SELECT id FROM coin_purchases
      WHERE razorpay_order_id = ${razorpay_order_id} AND status = 'paid'
    `;
    if (existing) {
      const balance = await getBalance(uid);
      return ok({ success: true, balance, alreadyProcessed: true });
    }

    // Update purchase record
    await sql`
      UPDATE coin_purchases
      SET status = 'paid', razorpay_payment_id = ${razorpay_payment_id}, paid_at = NOW()
      WHERE razorpay_order_id = ${razorpay_order_id} AND user_id = ${uid}
    `;

    // Credit coins to ledger
    const balance = await earnCoins(uid, packConfig.coins, `purchase_${pack}`, razorpay_order_id);

    return ok({ success: true, balance, coinsAdded: packConfig.coins });
  }

  return err('Invalid action', 400);
}
