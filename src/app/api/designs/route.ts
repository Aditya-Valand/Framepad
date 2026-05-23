import { sql } from '@/lib/db';
import { userId, ok, err } from '@/lib/api';

/**
 * GET /api/designs — List user's designs (paginated)
 */
export async function GET(req: Request) {
  const uid = userId(req);
  if (!uid) return err('Unauthorized', 401);

  const url = new URL(req.url);
  const page = Math.max(1, parseInt(url.searchParams.get('page') || '1'));
  const limit = Math.min(50, Math.max(1, parseInt(url.searchParams.get('limit') || '20')));
  const offset = (page - 1) * limit;

  const designs = await sql`
    SELECT id, title, thumbnail_url, canvas_state, frame_style, frame_color,
           template_id, status, has_caption, has_spotify_code,
           filter_preset, created_at, updated_at
    FROM designs
    WHERE user_id = ${uid} AND deleted_at IS NULL
    ORDER BY updated_at DESC
    LIMIT ${limit} OFFSET ${offset}`;

  const [{ count }] = await sql`
    SELECT COUNT(*)::int as count FROM designs
    WHERE user_id = ${uid} AND deleted_at IS NULL`;

  return ok({
    designs,
    pagination: { page, limit, total: count, pages: Math.ceil(count / limit) },
  });
}

/**
 * POST /api/designs — Create new design
 */
export async function POST(req: Request) {
  const uid = userId(req);
  if (!uid) return err('Unauthorized', 401);

  const body = await req.json();
  const { canvasState, title, templateId } = body;

  if (!canvasState || !canvasState.frameData) {
    return err('Invalid canvas state', 400);
  }

  const frameData = canvasState.frameData;

  // template_id in DB is UUID FK — if we get a slug string, store null
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  const dbTemplateId = templateId && isUuid.test(templateId) ? templateId : null;

  try {
    const [design] = await sql`
      INSERT INTO designs (
        user_id, template_id, title, canvas_state,
        frame_style, frame_color, has_caption, caption_text,
        has_top_label, top_label_text, has_spotify_code, spotify_uri,
        filter_preset, status
      ) VALUES (
        ${uid}, ${dbTemplateId}, ${title || 'Untitled'},
        ${JSON.stringify(canvasState)},
        ${frameData.frameStyle || 'classic'}, ${frameData.frameColor || '#FFFFFF'},
        ${!!frameData.bottomCaptionText}, ${frameData.bottomCaptionText || null},
        ${!!frameData.topLabelText}, ${frameData.topLabelText || null},
        ${!!frameData.musicUrl}, ${frameData.musicUrl || null},
        ${detectFilterPreset(frameData.filters)}, 'draft'
      ) RETURNING id, created_at`;

    // Save initial version
    await sql`
      INSERT INTO design_versions (design_id, version_number, canvas_state)
      VALUES (${design.id}, 1, ${JSON.stringify(canvasState)})`;

    // Increment user's design counter (ignore if profile doesn't exist)
    await sql`
      UPDATE user_profiles SET total_designs = total_designs + 1
      WHERE user_id = ${uid}`;

    return ok({ id: design.id, created_at: design.created_at }, 201);
  } catch (e: unknown) {
    console.error('[POST /api/designs]', e);
    return err('Failed to save design', 500);
  }
}

/**
 * Detect which filter preset matches the current filter values
 */
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
  for (const [name, preset] of Object.entries(presets)) {
    if (
      filters.brightness === preset.brightness &&
      filters.contrast === preset.contrast &&
      filters.saturation === preset.saturation &&
      filters.warmth === preset.warmth
    ) {
      return name;
    }
  }
  return 'custom';
}
