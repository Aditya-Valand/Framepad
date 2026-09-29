# Polamuse — Backend Implementation Guide
> All new API routes, server logic, cron jobs, and integrations.
> Everything lives inside Next.js API routes — no separate server.

---

## Existing Patterns (follow these)

- **Auth:** Middleware at `src/middleware.ts` verifies JWT and injects `x-user-id`, `x-user-role`, `x-user-email` headers. Route handlers read via helpers in `src/lib/api.ts`.
- **DB:** Raw SQL via `sql` tagged template from `src/lib/db.ts` (Neon serverless). No ORM.
- **Validation:** Zod schemas in `src/lib/validations.ts`.
- **Responses:** `ok(data, status)` and `err(message, status)` from `src/lib/api.ts`.
- **Payments:** Razorpay via `src/lib/razorpay.ts`, webhook at `/api/payments/webhook`.

---

## New Library: `src/lib/coins.ts`

Core coin operations. Every coin mutation goes through these functions.

```typescript
// src/lib/coins.ts
import { sql } from '@/lib/db';

export const COIN_PACKS = {
  starter: { coins: 50, pricePaise: 2900 },
  popular: { coins: 120, pricePaise: 5900 },
  best:    { coins: 300, pricePaise: 9900 },
} as const;

export type PackType = keyof typeof COIN_PACKS;

export const COIN_COSTS = {
  watermark:       10,
  template:        15,
  sticker:          8,
  booth:            8,
  filmstrip:       10,
  canvas:          12,
  canvas_extend:    5,
  save:             3,
  batch_download:  20,
} as const;

export type SpendReason = keyof typeof COIN_COSTS;

export const COIN_BONUSES = {
  signup:        20,
  first_design:  10,
  first_order:   15,
  referral:      25,
} as const;

export async function getBalance(userId: string): Promise<number> {
  const [row] = await sql`
    SELECT COALESCE(SUM(delta), 0) AS balance
    FROM coin_ledger WHERE user_id = ${userId}`;
  return Number(row.balance);
}

export async function spendCoins(
  userId: string,
  amount: number,
  reason: string,
  referenceId?: string
): Promise<{ success: boolean; balance: number }> {
  // Check balance first
  const balance = await getBalance(userId);
  if (balance < amount) return { success: false, balance };

  await sql`
    INSERT INTO coin_ledger (user_id, delta, reason, reference_id)
    VALUES (${userId}, ${-amount}, ${reason}, ${referenceId ?? null})`;

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
    VALUES (${userId}, ${amount}, ${reason}, ${referenceId ?? null})`;
  return await getBalance(userId);
}

export async function hasReceivedBonus(userId: string, reason: string): Promise<boolean> {
  const [row] = await sql`
    SELECT 1 FROM coin_ledger
    WHERE user_id = ${userId} AND reason = ${reason} AND delta > 0
    LIMIT 1`;
  return !!row;
}
```

**Race condition note:** The `spendCoins` check-then-insert is not atomic. For v1 this is acceptable — the worst case is a user spends slightly more than their balance. For production hardening, wrap in a transaction with `SELECT ... FOR UPDATE` or use a Postgres advisory lock.

---

## New API Routes

### Watermark Unlock

**`POST /api/designs/[id]/unlock/route.ts`**

Creates a Razorpay order for ₹9, or verifies payment and unlocks.

```
Request (create order):
  POST /api/designs/:id/unlock
  Body: { action: "create_order" }
Response: { razorpayOrderId, amount: 900, currency: "INR" }

Request (verify payment):
  POST /api/designs/:id/unlock
  Body: { action: "verify", razorpay_payment_id, razorpay_order_id, razorpay_signature }
Response: { unlocked: true }
```

Flow:
1. Client calls with `action: "create_order"` → backend creates Razorpay order for 900 paise
2. Client opens Razorpay checkout
3. On success, client calls with `action: "verify"` + payment details
4. Backend verifies signature → inserts into `design_unlocks` → returns success
5. No login required — if user is anonymous, `user_id` is null in the record

**`GET /api/designs/[id]/download/route.ts`**

Returns clean or watermarked PNG based on unlock status.

```
Response: { downloadUrl, isWatermarked: boolean }
```

Check: `SELECT 1 FROM design_unlocks WHERE design_id = $1`

---

### Pola Coins

**`GET /api/coins/balance/route.ts`** (authenticated)

```
Response: { balance: 42 }
```

**`GET /api/coins/history/route.ts`** (authenticated)

```
Query: ?page=1&limit=20
Response: {
  entries: [{ id, delta, reason, reference_id, created_at }],
  pagination: { page, limit, total, pages }
}
```

**`POST /api/coins/purchase/route.ts`** (authenticated)

```
Request (create order):
  Body: { pack: "popular", action: "create_order" }
Response: { razorpayOrderId, amount: 5900, coins: 120 }

Request (verify):
  Body: { pack: "popular", action: "verify", razorpay_payment_id, razorpay_order_id, razorpay_signature }
Response: { success: true, balance: 162 }
```

Flow:
1. Create Razorpay order for the pack price
2. Insert into `coin_purchases` with status `pending`
3. After payment verification, update `coin_purchases` to `paid`
4. Call `earnCoins()` to credit the ledger
5. Return new balance

**`POST /api/coins/spend/route.ts`** (authenticated)

```
Request: { feature: "watermark", referenceId: "design-uuid-here" }
Response: { success: true, balance: 32, coinsSpent: 10 }
  OR
Response: { success: false, balance: 5, required: 10, error: "Insufficient coins" }
```

Validation:
- Feature must be a valid key in `COIN_COSTS`
- `referenceId` required for `watermark`, `template`, `save` (to prevent double-spend on same item)
- Check for duplicate: `SELECT 1 FROM coin_ledger WHERE user_id = $1 AND reason = $2 AND reference_id = $3`

---

### Order Add-ons

**`POST /api/orders/[id]/addons/route.ts`** (authenticated)

```
Request: { addons: [{ type: "gift_wrap" }, { type: "note_card", message: "Happy birthday!" }] }
Response: { addons: [...], orderTotal: 12400 }
```

Validation:
- Order must belong to the authenticated user
- Order must be in `pending` or `confirmed` status (not shipped/delivered)
- `addon_type` must be valid enum value
- Price looked up server-side from constants — never trust client price

**`GET /api/orders/[id]/addons/route.ts`** (authenticated)

```
Response: { addons: [{ id, addon_type, quantity, price_paise, metadata, created_at }] }
```

---

### Gift Orders

Extend the existing `POST /api/orders/route.ts`:

```
Additional body fields when is_gift = true:
{
  is_gift: true,
  gift_message: "Happy birthday yaar, miss you",
  gift_recipient_name: "Priya",
  gift_recipient_email: "priya@example.com",
  is_anonymous_gift: false,
  gift_reveal_at: null     // or ISO date string for delayed reveal
}
```

On successful gift order creation:
1. Insert order with gift columns populated
2. Send email to `gift_recipient_email`: "Someone sent you a memory" (no spoilers)
3. Include tracking link: `/order/track/{order_number}` (public, no login)

**`GET /api/orders/track/[token]/route.ts`** (public, no auth)

```
Response: {
  status: "shipped",
  estimatedDelivery: "2026-10-03",
  trackingNumber: "...",
  senderName: "Arjun"  // or null if is_anonymous_gift
}
```

---

### Occasions

**`GET /api/occasions/route.ts`** (authenticated)

```
Response: { occasions: [{ id, label, person_name, occasion_date, notify_days_before }] }
```

**`POST /api/occasions/route.ts`** (authenticated)

```
Request: { label: "Partner's birthday", person_name: "Karan", occasion_date: "2026-03-14", notify_days_before: 3 }
Response: { occasion: { id, ... } }
```

**`PUT /api/occasions/[id]/route.ts`** (authenticated)

**`DELETE /api/occasions/[id]/route.ts`** (authenticated)

---

### Shared Canvas

**`POST /api/sessions/route.ts`** (authenticated or guest)

```
Response: { sessionId: "uuid", shareUrl: "https://polamuse.com/editor/shared/uuid" }
```

If coins are required (12 coins for a session), spend before creating.

**`GET /api/sessions/[id]/route.ts`** (public)

```
Response: { id, canvas_state, slot_a_filled, slot_b_filled, slot_a_label, slot_b_label, status, expires_at }
```

**`PUT /api/sessions/[id]/canvas/route.ts`** (public — anyone with the link)

```
Request: { canvasState: { ... }, slot: "a" | "b" }
Response: { ok: true }
```

Client should debounce this call (500ms after last change).

**`GET /api/sessions/[id]/stream/route.ts`** (SSE — public)

Server-Sent Events endpoint. Polls DB every 3 seconds and pushes `canvas_state` to all connected clients.

```typescript
// Response is a ReadableStream with Content-Type: text/event-stream
// Each event: data: {"canvas_state": {...}, "updated_at": "..."}
```

---

### Booth Mode

**`POST /api/booth/render/route.ts`** (authenticated)

```
Request: { shots: ["cloudinary-url-1", "url-2", "url-3", "url-4"], layout: "filmstrip" }
Response: { stripUrl: "https://res.cloudinary.com/.../booth-xxx.jpg" }
```

Uses `canvas` (node-canvas) package to:
1. Create a canvas sized for 4 stacked frames
2. Draw black background + white frame borders for each shot
3. Composite the 4 images
4. Add date stamp at bottom
5. Upload to Cloudinary under `polamuse/booth/`
6. Insert into `booth_sessions` table

---

### Admin — Monetization

**`GET /api/admin/monetization/summary/route.ts`** (admin only)

```
Query: ?period=30d  (7d, 30d, 90d, all)
Response: {
  watermark: { revenue_paise, count, conversion_rate },
  coins: { revenue_paise, packs_sold, coins_granted, coins_spent },
  prints: { revenue_paise, orders, avg_order_paise },
  addons: { revenue_paise, count, avg_per_order_paise },
  total: { gross_paise, net_paise }
}
```

**`GET /api/admin/coins/ledger/route.ts`** (admin only)

```
Query: ?page=1&limit=50&reason=purchase_popular
Response: { entries: [...], pagination: {...} }
```

---

## Middleware Updates

Add new protected routes to `src/middleware.ts`:

```typescript
const AUTH_REQUIRED_API = [
  '/api/designs',
  '/api/orders',
  '/api/payments',
  '/api/account',
  '/api/uploads',
  '/api/coins',       // NEW
  '/api/occasions',   // NEW
];
```

The following routes should remain public (no auth):
- `/api/designs/:id/unlock` — watermark unlock works without login
- `/api/designs/:id/download` — checks unlock status, serves accordingly
- `/api/sessions/:id` — shared canvas read (anyone with link)
- `/api/sessions/:id/stream` — SSE for shared canvas
- `/api/orders/track/:token` — gift order tracking

---

## Zod Validations to Add

```typescript
// src/lib/validations.ts — additions

export const coinPurchaseSchema = z.object({
  pack: z.enum(['starter', 'popular', 'best']),
  action: z.enum(['create_order', 'verify']),
  razorpay_payment_id: z.string().optional(),
  razorpay_order_id: z.string().optional(),
  razorpay_signature: z.string().optional(),
});

export const coinSpendSchema = z.object({
  feature: z.enum([
    'watermark', 'template', 'sticker', 'booth',
    'filmstrip', 'canvas', 'canvas_extend', 'save', 'batch_download'
  ]),
  referenceId: z.string().uuid().optional(),
});

export const addonSchema = z.object({
  addons: z.array(z.object({
    type: z.enum(['gift_wrap', 'note_card', 'magnet', 'extra_copy']),
    message: z.string().max(500).optional(),
  })).min(1).max(4),
});

export const occasionSchema = z.object({
  label: z.string().min(1).max(100),
  person_name: z.string().max(100).optional(),
  occasion_date: z.string().date(),
  notify_days_before: z.number().int().min(1).max(14).default(3),
});

export const giftOrderSchema = z.object({
  is_gift: z.literal(true),
  gift_message: z.string().max(500),
  gift_recipient_name: z.string().min(1).max(100),
  gift_recipient_email: z.string().email(),
  is_anonymous_gift: z.boolean().default(false),
  gift_reveal_at: z.string().datetime().optional(),
});

export const unlockDesignSchema = z.object({
  action: z.enum(['create_order', 'verify']),
  razorpay_payment_id: z.string().optional(),
  razorpay_order_id: z.string().optional(),
  razorpay_signature: z.string().optional(),
});

export const sharedCanvasUpdateSchema = z.object({
  canvasState: z.record(z.unknown()),
  slot: z.enum(['a', 'b']),
});
```

---

## Email Templates to Add

All in `src/components/emails/`:

1. **`GiftSent.tsx`** — "Someone sent you a memory" (to recipient)
   - No spoilers about content
   - Include tracking link
   - Warm, emotional tone

2. **`OccasionReminder.tsx`** — "{Person}'s birthday is in 3 days"
   - Include CTA to open last design or create new
   - Deep link to editor

3. **`CoinPurchaseReceipt.tsx`** — "You bought {coins} Pola Coins"
   - Pack name, coins received, amount paid, new balance

4. **`WatermarkUnlockReceipt.tsx`** — "Your design is watermark-free"
   - Download link to clean PNG
   - Amount paid

---

## Cron Jobs

### 1. Occasion Check (daily, 9 AM IST)

```
Route: /api/cron/occasions
Method: GET
Auth: Cron secret header (CRON_SECRET env var)
```

- Query `user_occasions` for dates matching NOW() + 3 days
- Send `OccasionReminder` email via Resend
- Update `last_notified_year` to current year

### 2. Session Cleanup (daily)

```
Route: /api/cron/cleanup-sessions
```

- Expire shared sessions past `expires_at`
- Optionally delete Cloudinary assets for old booth sessions (>30 days)

### Vercel cron config (`vercel.json`)

```json
{
  "crons": [
    { "path": "/api/cron/occasions", "schedule": "30 3 * * *" },
    { "path": "/api/cron/cleanup-sessions", "schedule": "0 4 * * *" }
  ]
}
```

(3:30 UTC = 9:00 AM IST, 4:00 UTC = 9:30 AM IST)

---

## Coin Grant Triggers

These are NOT separate API routes — they are side effects inside existing routes:

| Trigger | Where to add | Coins |
|---------|-------------|-------|
| User signs up | `POST /api/auth/signup` — after user insert | +20 |
| First design saved | `POST /api/designs` — check if first design | +10 |
| First print ordered | `POST /api/orders` — check if first order | +15 |
| Referral signup | `POST /api/auth/signup` — if `referral_code` in body | +25 to referrer |

Use `hasReceivedBonus()` before granting to prevent duplicates.

---

## Environment Variables to Add

```
# Coin/monetization (no new services, uses existing Razorpay)
CRON_SECRET=<random-string-for-cron-auth>
NEXT_PUBLIC_APP_URL=https://polamuse.com
```

---

*Polamuse Backend Implementation v2.1*
*New routes: ~20 · New lib: coins.ts · New emails: 4 · Cron jobs: 2*
