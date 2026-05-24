import { sql } from '@/lib/db';
import { ok, err, userId } from '@/lib/api';
import { NextRequest } from 'next/server';

// A10 — Mark Sheet Sent to Print Shop
// PUT /api/admin/print-sheets/[id]/sent
// Body: { printShopName: string }
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const adminId = userId(req);
  if (!adminId) return err('Unauthorized', 401);

  const { id } = await params;
  const body = await req.json();
  const { printShopName } = body as { printShopName?: string };

  if (!printShopName || !printShopName.trim()) {
    return err('Print shop name is required', 400);
  }

  try {
    const [sheet] = await sql`
      SELECT id, status FROM print_sheets WHERE id = ${id}
    `;

    if (!sheet) return err('Sheet not found', 404);

    if (sheet.status !== 'generated' && sheet.status !== 'ready') {
      return err(`Cannot mark as sent — current status is "${sheet.status}"`, 400);
    }

    const [updated] = await sql`
      UPDATE print_sheets
      SET status = 'sent',
          sent_to_shop_at = NOW(),
          print_shop_name = ${printShopName.trim()},
          updated_at = NOW()
      WHERE id = ${id}
      RETURNING id, sheet_number, status, sent_to_shop_at, print_shop_name
    `;

    return ok(updated);
  } catch (error) {
    console.error('Mark sheet sent error:', error);
    return err('Failed to mark sheet as sent', 500);
  }
}
