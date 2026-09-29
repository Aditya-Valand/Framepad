-- ============================================================
-- POLAMUSE — v2 FEATURES MIGRATION
-- Run once against Neon. Safe to re-run (all IF NOT EXISTS).
-- Covers: Watermark unlocks · Pola Coins · Booth Mode ·
--         Shared Canvas · Order Add-ons · Gift Enhancement ·
--         Occasions · Referrals · Push Notifications
-- Money: all values in paise (₹1 = 100 paise)
-- NOTE: uses gen_random_uuid() — no extensions required
-- ============================================================


-- ============================================================
-- 1. WATERMARK UNLOCKS  (Phase 1)
-- ============================================================

CREATE TABLE IF NOT EXISTS design_unlocks (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  design_id     UUID        NOT NULL REFERENCES designs(id) ON DELETE CASCADE,
  user_id       UUID        REFERENCES users(id) ON DELETE SET NULL,
  amount_paise  INTEGER     NOT NULL DEFAULT 900,
  payment_id    VARCHAR(100),
  unlocked_via  VARCHAR(20) NOT NULL DEFAULT 'payment'
                  CHECK (unlocked_via IN ('payment', 'coins')),
  paid_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (design_id)
);

CREATE INDEX IF NOT EXISTS idx_design_unlocks_user     ON design_unlocks(user_id);
CREATE INDEX IF NOT EXISTS idx_design_unlocks_design   ON design_unlocks(design_id);


-- ============================================================
-- 2. POLA COINS  (Phase 2)
-- ============================================================

-- Append-only ledger — balance is always SUM(delta), never stored directly
CREATE TABLE IF NOT EXISTS coin_ledger (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  delta         INTEGER     NOT NULL,                         -- positive = earn, negative = spend
  reason        VARCHAR(100) NOT NULL,                        -- 'signup_bonus', 'spend_watermark', etc.
  reference_id  UUID,                                         -- design_id, order_id, purchase_id, etc.
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_coin_ledger_user         ON coin_ledger(user_id);
CREATE INDEX IF NOT EXISTS idx_coin_ledger_user_created ON coin_ledger(user_id, created_at DESC);

-- Live balance view — always accurate, no denorm drift risk
CREATE OR REPLACE VIEW v_coin_balance AS
SELECT
  user_id,
  COALESCE(SUM(delta), 0) AS balance
FROM coin_ledger
GROUP BY user_id;

-- Payment records for reconciliation (separate from ledger)
CREATE TABLE IF NOT EXISTS coin_purchases (
  id                  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  pack_type           VARCHAR(20) NOT NULL CHECK (pack_type IN ('starter', 'popular', 'best')),
  coins_granted       INTEGER     NOT NULL,
  amount_paise        INTEGER     NOT NULL,
  razorpay_payment_id VARCHAR(100) UNIQUE,
  razorpay_order_id   VARCHAR(100),
  status              VARCHAR(20) NOT NULL DEFAULT 'pending'
                        CHECK (status IN ('pending', 'paid', 'failed')),
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  paid_at             TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_coin_purchases_user   ON coin_purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_coin_purchases_status ON coin_purchases(status) WHERE status = 'pending';

-- Referral code per user (needed for Phase 7 referrals)
ALTER TABLE user_profiles
  ADD COLUMN IF NOT EXISTS referral_code VARCHAR(20) UNIQUE;

-- Populate referral codes for existing users (8-char uppercase alphanum)
UPDATE user_profiles
SET referral_code = UPPER(SUBSTRING(REPLACE(gen_random_uuid()::TEXT, '-', ''), 1, 8))
WHERE referral_code IS NULL;


-- ============================================================
-- 3. BOOTH MODE  (Phase 3)
-- ============================================================

CREATE TABLE IF NOT EXISTS booth_sessions (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID        REFERENCES users(id) ON DELETE SET NULL,
  shots         JSONB       NOT NULL DEFAULT '[]',            -- array of Cloudinary URLs
  strip_url     TEXT,                                         -- composite film strip URL
  layout        VARCHAR(20) NOT NULL DEFAULT 'filmstrip'
                  CHECK (layout IN ('filmstrip', 'grid', '2x2')),
  location_tag  VARCHAR(100),
  coin_spend_id UUID        REFERENCES coin_ledger(id) ON DELETE SET NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_booth_sessions_user ON booth_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_booth_sessions_date ON booth_sessions(user_id, created_at DESC);


-- ============================================================
-- 4. SHARED CANVAS  (Phase 4)
-- ============================================================

CREATE TABLE IF NOT EXISTS shared_sessions (
  id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_user_id   UUID        REFERENCES users(id) ON DELETE SET NULL,
  canvas_state      JSONB       NOT NULL DEFAULT '{}',
  slot_a_filled     BOOLEAN     NOT NULL DEFAULT FALSE,
  slot_b_filled     BOOLEAN     NOT NULL DEFAULT FALSE,
  slot_a_label      VARCHAR(50),
  slot_b_label      VARCHAR(50),
  slot_a_image_url  TEXT,
  slot_b_image_url  TEXT,
  participant_count INTEGER     NOT NULL DEFAULT 1,
  status            VARCHAR(20) NOT NULL DEFAULT 'active'
                      CHECK (status IN ('active', 'completed', 'expired')),
  coin_spend_id     UUID        REFERENCES coin_ledger(id) ON DELETE SET NULL,
  expires_at        TIMESTAMPTZ NOT NULL DEFAULT NOW() + INTERVAL '48 hours',
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_shared_sessions_creator ON shared_sessions(creator_user_id);
CREATE INDEX IF NOT EXISTS idx_shared_sessions_active
  ON shared_sessions(expires_at) WHERE status = 'active';


-- ============================================================
-- 5. ORDER ADD-ONS  (Phase 5)
-- ============================================================

CREATE TABLE IF NOT EXISTS order_addons (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id    UUID        NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  addon_type  VARCHAR(50) NOT NULL
                CHECK (addon_type IN ('gift_wrap', 'note_card', 'magnet', 'extra_copy')),
  quantity    INTEGER     NOT NULL DEFAULT 1,
  price_paise INTEGER     NOT NULL,
  metadata    JSONB,                                          -- note card text, extra copy design_id, etc.
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_order_addons_order ON order_addons(order_id);


-- ============================================================
-- 6. GIFT ENHANCEMENT  (Phase 6)
-- ============================================================

ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS gift_recipient_name  VARCHAR(100),
  ADD COLUMN IF NOT EXISTS gift_recipient_email VARCHAR(255),
  ADD COLUMN IF NOT EXISTS gift_reveal_at       TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS is_anonymous_gift    BOOLEAN NOT NULL DEFAULT FALSE;


-- ============================================================
-- 7. OCCASIONS + REFERRALS  (Phase 7)
-- ============================================================

CREATE TABLE IF NOT EXISTS user_occasions (
  id                 UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id            UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  label              VARCHAR(100) NOT NULL,                   -- 'Birthday', 'Anniversary', etc.
  person_name        VARCHAR(100),
  occasion_date      DATE        NOT NULL,
  notify_days_before INTEGER     NOT NULL DEFAULT 3,
  last_notified_year INTEGER,                                 -- prevents duplicate sends
  is_active          BOOLEAN     NOT NULL DEFAULT TRUE,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_occasions_user   ON user_occasions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_occasions_active
  ON user_occasions(occasion_date) WHERE is_active = TRUE;

CREATE TABLE IF NOT EXISTS referrals (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id   UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  referred_id   UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  coins_granted BOOLEAN     NOT NULL DEFAULT FALSE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (referred_id)                                        -- one referrer per new user
);

CREATE INDEX IF NOT EXISTS idx_referrals_referrer ON referrals(referrer_id);


-- ============================================================
-- 8. PUSH NOTIFICATIONS  (PWA Track)
-- ============================================================

CREATE TABLE IF NOT EXISTS push_subscriptions (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  endpoint   TEXT        NOT NULL UNIQUE,
  p256dh     TEXT        NOT NULL,
  auth       TEXT        NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_push_subs_user ON push_subscriptions(user_id);


-- ============================================================
-- SUMMARY
-- ============================================================
-- New tables:    design_unlocks, coin_ledger, coin_purchases,
--                booth_sessions, shared_sessions, order_addons,
--                user_occasions, referrals, push_subscriptions   (9)
-- New view:      v_coin_balance                                   (1)
-- Altered table: orders (+4 cols), user_profiles (+1 col)        (2)
-- Safe to re-run: all CREATE IF NOT EXISTS / ADD COLUMN IF NOT EXISTS
-- ============================================================
