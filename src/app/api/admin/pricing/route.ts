import { sql } from '@/lib/db';
import { ok, err, userRole } from '@/lib/api';

export async function GET(req: Request) {
  if (userRole(req) !== 'admin') return err('Forbidden', 403);

  const templatePricing = await sql`
    SELECT tpm.*, ps.slug as size_slug, ps.name as size_name,
           ps.width_mm, ps.height_mm
    FROM template_print_mapping tpm
    JOIN print_sizes ps ON ps.id = tpm.print_size_id
    ORDER BY tpm.template_name`;

  const quantityDiscounts = await sql`
    SELECT * FROM quantity_discounts ORDER BY min_qty`;

  const finishes = await sql`SELECT * FROM print_finishes`;

  const settings = await sql`
    SELECT key, value FROM site_settings
    WHERE key IN ('gift_box_addon_paise', 'free_shipping_threshold_paise')`;

  return ok({ templatePricing, quantityDiscounts, finishes, settings });
}

// Update template pricing
export async function PUT(req: Request) {
  if (userRole(req) !== 'admin') return err('Forbidden', 403);

  const { templateId, pricePerUnitPaise, itemsPerSheet, isActive } = await req.json();
  if (!templateId) return err('templateId required', 400);

  await sql`
    UPDATE template_print_mapping SET
      price_per_unit_paise = COALESCE(${pricePerUnitPaise || null}, price_per_unit_paise),
      items_per_sheet = COALESCE(${itemsPerSheet || null}, items_per_sheet),
      is_active = ${isActive !== false},
      updated_at = NOW()
    WHERE template_id = ${templateId}`;

  return ok({ updated: true });
}

// Create new template mapping
export async function POST(req: Request) {
  if (userRole(req) !== 'admin') return err('Forbidden', 403);

  const { templateId, templateName, printSizeSlug, pricePerUnitPaise, itemsPerSheet } = await req.json();
  if (!templateId || !templateName || !printSizeSlug || !pricePerUnitPaise)
    return err('templateId, templateName, printSizeSlug, pricePerUnitPaise required', 400);

  const [size] = await sql`SELECT id FROM print_sizes WHERE slug = ${printSizeSlug}`;
  if (!size) return err('Invalid print size slug', 400);

  const [row] = await sql`
    INSERT INTO template_print_mapping (template_id, template_name, print_size_id, price_per_unit_paise, items_per_sheet)
    VALUES (${templateId}, ${templateName}, ${size.id}, ${pricePerUnitPaise}, ${itemsPerSheet || 6})
    ON CONFLICT (template_id) DO UPDATE SET
      template_name = EXCLUDED.template_name,
      print_size_id = EXCLUDED.print_size_id,
      price_per_unit_paise = EXCLUDED.price_per_unit_paise,
      items_per_sheet = EXCLUDED.items_per_sheet,
      updated_at = NOW()
    RETURNING id`;

  return ok({ id: row.id }, 201);
}

export async function DELETE(req: Request) {
  if (userRole(req) !== 'admin') return err('Forbidden', 403);

  const { templateId } = await req.json();
  if (!templateId) return err('templateId required', 400);

  await sql`UPDATE template_print_mapping SET is_active = false WHERE template_id = ${templateId}`;
  return ok({ deactivated: true });
}
