import { sql } from '@/lib/db';
import { ok, err, userId } from '@/lib/api';
import { getRazorpay, verifyPaymentSignature } from '@/lib/razorpay';
import { spendCoins, hasDuplicateSpend, COIN_COSTS } from '@/lib/coins';

const UNLOCK_PRICE_PAISE = 900;

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id: designId } = await params;
  const uid = userId(req);

  const [design] = await sql`SELECT id FROM designs WHERE id = ${designId} AND deleted_at IS NULL`;
  if (!design) return err('Design not found', 404);

  const [unlock] = await sql`SELECT id FROM design_unlocks WHERE design_id = ${designId}`;
  return ok({ design_id: designId, is_unlocked: !!unlock });
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id: designId } = await params;
  const uid = userId(req);
  if (!uid) return err('Unauthorized', 401);

  const body = await req.json();
  const { action } = body;

  const [design] = await sql`SELECT id FROM designs WHERE id = ${designId} AND deleted_at IS NULL`;
  if (!design) return err('Design not found', 404);

  // ── Already unlocked? ──────────────────────────────────────
  const [existing] = await sql`SELECT id FROM design_unlocks WHERE design_id = ${designId}`;
  if (existing) return ok({ already_unlocked: true });

  // ── Spend coins path ───────────────────────────────────────
  if (action === 'spend_coins') {
    const already = await hasDuplicateSpend(uid, 'spend_watermark', designId);
    if (already) return ok({ already_unlocked: true });

    const result = await spendCoins(uid, COIN_COSTS.watermark, 'spend_watermark', designId);
    if (!result.success) {
      return err(`Insufficient coins — need ${COIN_COSTS.watermark}, have ${result.balance}`, 402);
    }

    const [ledgerRow] = await sql`
      SELECT id FROM coin_ledger
      WHERE user_id = ${uid} AND reason = 'spend_watermark' AND reference_id = ${designId}
      ORDER BY created_at DESC LIMIT 1
    ` as Array<{ id: string }>;

    await sql`
      INSERT INTO design_unlocks (design_id, user_id, amount_paise, unlocked_via)
      VALUES (${designId}, ${uid}, 0, 'coins')
      ON CONFLICT (design_id) DO NOTHING
    `;

    return ok({ unlocked: true, via: 'coins', balance: result.balance });
  }

  // ── Razorpay create order ──────────────────────────────────
  if (action === 'create_order') {
    const rzp = getRazorpay();
    const order = await rzp.orders.create({
      amount: UNLOCK_PRICE_PAISE,
      currency: 'INR',
      receipt: `unlock_${designId.slice(0, 8)}_${Date.now()}`,
      notes: { design_id: designId, user_id: uid },
    });

    return ok({
      razorpay_order_id: order.id,
      amount: UNLOCK_PRICE_PAISE,
      currency: 'INR',
      key: process.env.RAZORPAY_KEY_ID,
    });
  }

  // ── Razorpay verify payment ────────────────────────────────
  if (action === 'verify') {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return err('Missing payment fields', 400);
    }

    const valid = verifyPaymentSignature(razorpay_order_id, razorpay_payment_id, razorpay_signature);
    if (!valid) return err('Invalid payment signature', 400);

    await sql`
      INSERT INTO design_unlocks (design_id, user_id, amount_paise, payment_id, unlocked_via)
      VALUES (${designId}, ${uid}, ${UNLOCK_PRICE_PAISE}, ${razorpay_payment_id}, 'payment')
      ON CONFLICT (design_id) DO NOTHING
    `;

    return ok({ unlocked: true, via: 'payment' });
  }

  return err('Invalid action', 400);
}
