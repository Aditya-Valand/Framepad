import { sql } from '@/lib/db';
import { ok, err, userId } from '@/lib/api';
import { COIN_COSTS, spendCoins, getBalance, hasDuplicateSpend } from '@/lib/coins';
import type { SpendReason } from '@/lib/coins';

export async function POST(req: Request) {
  const uid = userId(req);
  if (!uid) return err('Unauthorized', 401);

  const body = await req.json();
  const { feature, referenceId } = body;

  if (!feature || !(feature in COIN_COSTS)) return err('Invalid feature', 400);
  const cost = COIN_COSTS[feature as SpendReason];

  // Idempotency: prevent double-spend on same reference
  if (referenceId) {
    const isDuplicate = await hasDuplicateSpend(uid, `spend_${feature}`, referenceId);
    if (isDuplicate) {
      const balance = await getBalance(uid);
      return ok({ success: true, balance, coinsSpent: 0, alreadyUnlocked: true });
    }
  }

  const result = await spendCoins(uid, cost, `spend_${feature}`, referenceId);

  if (!result.success) {
    return ok({
      success: false,
      balance: result.balance,
      required: cost,
      error: 'Insufficient coins',
    });
  }

  // Side-effect: watermark feature also writes to design_unlocks
  if (feature === 'watermark' && referenceId) {
    await sql`
      INSERT INTO design_unlocks (design_id, user_id, amount_paise, unlocked_via)
      VALUES (${referenceId}, ${uid}, 0, 'coins')
      ON CONFLICT (design_id) DO NOTHING
    `;
  }

  return ok({ success: true, balance: result.balance, coinsSpent: cost });
}
