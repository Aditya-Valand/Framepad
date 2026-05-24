import { sql } from '@/lib/db';
import { ok, err, userRole } from '@/lib/api';

export async function GET(req: Request) {
  if (userRole(req) !== 'admin') return err('Forbidden', 403);

  const sizes = await sql`
    SELECT ps.*, pf.price_addon_paise as finish_addon
    FROM print_sizes ps
    LEFT JOIN print_finishes pf ON pf.slug = 'matte'
    ORDER BY ps.price_addon_paise`;

  return ok({ sizes });
}

export async function PUT(req: Request) {
  if (userRole(req) !== 'admin') return err('Forbidden', 403);

  const { id, priceAddonPaise, isActive } = await req.json();
  if (!id) return err('ID required', 400);

  await sql`
    UPDATE print_sizes SET
      price_addon_paise = ${priceAddonPaise ?? 0},
      is_active = ${isActive !== false}
    WHERE id = ${id}`;

  return ok({ updated: true });
}
