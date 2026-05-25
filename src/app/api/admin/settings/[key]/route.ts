import { sql } from '@/lib/db';
import { ok, err, userId } from '@/lib/api';
import { NextRequest } from 'next/server';

// A23 — Update a Single Setting
// PUT /api/admin/settings/:key
export async function PUT(req: NextRequest, { params }: { params: Promise<{ key: string }> }) {
  const adminId = userId(req);
  if (!adminId) return err('Unauthorized', 401);

  const { key } = await params;
  if (!key) return err('Setting key required', 400);

  try {
    const body = await req.json();
    if (!('value' in body)) return err('value is required', 400);

    const jsonValue = JSON.stringify(body.value);

    const [row] = await sql`
      INSERT INTO site_settings (key, value, updated_by, updated_at)
      VALUES (${key}, ${jsonValue}::JSONB, ${adminId}, NOW())
      ON CONFLICT (key) DO UPDATE SET
        value      = EXCLUDED.value,
        updated_by = EXCLUDED.updated_by,
        updated_at = NOW()
      RETURNING key, value, updated_at
    `;

    return ok(row);
  } catch (error) {
    console.error('Settings PUT error:', error);
    return err('Failed to update setting', 500);
  }
}
