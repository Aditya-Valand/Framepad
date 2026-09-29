# Polamuse — SQL Schema Changes
> All new tables and migrations needed for the monetization + feature expansion.
> Run these against Neon PostgreSQL. Order matters — tables reference each other.

---

## Prerequisites

Ensure the `uuid-ossp` extension is enabled:

```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

Existing tables referenced below: `users(id)`, `designs(id)`, `orders(id)`.

---

## 1. Design Watermark Unlocks

Tracks which designs have had their watermark removed via ₹9 payment.

```sql
CREATE TABLE design_unlocks (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  design_id     UUID NOT NULL REFERENCES designs(id) ON DELETE CASCADE,
  user_id       UUID REFERENCES users(id) ON DELETE SET NULL,
  amount_paise  INTEGER NOT NULL DEFAULT 900,
  payment_id    VARCHAR(100),          -- Razorpay payment_id for reconciliation
  paid_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (design_id)
);

CREATE INDEX idx_design_unlocks_user ON design_unlocks(user_id);
```

**Key constraint:** `UNIQUE (design_id)` — a design is unlocked once, forever. The `ON CONFLICT (design_id) DO NOTHING` pattern is used on insert to handle duplicate payment attempts.

---

## 2. Pola Coins Ledger

Append-only ledger. Balance is always computed as `SUM(delta)` — never stored directly to avoid race conditions.

```sql
CREATE TABLE coin_ledger (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  delta         INTEGER NOT NULL,
  reason        VARCHAR(100) NOT NULL,
  reference_id  UUID,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_coin_ledger_user ON coin_ledger(user_id);
CREATE INDEX idx_coin_ledger_user_created ON coin_ledger(user_id, created_at DESC);
```

### Reason values (standardized strings)

| Category | Reason | Delta |
|----------|--------|-------|
| **Earn — Bonus** | `signup_bonus` | +20 |
| **Earn — Bonus** | `first_design` | +10 |
| **Earn — Bonus** | `first_order` | +15 |
| **Earn — Bonus** | `referral` | +25 |
| **Earn — Purchase** | `purchase_starter` | +50 |
| **Earn — Purchase** | `purchase_popular` | +120 |
| **Earn — Purchase** | `purchase_best` | +300 |
| **Spend** | `spend_watermark` | -10 |
| **Spend** | `spend_template` | -15 |
| **Spend** | `spend_sticker` | -8 |
| **Spend** | `spend_booth` | -8 |
| **Spend** | `spend_filmstrip` | -10 |
| **Spend** | `spend_canvas` | -12 |
| **Spend** | `spend_canvas_extend` | -5 |
| **Spend** | `spend_save` | -3 |
| **Spend** | `spend_batch_download` | -20 |

### Balance view

```sql
CREATE VIEW v_coin_balance AS
SELECT user_id, COALESCE(SUM(delta), 0) AS balance
FROM coin_ledger
GROUP BY user_id;
```

**Usage:** `SELECT balance FROM v_coin_balance WHERE user_id = $1` — returns 0 rows for users who've never earned coins, so always use `COALESCE` or handle empty result.

---

## 3. Coin Purchases

Tracks Razorpay payments for coin packs. Separate from ledger for payment reconciliation.

```sql
CREATE TABLE coin_purchases (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  pack_type       VARCHAR(20) NOT NULL CHECK (pack_type IN ('starter', 'popular', 'best')),
  coins_granted   INTEGER NOT NULL,
  amount_paise    INTEGER NOT NULL,
  razorpay_payment_id   VARCHAR(100),
  razorpay_order_id     VARCHAR(100),
  status          VARCHAR(20) NOT NULL DEFAULT 'pending'
                    CHECK (status IN ('pending', 'paid', 'failed')),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  paid_at         TIMESTAMPTZ
);

CREATE INDEX idx_coin_purchases_user ON coin_purchases(user_id);
```

### Pack definitions (reference — not stored in DB, defined in code constants)

| Pack | Coins | Price (paise) |
|------|-------|---------------|
| `starter` | 50 | 2900 |
| `popular` | 120 | 5900 |
| `best` | 300 | 9900 |

---

## 4. Order Add-ons

Physical add-ons attached to print orders at checkout.

```sql
CREATE TABLE order_addons (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id      UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  addon_type    VARCHAR(50) NOT NULL
                  CHECK (addon_type IN ('gift_wrap', 'note_card', 'magnet', 'extra_copy')),
  quantity      INTEGER NOT NULL DEFAULT 1,
  price_paise   INTEGER NOT NULL,
  metadata      JSONB,                  -- e.g. { "message": "Happy birthday!" } for note_card
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_order_addons_order ON order_addons(order_id);
```

### Add-on pricing (reference)

| Type | Price (paise) | Cost (paise) | Margin |
|------|---------------|--------------|--------|
| `gift_wrap` | 2500 | 800 | 68% |
| `note_card` | 2000 | 500 | 75% |
| `magnet` | 4900 | 2600 | 47% |
| `extra_copy` | 5900 | 3500 | 41% |

---

## 5. Orders Table — Gift Columns

Add gift-related columns to the existing `orders` table.

```sql
ALTER TABLE orders ADD COLUMN IF NOT EXISTS is_gift BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS gift_message TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS gift_recipient_name VARCHAR(100);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS gift_recipient_email VARCHAR(255);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS gift_reveal_at TIMESTAMPTZ;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS is_anonymous_gift BOOLEAN DEFAULT FALSE;
```

---

## 6. User Occasions

Stores dates for occasion-targeted notifications (birthday prompts, anniversary reminders).

```sql
CREATE TABLE user_occasions (
  id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id              UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  label                VARCHAR(100) NOT NULL,
  person_name          VARCHAR(100),
  occasion_date        DATE NOT NULL,
  notify_days_before   INTEGER NOT NULL DEFAULT 3,
  last_notified_year   INTEGER,
  is_active            BOOLEAN NOT NULL DEFAULT TRUE,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_user_occasions_user ON user_occasions(user_id);
CREATE INDEX idx_user_occasions_date ON user_occasions(
  EXTRACT(MONTH FROM occasion_date),
  EXTRACT(DAY FROM occasion_date)
);
```

**Date handling:** Store full DATE but only use month+day for matching. The year is ignored when checking upcoming occasions. `last_notified_year` prevents double-notification in the same year.

### Cron query — find occasions coming up in N days

```sql
SELECT uo.*, u.email, u.full_name
FROM user_occasions uo
JOIN users u ON u.id = uo.user_id
WHERE uo.is_active = TRUE
  AND (uo.last_notified_year IS NULL OR uo.last_notified_year < EXTRACT(YEAR FROM NOW()))
  AND (
    EXTRACT(MONTH FROM uo.occasion_date) = EXTRACT(MONTH FROM NOW() + INTERVAL '3 days')
    AND EXTRACT(DAY FROM uo.occasion_date) = EXTRACT(DAY FROM NOW() + INTERVAL '3 days')
  );
```

---

## 7. Shared Canvas Sessions

For the "Make Together" feature — two people editing one polaroid from different devices.

```sql
CREATE TABLE shared_sessions (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  creator_user_id   UUID REFERENCES users(id) ON DELETE SET NULL,
  canvas_state      JSONB NOT NULL DEFAULT '{}',
  slot_a_filled     BOOLEAN NOT NULL DEFAULT FALSE,
  slot_b_filled     BOOLEAN NOT NULL DEFAULT FALSE,
  slot_a_label      VARCHAR(50),
  slot_b_label      VARCHAR(50),
  participant_count INTEGER NOT NULL DEFAULT 1,
  status            VARCHAR(20) NOT NULL DEFAULT 'active'
                      CHECK (status IN ('active', 'completed', 'expired')),
  expires_at        TIMESTAMPTZ NOT NULL DEFAULT NOW() + INTERVAL '48 hours',
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_shared_sessions_expires ON shared_sessions(expires_at)
  WHERE status = 'active';
CREATE INDEX idx_shared_sessions_creator ON shared_sessions(creator_user_id);
```

### Expiry cleanup (run daily via cron)

```sql
UPDATE shared_sessions
SET status = 'expired'
WHERE status = 'active' AND expires_at < NOW();
```

---

## 8. Booth Mode Sessions

Stores film strip photo shoots for logged-in users.

```sql
CREATE TABLE booth_sessions (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID REFERENCES users(id) ON DELETE SET NULL,
  shots         JSONB NOT NULL,
  strip_url     TEXT,
  layout        VARCHAR(20) NOT NULL DEFAULT 'filmstrip',
  location_tag  VARCHAR(100),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_booth_sessions_user ON booth_sessions(user_id);
```

**`shots` JSONB format:**
```json
[
  { "url": "https://res.cloudinary.com/...", "takenAt": "2026-09-29T10:30:00Z" },
  { "url": "...", "takenAt": "..." },
  { "url": "...", "takenAt": "..." },
  { "url": "...", "takenAt": "..." }
]
```

---

## 9. Referrals

Tracks who referred whom for the +25 coin bonus.

```sql
CREATE TABLE referrals (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  referrer_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  referred_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  coins_granted   BOOLEAN NOT NULL DEFAULT FALSE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (referred_id)
);

CREATE INDEX idx_referrals_referrer ON referrals(referrer_id);
```

**Constraint:** `UNIQUE (referred_id)` — a user can only be referred once.

---

## Migration Order

Run in this order to satisfy foreign key dependencies:

1. `design_unlocks`
2. `coin_ledger` + `v_coin_balance`
3. `coin_purchases`
4. `order_addons`
5. `ALTER TABLE orders` (gift columns)
6. `user_occasions`
7. `shared_sessions`
8. `booth_sessions`
9. `referrals`

---

*Polamuse SQL Schema v2.1 — 9 new tables/views + 1 ALTER*
