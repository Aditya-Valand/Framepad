import { ok, err, userId } from '@/lib/api';
import { sql } from '@/lib/db';
import { spendCoins, getBalance, COIN_COSTS } from '@/lib/coins';

export async function POST(req: Request) {
  const uid = userId(req); // empty for guests

  let body: { label?: string; skipCoins?: boolean } = {};
  try { body = await req.json(); } catch {}

  const { label = 'My session' } = body;

  // Coin gate — logged-in users spend coins, guests get one free try
  if (uid) {
    const balance = await getBalance(uid);
    const cost = COIN_COSTS.canvas;
    if (balance < cost) {
      return err(`Not enough coins. Need ${cost}, have ${balance}.`, 402);
    }
    const result = await spendCoins(uid, cost, 'spend_canvas');
    if (!result.success) {
      return err('Coin spend failed', 402);
    }
  }

  const creatorLabel = label.trim().slice(0, 50) || 'Creator';

  const [session] = await sql`
    INSERT INTO shared_sessions (
      creator_user_id,
      canvas_state,
      slot_a_filled,
      slot_a_label,
      participant_count,
      status,
      expires_at
    ) VALUES (
      ${uid || null},
      ${'{}'},
      true,
      ${creatorLabel},
      1,
      'active',
      NOW() + INTERVAL '48 hours'
    )
    RETURNING id, expires_at`;

  return ok({
    sessionId: session.id,
    shareUrl: `/editor/shared/${session.id}`,
    expiresAt: session.expires_at,
  }, 201);
}
