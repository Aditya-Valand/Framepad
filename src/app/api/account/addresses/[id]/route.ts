import { sql } from '@/lib/db';
import { ok, err, userId } from '@/lib/api';

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const uid = userId(req);
  if (!uid) return err('Unauthorized', 401);
  const { id } = await params;

  const body = await req.json();
  const { fullName, phone, line1, line2, landmark, city, state, pincode, label, isDefault } = body;

  if (!fullName || !phone || !line1 || !city || !state || !pincode)
    return err('Required fields missing', 400);
  if (!/^\d{6}$/.test(pincode)) return err('Invalid PIN code', 400);

  // Verify ownership
  const [existing] = await sql`SELECT id FROM addresses WHERE id = ${id} AND user_id = ${uid}`;
  if (!existing) return err('Address not found', 404);

  if (isDefault) {
    await sql`UPDATE addresses SET is_default = false WHERE user_id = ${uid}`;
  }

  await sql`
    UPDATE addresses SET
      full_name = ${fullName}, phone = ${phone}, line1 = ${line1},
      line2 = ${line2 || null}, landmark = ${landmark || null},
      city = ${city}, state = ${state}, pincode = ${pincode},
      label = ${label || null}, is_default = ${!!isDefault}, updated_at = NOW()
    WHERE id = ${id} AND user_id = ${uid}`;

  return ok({ updated: true });
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const uid = userId(req);
  if (!uid) return err('Unauthorized', 401);
  const { id } = await params;

  const [existing] = await sql`SELECT id FROM addresses WHERE id = ${id} AND user_id = ${uid}`;
  if (!existing) return err('Address not found', 404);

  await sql`DELETE FROM addresses WHERE id = ${id} AND user_id = ${uid}`;
  return ok({ deleted: true });
}
