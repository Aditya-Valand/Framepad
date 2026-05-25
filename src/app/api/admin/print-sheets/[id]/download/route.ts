import { sql } from '@/lib/db';
import { err, userId } from '@/lib/api';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

const SHEETS_DIR = path.join(process.cwd(), '.next', 'print-sheets');

// A09 — Download Print Sheet PNG
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
      return err('Sheet image not yet generated', 404);
    }

    const sheetUrl = sheet.sheet_url as string;

    // If it's a local path (starts with /api/admin/print-sheets/download/), serve from disk
    if (sheetUrl.startsWith('/api/admin/print-sheets/download/')) {
      const filename = path.basename(sheetUrl);
      const filepath = path.join(SHEETS_DIR, filename);

      if (!fs.existsSync(filepath)) {
        return err('Sheet file not found on disk', 404);
      }

      const buffer = fs.readFileSync(filepath);
      return new NextResponse(buffer, {
        status: 200,
        headers: {
          'Content-Type': 'image/png',
          'Content-Disposition': `attachment; filename="print-sheet-${id}.png"`,
          'Cache-Control': 'private, max-age=86400',
        },
      });
    }

    // Legacy: redirect to external URL (Cloudinary etc.)
    return Response.redirect(sheetUrl, 302);
  } catch (error) {
    console.error('Download sheet error:', error);
    return err('Failed to download sheet', 500);
  }
}
