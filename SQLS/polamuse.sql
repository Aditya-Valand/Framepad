-- ============================================================
-- POLAMUSE — PRODUCTION DATABASE SCHEMA
-- PostgreSQL 15+ | All monetary values stored in paise (₹1 = 100 paise)
-- UUIDs for all PKs | Soft deletes where noted | Timestamps in UTC
-- ============================================================

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- for text search

-- ============================================================
-- DOMAIN: AUTH & USERS
-- ============================================================

CREATE TABLE users (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email                 VARCHAR(255) NOT NULL UNIQUE,
  email_verified_at     TIMESTAMPTZ,
  password_hash         VARCHAR(255),           -- NULL if Google-only auth
  google_id             VARCHAR(255) UNIQUE,    -- NULL if email-only auth
  is_active             BOOLEAN NOT NULL DEFAULT TRUE,
  role                  VARCHAR(20) NOT NULL DEFAULT 'customer'
                          CHECK (role IN ('customer', 'admin', 'support')),
  last_login_at         TIMESTAMPTZ,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at            TIMESTAMPTZ             -- soft delete
);

CREATE TABLE user_profiles (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id               UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  full_name             VARCHAR(100),
  phone                 VARCHAR(20),
  avatar_url            TEXT,
  date_of_birth         DATE,
  city                  VARCHAR(100),
  state                 VARCHAR(100),
  -- Preferences
  default_font_preset   VARCHAR(50) DEFAULT 'handwritten',
  default_frame_style   VARCHAR(50) DEFAULT 'classic',
  preferred_finish      VARCHAR(20) DEFAULT 'glossy'
                          CHECK (preferred_finish IN ('glossy', 'matte')),
  -- Notifications
  email_marketing       BOOLEAN DEFAULT TRUE,
  whatsapp_updates      BOOLEAN DEFAULT TRUE,
  -- Stats (denormalized for speed)
  total_designs         INTEGER DEFAULT 0,
  total_orders          INTEGER DEFAULT 0,
  total_prints_ordered  INTEGER DEFAULT 0,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE password_reset_tokens (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id               UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash            VARCHAR(255) NOT NULL UNIQUE,
  expires_at            TIMESTAMPTZ NOT NULL,
  used_at               TIMESTAMPTZ,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE user_sessions (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id               UUID REFERENCES users(id) ON DELETE SET NULL,
  session_token_hash    VARCHAR(255) NOT NULL UNIQUE,
  device_type           VARCHAR(50),            -- 'mobile', 'desktop', 'tablet'
  browser               VARCHAR(100),
  os                    VARCHAR(100),
  ip_address            INET,
  country_code          CHAR(2),
  city                  VARCHAR(100),
  expires_at            TIMESTAMPTZ NOT NULL,
  last_active_at        TIMESTAMPTZ,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- DOMAIN: TEMPLATES
-- ============================================================

CREATE TABLE templates (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug                  VARCHAR(100) NOT NULL UNIQUE,  -- 'classic', 'instax-mini', 'movie-poster'
  name                  VARCHAR(100) NOT NULL,
  description           TEXT,
  vibe                  VARCHAR(50),                   -- 'timeless', 'trending', 'cinematic'
  thumbnail_url         TEXT,
  default_canvas_state  JSONB NOT NULL,                -- default fabric.js JSON for this template
  -- Frame properties (derived from canvas_state, stored for filtering)
  frame_ratio           VARCHAR(10),                   -- '3:4', '1:1', '3:2'
  orientation           VARCHAR(20) CHECK (orientation IN ('portrait', 'landscape', 'square')),
  frame_color           VARCHAR(20) DEFAULT '#FFFFFF',
  has_top_label         BOOLEAN DEFAULT FALSE,
  has_bottom_caption    BOOLEAN DEFAULT TRUE,
  has_dark_strip        BOOLEAN DEFAULT FALSE,
  -- Access
  is_premium            BOOLEAN NOT NULL DEFAULT FALSE,
  price_paise           INTEGER NOT NULL DEFAULT 0,     -- 0 = free
  is_active             BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order            INTEGER NOT NULL DEFAULT 0,
  -- Stats
  times_used            INTEGER DEFAULT 0,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- DOMAIN: DESIGNS (the user's creations)
-- ============================================================

CREATE TABLE designs (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id               UUID REFERENCES users(id) ON DELETE SET NULL,
  template_id           UUID REFERENCES templates(id) ON DELETE SET NULL,
  title                 VARCHAR(200),                  -- optional user-given name
  -- Canvas data
  canvas_state          JSONB NOT NULL,                -- full fabric.js serialized JSON
  canvas_state_url      TEXT,                          -- S3 URL if too large for DB
  -- Derived / indexed properties (extracted from canvas_state for fast queries)
  frame_style           VARCHAR(50),
  frame_color           VARCHAR(20),
  has_caption           BOOLEAN DEFAULT FALSE,
  caption_text          VARCHAR(500),
  has_top_label         BOOLEAN DEFAULT FALSE,
  top_label_text        VARCHAR(200),
  has_spotify_code      BOOLEAN DEFAULT FALSE,
  spotify_uri           VARCHAR(200),
  has_stickers          BOOLEAN DEFAULT FALSE,
  filter_preset         VARCHAR(50),
  -- Outputs
  thumbnail_url         TEXT,                          -- low-res preview, S3
  export_url            TEXT,                          -- high-res PNG, S3 (2x multiplier)
  export_resolution     VARCHAR(20),                   -- e.g. '800x1000'
  -- Status
  status                VARCHAR(20) NOT NULL DEFAULT 'draft'
                          CHECK (status IN ('draft', 'exported', 'ordered', 'archived')),
  is_public             BOOLEAN NOT NULL DEFAULT FALSE, -- future: public gallery
  -- Metadata
  source                VARCHAR(50) DEFAULT 'editor'
                          CHECK (source IN ('editor', 'bulk', 'api')),
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at            TIMESTAMPTZ
);

-- Stickers and overlays placed on designs (normalized for analytics)
CREATE TABLE design_stickers (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  design_id             UUID NOT NULL REFERENCES designs(id) ON DELETE CASCADE,
  sticker_type          VARCHAR(50),                   -- 'heart', 'tape', 'date_label', 'custom'
  sticker_url           TEXT,                          -- S3 URL for custom uploads
  position_x            NUMERIC(6,2),
  position_y            NUMERIC(6,2),
  scale                 NUMERIC(4,2) DEFAULT 1.0,
  rotation              NUMERIC(6,2) DEFAULT 0,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Version history for designs
CREATE TABLE design_versions (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  design_id             UUID NOT NULL REFERENCES designs(id) ON DELETE CASCADE,
  version_number        INTEGER NOT NULL,
  canvas_state          JSONB NOT NULL,
  thumbnail_url         TEXT,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (design_id, version_number)
);

-- ============================================================
-- DOMAIN: PRODUCT CATALOG
-- ============================================================

CREATE TABLE product_types (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug                  VARCHAR(50) NOT NULL UNIQUE,   -- 'single', 'pack-5', 'pack-10', 'pack-20', 'gift-box'
  name                  VARCHAR(100) NOT NULL,
  description           TEXT,
  quantity              INTEGER NOT NULL,              -- number of prints
  base_price_paise      INTEGER NOT NULL,
  has_gift_box          BOOLEAN NOT NULL DEFAULT FALSE,
  has_gift_message      BOOLEAN NOT NULL DEFAULT FALSE,
  has_tissue_wrap       BOOLEAN NOT NULL DEFAULT FALSE,
  discount_percentage   INTEGER DEFAULT 0,            -- 0 = no discount, 25 = 25% off per print
  is_active             BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order            INTEGER NOT NULL DEFAULT 0,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE print_finishes (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug                  VARCHAR(20) NOT NULL UNIQUE,   -- 'glossy', 'matte'
  name                  VARCHAR(50) NOT NULL,
  description           TEXT,
  price_addon_paise     INTEGER NOT NULL DEFAULT 0,
  is_active             BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE print_sizes (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug                  VARCHAR(30) NOT NULL UNIQUE,   -- '4x6', '5x7', 'instax-mini', 'square'
  name                  VARCHAR(50) NOT NULL,          -- '4×6 in', 'Instax Mini'
  width_mm              NUMERIC(6,2),
  height_mm             NUMERIC(6,2),
  orientation           VARCHAR(20) CHECK (orientation IN ('portrait', 'landscape', 'square')),
  price_addon_paise     INTEGER NOT NULL DEFAULT 0,
  is_default            BOOLEAN NOT NULL DEFAULT FALSE,
  is_active             BOOLEAN NOT NULL DEFAULT TRUE
);

-- ============================================================
-- DOMAIN: SHIPPING ADDRESSES
-- ============================================================

CREATE TABLE addresses (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id               UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  label                 VARCHAR(50),                   -- 'Home', 'Office', 'Friend's place'
  full_name             VARCHAR(100) NOT NULL,
  phone                 VARCHAR(20) NOT NULL,
  line1                 VARCHAR(255) NOT NULL,
  line2                 VARCHAR(255),
  landmark              VARCHAR(255),
  city                  VARCHAR(100) NOT NULL,
  state                 VARCHAR(100) NOT NULL,
  pincode               VARCHAR(10) NOT NULL,
  country               CHAR(2) NOT NULL DEFAULT 'IN',
  is_default            BOOLEAN NOT NULL DEFAULT FALSE,
  is_verified           BOOLEAN NOT NULL DEFAULT FALSE, -- address verified via pincode API
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- DOMAIN: ORDERS
-- ============================================================

CREATE TABLE orders (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number          VARCHAR(30) NOT NULL UNIQUE,   -- 'PML-2026-00001'
  user_id               UUID NOT NULL REFERENCES users(id),
  -- Amounts (all in paise)
  subtotal_paise        INTEGER NOT NULL,
  discount_paise        INTEGER NOT NULL DEFAULT 0,
  shipping_paise        INTEGER NOT NULL DEFAULT 0,
  tax_paise             INTEGER NOT NULL DEFAULT 0,
  total_paise           INTEGER NOT NULL,
  currency              CHAR(3) NOT NULL DEFAULT 'INR',
  -- Type & Status
  order_type            VARCHAR(20) NOT NULL DEFAULT 'standard'
                          CHECK (order_type IN ('standard', 'gift', 'event', 'subscription')),
  status                VARCHAR(30) NOT NULL DEFAULT 'pending_payment'
                          CHECK (status IN (
                            'pending_payment', 'payment_failed', 'confirmed',
                            'processing', 'printing', 'shipped', 'delivered',
                            'cancelled', 'refunded', 'partially_refunded'
                          )),
  -- Relations
  shipping_address_id   UUID REFERENCES addresses(id),
  coupon_id             UUID,                          -- FK added below
  -- Gift
  is_gift               BOOLEAN NOT NULL DEFAULT FALSE,
  -- Dates
  confirmed_at          TIMESTAMPTZ,
  estimated_delivery_at DATE,
  delivered_at          TIMESTAMPTZ,
  cancelled_at          TIMESTAMPTZ,
  cancellation_reason   TEXT,
  -- Internal
  notes                 TEXT,
  internal_notes        TEXT,
  metadata              JSONB,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Sequence for readable order numbers
CREATE SEQUENCE order_number_seq START 1;

CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
  NEW.order_number := 'PML-' || TO_CHAR(NOW(), 'YYYY') || '-' ||
                      LPAD(NEXTVAL('order_number_seq')::TEXT, 5, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_order_number
  BEFORE INSERT ON orders
  FOR EACH ROW EXECUTE FUNCTION generate_order_number();

CREATE TABLE order_items (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id              UUID NOT NULL REFERENCES orders(id) ON DELETE RESTRICT,
  design_id             UUID NOT NULL REFERENCES designs(id),
  product_type_id       UUID NOT NULL REFERENCES product_types(id),
  print_finish_id       UUID NOT NULL REFERENCES print_finishes(id),
  print_size_id         UUID NOT NULL REFERENCES print_sizes(id),
  quantity              INTEGER NOT NULL DEFAULT 1,
  unit_price_paise      INTEGER NOT NULL,              -- price at time of order (snapshot)
  total_price_paise     INTEGER NOT NULL,
  -- Print output
  print_ready_url       TEXT,                          -- S3 URL of the print-ready file
  print_status          VARCHAR(20) NOT NULL DEFAULT 'pending'
                          CHECK (print_status IN (
                            'pending', 'queued', 'printing', 'printed', 'shipped', 'failed'
                          )),
  -- Snapshot of design at order time
  design_snapshot_url   TEXT,                          -- frozen PNG, won't change if user edits later
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE gift_messages (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id              UUID NOT NULL UNIQUE REFERENCES orders(id) ON DELETE CASCADE,
  from_name             VARCHAR(100) NOT NULL,
  to_name               VARCHAR(100),
  message               TEXT CHECK (LENGTH(message) <= 500),
  font_style            VARCHAR(50) DEFAULT 'handwritten',  -- how to print the note
  is_printed            BOOLEAN NOT NULL DEFAULT FALSE,
  printed_at            TIMESTAMPTZ,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- DOMAIN: PAYMENTS
-- ============================================================

CREATE TABLE payments (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id              UUID NOT NULL REFERENCES orders(id),
  -- Provider
  provider              VARCHAR(30) NOT NULL DEFAULT 'razorpay'
                          CHECK (provider IN ('razorpay', 'stripe', 'manual')),
  provider_payment_id   VARCHAR(100),                  -- rzp_pay_xxxx
  provider_order_id     VARCHAR(100),                  -- rzp_ord_xxxx
  -- Amount
  amount_paise          INTEGER NOT NULL,
  currency              CHAR(3) NOT NULL DEFAULT 'INR',
  -- Status
  status                VARCHAR(20) NOT NULL DEFAULT 'created'
                          CHECK (status IN ('created', 'attempted', 'captured', 'failed', 'refunded', 'partially_refunded')),
  payment_method        VARCHAR(50),                   -- 'upi', 'card', 'netbanking', 'wallet'
  bank                  VARCHAR(100),
  card_network          VARCHAR(50),                   -- 'Visa', 'Mastercard', 'RuPay'
  -- Failure
  failure_code          VARCHAR(100),
  failure_reason        TEXT,
  -- Refund
  refund_amount_paise   INTEGER DEFAULT 0,
  refund_reason         TEXT,
  refunded_at           TIMESTAMPTZ,
  -- Raw payload for reconciliation
  provider_payload      JSONB,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- DOMAIN: FULFILLMENT
-- ============================================================

CREATE TABLE print_jobs (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id              UUID NOT NULL REFERENCES orders(id),
  order_item_id         UUID NOT NULL REFERENCES order_items(id),
  -- Provider
  provider              VARCHAR(30) NOT NULL DEFAULT 'manual'
                          CHECK (provider IN ('manual', 'gelato', 'printful', 'local_lab')),
  provider_job_id       VARCHAR(200),
  -- Files
  print_file_url        TEXT NOT NULL,
  print_specs           JSONB NOT NULL,                -- {size, finish, quantity, bleed, dpi}
  -- Status
  status                VARCHAR(20) NOT NULL DEFAULT 'queued'
                          CHECK (status IN ('queued', 'processing', 'sent', 'confirmed', 'printing', 'printed', 'failed')),
  attempts              INTEGER NOT NULL DEFAULT 0,
  last_attempt_at       TIMESTAMPTZ,
  error_message         TEXT,
  -- Timeline
  queued_at             TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  sent_at               TIMESTAMPTZ,
  confirmed_at          TIMESTAMPTZ,
  printed_at            TIMESTAMPTZ,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE shipments (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id              UUID NOT NULL REFERENCES orders(id),
  -- Provider
  provider              VARCHAR(50),                   -- 'shiprocket', 'delhivery', 'ecom_express', 'manual'
  provider_shipment_id  VARCHAR(200),
  -- Tracking
  tracking_number       VARCHAR(200),
  tracking_url          TEXT,
  carrier               VARCHAR(100),
  -- Status
  status                VARCHAR(30) NOT NULL DEFAULT 'created'
                          CHECK (status IN (
                            'created', 'picked_up', 'in_transit',
                            'out_for_delivery', 'delivered', 'failed', 'returned'
                          )),
  -- Events log
  tracking_events       JSONB,                         -- array of {status, location, timestamp}
  -- Timeline
  shipped_at            TIMESTAMPTZ,
  expected_delivery_at  DATE,
  delivered_at          TIMESTAMPTZ,
  failed_at             TIMESTAMPTZ,
  failure_reason        TEXT,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- DOMAIN: COUPONS & DISCOUNTS
-- ============================================================

CREATE TABLE coupons (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code                  VARCHAR(50) NOT NULL UNIQUE,
  description           VARCHAR(255),
  type                  VARCHAR(30) NOT NULL
                          CHECK (type IN ('percentage', 'fixed_amount', 'free_shipping', 'free_gift_box')),
  value                 INTEGER NOT NULL,              -- percentage OR paise
  min_order_paise       INTEGER DEFAULT 0,             -- minimum order to apply
  max_discount_paise    INTEGER,                       -- cap for percentage discounts
  -- Usage limits
  total_usage_limit     INTEGER,                       -- null = unlimited
  usage_count           INTEGER NOT NULL DEFAULT 0,
  per_user_limit        INTEGER NOT NULL DEFAULT 1,
  -- Applicability
  applicable_to         VARCHAR(30) DEFAULT 'all'
                          CHECK (applicable_to IN ('all', 'first_order', 'product_type', 'event')),
  applicable_product_id UUID REFERENCES product_types(id),
  -- Validity
  valid_from            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  valid_until           TIMESTAMPTZ,
  is_active             BOOLEAN NOT NULL DEFAULT TRUE,
  created_by            UUID REFERENCES users(id),
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE orders ADD CONSTRAINT fk_orders_coupon
  FOREIGN KEY (coupon_id) REFERENCES coupons(id);

CREATE TABLE coupon_usages (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  coupon_id             UUID NOT NULL REFERENCES coupons(id),
  user_id               UUID NOT NULL REFERENCES users(id),
  order_id              UUID NOT NULL REFERENCES orders(id),
  discount_applied_paise INTEGER NOT NULL,
  used_at               TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (coupon_id, order_id)
);

-- ============================================================
-- DOMAIN: SUBSCRIPTIONS (monthly print packs)
-- ============================================================

CREATE TABLE subscription_plans (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug                  VARCHAR(30) NOT NULL UNIQUE,   -- 'starter', 'regular', 'premium'
  name                  VARCHAR(50) NOT NULL,
  prints_per_month      INTEGER NOT NULL,
  price_paise           INTEGER NOT NULL,              -- per month
  includes_gift_box     BOOLEAN DEFAULT FALSE,
  rollover_prints       BOOLEAN DEFAULT FALSE,         -- unused prints carry over?
  is_active             BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order            INTEGER DEFAULT 0,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE subscriptions (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id               UUID NOT NULL REFERENCES users(id),
  plan_id               UUID NOT NULL REFERENCES subscription_plans(id),
  status                VARCHAR(20) NOT NULL DEFAULT 'active'
                          CHECK (status IN ('active', 'paused', 'cancelled', 'past_due', 'expired')),
  -- Billing
  provider              VARCHAR(30) DEFAULT 'razorpay',
  provider_sub_id       VARCHAR(200),
  -- Period
  current_period_start  DATE NOT NULL,
  current_period_end    DATE NOT NULL,
  next_billing_date     DATE,
  -- Usage
  prints_remaining      INTEGER NOT NULL,
  prints_used_this_period INTEGER NOT NULL DEFAULT 0,
  -- Lifecycle
  paused_at             TIMESTAMPTZ,
  pause_reason          TEXT,
  cancelled_at          TIMESTAMPTZ,
  cancellation_reason   TEXT,
  expires_at            TIMESTAMPTZ,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE subscription_billing_history (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  subscription_id       UUID NOT NULL REFERENCES subscriptions(id),
  payment_id            UUID REFERENCES payments(id),
  amount_paise          INTEGER NOT NULL,
  status                VARCHAR(20),
  billing_period_start  DATE NOT NULL,
  billing_period_end    DATE NOT NULL,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- DOMAIN: EVENTS (weddings, corporate, bulk)
-- ============================================================

CREATE TABLE event_orders (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id               UUID NOT NULL REFERENCES users(id),
  order_id              UUID REFERENCES orders(id),   -- linked when confirmed
  name                  VARCHAR(200) NOT NULL,         -- 'Priya & Raj Wedding'
  event_type            VARCHAR(30) NOT NULL
                          CHECK (event_type IN ('wedding', 'birthday', 'corporate', 'farewell', 'anniversary', 'other')),
  event_date            DATE,
  quantity              INTEGER NOT NULL,
  theme_brief           TEXT,
  reference_images      JSONB,                         -- array of S3 URLs
  -- Preferred options
  preferred_finish      VARCHAR(20),
  preferred_size        VARCHAR(30),
  has_gift_packaging    BOOLEAN DEFAULT FALSE,
  -- Status
  status                VARCHAR(20) NOT NULL DEFAULT 'enquiry'
                          CHECK (status IN ('enquiry', 'quoted', 'confirmed', 'in_production', 'shipped', 'completed', 'cancelled')),
  -- Pricing
  quote_paise           INTEGER,
  final_price_paise     INTEGER,
  -- Internal
  assigned_to           UUID REFERENCES users(id),    -- internal team member
  internal_notes        TEXT,
  -- Delivery
  delivery_address_id   UUID REFERENCES addresses(id),
  required_by_date      DATE,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- DOMAIN: NOTIFICATIONS
-- ============================================================

CREATE TABLE notifications (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id               UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type                  VARCHAR(50) NOT NULL,          -- 'order_confirmed', 'order_shipped', etc
  title                 VARCHAR(200) NOT NULL,
  body                  TEXT NOT NULL,
  data                  JSONB,                         -- {order_id, tracking_url, design_id}
  channel               VARCHAR(20) NOT NULL
                          CHECK (channel IN ('email', 'whatsapp', 'push', 'sms', 'in_app')),
  status                VARCHAR(20) NOT NULL DEFAULT 'pending'
                          CHECK (status IN ('pending', 'sent', 'failed', 'bounced')),
  sent_at               TIMESTAMPTZ,
  read_at               TIMESTAMPTZ,
  failure_reason        TEXT,
  provider_message_id   VARCHAR(200),                 -- e.g. SendGrid message ID
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- DOMAIN: ANALYTICS
-- ============================================================

CREATE TABLE design_events (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  design_id             UUID REFERENCES designs(id) ON DELETE SET NULL,
  user_id               UUID REFERENCES users(id) ON DELETE SET NULL,
  session_id            UUID REFERENCES user_sessions(id) ON DELETE SET NULL,
  event_type            VARCHAR(50) NOT NULL
                          CHECK (event_type IN (
                            'design_created', 'design_edited', 'template_applied',
                            'filter_applied', 'sticker_added', 'spotify_added',
                            'caption_typed', 'design_exported', 'design_ordered',
                            'design_shared', 'design_deleted'
                          )),
  metadata              JSONB,                         -- {template_id, filter_name, sticker_type}
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE page_views (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id               UUID REFERENCES users(id) ON DELETE SET NULL,
  session_id            UUID REFERENCES user_sessions(id) ON DELETE SET NULL,
  page                  VARCHAR(100) NOT NULL,         -- '/editor', '/order', '/login'
  referrer              TEXT,
  utm_source            VARCHAR(100),
  utm_medium            VARCHAR(100),
  utm_campaign          VARCHAR(200),
  time_on_page_seconds  INTEGER,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- SEED DATA — Product types
-- ============================================================

INSERT INTO product_types (slug, name, description, quantity, base_price_paise, has_gift_box, has_gift_message, discount_percentage, sort_order) VALUES
  ('single',   'Single Print',  'One polaroid, shipped in a protective kraft envelope',  1,  7900,  FALSE, FALSE,  0, 1),
  ('pack-5',   'Pack of 5',     'Five polaroids in a kraft sleeve set',                  5,  34900, FALSE, TRUE,  10, 2),
  ('pack-10',  'Pack of 10',    'Ten polaroids in a premium kraft gift box',             10, 59000, TRUE,  TRUE,  25, 3),
  ('pack-20',  'Pack of 20',    'Twenty polaroids — perfect for events and weddings',   20, 99900, TRUE,  TRUE,  37, 4),
  ('gift-box', 'Gift Box',      'Curated gift box with tissue paper and ribbon',         5,  49900, TRUE,  TRUE,  15, 5);

INSERT INTO print_finishes (slug, name, description, price_addon_paise) VALUES
  ('glossy', 'Glossy', 'Classic shiny finish — vivid colors', 0),
  ('matte',  'Matte',  'Soft, non-reflective — premium feel',  500);

INSERT INTO print_sizes (slug, name, width_mm, height_mm, orientation, price_addon_paise, is_default) VALUES
  ('4x6',        '4×6 in',      101.6, 152.4, 'portrait',  0,    TRUE),
  ('5x7',        '5×7 in',      127.0, 177.8, 'portrait',  1000, FALSE),
  ('instax-mini','Instax Mini',  54.0,  86.0,  'portrait',  0,    FALSE),
  ('square',     'Square 3×3',   76.2,  76.2,  'square',    500,  FALSE);

INSERT INTO subscription_plans (slug, name, prints_per_month, price_paise, includes_gift_box, rollover_prints, sort_order) VALUES
  ('starter', 'Starter',  5,  19900, FALSE, FALSE, 1),
  ('regular', 'Regular', 10,  34900, FALSE, TRUE,  2),
  ('premium', 'Premium', 20,  49900, TRUE,  TRUE,  3);

-- ============================================================
-- INDEXES — critical for production performance
-- ============================================================

-- Users
CREATE INDEX idx_users_email            ON users(email);
CREATE INDEX idx_users_google_id        ON users(google_id) WHERE google_id IS NOT NULL;
CREATE INDEX idx_users_deleted_at       ON users(deleted_at) WHERE deleted_at IS NOT NULL;

-- Designs
CREATE INDEX idx_designs_user_id        ON designs(user_id);
CREATE INDEX idx_designs_status         ON designs(status);
CREATE INDEX idx_designs_created_at     ON designs(created_at DESC);
CREATE INDEX idx_designs_template_id    ON designs(template_id);
CREATE INDEX idx_designs_user_status    ON designs(user_id, status);
CREATE INDEX idx_designs_caption_text   ON designs USING gin(to_tsvector('english', caption_text))
                                         WHERE caption_text IS NOT NULL;

-- Orders
CREATE INDEX idx_orders_user_id         ON orders(user_id);
CREATE INDEX idx_orders_status          ON orders(status);
CREATE INDEX idx_orders_order_number    ON orders(order_number);
CREATE INDEX idx_orders_created_at      ON orders(created_at DESC);
CREATE INDEX idx_orders_user_status     ON orders(user_id, status);

-- Order items
CREATE INDEX idx_order_items_order_id   ON order_items(order_id);
CREATE INDEX idx_order_items_design_id  ON order_items(design_id);

-- Payments
CREATE INDEX idx_payments_order_id      ON payments(order_id);
CREATE INDEX idx_payments_provider_id   ON payments(provider_payment_id);
CREATE INDEX idx_payments_status        ON payments(status);

-- Print jobs
CREATE INDEX idx_print_jobs_order_id    ON print_jobs(order_id);
CREATE INDEX idx_print_jobs_status      ON print_jobs(status);

-- Shipments
CREATE INDEX idx_shipments_order_id     ON shipments(order_id);
CREATE INDEX idx_shipments_tracking     ON shipments(tracking_number);

-- Coupons
CREATE INDEX idx_coupons_code           ON coupons(code);
CREATE INDEX idx_coupons_valid          ON coupons(valid_from, valid_until) WHERE is_active = TRUE;

-- Notifications
CREATE INDEX idx_notifications_user_id  ON notifications(user_id);
CREATE INDEX idx_notifications_unread   ON notifications(user_id, read_at) WHERE read_at IS NULL;

-- Analytics
CREATE INDEX idx_design_events_design   ON design_events(design_id);
CREATE INDEX idx_design_events_user     ON design_events(user_id);
CREATE INDEX idx_design_events_type     ON design_events(event_type, created_at DESC);
CREATE INDEX idx_page_views_session     ON page_views(session_id);
CREATE INDEX idx_page_views_page        ON page_views(page, created_at DESC);

-- ============================================================
-- VIEWS — useful for reporting
-- ============================================================

CREATE VIEW v_order_summary AS
SELECT
  o.id,
  o.order_number,
  o.status,
  o.order_type,
  o.total_paise,
  o.created_at,
  up.full_name AS customer_name,
  u.email AS customer_email,
  COUNT(oi.id) AS item_count,
  SUM(oi.quantity) AS total_prints,
  p.status AS payment_status,
  s.status AS shipment_status,
  s.tracking_number
FROM orders o
JOIN users u ON u.id = o.user_id
LEFT JOIN user_profiles up ON up.user_id = o.user_id
LEFT JOIN order_items oi ON oi.order_id = o.id
LEFT JOIN payments p ON p.order_id = o.id
LEFT JOIN shipments s ON s.order_id = o.id
WHERE o.cancelled_at IS NULL
GROUP BY o.id, o.order_number, o.status, o.order_type, o.total_paise,
         o.created_at, up.full_name, u.email, p.status, s.status, s.tracking_number;

CREATE VIEW v_design_stats AS
SELECT
  d.id,
  d.user_id,
  d.template_id,
  t.name AS template_name,
  d.status,
  d.has_spotify_code,
  d.filter_preset,
  d.created_at,
  COUNT(de.id) AS edit_count,
  MAX(CASE WHEN de.event_type = 'design_exported' THEN de.created_at END) AS last_exported_at,
  MAX(CASE WHEN de.event_type = 'design_ordered' THEN de.created_at END) AS last_ordered_at
FROM designs d
LEFT JOIN templates t ON t.id = d.template_id
LEFT JOIN design_events de ON de.design_id = d.id
WHERE d.deleted_at IS NULL
GROUP BY d.id, d.user_id, d.template_id, t.name, d.status,
         d.has_spotify_code, d.filter_preset, d.created_at;

-- ============================================================
-- END OF SCHEMA
-- Total tables: 28
-- Domains: Auth, Templates, Designs, Products, Orders,
--          Payments, Fulfillment, Coupons, Subscriptions,
--          Events, Notifications, Analytics
-- ============================================================
