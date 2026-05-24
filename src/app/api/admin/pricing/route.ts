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

  const bundles = await sql`
    SELECT * FROM price_bundles ORDER BY template_id, sort_order`;

  const finishes = await sql`SELECT * FROM print_finishes`;

  const printSizes = await sql`
    SELECT ps.id, ps.slug, ps.name, ps.width_mm, ps.height_mm,
           psc.items_per_sheet, psc.columns, psc.rows
    FROM print_sizes ps
    LEFT JOIN print_sheet_configs psc ON psc.print_size_id = ps.id AND psc.paper_size = 'A4'
    WHERE ps.is_active = true
    ORDER BY ps.name`;

  const settings = await sql`
    SELECT key, value, description FROM site_settings
    WHERE key IN ('gift_box_addon_paise', 'free_shipping_threshold_paise', 'sheet_saver_enabled')`;

  return ok({ templatePricing, bundles, finishes, printSizes, settings });
}

// Update template pricing
export async function PUT(req: Request) {
  if (userRole(req) !== 'admin') return err('Forbidden', 403);

  const { templateId, firstPrintPaise, extraPrintPaise, itemsPerSheet, isActive, printSizeId } = await req.json();
  if (!templateId) return err('templateId required', 400);

  await sql`
    UPDATE template_print_mapping SET
      first_print_paise = COALESCE(${firstPrintPaise || null}, first_print_paise),
      extra_print_paise = COALESCE(${extraPrintPaise || null}, extra_print_paise),
      items_per_sheet = COALESCE(${itemsPerSheet || null}, items_per_sheet),
      print_size_id = COALESCE(${printSizeId || null}, print_size_id),
      is_active = ${isActive !== false},
      updated_at = NOW()
    WHERE template_id = ${templateId}`;

  return ok({ updated: true });
}

// Create new template mapping OR bundle
export async function POST(req: Request) {
  if (userRole(req) !== 'admin') return err('Forbidden', 403);

  const body = await req.json();

  // If it's a bundle creation
  if (body.type === 'bundle') {
    const { templateId, bundleName, quantity, pricePaise, sortOrder } = body;
    if (!templateId || !bundleName || !quantity || !pricePaise)
      return err('templateId, bundleName, quantity, pricePaise required', 400);

    const [row] = await sql`
      INSERT INTO price_bundles (template_id, bundle_name, quantity, price_paise, sort_order)
      VALUES (${templateId}, ${bundleName}, ${quantity}, ${pricePaise}, ${sortOrder || 0})
      ON CONFLICT (template_id, quantity) DO UPDATE SET
        bundle_name = EXCLUDED.bundle_name,
        price_paise = EXCLUDED.price_paise,
        sort_order = EXCLUDED.sort_order,
        updated_at = NOW()
      RETURNING id`;

    return ok({ id: row.id }, 201);
  }

  // Template mapping creation
  const { templateId, templateName, printSizeSlug, firstPrintPaise, extraPrintPaise, itemsPerSheet } = body;
  if (!templateId || !templateName || !printSizeSlug || !firstPrintPaise || !extraPrintPaise)
    return err('templateId, templateName, printSizeSlug, firstPrintPaise, extraPrintPaise required', 400);

  const [size] = await sql`SELECT id FROM print_sizes WHERE slug = ${printSizeSlug}`;
  if (!size) return err('Invalid print size slug', 400);

  const [row] = await sql`
    INSERT INTO template_print_mapping (template_id, template_name, print_size_id, first_print_paise, extra_print_paise, items_per_sheet)
    VALUES (${templateId}, ${templateName}, ${size.id}, ${firstPrintPaise}, ${extraPrintPaise}, ${itemsPerSheet || 6})
    ON CONFLICT (template_id) DO UPDATE SET
      template_name = EXCLUDED.template_name,
      print_size_id = EXCLUDED.print_size_id,
      first_print_paise = EXCLUDED.first_print_paise,
      extra_print_paise = EXCLUDED.extra_print_paise,
      items_per_sheet = EXCLUDED.items_per_sheet,
      updated_at = NOW()
    RETURNING id`;

  return ok({ id: row.id }, 201);
}

export async function DELETE(req: Request) {
  if (userRole(req) !== 'admin') return err('Forbidden', 403);

  const body = await req.json();

  // Delete bundle
  if (body.type === 'bundle') {
    if (!body.bundleId) return err('bundleId required', 400);
    await sql`DELETE FROM price_bundles WHERE id = ${body.bundleId}`;
    return ok({ deleted: true });
  }

  // Deactivate template
  const { templateId } = body;
  if (!templateId) return err('templateId required', 400);
  await sql`UPDATE template_print_mapping SET is_active = false WHERE template_id = ${templateId}`;
  return ok({ deactivated: true });
}
