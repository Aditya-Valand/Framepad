import { sql } from '@/lib/db';
import { err, userId } from '@/lib/api';
import { NextRequest } from 'next/server';

// A09 — Download Print Sheet PDF/PNG
// GET /api/admin/print-sheets/[id]/download
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const adminId = userId(req);
  if (!adminId) return err('Unauthorized', 401);

  const { id } = await params;

  try {
    const [sheet] = await sql`
      SELECT sheet_url, sheet_number, status
      FROM print_sheets
      WHERE id = ${id}
    `;

    if (!sheet) return err('Sheet not found', 404);

    if (!sheet.sheet_url) {
      return err('Sheet PDF/image not yet generated', 404);
    }

    // Redirect to the sheet URL (Cloudinary or storage URL)
    return Response.redirect(sheet.sheet_url as string, 302);
  } catch (error) {
    console.error('Download sheet error:', error);
    return err('Failed to download sheet', 500);
  }
}
