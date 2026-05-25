import { sql } from '@/lib/db';
import { err, userId } from '@/lib/api';
import { NextRequest, NextResponse } from 'next/server';

// A05 — Download Print File for an Order Item
// GET /api/admin/orders/items/:itemId/print-file
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ itemId: string }> }
) {
  const adminId = userId(req);
  if (!adminId) return err('Unauthorized', 401);

  const { itemId } = await params;

  try {
    const [item] = await sql`
      SELECT
        oi.id,
        oi.print_ready_url,
        oi.design_snapshot_url,
        d.export_url,
        d.thumbnail_url,
        o.order_number
      FROM order_items oi
      JOIN orders o ON o.id = oi.order_id
      LEFT JOIN designs d ON d.id = oi.design_id
      WHERE oi.id = ${itemId}
    `;

    if (!item) return err('Order item not found', 404);

    // Priority: print_ready_url > design_snapshot_url > export_url > thumbnail_url
    const fileUrl =
      item.print_ready_url ||
      item.design_snapshot_url ||
      item.export_url ||
      item.thumbnail_url;

    if (!fileUrl) {
      return err('No print file available for this item', 404);
    }

    // Redirect to the file URL
    return NextResponse.redirect(fileUrl);
  } catch (error) {
    console.error('Admin download print file error:', error);
    return err('Failed to get print file', 500);
  }
}
