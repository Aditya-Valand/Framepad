import { sql } from '@/lib/db';
import { ok, err, userId } from '@/lib/api';
import { NextRequest } from 'next/server';

// A18 — Template Analytics
// GET /api/admin/analytics/templates
export async function GET(req: NextRequest) {
  const adminId = userId(req);
  if (!adminId) return err('Unauthorized', 401);

  try {
    const rows = await sql`
      SELECT
        id,
        slug,
        name,
        vibe,
        total_designs,
        ordered_designs,
        exported_designs,
        order_conversion_pct
      FROM v_template_analytics
      ORDER BY total_designs DESC
      LIMIT 10
    `;

    // Total ordered across all templates for percentage bars
    const totalOrdered = rows.reduce(
      (sum: number, r: Record<string, unknown>) => sum + Number(r.ordered_designs), 0
    );

    return ok({
      templates: rows.map((r: Record<string, unknown>) => ({
        id:                r.id,
        slug:              r.slug,
        name:              r.name,
        vibe:              r.vibe,
        totalDesigns:      Number(r.total_designs),
        orderedDesigns:    Number(r.ordered_designs),
        exportedDesigns:   Number(r.exported_designs),
        orderConversionPct: Number(r.order_conversion_pct),
        sharePct: totalOrdered > 0
          ? Math.round((Number(r.ordered_designs) / totalOrdered) * 1000) / 10
          : 0,
      })),
      totalOrdered,
    });
  } catch (error) {
    console.error('Analytics templates error:', error);
    return err('Failed to fetch template analytics', 500);
  }
}
