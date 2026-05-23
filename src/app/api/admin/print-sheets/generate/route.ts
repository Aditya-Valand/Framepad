import { sql, withTransaction } from '@/lib/db';
import { ok, err, userId } from '@/lib/api';
import { NextRequest } from 'next/server';

// A08 — Generate Print Sheets
// POST /api/admin/print-sheets/generate
// Body: { size_slug: string, finish_slug: string } or { all: true }
export async function POST(req: NextRequest) {
  const adminId = userId(req);
  if (!adminId) return err('Unauthorized', 401);

  const body = await req.json();
  const { size_slug, finish_slug, all } = body as {
    size_slug?: string;
    finish_slug?: string;
    all?: boolean;
  };

  if (!all && (!size_slug || !finish_slug)) {
    return err('Provide size_slug and finish_slug, or set all: true', 400);
  }

  try {
    // Get pending items, optionally filtered by size/finish
    const pendingItems = await sql`
      SELECT
        oi.id AS order_item_id,
        oi.quantity,
        oi.design_snapshot_url,
        oi.print_ready_url,
        ps.id AS print_size_id,
        ps.slug AS size_slug,
        pf.id AS print_finish_id,
        pf.slug AS finish_slug,
        psc.id AS config_id,
        psc.items_per_sheet AS capacity,
        psc.columns AS config_columns,
        psc.rows AS config_rows
      FROM order_items oi
      JOIN orders o ON o.id = oi.order_id
      JOIN print_sizes ps ON ps.id = oi.print_size_id
      JOIN print_finishes pf ON pf.id = oi.print_finish_id
      LEFT JOIN print_sheet_configs psc ON psc.print_size_id = ps.id AND psc.paper_size = 'A4' AND psc.is_active = TRUE
      WHERE o.status IN ('confirmed', 'processing')
        AND oi.print_status = 'pending'
        AND oi.print_sheet_id IS NULL
        ${!all && size_slug ? sql`AND ps.slug = ${size_slug}` : sql``}
        ${!all && finish_slug ? sql`AND pf.slug = ${finish_slug}` : sql``}
      ORDER BY o.confirmed_at ASC
    `;

    if (pendingItems.length === 0) {
      return ok({ sheetsCreated: 0, message: 'No pending items to batch' });
    }

    // Group items by size + finish
    const groups: Record<string, {
      print_size_id: string;
      print_finish_id: string;
      config_id: string;
      capacity: number;
      columns: number;
      rows: number;
      items: typeof pendingItems;
    }> = {};

    for (const item of pendingItems) {
      const key = `${item.size_slug}_${item.finish_slug}`;
      if (!groups[key]) {
        groups[key] = {
          print_size_id: item.print_size_id as string,
          print_finish_id: item.print_finish_id as string,
          config_id: item.config_id as string,
          capacity: (item.capacity as number) || 6,
          columns: (item.config_columns as number) || 2,
          rows: (item.config_rows as number) || 3,
          items: [],
        };
      }
      // Each order_item is one slot (quantity is handled at order level, not sheet level)
      groups[key].items.push(item);
    }

    let totalSheetsCreated = 0;
    const sheetIds: string[] = [];

    // For each group, create sheets and assign items
    for (const key of Object.keys(groups)) {
      const g = groups[key];
      if (!g.config_id) {
        console.warn(`No print_sheet_config found for group ${key}, skipping`);
        continue;
      }
      const { capacity, items } = g;

      // Split items into sheet-sized batches
      for (let i = 0; i < items.length; i += capacity) {
        const batch = items.slice(i, i + capacity);
        const isFull = batch.length === capacity;

        // Create the sheet within a transaction
        const sheet = await withTransaction<{ id: string; sheet_number: string }>(async () => {
          // Create print sheet (trigger generates sheet_number)
          const [newSheet] = await sql`
            INSERT INTO print_sheets (print_finish_id, print_size_id, config_id, paper_size, capacity, items_count, is_full, status, generated_at)
            VALUES (${g.print_finish_id}, ${g.print_size_id}, ${g.config_id}, 'A4', ${capacity}, ${batch.length}, ${isFull}, 'generated', NOW())
            RETURNING id, sheet_number
          `;

          // Insert sheet items and update order_items
          for (let j = 0; j < batch.length; j++) {
            const item = batch[j];
            const col = j % g.columns;
            const row = Math.floor(j / g.columns);
            const snapshotUrl = (item.print_ready_url || item.design_snapshot_url || '') as string;

            await sql`
              INSERT INTO print_sheet_items (sheet_id, order_item_id, position, col, row, design_snapshot_url)
              VALUES (${newSheet.id}, ${item.order_item_id}, ${j + 1}, ${col}, ${row}, ${snapshotUrl || 'pending'})
            `;

            await sql`
              UPDATE order_items
              SET print_sheet_id = ${newSheet.id}, print_status = 'assigned_to_sheet', updated_at = NOW()
              WHERE id = ${item.order_item_id}
            `;
          }

          return newSheet as { id: string; sheet_number: string };
        });

        sheetIds.push(sheet.id as string);
        totalSheetsCreated++;
      }
    }

    return ok({
      sheetsCreated: totalSheetsCreated,
      sheetIds,
      message: `Generated ${totalSheetsCreated} sheet(s)`,
    });
  } catch (error) {
    console.error('Generate sheets error:', error);
    return err('Failed to generate sheets', 500);
  }
}
