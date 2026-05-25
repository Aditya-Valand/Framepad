import { ok, err, userId } from '@/lib/api';
import { NextRequest } from 'next/server';
import { regenerateSheet } from '@/lib/printSheetGenerator';

// POST /api/admin/print-sheets/[id]/regenerate
// Re-renders the sheet PNG from canvas_state (no Cloudinary upload)
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const adminId = userId(req);
  if (!adminId) return err('Unauthorized', 401);

  const { id: sheetId } = await params;

  try {
    const result = await regenerateSheet(sheetId);

    if (!result.success) {
      return err('Could not regenerate sheet — no items found', 400);
    }

    return ok({
      message: 'Sheet regenerated successfully',
      sheetUrl: result.sheetUrl,
    });
  } catch (error) {
    console.error('Regenerate sheet error:', error);
    return err('Failed to regenerate sheet', 500);
  }
}
