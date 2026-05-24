-- ============================================================
-- MIGRATION: New pricing model v2
-- Template-based pricing + quantity discounts + gift box addon
-- ============================================================

-- 1. Template → Print Size mapping
-- Maps each editor template_id to its physical print size
CREATE TABLE IF NOT EXISTS template_print_mapping (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  template_id       VARCHAR(50) NOT NULL UNIQUE,  -- matches store POLAROID_TEMPLATES id
  template_name     VARCHAR(100) NOT NULL,
  print_size_id     UUID NOT NULL REFERENCES print_sizes(id),
  price_per_unit_paise INTEGER NOT NULL,          -- selling price per polaroid
  items_per_sheet   INTEGER NOT NULL DEFAULT 6,   -- how many fit on one A4
  is_active         BOOLEAN NOT NULL DEFAULT TRUE,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Quantity discount tiers
CREATE TABLE IF NOT EXISTS quantity_discounts (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  min_qty           INTEGER NOT NULL UNIQUE,       -- minimum quantity for this tier
  discount_percent  INTEGER NOT NULL DEFAULT 0,    -- percentage off
  label             VARCHAR(50),                   -- e.g. "Pack of 5"
  is_active         BOOLEAN NOT NULL DEFAULT TRUE,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Seed template mappings
INSERT INTO template_print_mapping (template_id, template_name, print_size_id, price_per_unit_paise, items_per_sheet)
SELECT t.tid, t.tname, ps.id, t.price, t.per_sheet
FROM (VALUES
  ('instax-mini',      'Instax Mini',         'instax-mini', 4900,  9),
  ('instax-square',    'Instax Square',       'square',      7900,  6),
  ('instax-wide',      'Instax Wide',         'instax-wide', 9900,  2),
  ('polaroid-600',     'Polaroid 600',        'classic',     7900,  6),
  ('polaroid-itype',   'Polaroid i-Type',     'classic',     7900,  6),
  ('polaroid-bw',      'Polaroid B&W',        'classic',     7900,  6),
  ('movie-poster',     'Movie Poster',        '5x7',        14900, 1),
  ('polaroid-classic', 'Classic Polaroid',    'classic',     7900,  6),
  ('vintage-color',    'Vintage Color 600',   'classic',     7900,  6),
  ('dark-minimal',     'Dark Minimal',        'classic',     7900,  6),
  ('tape-border',      'Tape Border',         'classic',     7900,  6),
  ('concert-ticket',   'Concert Ticket',      '5x7',        14900, 1)
) AS t(tid, tname, size_slug, price, per_sheet)
JOIN print_sizes ps ON ps.slug = t.size_slug
ON CONFLICT (template_id) DO NOTHING;

-- 4. Seed quantity discounts
INSERT INTO quantity_discounts (min_qty, discount_percent, label) VALUES
  (1,   0, 'Single'),
  (5,  10, 'Pack of 5'),
  (10, 20, 'Pack of 10'),
  (20, 35, 'Pack of 20')
ON CONFLICT (min_qty) DO NOTHING;

-- 5. Add gift_box_addon_paise to site_settings
INSERT INTO site_settings (key, value, description) VALUES
  ('gift_box_addon_paise', '14900', 'Gift box addon price in paise (₹149)')
ON CONFLICT (key) DO NOTHING;
