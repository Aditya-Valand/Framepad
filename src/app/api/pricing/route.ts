import { sql } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  // Template → price mapping (auto-detected from design)
  const templatePricing = await sql`
    SELECT template_id, template_name, first_print_paise, extra_print_paise, items_per_sheet
    FROM template_print_mapping
    WHERE is_active = true
    ORDER BY template_name`;

  // Bundle packs
  const bundles = await sql`
    SELECT id, template_id, bundle_name, quantity, price_paise
    FROM price_bundles
    WHERE is_active = true
    ORDER BY template_id, sort_order`;

  // Print finishes (glossy/matte)
  const finishes = await sql`
    SELECT id, slug, name, description, price_addon_paise
    FROM print_finishes
    WHERE is_active = true`;

  // Site settings for gift box + shipping + sheet saver
  const settings = await sql`
    SELECT key, value FROM site_settings
    WHERE key IN ('gift_box_addon_paise', 'free_shipping_threshold_paise', 'sheet_saver_enabled')`;

  const settingsMap: Record<string, string> = {};
  for (const s of settings) settingsMap[s.key] = s.value;

  return NextResponse.json({
    templatePricing,
    bundles,
    finishes,
    giftBoxPaise: parseInt(settingsMap.gift_box_addon_paise || '14900'),
    freeShippingThresholdPaise: parseInt(settingsMap.free_shipping_threshold_paise || '50000'),
    sheetSaverEnabled: settingsMap.sheet_saver_enabled !== 'false',
  });
}
