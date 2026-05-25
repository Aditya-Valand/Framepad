-- ============================================================
-- MIGRATION: New pricing model v2
-- Template-based pricing: base price + per-extra-print price
-- Each template type has its own cost structure based on A4 sheet usage
-- ============================================================

-- Drop old table if re-running
DROP TABLE IF EXISTS template_print_mapping CASCADE;
DROP TABLE IF EXISTS quantity_discounts CASCADE;

-- 1. Template → Print Config + Pricing
CREATE TABLE template_print_mapping (
  id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  template_id          VARCHAR(50) NOT NULL UNIQUE,   -- matches store POLAROID_TEMPLATES id
  template_name        VARCHAR(100) NOT NULL,
  print_size_id        UUID NOT NULL REFERENCES print_sizes(id),
  items_per_sheet      INTEGER NOT NULL DEFAULT 6,    -- how many fit on one A4
  first_print_paise    INTEGER NOT NULL,              -- price for the first polaroid of this type
  extra_print_paise    INTEGER NOT NULL,              -- price for each additional of same type
  is_active            BOOLEAN NOT NULL DEFAULT TRUE,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Seed template mappings
-- Classic types (6 per A4, sheet cost ~₹40, so extra = ~₹7-8)
-- Wide/large types (1-2 per A4, sheet cost ~₹40, so extra = ~₹18-20)
INSERT INTO template_print_mapping (template_id, template_name, print_size_id, items_per_sheet, first_print_paise, extra_print_paise)
SELECT t.tid, t.tname, ps.id, t.per_sheet, t.first_price, t.extra_price
FROM (VALUES
  ('instax-mini',      'Instax Mini',         'instax-mini', 9,  5000,   500),
  ('instax-square',    'Instax Square',       'square',      6,  5000,   800),
  ('instax-wide',      'Instax Wide',         'instax-wide', 2,  5000,  1800),
  ('polaroid-600',     'Polaroid 600',        'classic',     6,  5000,   800),
  ('polaroid-itype',   'Polaroid i-Type',     'classic',     6,  5000,   800),
  ('polaroid-bw',      'Polaroid B&W',        'classic',     6,  5000,   800),
  ('movie-poster',     'Movie Poster',        '5x7',        1,  5000,  3500),
  ('polaroid-classic', 'Classic Polaroid',    'classic',     6,  5000,   800),
  ('vintage-color',    'Vintage Color 600',   'classic',     6,  5000,   800),
  ('dark-minimal',     'Dark Minimal',        'classic',     6,  5000,   800),
  ('tape-border',      'Tape Border',         'classic',     6,  5000,   800),
  ('concert-ticket',   'Concert Ticket',      '5x7',        1,  5000,  3500)
) AS t(tid, tname, size_slug, per_sheet, first_price, extra_price)
JOIN print_sizes ps ON ps.slug = t.size_slug
ON CONFLICT (template_id) DO UPDATE SET
  first_print_paise = EXCLUDED.first_print_paise,
  extra_print_paise = EXCLUDED.extra_print_paise,
  items_per_sheet = EXCLUDED.items_per_sheet,
  updated_at = NOW();

-- 3. Add gift_box_addon_paise to site_settings
INSERT INTO site_settings (key, value, description) VALUES
  ('gift_box_addon_paise', '14900', 'Gift box addon price in paise (₹149)')
ON CONFLICT (key) DO NOTHING;
