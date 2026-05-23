import { sql } from '@/lib/db';
import { ok, err, userId } from '@/lib/api';
import { NextRequest } from 'next/server';

// A07 — Print Queue View
// GET /api/admin/print-queue?size_slug=&finish_slug=
export async function GET(req: NextRequest) {
  const adminId = userId(req);
  if (!adminId) return err('Unauthorized', 401);

  const { searchParams } = req.nextUrl;
  const sizeSlug = searchParams.get('size_slug');
  const finishSlug = searchParams.get('finish_slug');

  try {
    // Get pending items from the print queue
    const items = await sql`
      SELECT
        oi.id AS order_item_id,
        o.order_number,
        o.confirmed_at,
        oi.quantity,
        oi.design_snapshot_url,
        oi.print_ready_url,
        oi.print_status,
        ps.slug AS size_slug,
        ps.name AS size_name,
        ps.width_mm,
        ps.height_mm,
        pf.slug AS finish_slug,
        pf.name AS finish_name,
        pt.name AS product_name,
        up.full_name AS customer_name,
        u.email AS customer_email,
        psc.items_per_sheet AS fits_per_sheet,
        psc.columns,
        psc.rows
      FROM order_items oi
      JOIN orders o ON o.id = oi.order_id
      JOIN users u ON u.id = o.user_id
      LEFT JOIN user_profiles up ON up.user_id = o.user_id
      JOIN product_types pt ON pt.id = oi.product_type_id
      JOIN print_sizes ps ON ps.id = oi.print_size_id
      JOIN print_finishes pf ON pf.id = oi.print_finish_id
      LEFT JOIN print_sheet_configs psc ON psc.print_size_id = oi.print_size_id AND psc.paper_size = 'A4'
      WHERE o.status IN ('confirmed', 'processing')
        AND oi.print_status = 'pending'
        AND oi.print_sheet_id IS NULL
        ${sizeSlug ? sql`AND ps.slug = ${sizeSlug}` : sql``}
        ${finishSlug ? sql`AND pf.slug = ${finishSlug}` : sql``}
      ORDER BY o.confirmed_at ASC
    `;

    // Group items by size + finish
    const groups: Record<string, {
      size_slug: string;
      size_name: string;
      finish_slug: string;
      finish_name: string;
      items: typeof items;
      item_count: number;
      fits_per_sheet: number;
      columns: number;
      rows: number;
      sheets_needed: number;
      is_full: boolean;
    }> = {};

    for (const item of items) {
      const key = `${item.size_slug}_${item.finish_slug}`;
      if (!groups[key]) {
        groups[key] = {
          size_slug: item.size_slug as string,
          size_name: item.size_name as string,
          finish_slug: item.finish_slug as string,
          finish_name: item.finish_name as string,
          items: [],
          item_count: 0,
          fits_per_sheet: (item.fits_per_sheet as number) || 6,
          columns: (item.columns as number) || 2,
          rows: (item.rows as number) || 3,
          sheets_needed: 0,
          is_full: false,
        };
      }
      groups[key].items.push(item);
      groups[key].item_count += (item.quantity as number) || 1;
    }

    // Calculate sheets needed for each group
    for (const key of Object.keys(groups)) {
      const g = groups[key];
      g.sheets_needed = Math.ceil(g.item_count / g.fits_per_sheet);
      g.is_full = g.item_count >= g.fits_per_sheet;
    }

    // Get existing print sheets (recent)
    const sheets = await sql`
      SELECT
        ps.id,
        ps.sheet_number,
        ps.status,
        ps.capacity,
        ps.items_count,
        ps.is_full,
        ps.sheet_url,
        ps.generated_at,
        ps.sent_to_shop_at,
        ps.printed_at,
        ps.print_shop_name,
        ps.admin_notes,
        ps.created_at,
        psize.name AS size_name,
        psize.slug AS size_slug,
        pfinish.name AS finish_name,
        pfinish.slug AS finish_slug,
        psc.columns,
        psc.rows
      FROM print_sheets ps
      JOIN print_sizes psize ON psize.id = ps.print_size_id
      JOIN print_finishes pfinish ON pfinish.id = ps.print_finish_id
      JOIN print_sheet_configs psc ON psc.id = ps.config_id
      WHERE ps.status NOT IN ('printed')
      ORDER BY ps.created_at DESC
      LIMIT 20
    `;

    // Get sheet items for each sheet
    const sheetIds = sheets.map((s: Record<string, unknown>) => s.id);
    let sheetItems: Record<string, unknown>[] = [];
    if (sheetIds.length > 0) {
      sheetItems = await sql`
        SELECT
          psi.sheet_id,
          psi.order_item_id,
          psi.position,
          psi.col,
          psi.row,
          psi.design_snapshot_url
        FROM print_sheet_items psi
        WHERE psi.sheet_id = ANY(${sheetIds})
        ORDER BY psi.position
      `;
    }

    // Attach items to sheets
    const sheetsWithItems = sheets.map((sheet: Record<string, unknown>) => ({
      ...sheet,
      items: sheetItems.filter((si: Record<string, unknown>) => si.sheet_id === sheet.id),
    }));

    // Stats
    const totalItems = Object.values(groups).reduce((sum, g) => sum + g.item_count, 0);
    const totalSheetsNeeded = Object.values(groups).reduce((sum, g) => sum + g.sheets_needed, 0);
    const sheetsToday = sheets.filter((s: Record<string, unknown>) => {
      const created = new Date(s.created_at as string);
      const today = new Date();
      return created.toDateString() === today.toDateString();
    }).length;

    return ok({
      groups: Object.values(groups),
      sheets: sheetsWithItems,
      stats: {
        totalItems,
        totalSheetsNeeded,
        sheetsToday,
        groupCount: Object.keys(groups).length,
      },
    });
  } catch (error) {
    console.error('Print queue fetch error:', error);
    return err('Failed to fetch print queue', 500);
  }
}
