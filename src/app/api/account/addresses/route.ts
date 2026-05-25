import { sql } from '@/lib/db';
import { ok, err, userId } from '@/lib/api';

export async function GET(req: Request) {
  const uid = userId(req);
  if (!uid) return err('Unauthorized', 401);

  const addresses = await sql`
    SELECT id, label, full_name, phone, line1, line2, landmark,
           city, state, pincode, country, is_default, created_at
    FROM addresses
    WHERE user_id = ${uid}
    ORDER BY is_default DESC, created_at DESC`;

  return ok({ addresses });
}

export async function POST(req: Request) {
  const uid = userId(req);
  if (!uid) return err('Unauthorized', 401);

  const body = await req.json();
  const { fullName, phone, line1, line2, landmark, city, state, pincode, label, isDefault } = body;

  if (!fullName || !phone || !line1 || !city || !state || !pincode)
    return err('Required fields missing', 400);
  if (!/^\d{6}$/.test(pincode)) return err('Invalid PIN code', 400);
  if (!/^\d{10}$/.test(phone.replace(/\D/g, ''))) return err('Invalid phone number', 400);

  if (isDefault) {
    await sql`UPDATE addresses SET is_default = false WHERE user_id = ${uid}`;
  }

  const [addr] = await sql`
    INSERT INTO addresses (user_id, full_name, phone, line1, line2, landmark, city, state, pincode, label, is_default)
    VALUES (${uid}, ${fullName}, ${phone}, ${line1}, ${line2 || null}, ${landmark || null},
            ${city}, ${state}, ${pincode}, ${label || null}, ${!!isDefault})
    RETURNING id, full_name, is_default`;

  return ok({ address: addr }, 201);
}
