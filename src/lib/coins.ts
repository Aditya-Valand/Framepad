import { sql } from '@/lib/db';

export const COIN_PACKS = {
  starter: { coins: 50,  pricePaise: 2900 },
  popular: { coins: 120, pricePaise: 5900 },
  best:    { coins: 300, pricePaise: 9900 },
} as const;

export type PackType = keyof typeof COIN_PACKS;

export const COIN_COSTS = {
  watermark:      10,
  template:       15,
  sticker:         8,
  booth:           8,
  filmstrip:      10,
  canvas:         12,
  canvas_extend:   5,
  save:            3,
  batch_download: 20,
} as const;

export type SpendReason = keyof typeof COIN_COSTS;

export const COIN_BONUSES = {
  signup:       20,
  first_design: 10,
  first_order:  15,
  referral:     25,
} as const;

export async function getBalance(userId: string): Promise<number> {
  const [row] = await sql`
    SELECT COALESCE(SUM(delta), 0) AS balance
    FROM coin_ledger WHERE user_id = ${userId}
  ` as Array<{ balance: string }>;
  return Number(row?.balance ?? 0);
}

export async function spendCoins(
  userId: string,
  amount: number,
  reason: string,
  referenceId?: string
): Promise<{ success: boolean; balance: number }> {
  const balance = await getBalance(userId);
  if (balance < amount) return { success: false, balance };

  await sql`
    INSERT INTO coin_ledger (user_id, delta, reason, reference_id)
    VALUES (${userId}, ${-amount}, ${reason}, ${referenceId ?? null})
  `;

  return { success: true, balance: balance - amount };
}

export async function earnCoins(
  userId: string,
  amount: number,
  reason: string,
  referenceId?: string
): Promise<number> {
  await sql`
    INSERT INTO coin_ledger (user_id, delta, reason, reference_id)
    VALUES (${userId}, ${amount}, ${reason}, ${referenceId ?? null})
  `;
  return await getBalance(userId);
}

export async function hasReceivedBonus(userId: string, reason: string): Promise<boolean> {
  const [row] = await sql`
    SELECT 1 FROM coin_ledger
    WHERE user_id = ${userId} AND reason = ${reason} AND delta > 0
    LIMIT 1
  `;
  return !!row;
}

export async function hasDuplicateSpend(
  userId: string,
  reason: string,
  referenceId: string
): Promise<boolean> {
  const [row] = await sql`
    SELECT 1 FROM coin_ledger
    WHERE user_id = ${userId} AND reason = ${reason} AND reference_id = ${referenceId}
    LIMIT 1
  `;
  return !!row;
}
