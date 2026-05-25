import { ok, err, userId } from '@/lib/api';
import { generatePrintSheets } from '@/lib/printSheetGenerator';
import { NextRequest } from 'next/server';

// A08 — Generate Print Sheets (SFFD bin-packing algorithm)
// POST /api/admin/print-sheets/generate
// Body: { finish?: 'glossy' | 'matte', all?: true }
export async function POST(req: NextRequest) {
  const adminId = userId(req);
  if (!adminId) return err('Unauthorized', 401);

  const body = await req.json().catch(() => ({}));
  const { finish, finish_slug, all } = body as {
    finish?: 'glossy' | 'matte';
    finish_slug?: string;
    all?: boolean;
  };

  // Support both old API shape (finish_slug) and new shape (finish)
  const finishFilter = finish || (finish_slug as 'glossy' | 'matte' | undefined);

  try {
    const result = await generatePrintSheets(
      all ? undefined : finishFilter
    );

    return ok({
      sheetsCreated: result.totalSheets,
      itemsPlaced: result.itemsPlaced,
      areaSavedPct: result.areaSavedPct,
      sheets: result.sheets,
      message: result.totalSheets === 0
        ? 'No pending items to batch'
        : `Generated ${result.totalSheets} sheet(s) with SFFD packing — ${result.areaSavedPct}% paper saved`,
    });
  } catch (error) {
    console.error('Generate sheets error:', error);
    return err('Failed to generate sheets', 500);
  }
}
