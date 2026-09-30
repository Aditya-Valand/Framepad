// Client-safe constants — no server/DB imports.
// Import this in client components; import '@/lib/coins' only in API routes.

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
