import { sql } from '@/lib/db';
import { ok, err, userId } from '@/lib/api';
import { NextRequest } from 'next/server';
import { renderSheet, packIntoSheets, PrintItem } from '@/lib/printSheetGenerator';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// POST /api/admin/print-sheets/[id]/regenerate
// Re-renders the sheet PNG from the same items (useful when design images were updated)
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const adminId = userId(req);
  if (!adminId) return err('Unauthorized', 401);

  const { id: sheetId } = await params;

  // Get the sheet and its items
  const [sheet] = await sql`
    SELECT ps.id, ps.status, pf.slug AS finish_slug
    FROM print_sheets ps
    JOIN print_finishes pf ON pf.id = ps.print_finish_id
    WHERE ps.id = ${sheetId}`;
  if (!sheet) return err('Sheet not found', 404);

  // Fetch items with their current best image URL
  const items = await sql`
    SELECT
      psi.order_item_id,
      COALESCE(oi.design_snapshot_url, oi.print_ready_url, d.export_url, d.thumbnail_url) AS design_snapshot_url,
      psc.item_width_mm AS width_mm,
      psc.item_height_mm AS height_mm,
      ps_size.slug AS size_slug,
      t.slug AS template_slug,
      o.order_number
    FROM print_sheet_items psi
    JOIN order_items oi ON oi.id = psi.order_item_id
    JOIN orders o ON o.id = oi.order_id
    JOIN print_sizes ps_size ON ps_size.id = oi.print_size_id
    JOIN print_sheet_configs psc ON psc.print_size_id = oi.print_size_id AND psc.paper_size = 'A4'
    LEFT JOIN designs d ON d.id = oi.design_id
    LEFT JOIN templates t ON t.id = d.template_id
    WHERE psi.sheet_id = ${sheetId}
    ORDER BY psi.position ASC`;

  if (items.length === 0) return err('Sheet has no items', 400);

  // Build PrintItem array
  const printItems: PrintItem[] = items.map(row => ({
    orderItemId:       row.order_item_id as string,
    designSnapshotUrl: (row.design_snapshot_url as string) || '',
    widthMm:           Number(row.width_mm),
    heightMm:          Number(row.height_mm),
    finish:            sheet.finish_slug as 'glossy' | 'matte',
    sizeSlug:          row.size_slug as string,
    templateSlug:      (row.template_slug as string) ?? 'unknown',
    orderNumber:       row.order_number as string,
  }));

  try {
    // Re-pack (single sheet's items)
    const sheets = packIntoSheets(printItems);
    if (sheets.length === 0) return err('Could not pack items', 500);

    // Render the first sheet (should be just one since these items fit on one sheet)
    const buffer = await renderSheet(sheets[0]);

    // Upload to Cloudinary (overwrite the existing one)
    const sheetUrl: string = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: 'polamuse/print-sheets',
          public_id: `sheet-${sheetId}`,
          resource_type: 'image',
          format: 'png',
          quality: 100,
          overwrite: true,
          transformation: [],
        },
        (uploadErr, result) => {
          if (uploadErr || !result) return reject(uploadErr ?? new Error('Upload failed'));
          resolve(result.secure_url);
        }
      );
      stream.end(buffer);
    });

    // Update sheet record with new URL
    await sql`
      UPDATE print_sheets SET
        sheet_url = ${sheetUrl},
        generated_at = NOW(),
        updated_at = NOW()
      WHERE id = ${sheetId}`;

    return ok({
      message: 'Sheet regenerated successfully',
      sheetUrl,
      itemCount: printItems.length,
    });
  } catch (error) {
    console.error('Regenerate sheet error:', error);
    return err('Failed to regenerate sheet', 500);
  }
}
