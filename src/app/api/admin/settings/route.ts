import { sql } from '@/lib/db';
import { ok, err, userId } from '@/lib/api';
import { NextRequest } from 'next/server';

// A23 — Site Settings List
// GET /api/admin/settings
export async function GET(req: NextRequest) {
  const adminId = userId(req);
  if (!adminId) return err('Unauthorized', 401);

  try {
    const rows = await sql`
      SELECT key, value, description, updated_by, updated_at
      FROM site_settings
      ORDER BY key ASC
    `;

    // Return as flat object { key: value, ... } for easy frontend use
    const settings: Record<string, unknown> = {};
    const meta: Record<string, { description: string | null; updatedAt: unknown }> = {};

    for (const row of rows as Array<{ key: string; value: unknown; description: string | null; updated_at: unknown }>) {
      settings[row.key] = row.value;
      meta[row.key]     = { description: row.description, updatedAt: row.updated_at };
    }

    return ok({ settings, meta });
  } catch (error) {
    console.error('Settings GET error:', error);
    return err('Failed to fetch settings', 500);
  }
}
