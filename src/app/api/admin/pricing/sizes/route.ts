import { sql } from '@/lib/db';
import { ok, err, userRole } from '@/lib/api';

// Manages quantity discount tiers
export async function GET(req: Request) {
  if (userRole(req) !== 'admin') return err('Forbidden', 403);

  const discounts = await sql`
    SELECT * FROM quantity_discounts ORDER BY min_qty`;

  return ok({ discounts });
}

export async function PUT(req: Request) {
  if (userRole(req) !== 'admin') return err('Forbidden', 403);

  const { id, minQty, discountPercent, label, isActive } = await req.json();
  if (!id) return err('ID required', 400);

  await sql`
    UPDATE quantity_discounts SET
      min_qty = COALESCE(${minQty || null}, min_qty),
      discount_percent = COALESCE(${discountPercent ?? null}, discount_percent),
      label = COALESCE(${label || null}, label),
      is_active = ${isActive !== false}
    WHERE id = ${id}`;

  return ok({ updated: true });
}

export async function POST(req: Request) {
  if (userRole(req) !== 'admin') return err('Forbidden', 403);

  const { minQty, discountPercent, label } = await req.json();
  if (!minQty || discountPercent === undefined) return err('minQty and discountPercent required', 400);

  const [row] = await sql`
    INSERT INTO quantity_discounts (min_qty, discount_percent, label)
    VALUES (${minQty}, ${discountPercent}, ${label || null})
    RETURNING id`;

  return ok({ id: row.id }, 201);
}
