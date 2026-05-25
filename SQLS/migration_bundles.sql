-- ============================================================
-- MIGRATION: Add bundle pricing layer
-- Bundles give customers pack deals (e.g., 3 Classic = ₹99)
-- Works alongside individual pricing for flexibility
-- ============================================================

-- Bundle pricing table
CREATE TABLE IF NOT EXISTS price_bundles (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  template_id       VARCHAR(50) NOT NULL REFERENCES template_print_mapping(template_id),
  bundle_name       VARCHAR(100) NOT NULL,       -- e.g., "3 Classic Pack"
  quantity          INTEGER NOT NULL,            -- e.g., 3
  price_paise       INTEGER NOT NULL,            -- total bundle price in paise
  is_active         BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order        INTEGER NOT NULL DEFAULT 0,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Unique constraint: one bundle per template per quantity
CREATE UNIQUE INDEX IF NOT EXISTS idx_bundle_template_qty ON price_bundles(template_id, quantity);

-- Seed example bundles
INSERT INTO price_bundles (template_id, bundle_name, quantity, price_paise, sort_order) VALUES
  -- Classic types (polaroid-classic, polaroid-600, etc.)
  ('polaroid-classic', '3 Classic Pack', 3, 9900, 1),
  ('polaroid-classic', '6 Classic Pack', 6, 16900, 2),
  ('polaroid-classic', '9 Classic Pack', 9, 22900, 3),
  ('polaroid-600', '3 Pack', 3, 9900, 1),
  ('polaroid-600', '6 Pack', 6, 16900, 2),
  ('polaroid-600', '9 Pack', 9, 22900, 3),
  -- Instax Mini
  ('instax-mini', '3 Instax Mini', 3, 9900, 1),
  ('instax-mini', '6 Instax Mini', 6, 16900, 2),
  ('instax-mini', '9 Instax Mini', 9, 22900, 3),
  -- Instax Wide
  ('instax-wide', '2 Instax Wide', 2, 12900, 1),
  ('instax-wide', '4 Instax Wide', 4, 23900, 2)
ON CONFLICT (template_id, quantity) DO NOTHING;

-- Add sheet_saver_enabled setting
INSERT INTO site_settings (key, value, description) VALUES
  ('sheet_saver_enabled', 'true', 'Show sheet saver recommendation when customer can fill unused sheet space')
ON CONFLICT (key) DO NOTHING;
