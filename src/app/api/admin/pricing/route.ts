import { sql } from '@/lib/db';
import { ok, err, userRole } from '@/lib/api';

export async function GET(req: Request) {
  if (userRole(req) !== 'admin') return err('Forbidden', 403);

  const productTypes = await sql`SELECT * FROM product_types ORDER BY sort_order`;
  const sizes = await sql`SELECT * FROM print_sizes ORDER BY price_addon_paise`;
  const finishes = await sql`SELECT * FROM print_finishes`;

  return ok({ productTypes, sizes, finishes });
}

export async function POST(req: Request) {
  if (userRole(req) !== 'admin') return err('Forbidden', 403);

  const { slug, name, description, quantity, basePricePaise, discountPercentage,
          hasGiftBox, hasGiftMessage, hasTissueWrap, sortOrder } = await req.json();

  if (!slug || !name || !quantity || !basePricePaise)
    return err('slug, name, quantity, basePricePaise required', 400);

  const [tier] = await sql`
    INSERT INTO product_types (slug, name, description, quantity, base_price_paise,
      discount_percentage, has_gift_box, has_gift_message, has_tissue_wrap, sort_order)
    VALUES (${slug}, ${name}, ${description || null}, ${quantity}, ${basePricePaise},
      ${discountPercentage || 0}, ${!!hasGiftBox}, ${!!hasGiftMessage}, ${!!hasTissueWrap}, ${sortOrder || 0})
    RETURNING id`;

  return ok({ id: tier.id }, 201);
}

export async function PUT(req: Request) {
  if (userRole(req) !== 'admin') return err('Forbidden', 403);

  const { id, name, description, quantity, basePricePaise, discountPercentage,
          hasGiftBox, hasGiftMessage, hasTissueWrap, sortOrder, isActive } = await req.json();

  if (!id) return err('ID required', 400);

  await sql`
    UPDATE product_types SET
      name = ${name}, description = ${description || null},
      quantity = ${quantity}, base_price_paise = ${basePricePaise},
      discount_percentage = ${discountPercentage || 0},
      has_gift_box = ${!!hasGiftBox}, has_gift_message = ${!!hasGiftMessage},
      has_tissue_wrap = ${!!hasTissueWrap}, sort_order = ${sortOrder || 0},
      is_active = ${isActive !== false}
    WHERE id = ${id}`;

  return ok({ updated: true });
}

export async function DELETE(req: Request) {
  if (userRole(req) !== 'admin') return err('Forbidden', 403);

  const { id } = await req.json();
  if (!id) return err('ID required', 400);

  // Soft-delete by deactivating
  await sql`UPDATE product_types SET is_active = false WHERE id = ${id}`;
  return ok({ deactivated: true });
}
