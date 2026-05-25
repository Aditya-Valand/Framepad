import { sql } from '@/lib/db';
import { ok, err, userRole } from '@/lib/api';

// Manages pricing settings (gift box, free shipping threshold)
export async function GET(req: Request) {
  if (userRole(req) !== 'admin') return err('Forbidden', 403);

  const settings = await sql`
    SELECT key, value, description FROM site_settings
    WHERE key IN ('gift_box_addon_paise', 'free_shipping_threshold_paise')
    ORDER BY key`;

  const finishes = await sql`SELECT * FROM print_finishes ORDER BY slug`;

  return ok({ settings, finishes });
}

export async function PUT(req: Request) {
  if (userRole(req) !== 'admin') return err('Forbidden', 403);

  const { key, value } = await req.json();
  if (!key || value === undefined) return err('key and value required', 400);

  await sql`
    UPDATE site_settings SET value = ${String(value)}
    WHERE key = ${key}`;

  return ok({ updated: true });
}
