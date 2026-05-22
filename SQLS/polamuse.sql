-- ============================================================
-- POLAMUSE — COMPLETE PRODUCTION DATABASE SCHEMA
-- PostgreSQL 15+
-- Version: 3.0
-- Includes: Full app + Print Sheet System + Admin + Analytics
-- Money: all values in paise (₹1 = 100 paise)
-- IDs: UUID for all PKs
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";


-- ============================================================
-- SECTION 1: AUTH & USERS
-- ============================================================

CREATE TABLE users (
  id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email                VARCHAR(255)  NOT NULL UNIQUE,
  email_verified_at    TIMESTAMPTZ,
  password_hash        VARCHAR(255),
  role                 VARCHAR(20)   NOT NULL DEFAULT 'customer'
                         CHECK (role IN ('customer','admin')),
  is_active            BOOLEAN       NOT NULL DEFAULT TRUE,
  is_banned            BOOLEAN       NOT NULL DEFAULT FALSE,
  ban_reason           TEXT,
  banned_at            TIMESTAMPTZ,
  banned_by            UUID,                            -- FK→users (admin), added below
  last_login_at        TIMESTAMPTZ,
  created_at           TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  deleted_at           TIMESTAMPTZ                      -- soft delete
);

CREATE TABLE user_profiles (
  id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id              UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  full_name            VARCHAR(100),
  phone                VARCHAR(20),
  avatar_url           TEXT,
  city                 VARCHAR(100),
  state                VARCHAR(100),
  -- Editor preferences
  default_font_preset  VARCHAR(50)   DEFAULT 'handwritten',
  default_frame_style  VARCHAR(50)   DEFAULT 'classic',
  preferred_finish     VARCHAR(20)   DEFAULT 'glossy',
  -- Notification prefs
  email_marketing      BOOLEAN       DEFAULT TRUE,
  -- Denormalised counters (★ updated on write, fast to read)
  total_designs        INTEGER       DEFAULT 0,
  total_orders         INTEGER       DEFAULT 0,
  total_spent_paise    INTEGER       DEFAULT 0,
  created_at           TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE TABLE user_sessions (
  id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id              UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  refresh_token_hash   VARCHAR(255)  NOT NULL UNIQUE,
  device_type          VARCHAR(50),
  browser              VARCHAR(100),
  ip_address           INET,
  country_code         CHAR(2),
  expires_at           TIMESTAMPTZ   NOT NULL,
  last_active_at       TIMESTAMPTZ,
  created_at           TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE TABLE password_reset_tokens (
  id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id              UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash           VARCHAR(255)  NOT NULL UNIQUE,
  expires_at           TIMESTAMPTZ   NOT NULL,
  used_at              TIMESTAMPTZ,
  created_at           TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- Add self-referencing FK for banned_by
ALTER TABLE users
  ADD CONSTRAINT fk_users_banned_by
  FOREIGN KEY (banned_by) REFERENCES users(id);


-- ============================================================
-- SECTION 2: TEMPLATES & DESIGNS
-- ============================================================

CREATE TABLE templates (
  id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug                 VARCHAR(100)  NOT NULL UNIQUE,
  name                 VARCHAR(100)  NOT NULL,
  description          TEXT,
  vibe                 VARCHAR(50),
  thumbnail_url        TEXT,
  default_canvas_state JSONB         NOT NULL,
  -- Physical print dimensions (needed for sheet layout calculation)
  print_width_mm       NUMERIC(6,2)  NOT NULL DEFAULT 100.0,
  print_height_mm      NUMERIC(6,2)  NOT NULL DEFAULT 125.0,
  frame_ratio          VARCHAR(10),
  orientation          VARCHAR(20)   CHECK (orientation IN ('portrait','landscape','square')),
  frame_color          VARCHAR(20)   DEFAULT '#FFFFFF',
  has_top_label        BOOLEAN       DEFAULT FALSE,
  has_bottom_caption   BOOLEAN       DEFAULT TRUE,
  -- Access control
  is_premium           BOOLEAN       NOT NULL DEFAULT FALSE,
  price_paise          INTEGER       NOT NULL DEFAULT 0,
  is_active            BOOLEAN       NOT NULL DEFAULT TRUE,
  sort_order           INTEGER       NOT NULL DEFAULT 0,
  times_used           INTEGER       DEFAULT 0,          -- denormalised
  created_at           TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE TABLE designs (
  id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id              UUID REFERENCES users(id) ON DELETE SET NULL,
  template_id          UUID REFERENCES templates(id) ON DELETE SET NULL,
  title                VARCHAR(200),
  -- Canvas data
  canvas_state         JSONB         NOT NULL,
  thumbnail_url        TEXT,
  export_url           TEXT,
  -- Extracted properties for fast queries
  frame_style          VARCHAR(50),
  frame_color          VARCHAR(20),
  has_caption          BOOLEAN       DEFAULT FALSE,
  caption_text         VARCHAR(500),
  has_top_label        BOOLEAN       DEFAULT FALSE,
  top_label_text       VARCHAR(200),
  has_spotify_code     BOOLEAN       DEFAULT FALSE,
  spotify_uri          VARCHAR(200),
  has_stickers         BOOLEAN       DEFAULT FALSE,
  filter_preset        VARCHAR(50),
  -- Status
  status               VARCHAR(20)   NOT NULL DEFAULT 'draft'
                         CHECK (status IN ('draft','exported','ordered','archived')),
  is_public            BOOLEAN       NOT NULL DEFAULT FALSE,
  source               VARCHAR(20)   DEFAULT 'editor',
  created_at           TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  deleted_at           TIMESTAMPTZ
);

CREATE TABLE design_versions (
  id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  design_id            UUID NOT NULL REFERENCES designs(id) ON DELETE CASCADE,
  version_number       INTEGER       NOT NULL,
  canvas_state         JSONB         NOT NULL,
  thumbnail_url        TEXT,
  created_at           TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  UNIQUE (design_id, version_number)
);

CREATE TABLE design_stickers (
  id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  design_id            UUID NOT NULL REFERENCES designs(id) ON DELETE CASCADE,
  sticker_type         VARCHAR(50),
  sticker_url          TEXT,
  position_x           NUMERIC(6,2),
  position_y           NUMERIC(6,2),
  scale                NUMERIC(4,2)  DEFAULT 1.0,
  rotation             NUMERIC(6,2)  DEFAULT 0,
  created_at           TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);


-- ============================================================
-- SECTION 3: PRODUCT CATALOG
-- ============================================================

CREATE TABLE product_types (
  id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug                 VARCHAR(50)   NOT NULL UNIQUE,
  name                 VARCHAR(100)  NOT NULL,
  description          TEXT,
  quantity             INTEGER       NOT NULL,
  base_price_paise     INTEGER       NOT NULL,
  has_gift_box         BOOLEAN       NOT NULL DEFAULT FALSE,
  has_gift_message     BOOLEAN       NOT NULL DEFAULT FALSE,
  has_tissue_wrap      BOOLEAN       NOT NULL DEFAULT FALSE,
  discount_percentage  INTEGER       DEFAULT 0,
  is_active            BOOLEAN       NOT NULL DEFAULT TRUE,
  sort_order           INTEGER       NOT NULL DEFAULT 0,
  created_at           TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE TABLE print_finishes (
  id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug                 VARCHAR(20)   NOT NULL UNIQUE,
  name                 VARCHAR(50)   NOT NULL,
  description          TEXT,
  price_addon_paise    INTEGER       NOT NULL DEFAULT 0,
  is_active            BOOLEAN       NOT NULL DEFAULT TRUE
);

CREATE TABLE print_sizes (
  id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug                 VARCHAR(30)   NOT NULL UNIQUE,
  name                 VARCHAR(50)   NOT NULL,
  width_mm             NUMERIC(6,2),
  height_mm            NUMERIC(6,2),
  orientation          VARCHAR(20)   CHECK (orientation IN ('portrait','landscape','square')),
  price_addon_paise    INTEGER       NOT NULL DEFAULT 0,
  is_default           BOOLEAN       NOT NULL DEFAULT FALSE,
  is_active            BOOLEAN       NOT NULL DEFAULT TRUE
);


-- ============================================================
-- SECTION 4: PRINT SHEET SYSTEM
-- (The A4 imposition system — batching polaroids onto sheets)
-- ============================================================

/*
  CONCEPT:
  Instead of printing one Polaroid at a time, the admin batches
  multiple order items onto a single A4 sheet for efficiency.

  An A4 sheet (210×297mm) can hold different numbers of Polaroids
  depending on the print size:
    - Classic (100×125mm)  → 2 cols × 3 rows = 6 per sheet
    - Instax Mini (54×86mm)→ 3 cols × 3 rows = 9 per sheet
    - Square (76×76mm)     → 2 cols × 3 rows = 6 per sheet
    - Instax Wide (102×170mm)→ 2 cols × 1 row = 2 per sheet
    - 5×7 in (127×178mm)   → 1 col × 1 row  = 1 per sheet

  The admin clicks "Generate Print Sheet" which batches all
  confirmed, unprinted order items of the same size onto sheets,
  generates a composite PNG, and marks them ready to send.
*/

-- Defines how many items fit on one sheet for each size
CREATE TABLE print_sheet_configs (
  id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  print_size_id        UUID NOT NULL REFERENCES print_sizes(id),
  paper_size           VARCHAR(10)   NOT NULL DEFAULT 'A4'
                         CHECK (paper_size IN ('A4','A3','Letter','4x6')),
  paper_width_mm       NUMERIC(6,2)  NOT NULL DEFAULT 210.0,
  paper_height_mm      NUMERIC(6,2)  NOT NULL DEFAULT 297.0,
  columns              INTEGER       NOT NULL,
  rows                 INTEGER       NOT NULL,
  items_per_sheet      INTEGER       NOT NULL GENERATED ALWAYS AS (columns * rows) STORED,
  item_width_mm        NUMERIC(6,2)  NOT NULL,
  item_height_mm       NUMERIC(6,2)  NOT NULL,
  margin_mm            NUMERIC(4,2)  NOT NULL DEFAULT 5.0,
  gap_mm               NUMERIC(4,2)  NOT NULL DEFAULT 3.0,
  is_active            BOOLEAN       NOT NULL DEFAULT TRUE,
  notes                TEXT,
  created_at           TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  UNIQUE (print_size_id, paper_size)
);

-- A generated A4 sheet containing multiple polaroids
CREATE TABLE print_sheets (
  id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sheet_number         VARCHAR(30)   NOT NULL UNIQUE, -- PSH-2026-00001
  print_finish_id      UUID NOT NULL REFERENCES print_finishes(id),
  print_size_id        UUID NOT NULL REFERENCES print_sizes(id),
  config_id            UUID NOT NULL REFERENCES print_sheet_configs(id),
  paper_size           VARCHAR(10)   NOT NULL DEFAULT 'A4',
  -- Capacity
  capacity             INTEGER       NOT NULL,        -- from config.items_per_sheet
  items_count          INTEGER       NOT NULL DEFAULT 0,
  is_full              BOOLEAN       NOT NULL DEFAULT FALSE,
  -- Generated file
  sheet_url            TEXT,                          -- Cloudinary URL of composite PNG
  sheet_dpi            INTEGER       DEFAULT 300,
  sheet_width_px       INTEGER,
  sheet_height_px      INTEGER,
  -- Status
  status               VARCHAR(20)   NOT NULL DEFAULT 'open'
                         CHECK (status IN (
                           'open',        -- accepting more items
                           'ready',       -- full or manually closed, ready to generate
                           'generating',  -- PNG being built
                           'generated',   -- PNG ready, not yet sent to print shop
                           'sent',        -- sent to print shop
                           'printed',     -- confirmed printed
                           'failed'       -- generation failed
                         )),
  -- Admin tracking
  generated_at         TIMESTAMPTZ,
  sent_to_shop_at      TIMESTAMPTZ,
  printed_at           TIMESTAMPTZ,
  print_shop_name      VARCHAR(200),
  admin_notes          TEXT,
  created_at           TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- Sequence for readable sheet numbers
CREATE SEQUENCE print_sheet_number_seq START 1;
CREATE OR REPLACE FUNCTION generate_sheet_number()
RETURNS TRIGGER AS $$
BEGIN
  NEW.sheet_number := 'PSH-' || TO_CHAR(NOW(),'YYYY') || '-' ||
                      LPAD(NEXTVAL('print_sheet_number_seq')::TEXT, 5, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER trg_sheet_number
  BEFORE INSERT ON print_sheets
  FOR EACH ROW EXECUTE FUNCTION generate_sheet_number();

-- NOTE: print_sheet_items is defined after order_items (Section 5)
-- because it references order_items which must exist first.


-- ============================================================
-- SECTION 5: ADDRESSES & ORDERS
-- ============================================================

CREATE TABLE addresses (
  id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id              UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  label                VARCHAR(50),
  full_name            VARCHAR(100)  NOT NULL,
  phone                VARCHAR(20)   NOT NULL,
  line1                VARCHAR(255)  NOT NULL,
  line2                VARCHAR(255),
  landmark             VARCHAR(255),
  city                 VARCHAR(100)  NOT NULL,
  state                VARCHAR(100)  NOT NULL,
  pincode              VARCHAR(10)   NOT NULL,
  country              CHAR(2)       NOT NULL DEFAULT 'IN',
  is_default           BOOLEAN       NOT NULL DEFAULT FALSE,
  is_verified          BOOLEAN       NOT NULL DEFAULT FALSE,
  created_at           TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE TABLE orders (
  id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number         VARCHAR(30)   NOT NULL UNIQUE,
  user_id              UUID NOT NULL REFERENCES users(id),
  -- Amounts in paise
  subtotal_paise       INTEGER       NOT NULL,
  discount_paise       INTEGER       NOT NULL DEFAULT 0,
  shipping_paise       INTEGER       NOT NULL DEFAULT 0,
  tax_paise            INTEGER       NOT NULL DEFAULT 0,
  total_paise          INTEGER       NOT NULL,
  currency             CHAR(3)       NOT NULL DEFAULT 'INR',
  -- Classification
  order_type           VARCHAR(20)   NOT NULL DEFAULT 'standard'
                         CHECK (order_type IN ('standard','gift','event','subscription')),
  status               VARCHAR(30)   NOT NULL DEFAULT 'pending_payment'
                         CHECK (status IN (
                           'pending_payment','payment_failed','confirmed',
                           'processing','printing','shipped','delivered',
                           'cancelled','refunded','partially_refunded'
                         )),
  -- Relations
  shipping_address_id  UUID REFERENCES addresses(id),
  coupon_id            UUID,                          -- FK added later
  -- Gift
  is_gift              BOOLEAN       NOT NULL DEFAULT FALSE,
  -- Dates
  confirmed_at         TIMESTAMPTZ,
  estimated_delivery_at DATE,
  delivered_at         TIMESTAMPTZ,
  cancelled_at         TIMESTAMPTZ,
  cancellation_reason  TEXT,
  -- Notes
  customer_notes       TEXT,
  internal_notes       TEXT,                          -- admin-only
  created_at           TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- Auto-generate order number PML-2026-00001
CREATE SEQUENCE order_number_seq START 1;
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
  NEW.order_number := 'PML-' || TO_CHAR(NOW(),'YYYY') || '-' ||
                      LPAD(NEXTVAL('order_number_seq')::TEXT, 5, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER trg_order_number
  BEFORE INSERT ON orders
  FOR EACH ROW EXECUTE FUNCTION generate_order_number();

CREATE TABLE order_items (
  id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id             UUID NOT NULL REFERENCES orders(id) ON DELETE RESTRICT,
  design_id            UUID NOT NULL REFERENCES designs(id),
  product_type_id      UUID NOT NULL REFERENCES product_types(id),
  print_finish_id      UUID NOT NULL REFERENCES print_finishes(id),
  print_size_id        UUID NOT NULL REFERENCES print_sizes(id),
  quantity             INTEGER       NOT NULL DEFAULT 1,
  unit_price_paise     INTEGER       NOT NULL,
  total_price_paise    INTEGER       NOT NULL,
  -- Frozen copies (never changes after order placed)
  design_snapshot_url  TEXT,                          -- PNG frozen at payment time
  print_ready_url      TEXT,                          -- high-res file for print
  -- Print tracking
  print_status         VARCHAR(20)   NOT NULL DEFAULT 'pending'
                         CHECK (print_status IN (
                           'pending','assigned_to_sheet','printing','printed','shipped','failed'
                         )),
  print_sheet_id       UUID REFERENCES print_sheets(id), -- which sheet this item is on
  created_at           TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- print_sheet_items defined HERE (after order_items) because it
-- references both print_sheets (Section 4) AND order_items (above)
CREATE TABLE print_sheet_items (
  id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sheet_id             UUID NOT NULL REFERENCES print_sheets(id),
  order_item_id        UUID NOT NULL UNIQUE REFERENCES order_items(id),
  position             INTEGER       NOT NULL,        -- 1 to capacity
  col                  INTEGER       NOT NULL,        -- column on sheet (0-indexed)
  row                  INTEGER       NOT NULL,        -- row on sheet (0-indexed)
  design_snapshot_url  TEXT          NOT NULL,        -- frozen copy used for sheet
  added_at             TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  UNIQUE (sheet_id, position)
);

CREATE TABLE gift_messages (
  id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id             UUID NOT NULL UNIQUE REFERENCES orders(id) ON DELETE CASCADE,
  from_name            VARCHAR(100)  NOT NULL,
  to_name              VARCHAR(100),
  message              TEXT          CHECK (LENGTH(message) <= 500),
  font_style           VARCHAR(50)   DEFAULT 'handwritten',
  is_printed           BOOLEAN       NOT NULL DEFAULT FALSE,
  printed_at           TIMESTAMPTZ,
  created_at           TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);


-- ============================================================
-- SECTION 6: PAYMENTS
-- ============================================================

CREATE TABLE payments (
  id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id             UUID NOT NULL REFERENCES orders(id),
  provider             VARCHAR(30)   NOT NULL DEFAULT 'razorpay'
                         CHECK (provider IN ('razorpay','stripe','manual','upi_qr')),
  provider_payment_id  VARCHAR(100)  UNIQUE,          -- idempotency key
  provider_order_id    VARCHAR(100),
  amount_paise         INTEGER       NOT NULL,
  currency             CHAR(3)       NOT NULL DEFAULT 'INR',
  status               VARCHAR(20)   NOT NULL DEFAULT 'created'
                         CHECK (status IN (
                           'created','attempted','captured','failed','refunded','partially_refunded'
                         )),
  payment_method       VARCHAR(50),
  bank                 VARCHAR(100),
  card_network         VARCHAR(50),
  failure_code         VARCHAR(100),
  failure_reason       TEXT,
  refund_amount_paise  INTEGER       DEFAULT 0,
  refund_reason        TEXT,
  refunded_at          TIMESTAMPTZ,
  provider_payload     JSONB,                         -- full webhook body for reconciliation
  created_at           TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);


-- ============================================================
-- SECTION 7: SHIPMENTS
-- ============================================================

CREATE TABLE shipments (
  id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id             UUID NOT NULL REFERENCES orders(id),
  provider             VARCHAR(50),
  provider_shipment_id VARCHAR(200),
  tracking_number      VARCHAR(200),
  tracking_url         TEXT,
  carrier              VARCHAR(100),
  status               VARCHAR(30)   NOT NULL DEFAULT 'created'
                         CHECK (status IN (
                           'created','picked_up','in_transit',
                           'out_for_delivery','delivered','failed','returned'
                         )),
  tracking_events      JSONB,                         -- [{status, location, ts}]
  shipped_at           TIMESTAMPTZ,
  expected_delivery_at DATE,
  delivered_at         TIMESTAMPTZ,
  failed_at            TIMESTAMPTZ,
  failure_reason       TEXT,
  created_at           TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);


-- ============================================================
-- SECTION 8: COUPONS
-- ============================================================

CREATE TABLE coupons (
  id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code                 VARCHAR(50)   NOT NULL UNIQUE,
  description          VARCHAR(255),
  type                 VARCHAR(30)   NOT NULL
                         CHECK (type IN ('percentage','fixed_amount','free_shipping','free_gift_box')),
  value                INTEGER       NOT NULL,
  min_order_paise      INTEGER       DEFAULT 0,
  max_discount_paise   INTEGER,
  total_usage_limit    INTEGER,
  usage_count          INTEGER       NOT NULL DEFAULT 0,
  per_user_limit       INTEGER       NOT NULL DEFAULT 1,
  applicable_to        VARCHAR(30)   DEFAULT 'all'
                         CHECK (applicable_to IN ('all','first_order','event')),
  valid_from           TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  valid_until          TIMESTAMPTZ,
  is_active            BOOLEAN       NOT NULL DEFAULT TRUE,
  created_by           UUID REFERENCES users(id),
  created_at           TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

ALTER TABLE orders
  ADD CONSTRAINT fk_orders_coupon FOREIGN KEY (coupon_id) REFERENCES coupons(id);

CREATE TABLE coupon_usages (
  id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  coupon_id            UUID NOT NULL REFERENCES coupons(id),
  user_id              UUID NOT NULL REFERENCES users(id),
  order_id             UUID NOT NULL REFERENCES orders(id),
  discount_applied_paise INTEGER NOT NULL,
  used_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (coupon_id, order_id)
);


-- ============================================================
-- SECTION 9: SUBSCRIPTIONS
-- ============================================================

CREATE TABLE subscription_plans (
  id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug                 VARCHAR(30)   NOT NULL UNIQUE,
  name                 VARCHAR(50)   NOT NULL,
  prints_per_month     INTEGER       NOT NULL,
  price_paise          INTEGER       NOT NULL,
  includes_gift_box    BOOLEAN       DEFAULT FALSE,
  rollover_prints      BOOLEAN       DEFAULT FALSE,
  is_active            BOOLEAN       NOT NULL DEFAULT TRUE,
  sort_order           INTEGER       DEFAULT 0,
  created_at           TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE TABLE subscriptions (
  id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id              UUID NOT NULL REFERENCES users(id),
  plan_id              UUID NOT NULL REFERENCES subscription_plans(id),
  status               VARCHAR(20)   NOT NULL DEFAULT 'active'
                         CHECK (status IN ('active','paused','cancelled','past_due','expired')),
  provider             VARCHAR(30)   DEFAULT 'razorpay',
  provider_sub_id      VARCHAR(200),
  current_period_start DATE          NOT NULL,
  current_period_end   DATE          NOT NULL,
  next_billing_date    DATE,
  prints_remaining     INTEGER       NOT NULL,
  prints_used_period   INTEGER       NOT NULL DEFAULT 0,
  paused_at            TIMESTAMPTZ,
  cancelled_at         TIMESTAMPTZ,
  cancellation_reason  TEXT,
  created_at           TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE TABLE subscription_billing_history (
  id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  subscription_id      UUID NOT NULL REFERENCES subscriptions(id),
  payment_id           UUID REFERENCES payments(id),
  amount_paise         INTEGER       NOT NULL,
  status               VARCHAR(20),
  period_start         DATE          NOT NULL,
  period_end           DATE          NOT NULL,
  created_at           TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);


-- ============================================================
-- SECTION 10: EVENT ORDERS (weddings, corporate)
-- ============================================================

CREATE TABLE event_orders (
  id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id              UUID NOT NULL REFERENCES users(id),
  order_id             UUID REFERENCES orders(id),
  name                 VARCHAR(200)  NOT NULL,
  event_type           VARCHAR(30)   NOT NULL
                         CHECK (event_type IN ('wedding','birthday','corporate','farewell','anniversary','other')),
  event_date           DATE,
  quantity             INTEGER       NOT NULL,
  theme_brief          TEXT,
  reference_images     JSONB,                         -- [{url, note}]
  preferred_finish     VARCHAR(20),
  preferred_size       VARCHAR(30),
  has_gift_packaging   BOOLEAN       DEFAULT FALSE,
  status               VARCHAR(20)   NOT NULL DEFAULT 'enquiry'
                         CHECK (status IN ('enquiry','quoted','confirmed','in_production','shipped','completed','cancelled')),
  quote_paise          INTEGER,
  final_price_paise    INTEGER,
  assigned_to          UUID REFERENCES users(id),
  required_by_date     DATE,
  delivery_address_id  UUID REFERENCES addresses(id),
  internal_notes       TEXT,
  created_at           TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);


-- ============================================================
-- SECTION 11: ADMIN TABLES
-- ============================================================

-- Full audit log of every admin action
CREATE TABLE admin_activity_logs (
  id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_user_id        UUID NOT NULL REFERENCES users(id),
  action               VARCHAR(100)  NOT NULL,
  -- e.g. 'order.status_changed', 'coupon.created', 'user.banned',
  --      'print_sheet.generated', 'order.tracking_added'
  entity_type          VARCHAR(50),
  entity_id            UUID,
  old_value            JSONB,
  new_value            JSONB,
  ip_address           INET,
  notes                TEXT,
  created_at           TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- Admin notes on the print queue
CREATE TABLE print_queue_notes (
  id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  print_sheet_id       UUID NOT NULL REFERENCES print_sheets(id),
  admin_user_id        UUID NOT NULL REFERENCES users(id),
  note                 TEXT          NOT NULL,
  print_shop_name      VARCHAR(200),
  cost_paise           INTEGER,                       -- what you paid the print shop
  sent_at              TIMESTAMPTZ,
  created_at           TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- Global settings editable from admin dashboard
CREATE TABLE site_settings (
  id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key                  VARCHAR(100)  NOT NULL UNIQUE,
  value                JSONB         NOT NULL,
  description          TEXT,
  updated_by           UUID REFERENCES users(id),
  updated_at           TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- Banners / announcements shown on the site
CREATE TABLE admin_announcements (
  id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title                VARCHAR(200)  NOT NULL,
  message              TEXT          NOT NULL,
  type                 VARCHAR(20)   DEFAULT 'info'
                         CHECK (type IN ('info','warning','success','promo')),
  target               VARCHAR(20)   DEFAULT 'all'
                         CHECK (target IN ('all','logged_in','admin')),
  is_active            BOOLEAN       NOT NULL DEFAULT TRUE,
  starts_at            TIMESTAMPTZ,
  ends_at              TIMESTAMPTZ,
  created_by           UUID REFERENCES users(id),
  created_at           TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);


-- ============================================================
-- SECTION 12: NOTIFICATIONS
-- ============================================================

CREATE TABLE notifications (
  id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id              UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type                 VARCHAR(50)   NOT NULL,
  title                VARCHAR(200)  NOT NULL,
  body                 TEXT          NOT NULL,
  data                 JSONB,                         -- {order_id, tracking_url}
  channel              VARCHAR(20)   NOT NULL
                         CHECK (channel IN ('email','in_app')),
  status               VARCHAR(20)   NOT NULL DEFAULT 'pending'
                         CHECK (status IN ('pending','sent','failed','bounced')),
  provider_message_id  VARCHAR(200),
  sent_at              TIMESTAMPTZ,
  read_at              TIMESTAMPTZ,
  failure_reason       TEXT,
  created_at           TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);


-- ============================================================
-- SECTION 13: ANALYTICS
-- ============================================================

CREATE TABLE design_events (
  id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  design_id            UUID REFERENCES designs(id) ON DELETE SET NULL,
  user_id              UUID REFERENCES users(id) ON DELETE SET NULL,
  event_type           VARCHAR(50)   NOT NULL,
  -- event_type values:
  -- design_created, design_edited, template_applied
  -- filter_applied, sticker_added, spotify_added
  -- caption_typed, design_exported, design_ordered
  -- design_shared, design_deleted
  metadata             JSONB,
  created_at           TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE TABLE page_views (
  id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id              UUID REFERENCES users(id) ON DELETE SET NULL,
  page                 VARCHAR(100)  NOT NULL,
  referrer             TEXT,
  utm_source           VARCHAR(100),
  utm_medium           VARCHAR(100),
  utm_campaign         VARCHAR(200),
  time_on_page_seconds INTEGER,
  created_at           TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);


-- ============================================================
-- SECTION 14: INDEXES
-- ============================================================

-- Users
CREATE INDEX idx_users_email           ON users(email);
CREATE INDEX idx_users_role            ON users(role);
CREATE INDEX idx_users_is_banned       ON users(is_banned) WHERE is_banned = TRUE;
CREATE INDEX idx_users_deleted_at      ON users(deleted_at) WHERE deleted_at IS NOT NULL;

-- Designs
CREATE INDEX idx_designs_user_id       ON designs(user_id);
CREATE INDEX idx_designs_status        ON designs(status);
CREATE INDEX idx_designs_created_at    ON designs(created_at DESC);
CREATE INDEX idx_designs_template_id   ON designs(template_id);
CREATE INDEX idx_designs_has_spotify   ON designs(has_spotify_code) WHERE has_spotify_code = TRUE;
CREATE INDEX idx_designs_caption_fts   ON designs USING gin(
  to_tsvector('english', COALESCE(caption_text,''))
);

-- Orders
CREATE INDEX idx_orders_user_id        ON orders(user_id);
CREATE INDEX idx_orders_status         ON orders(status);
CREATE INDEX idx_orders_order_number   ON orders(order_number);
CREATE INDEX idx_orders_created_at     ON orders(created_at DESC);
CREATE INDEX idx_orders_type_status    ON orders(order_type, status);

-- Order items
CREATE INDEX idx_order_items_order_id  ON order_items(order_id);
CREATE INDEX idx_order_items_design_id ON order_items(design_id);
CREATE INDEX idx_order_items_sheet_id  ON order_items(print_sheet_id);
CREATE INDEX idx_order_items_status    ON order_items(print_status);

-- Payments
CREATE INDEX idx_payments_order_id     ON payments(order_id);
CREATE INDEX idx_payments_provider_id  ON payments(provider_payment_id);
CREATE INDEX idx_payments_status       ON payments(status);

-- Print sheets
CREATE INDEX idx_print_sheets_status   ON print_sheets(status);
CREATE INDEX idx_print_sheets_size     ON print_sheets(print_size_id, print_finish_id);
CREATE INDEX idx_sheet_items_sheet_id  ON print_sheet_items(sheet_id);

-- Shipments
CREATE INDEX idx_shipments_order_id    ON shipments(order_id);
CREATE INDEX idx_shipments_tracking    ON shipments(tracking_number) WHERE tracking_number IS NOT NULL;

-- Coupons
CREATE INDEX idx_coupons_code          ON coupons(code);
CREATE INDEX idx_coupons_active        ON coupons(is_active, valid_until);

-- Admin logs
CREATE INDEX idx_admin_logs_admin_id   ON admin_activity_logs(admin_user_id);
CREATE INDEX idx_admin_logs_entity     ON admin_activity_logs(entity_type, entity_id);
CREATE INDEX idx_admin_logs_created_at ON admin_activity_logs(created_at DESC);

-- Analytics
CREATE INDEX idx_design_events_design  ON design_events(design_id);
CREATE INDEX idx_design_events_user    ON design_events(user_id);
CREATE INDEX idx_design_events_type_ts ON design_events(event_type, created_at DESC);
CREATE INDEX idx_page_views_page       ON page_views(page, created_at DESC);
CREATE INDEX idx_notifications_user    ON notifications(user_id);
CREATE INDEX idx_notifications_unread  ON notifications(user_id, read_at) WHERE read_at IS NULL;


-- ============================================================
-- SECTION 15: SEED DATA
-- ============================================================

-- Product types
INSERT INTO product_types
  (slug, name, description, quantity, base_price_paise, has_gift_box, has_gift_message, discount_percentage, sort_order)
VALUES
  ('single',   'Single Print',  'One polaroid in a kraft sleeve',          1,  7900,  FALSE, FALSE,  0, 1),
  ('pack-5',   'Pack of 5',     '5 polaroids in a kraft sleeve set',       5,  34900, FALSE, TRUE,  10, 2),
  ('pack-10',  'Pack of 10',    '10 polaroids in a premium gift box',     10,  59000, TRUE,  TRUE,  25, 3),
  ('pack-20',  'Pack of 20',    '20 polaroids — ideal for events',        20,  99900, TRUE,  TRUE,  37, 4),
  ('gift-box', 'Gift Box',      'Curated box with tissue paper + ribbon',  5,  49900, TRUE,  TRUE,  15, 5);

-- Print finishes
INSERT INTO print_finishes (slug, name, description, price_addon_paise) VALUES
  ('glossy', 'Glossy', 'Classic shiny finish — vivid colours',  0),
  ('matte',  'Matte',  'Soft matte finish — premium feel',     500);

-- Print sizes
INSERT INTO print_sizes (slug, name, width_mm, height_mm, orientation, price_addon_paise, is_default) VALUES
  ('classic',     'Classic Polaroid', 100.0, 125.0, 'portrait',   0, TRUE),
  ('instax-mini', 'Instax Mini',       54.0,  86.0, 'portrait',   0, FALSE),
  ('instax-wide', 'Instax Wide',      102.0,  170.0,'portrait',   0, FALSE),
  ('square',      'Square',            76.0,   76.0, 'square',   500, FALSE),
  ('5x7',         '5×7 in',           127.0,  178.0, 'portrait', 1000, FALSE);

-- Print sheet configs (how many fit on A4)
INSERT INTO print_sheet_configs
  (print_size_id, paper_size, paper_width_mm, paper_height_mm, columns, rows,
   item_width_mm, item_height_mm, margin_mm, gap_mm, notes)
SELECT
  ps.id, 'A4', 210.0, 297.0,
  cfg.cols, cfg.rows,
  cfg.iw, cfg.ih,
  5.0, 3.0,
  cfg.note
FROM print_sizes ps
JOIN (VALUES
  ('classic',     2, 3, 100.0, 125.0, '6 per A4 sheet — standard layout'),
  ('instax-mini', 3, 3,  54.0,  86.0, '9 per A4 sheet — mini layout'),
  ('instax-wide', 1, 1, 102.0, 170.0, '1 per A4 sheet — wide layout'),
  ('square',      2, 3,  76.0,  76.0, '6 per A4 sheet — square layout'),
  ('5x7',         1, 1, 127.0, 178.0, '1 per A4 sheet — large format')
) AS cfg(slug, cols, rows, iw, ih, note) ON ps.slug = cfg.slug;

-- Subscription plans
INSERT INTO subscription_plans
  (slug, name, prints_per_month, price_paise, includes_gift_box, rollover_prints, sort_order)
VALUES
  ('starter', 'Starter',  5,  19900, FALSE, FALSE, 1),
  ('regular', 'Regular', 10,  34900, FALSE, TRUE,  2),
  ('premium', 'Premium', 20,  49900, TRUE,  TRUE,  3);

-- Site settings defaults
INSERT INTO site_settings (key, value, description) VALUES
  ('free_shipping_threshold_paise', '50000',   'Orders above this value get free shipping (in paise)'),
  ('delivery_days_estimate',        '"3-5"',    'Default delivery estimate shown to customers'),
  ('max_designs_per_user',          '50',       'Maximum saved designs per user account'),
  ('order_acceptance_active',       'true',     'Toggle to pause all new orders'),
  ('maintenance_mode',              'false',    'When true, show maintenance page to all users'),
  ('free_download_enabled',         'true',     'Whether free PNG download is available'),
  ('default_print_shop',            '"Local"',  'Default print shop name for print queue notes');

-- Template data (9 templates)
INSERT INTO templates
  (slug, name, vibe, print_width_mm, print_height_mm, orientation, frame_color, has_top_label, has_bottom_caption, is_active, sort_order, default_canvas_state)
VALUES
  ('classic',       'Classic Polaroid',    'timeless',   100.0, 125.0, 'portrait',  '#FFFFFF', FALSE, TRUE,  TRUE, 1, '{"version":"5.3","objects":[],"background":"#FFFFFF"}'),
  ('instax-mini',   'Instax Mini',         'trending',    54.0,  86.0, 'portrait',  '#FAFAF8', FALSE, TRUE,  TRUE, 2, '{"version":"5.3","objects":[],"background":"#FAFAF8"}'),
  ('movie-poster',  'Movie Poster',        'cinematic',  100.0, 140.0, 'portrait',  '#F5F3EE', TRUE,  TRUE,  TRUE, 3, '{"version":"5.3","objects":[],"background":"#F5F3EE"}'),
  ('instax-square', 'Instax Square',       'minimal',     76.0,  76.0, 'square',    '#FFFFFF', FALSE, FALSE, TRUE, 4, '{"version":"5.3","objects":[],"background":"#FFFFFF"}'),
  ('vintage-600',   'Vintage Color 600',   'nostalgic',  100.0, 125.0, 'portrait',  '#F0EBD8', FALSE, TRUE,  TRUE, 5, '{"version":"5.3","objects":[],"background":"#F0EBD8"}'),
  ('polaroid-bw',   'Polaroid B&W',        'film',       100.0, 125.0, 'portrait',  '#FFFFFF', FALSE, TRUE,  TRUE, 6, '{"version":"5.3","objects":[],"background":"#FFFFFF"}'),
  ('instax-wide',   'Instax Wide 300',     'landscape',  102.0, 170.0, 'landscape', '#FAFAF8', FALSE, TRUE,  TRUE, 7, '{"version":"5.3","objects":[],"background":"#FAFAF8"}'),
  ('dark-minimal',  'Dark Minimal',        'editorial',  100.0, 125.0, 'portrait',  '#1A1814', TRUE,  TRUE,  TRUE, 8, '{"version":"5.3","objects":[],"background":"#1A1814"}'),
  ('tape-border',   'Tape Border',         'scrapbook',  100.0, 125.0, 'portrait',  '#FFFFFF', FALSE, TRUE,  TRUE, 9, '{"version":"5.3","objects":[],"background":"#FFFFFF"}');


-- ============================================================
-- SECTION 16: USEFUL VIEWS FOR ADMIN DASHBOARD
-- ============================================================

-- Admin: full order list with all joined details
CREATE VIEW v_admin_orders AS
SELECT
  o.id,
  o.order_number,
  o.status,
  o.order_type,
  o.total_paise,
  o.confirmed_at,
  o.created_at,
  up.full_name        AS customer_name,
  u.email             AS customer_email,
  u.id                AS customer_id,
  COUNT(oi.id)        AS item_count,
  SUM(oi.quantity)    AS total_prints,
  p.status            AS payment_status,
  p.payment_method,
  s.status            AS shipment_status,
  s.tracking_number,
  s.carrier,
  s.shipped_at,
  s.delivered_at,
  a.city              AS shipping_city,
  a.state             AS shipping_state
FROM orders o
JOIN users u              ON u.id  = o.user_id
LEFT JOIN user_profiles up ON up.user_id = o.user_id
LEFT JOIN order_items oi   ON oi.order_id = o.id
LEFT JOIN payments p       ON p.order_id  = o.id AND p.status = 'captured'
LEFT JOIN shipments s      ON s.order_id  = o.id
LEFT JOIN addresses a      ON a.id = o.shipping_address_id
WHERE u.deleted_at IS NULL
GROUP BY o.id, up.full_name, u.email, u.id,
         p.status, p.payment_method,
         s.status, s.tracking_number, s.carrier, s.shipped_at, s.delivered_at,
         a.city, a.state;

-- Admin: print queue — confirmed orders not yet on a print sheet
CREATE VIEW v_print_queue AS
SELECT
  oi.id               AS order_item_id,
  o.order_number,
  o.confirmed_at,
  oi.quantity,
  oi.design_snapshot_url,
  oi.print_ready_url,
  oi.print_status,
  ps_size.slug        AS size_slug,
  ps_size.name        AS size_name,
  ps_size.width_mm,
  ps_size.height_mm,
  pf.slug             AS finish_slug,
  pf.name             AS finish_name,
  pt.name             AS product_name,
  up.full_name        AS customer_name,
  u.email             AS customer_email,
  psc.items_per_sheet AS fits_per_sheet
FROM order_items oi
JOIN orders o              ON o.id  = oi.order_id
JOIN users u               ON u.id  = o.user_id
LEFT JOIN user_profiles up ON up.user_id = o.user_id
JOIN product_types pt      ON pt.id = oi.product_type_id
JOIN print_sizes ps_size   ON ps_size.id = oi.print_size_id
JOIN print_finishes pf     ON pf.id = oi.print_finish_id
LEFT JOIN print_sheet_configs psc ON psc.print_size_id = oi.print_size_id AND psc.paper_size = 'A4'
WHERE o.status = 'confirmed'
  AND oi.print_status = 'pending'
  AND oi.print_sheet_id IS NULL
ORDER BY o.confirmed_at ASC;

-- Admin: print sheet progress
CREATE VIEW v_print_sheet_summary AS
SELECT
  ps.id,
  ps.sheet_number,
  ps.status,
  ps.capacity,
  ps.items_count,
  ps.is_full,
  psize.name          AS size_name,
  pfinish.name        AS finish_name,
  ps.paper_size,
  ps.sheet_url,
  ps.generated_at,
  ps.sent_to_shop_at,
  ps.printed_at,
  ps.print_shop_name,
  COUNT(psi.id)       AS actual_items,
  ps.created_at
FROM print_sheets ps
JOIN print_sizes psize     ON psize.id  = ps.print_size_id
JOIN print_finishes pfinish ON pfinish.id = ps.print_finish_id
LEFT JOIN print_sheet_items psi ON psi.sheet_id = ps.id
GROUP BY ps.id, psize.name, pfinish.name;

-- Admin: user management list
CREATE VIEW v_admin_users AS
SELECT
  u.id,
  u.email,
  u.role,
  u.is_active,
  u.is_banned,
  u.ban_reason,
  u.last_login_at,
  u.created_at,
  up.full_name,
  up.phone,
  up.city,
  up.state,
  up.total_designs,
  up.total_orders,
  up.total_spent_paise,
  up.preferred_finish
FROM users u
LEFT JOIN user_profiles up ON up.user_id = u.id
WHERE u.deleted_at IS NULL
ORDER BY u.created_at DESC;

-- Admin: revenue analytics (daily)
CREATE VIEW v_daily_revenue AS
SELECT
  DATE(o.confirmed_at)     AS day,
  COUNT(o.id)              AS order_count,
  SUM(o.total_paise)       AS revenue_paise,
  AVG(o.total_paise)       AS avg_order_paise,
  COUNT(CASE WHEN o.is_gift THEN 1 END) AS gift_orders,
  SUM(SUM(o.total_paise)) OVER (ORDER BY DATE(o.confirmed_at)) AS cumulative_revenue_paise
FROM orders o
WHERE o.status NOT IN ('cancelled','refunded')
  AND o.confirmed_at IS NOT NULL
GROUP BY DATE(o.confirmed_at)
ORDER BY day DESC;

-- Admin: analytics — top templates
CREATE VIEW v_template_analytics AS
SELECT
  t.id,
  t.slug,
  t.name,
  t.vibe,
  COUNT(d.id)              AS total_designs,
  COUNT(CASE WHEN d.status = 'ordered' THEN 1 END) AS ordered_designs,
  COUNT(CASE WHEN d.status = 'exported' THEN 1 END) AS exported_designs,
  ROUND(
    COUNT(CASE WHEN d.status = 'ordered' THEN 1 END)::NUMERIC /
    NULLIF(COUNT(d.id),0) * 100, 1
  )                        AS order_conversion_pct
FROM templates t
LEFT JOIN designs d ON d.template_id = t.id
GROUP BY t.id, t.slug, t.name, t.vibe
ORDER BY total_designs DESC;


-- ============================================================
-- END
-- Tables: 31
-- Views: 6 (admin)
-- Domains: Auth, Designs, Products, Print Sheets,
--          Orders, Payments, Shipments, Coupons,
--          Subscriptions, Events, Admin, Notifications, Analytics
-- ============================================================