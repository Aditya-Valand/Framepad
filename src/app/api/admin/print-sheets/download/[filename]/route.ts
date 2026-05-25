import { err, userId } from '@/lib/api';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

const SHEETS_DIR = path.join(process.cwd(), '.next', 'print-sheets');

// GET /api/admin/print-sheets/download/[filename]
// Serves locally stored print sheet PNGs
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  const adminId = userId(req);
  if (!adminId) return err('Unauthorized', 401);

  const { filename } = await params;

  // Sanitize filename to prevent path traversal
  const sanitized = path.basename(filename);
  if (sanitized !== filename || filename.includes('..')) {
    return err('Invalid filename', 400);
  }

  const filepath = path.join(SHEETS_DIR, sanitized);

  if (!fs.existsSync(filepath)) {
    return err('Sheet file not found', 404);
  }

  const buffer = fs.readFileSync(filepath);

  return new NextResponse(buffer, {
    status: 200,
    headers: {
      'Content-Type': 'image/png',
      'Content-Disposition': `inline; filename="${sanitized}"`,
      'Cache-Control': 'private, max-age=86400',
    },
  });
}
