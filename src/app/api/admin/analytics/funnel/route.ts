import { sql } from '@/lib/db';
import { ok, err, userId } from '@/lib/api';
import { NextRequest } from 'next/server';

// A19 — Design Funnel
// GET /api/admin/analytics/funnel
export async function GET(req: NextRequest) {
  const adminId = userId(req);
  if (!adminId) return err('Unauthorized', 401);

  try {
    const [row] = await sql`
      SELECT
        COUNT(*)                                                        AS total_created,
        COUNT(*) FILTER (WHERE status IN ('exported', 'ordered'))      AS total_exported,
        COUNT(*) FILTER (WHERE status = 'ordered')                     AS total_ordered,
        COUNT(*) FILTER (WHERE status = 'draft')                       AS total_draft,
        COUNT(*) FILTER (WHERE status = 'saved')                       AS total_saved
      FROM designs
      WHERE deleted_at IS NULL
    `;

    const totalCreated  = Number(row.total_created);
    const totalExported = Number(row.total_exported);
    const totalOrdered  = Number(row.total_ordered);
    const totalDraft    = Number(row.total_draft);
    const totalSaved    = Number(row.total_saved);

    return ok({
      totalCreated,
      totalExported,
      totalOrdered,
      totalDraft,
      totalSaved,
      exportRate:     totalCreated  > 0 ? Math.round((totalExported / totalCreated)  * 1000) / 10 : 0,
      orderRate:      totalCreated  > 0 ? Math.round((totalOrdered  / totalCreated)  * 1000) / 10 : 0,
      conversionRate: totalExported > 0 ? Math.round((totalOrdered  / totalExported) * 1000) / 10 : 0,
    });
  } catch (error) {
    console.error('Analytics funnel error:', error);
    return err('Failed to fetch funnel analytics', 500);
  }
}
