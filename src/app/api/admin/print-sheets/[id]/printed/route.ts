import { sql, withTransaction } from '@/lib/db';
import { ok, err, userId } from '@/lib/api';
import { NextRequest } from 'next/server';

// A11 — Mark Sheet Printed (updates order_items print_status)
// PUT /api/admin/print-sheets/[id]/printed
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const adminId = userId(req);
  if (!adminId) return err('Unauthorized', 401);

  const { id } = await params;

  try {
    const [sheet] = await sql`
      SELECT id, status FROM print_sheets WHERE id = ${id}
    `;

    if (!sheet) return err('Sheet not found', 404);

    if (sheet.status !== 'sent') {
      return err(`Cannot mark as printed — current status is "${sheet.status}"`, 400);
    }

    const result = await withTransaction(async () => {
      // Update the sheet status
      const [updated] = await sql`
        UPDATE print_sheets
        SET status = 'printed',
            printed_at = NOW(),
            updated_at = NOW()
        WHERE id = ${id}
        RETURNING id, sheet_number, status, printed_at
      `;

      // Update all order_items on this sheet to 'printed'
      await sql`
        UPDATE order_items
        SET print_status = 'printed', updated_at = NOW()
        WHERE print_sheet_id = ${id}
      `;

      // Check if any orders now have ALL items printed → update order status to 'processing'
      // Find affected orders
      const affectedOrders = await sql`
        SELECT DISTINCT oi.order_id
        FROM order_items oi
        WHERE oi.print_sheet_id = ${id}
      `;

      for (const row of affectedOrders) {
        // Check if all items in that order are printed
        const [check] = await sql`
          SELECT COUNT(*) FILTER (WHERE print_status != 'printed') AS unprinted
          FROM order_items
          WHERE order_id = ${row.order_id}
        `;

        if (Number(check.unprinted) === 0) {
          // All items printed — mark order as ready for shipping
          await sql`
            UPDATE orders
            SET status = 'processing', updated_at = NOW()
            WHERE id = ${row.order_id} AND status = 'confirmed'
          `;
        }
      }

      return updated;
    });

    return ok(result);
  } catch (error) {
    console.error('Mark sheet printed error:', error);
    return err('Failed to mark sheet as printed', 500);
  }
}
