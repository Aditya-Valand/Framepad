# Polamuse — Pola Coins & Transaction Management
> How the virtual currency system works end-to-end: earning, spending, purchasing, and reconciliation.
> Append-only ledger model — balance is never stored directly.

---

## Core Design Principle

```
The coin_ledger table is the SINGLE SOURCE OF TRUTH.

Balance = SUM(delta) WHERE user_id = X

Never store balance as a column. Never cache it in a separate table.
Every earn is a positive row. Every spend is a negative row.
The sum is always correct. There is no sync problem.
```

---

## 1. The Ledger Model

### Table: `coin_ledger`

```sql
CREATE TABLE coin_ledger (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  delta         INTEGER NOT NULL,      -- +ve = earned, -ve = spent
  reason        VARCHAR(100) NOT NULL,  -- standardized string
  reference_id  UUID,                   -- links to design_id, order_id, etc.
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### Reading balance

```sql
SELECT COALESCE(SUM(delta), 0) AS balance
FROM coin_ledger
WHERE user_id = $1;
```

Or via the convenience view:

```sql
SELECT balance FROM v_coin_balance WHERE user_id = $1;
-- Returns 0 rows if user has no ledger entries — handle with COALESCE
```

### Why append-only

- **No race conditions:** Two concurrent spends can't both read balance=10 and both spend 10. At worst, one succeeds and the other sees correct balance on retry.
- **Full audit trail:** Every coin ever earned or spent is traceable. Admin can see exactly where coins went.
- **Easy reconciliation:** Sum the deltas — if it doesn't match what the user sees, there's a bug. One column, one query.

---

## 2. Earning Coins

### Automatic bonuses (server-side triggers)

| Event | Coins | Reason string | Where triggered |
|-------|-------|---------------|-----------------|
| New user signs up | +20 | `signup_bonus` | `POST /api/auth/signup` |
| First design saved | +10 | `first_design` | `POST /api/designs` |
| First print ordered | +15 | `first_order` | `POST /api/orders` |
| Referral (friend signs up) | +25 | `referral` | `POST /api/auth/signup` (with referral code) |

**Duplicate prevention:** Before granting a bonus, always check:

```typescript
const alreadyGranted = await hasReceivedBonus(userId, 'signup_bonus');
if (alreadyGranted) return; // Don't grant twice
```

```sql
SELECT 1 FROM coin_ledger
WHERE user_id = $1 AND reason = $2 AND delta > 0
LIMIT 1;
```

### Purchased coins (via Razorpay)

| Pack | Coins | Price | Reason string |
|------|-------|-------|---------------|
| Starter | 50 | ₹29 | `purchase_starter` |
| Popular | 120 | ₹59 | `purchase_popular` |
| Best Value | 300 | ₹99 | `purchase_best` |

**Purchase flow:**

```
Client                          Server                        Razorpay
  │                               │                              │
  │  POST /api/coins/purchase     │                              │
  │  { pack: "popular",           │                              │
  │    action: "create_order" }   │                              │
  │ ─────────────────────────────>│                              │
  │                               │  razorpay.orders.create()   │
  │                               │ ─────────────────────────── >│
  │                               │ <────────────────────────── │
  │                               │  INSERT coin_purchases      │
  │                               │  (status = 'pending')       │
  │ <─────────────────────────────│                              │
  │  { razorpayOrderId, amount }  │                              │
  │                               │                              │
  │  [User completes Razorpay checkout on client]                │
  │                               │                              │
  │  POST /api/coins/purchase     │                              │
  │  { pack: "popular",           │                              │
  │    action: "verify",          │                              │
  │    razorpay_payment_id,       │                              │
  │    razorpay_order_id,         │                              │
  │    razorpay_signature }       │                              │
  │ ─────────────────────────────>│                              │
  │                               │  Verify signature            │
  │                               │  UPDATE coin_purchases       │
  │                               │    SET status = 'paid'       │
  │                               │  INSERT coin_ledger          │
  │                               │    (delta = +120,            │
  │                               │     reason = 'purchase_popular') │
  │ <─────────────────────────────│                              │
  │  { success: true,             │                              │
  │    balance: 162 }             │                              │
```

**Critical:** The ledger insert happens ONLY after Razorpay signature verification. Never credit coins optimistically.

### `coin_purchases` table

Tracks payment metadata separately from the ledger for reconciliation:

```sql
CREATE TABLE coin_purchases (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id               UUID NOT NULL REFERENCES users(id),
  pack_type             VARCHAR(20) NOT NULL,
  coins_granted         INTEGER NOT NULL,
  amount_paise          INTEGER NOT NULL,
  razorpay_payment_id   VARCHAR(100),
  razorpay_order_id     VARCHAR(100),
  status                VARCHAR(20) NOT NULL DEFAULT 'pending',
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  paid_at               TIMESTAMPTZ
);
```

**Reconciliation query** (admin):

```sql
-- All coin purchases vs. ledger entries — should match 1:1
SELECT
  cp.id AS purchase_id,
  cp.pack_type,
  cp.coins_granted,
  cp.amount_paise,
  cp.status,
  cl.id AS ledger_id,
  cl.delta AS ledger_delta
FROM coin_purchases cp
LEFT JOIN coin_ledger cl
  ON cl.user_id = cp.user_id
  AND cl.reason = 'purchase_' || cp.pack_type
  AND cl.created_at BETWEEN cp.created_at AND cp.created_at + INTERVAL '1 minute'
WHERE cp.status = 'paid'
ORDER BY cp.created_at DESC;
```

---

## 3. Spending Coins

### Spend costs

| Feature | Coins | Reason string | Reference |
|---------|-------|---------------|-----------|
| Remove watermark (1 design) | 10 | `spend_watermark` | design_id |
| Premium template unlock | 15 | `spend_template` | template_id |
| Custom sticker upload | 8 | `spend_sticker` | — |
| Booth session (unlimited shots) | 8 | `spend_booth` | — |
| Film strip without watermark | 10 | `spend_filmstrip` | booth_session_id |
| Shared canvas session (48h) | 12 | `spend_canvas` | session_id |
| Session extension (+24h) | 5 | `spend_canvas_extend` | session_id |
| Cloud save (beyond free tier) | 3 | `spend_save` | design_id |
| Batch download (3 designs) | 20 | `spend_batch_download` | — |

### Spend flow (server-side)

```typescript
// POST /api/coins/spend
export async function POST(req: Request) {
  const uid = userId(req);
  const body = await req.json();
  const parsed = coinSpendSchema.safeParse(body);
  if (!parsed.success) return err(parsed.error.issues[0].message, 400);

  const { feature, referenceId } = parsed.data;
  const cost = COIN_COSTS[feature];

  // 1. Prevent duplicate spend on same reference
  if (referenceId) {
    const [existing] = await sql`
      SELECT 1 FROM coin_ledger
      WHERE user_id = ${uid}
        AND reason = ${'spend_' + feature}
        AND reference_id = ${referenceId}
      LIMIT 1`;
    if (existing) {
      // Already spent on this — return success (idempotent)
      const balance = await getBalance(uid);
      return ok({ success: true, balance, coinsSpent: 0, alreadyUnlocked: true });
    }
  }

  // 2. Check balance and deduct
  const result = await spendCoins(uid, cost, 'spend_' + feature, referenceId);

  if (!result.success) {
    return ok({
      success: false,
      balance: result.balance,
      required: cost,
      error: 'Insufficient coins',
    });
  }

  // 3. Perform the unlock side-effect
  switch (feature) {
    case 'watermark':
      // Also insert into design_unlocks for the download check
      await sql`
        INSERT INTO design_unlocks (design_id, user_id, amount_paise, paid_at)
        VALUES (${referenceId}, ${uid}, 0, NOW())
        ON CONFLICT (design_id) DO NOTHING`;
      break;
    case 'canvas':
      // Create the shared session
      // ... (handled by the calling flow)
      break;
    // Other features just need the coin deduction
  }

  return ok({ success: true, balance: result.balance, coinsSpent: cost });
}
```

### Race condition handling

The current `spendCoins` function (check-then-insert) is not atomic:

```typescript
// This has a race window:
const balance = await getBalance(userId);     // Thread A reads 10
                                               // Thread B reads 10
if (balance < amount) return { success: false };
await sql`INSERT INTO coin_ledger ...`;        // Thread A inserts -10 (balance now 0)
                                               // Thread B inserts -10 (balance now -10!)
```

**v1 mitigation:** This is acceptable at launch scale. The worst case is a user gets a few free coins worth of features.

**v2 hardening** (when scale demands):

```sql
-- Use a transaction with a row-level lock
BEGIN;
  SELECT COALESCE(SUM(delta), 0) AS balance
  FROM coin_ledger
  WHERE user_id = $1
  FOR UPDATE;  -- locks all rows for this user

  -- If balance >= cost:
  INSERT INTO coin_ledger (user_id, delta, reason, reference_id)
  VALUES ($1, $2, $3, $4);
COMMIT;
```

Or use Postgres advisory locks:

```sql
SELECT pg_advisory_xact_lock(hashtext($userId));
-- Now safe to check-and-insert within this transaction
```

---

## 4. Watermark Unlock — Two Payment Paths

A design can be unlocked via either direct ₹9 payment OR 10 coins. Both paths write to `design_unlocks`.

### Path A: Direct ₹9 payment (no login required)

```
POST /api/designs/:id/unlock  { action: "create_order" }
  → Creates Razorpay order for 900 paise
  → Returns razorpayOrderId

[User pays via Razorpay UPI — 8 seconds]

POST /api/designs/:id/unlock  { action: "verify", razorpay_payment_id, ... }
  → Verify signature
  → INSERT INTO design_unlocks (design_id, user_id, amount_paise)
  → Return { unlocked: true }
```

### Path B: 10 coins (login required)

```
POST /api/coins/spend  { feature: "watermark", referenceId: "design-uuid" }
  → Check balance ≥ 10
  → INSERT INTO coin_ledger (delta = -10, reason = 'spend_watermark')
  → INSERT INTO design_unlocks (design_id, user_id, amount_paise = 0)
  → Return { success: true, balance }
```

### Download check

```typescript
// GET /api/designs/:id/download
const [unlock] = await sql`
  SELECT 1 FROM design_unlocks WHERE design_id = ${designId} LIMIT 1`;

if (unlock) {
  // Return clean PNG (no watermark)
} else {
  // Return watermarked PNG
}
```

---

## 5. Free Tier Limits

Some features have free usage before coins are required:

| Feature | Free tier | After free tier |
|---------|-----------|-----------------|
| Download (watermarked) | Unlimited | — |
| Download (clean) | 0 | ₹9 or 10 coins |
| Booth sessions per day | 3 | 8 coins each |
| Cloud saves per month | 3 | 3 coins each |
| Shared canvas | 0 | 12 coins |

### Tracking free tier usage

**Booth sessions:** Tracked client-side in localStorage (date-keyed counter). Server doesn't enforce this — it's a soft gate.

**Cloud saves:** Tracked server-side:

```sql
SELECT COUNT(*) FROM designs
WHERE user_id = $1
  AND created_at >= date_trunc('month', NOW())
  AND created_at < date_trunc('month', NOW()) + INTERVAL '1 month';
```

If count < 3, save is free. If count ≥ 3, require 3 coins.

---

## 6. Referral System

### How it works

1. Every user gets a referral code (their user ID or a short generated code)
2. They share a link: `https://polamuse.com?ref=CODE`
3. New user signs up with that link → `referral_code` stored in signup payload
4. Server validates the referral and creates entries:

```typescript
// In POST /api/auth/signup, after user creation:
if (referralCode) {
  // Find referrer
  const [referrer] = await sql`
    SELECT id FROM users WHERE id = ${referralCode} OR referral_code = ${referralCode} LIMIT 1`;
  
  if (referrer) {
    // Record the referral
    await sql`
      INSERT INTO referrals (referrer_id, referred_id)
      VALUES (${referrer.id}, ${newUserId})
      ON CONFLICT (referred_id) DO NOTHING`;
    
    // Grant coins to referrer
    await earnCoins(referrer.id, 25, 'referral', newUserId);
  }
}
```

### Referral abuse prevention

- Each user can only be referred once (`UNIQUE (referred_id)`)
- Self-referral blocked: `referrer_id != referred_id`
- Consider adding: IP-based dedup, email domain check (block disposable emails)

---

## 7. Admin Monitoring

### Revenue dashboard query

```sql
-- Layer-by-layer revenue for a time period
WITH period AS (
  SELECT NOW() - INTERVAL '30 days' AS start_date
)
SELECT
  -- Layer 1: Watermark unlocks
  (SELECT COUNT(*) FROM design_unlocks WHERE paid_at >= (SELECT start_date FROM period) AND amount_paise > 0) AS watermark_count,
  (SELECT COALESCE(SUM(amount_paise), 0) FROM design_unlocks WHERE paid_at >= (SELECT start_date FROM period) AND amount_paise > 0) AS watermark_revenue,

  -- Layer 2: Coin purchases
  (SELECT COUNT(*) FROM coin_purchases WHERE status = 'paid' AND paid_at >= (SELECT start_date FROM period)) AS coin_purchase_count,
  (SELECT COALESCE(SUM(amount_paise), 0) FROM coin_purchases WHERE status = 'paid' AND paid_at >= (SELECT start_date FROM period)) AS coin_revenue,
  (SELECT COALESCE(SUM(coins_granted), 0) FROM coin_purchases WHERE status = 'paid' AND paid_at >= (SELECT start_date FROM period)) AS coins_sold,

  -- Layer 3: Print orders (from existing orders table)
  (SELECT COUNT(*) FROM orders WHERE status != 'cancelled' AND created_at >= (SELECT start_date FROM period)) AS order_count,
  (SELECT COALESCE(SUM(total_paise), 0) FROM orders WHERE status != 'cancelled' AND created_at >= (SELECT start_date FROM period)) AS order_revenue,

  -- Layer 4: Add-ons
  (SELECT COUNT(*) FROM order_addons WHERE created_at >= (SELECT start_date FROM period)) AS addon_count,
  (SELECT COALESCE(SUM(price_paise), 0) FROM order_addons WHERE created_at >= (SELECT start_date FROM period)) AS addon_revenue;
```

### Coin economy health check

```sql
-- Total coins in circulation
SELECT
  SUM(CASE WHEN delta > 0 THEN delta ELSE 0 END) AS total_earned,
  SUM(CASE WHEN delta < 0 THEN ABS(delta) ELSE 0 END) AS total_spent,
  SUM(delta) AS net_in_circulation
FROM coin_ledger;

-- Coins earned by reason (understand where coins come from)
SELECT reason, SUM(delta) AS total, COUNT(*) AS transactions
FROM coin_ledger
WHERE delta > 0
GROUP BY reason
ORDER BY total DESC;

-- Coins spent by reason (understand what users buy)
SELECT reason, SUM(ABS(delta)) AS total, COUNT(*) AS transactions
FROM coin_ledger
WHERE delta < 0
GROUP BY reason
ORDER BY total DESC;

-- Users with highest balances (hoarding detection)
SELECT user_id, SUM(delta) AS balance
FROM coin_ledger
GROUP BY user_id
ORDER BY balance DESC
LIMIT 20;
```

### Red flags to monitor

| Signal | Query | Threshold |
|--------|-------|-----------|
| Negative balance | `SELECT user_id FROM v_coin_balance WHERE balance < 0` | Any row = bug |
| High hoarding | Avg balance > 100 coins | Users not spending → pricing may be wrong |
| Low purchase conversion | Coin buyers / MAU < 5% | Packs too expensive or features not desirable |
| Referral abuse | Same IP registering multiple accounts with referrals | > 3 referrals from same IP/day |

---

## 8. Transaction Flow Summary

```
                  ┌──────────────┐
                  │   RAZORPAY   │
                  └──────┬───────┘
                         │ payment verified
                         ▼
         ┌───────────────────────────────┐
         │                               │
    ₹9 unlock                    coin pack purchase
         │                               │
         ▼                               ▼
  design_unlocks              coin_purchases (status=paid)
  (amount_paise=900)                     │
                                         ▼
                               coin_ledger (+50/+120/+300)
                                         │
                              ┌──────────┴──────────┐
                              │                     │
                         auto bonus              user spends
                      (signup/first/ref)       (watermark/booth/etc)
                              │                     │
                              ▼                     ▼
                    coin_ledger (+20/+10/+15/+25)   coin_ledger (-N)
                                                    │
                                              ┌─────┴──────┐
                                              │            │
                                         if watermark   other features
                                              │         (no side effect
                                              ▼          beyond deduction)
                                       design_unlocks
                                       (amount_paise=0)
```

---

## 9. Testing Checklist

Before going live, verify these scenarios:

- [ ] User signs up → gets +20 coins → balance shows 20
- [ ] User signs up twice (same email) → only gets bonus once
- [ ] User buys Popular pack → Razorpay payment → balance increases by 120
- [ ] User with 10 coins spends on watermark → balance becomes 0 → design unlocked
- [ ] User with 5 coins tries watermark (cost 10) → rejected, balance unchanged
- [ ] User unlocks watermark via ₹9 → design_unlocks row created → download is clean
- [ ] User unlocks same design again → idempotent, no error, no double charge
- [ ] User refers friend → friend signs up → referrer gets +25
- [ ] User refers themselves → rejected
- [ ] Same person referred by two different users → only first counts
- [ ] Admin dashboard shows correct layer-by-layer revenue
- [ ] Negative balance never occurs (check after load testing)
- [ ] Razorpay payment fails → no coins credited, coin_purchases stays 'pending'
- [ ] coin_ledger SUM matches what user sees in header

---

*Polamuse Pola Coins & Transactions v2.1*
*Append-only ledger · Two payment paths · 4 revenue layers · Full audit trail*
