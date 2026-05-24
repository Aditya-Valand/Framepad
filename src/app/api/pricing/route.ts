import { sql } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  // Template → price mapping (auto-detected from design)
  const templatePricing = await sql`
    SELECT template_id, template_name, price_per_unit_paise, items_per_sheet
    FROM template_print_mapping
    WHERE is_active = true
    ORDER BY template_name`;

  // Quantity discount tiers
  const quantityDiscounts = await sql`
    SELECT min_qty, discount_percent, label
    FROM quantity_discounts
    WHERE is_active = true
    ORDER BY min_qty`;

  // Print finishes (glossy/matte)
  const finishes = await sql`
    SELECT id, slug, name, description, price_addon_paise
    FROM print_finishes
    WHERE is_active = true`;

  // Site settings for gift box + shipping
  const settings = await sql`
    SELECT key, value FROM site_settings
    WHERE key IN ('gift_box_addon_paise', 'free_shipping_threshold_paise')`;

  const settingsMap: Record<string, string> = {};
  for (const s of settings) settingsMap[s.key] = s.value;

  return NextResponse.json({
    templatePricing,
    quantityDiscounts,
    finishes,
    giftBoxPaise: parseInt(settingsMap.gift_box_addon_paise || '14900'),
    freeShippingThresholdPaise: parseInt(settingsMap.free_shipping_threshold_paise || '50000'),
  });
}
