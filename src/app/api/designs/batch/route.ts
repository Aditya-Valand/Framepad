import { sql } from '@/lib/db';
import { userId, ok, err } from '@/lib/api';

/**
 * POST /api/designs/batch — Bulk-create designs (up to 20)
 * Used by the batch export "Save All to My Designs" feature.
 */
export async function POST(req: Request) {
  const uid = userId(req);
  if (!uid) return err('Unauthorized', 401);

  const body = await req.json();
  const { designs } = body;

  if (!Array.isArray(designs) || designs.length === 0 || designs.length > 20) {
    return err('1-20 designs required', 400);
  }

  const ids: string[] = [];

  for (const d of designs) {
    const canvasState = d.canvas_state;
    const frameData = canvasState?.frameData;
    if (!frameData) continue;

    try {
      const [design] = await sql`
        INSERT INTO designs (
          user_id, title, canvas_state,
          frame_style, frame_color, has_caption, caption_text,
          has_top_label, top_label_text, has_spotify_code, spotify_uri,
          filter_preset, status, source
        ) VALUES (
          ${uid}, ${d.title || 'Batch design'},
          ${JSON.stringify(canvasState)},
          ${frameData.frameStyle || 'classic'}, ${frameData.frameColor || '#FFFFFF'},
          ${!!frameData.bottomCaptionText}, ${frameData.bottomCaptionText || null},
          ${!!frameData.topLabelText}, ${frameData.topLabelText || null},
          ${!!frameData.musicUrl}, ${frameData.musicUrl || null},
          ${detectFilterPreset(frameData.filters)}, 'draft', 'batch'
        ) RETURNING id`;

      ids.push(design.id);
    } catch (e) {
      console.error('[POST /api/designs/batch] item error:', e);
    }
  }

  // Increment user's design counter
  if (ids.length > 0) {
    await sql`
      UPDATE user_profiles SET total_designs = total_designs + ${ids.length}
      WHERE user_id = ${uid}`;
  }

  return ok({ created: ids.length, ids }, 201);
}

function detectFilterPreset(filters: { brightness: number; contrast: number; saturation: number; warmth: number } | undefined): string {
  if (!filters) return 'none';
  const presets: Record<string, { brightness: number; contrast: number; saturation: number; warmth: number }> = {
    none: { brightness: 0, contrast: 0, saturation: 0, warmth: 0 },
    vintage: { brightness: 10, contrast: -5, saturation: -20, warmth: 30 },
    film: { brightness: 5, contrast: 10, saturation: -10, warmth: 10 },
    sepia: { brightness: 0, contrast: 5, saturation: -80, warmth: 40 },
    bw: { brightness: 0, contrast: 10, saturation: -100, warmth: 0 },
    faded: { brightness: 20, contrast: -20, saturation: -30, warmth: 5 },
  };
  for (const [name, vals] of Object.entries(presets)) {
    if (filters.brightness === vals.brightness && filters.contrast === vals.contrast &&
        filters.saturation === vals.saturation && filters.warmth === vals.warmth) {
      return name;
    }
  }
  return 'custom';
}
