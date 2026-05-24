import { sql } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  const productTypes = await sql`
    SELECT id, slug, name, description, quantity, base_price_paise,
           has_gift_box, has_gift_message, has_tissue_wrap,
           discount_percentage, sort_order
    FROM product_types
    WHERE is_active = true
    ORDER BY sort_order`;

  const sizes = await sql`
    SELECT id, slug, name, width_mm, height_mm, orientation,
           price_addon_paise, is_default
    FROM print_sizes
    WHERE is_active = true
    ORDER BY price_addon_paise`;

  const finishes = await sql`
    SELECT id, slug, name, description, price_addon_paise
    FROM print_finishes
    WHERE is_active = true`;

  return NextResponse.json({ productTypes, sizes, finishes });
}
