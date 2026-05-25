import { sql } from '@/lib/db';
import { userId, ok, err } from '@/lib/api';

/**
 * GET /api/designs/[id] — Fetch a single design
 */
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const uid = userId(req);
  if (!uid) return err('Unauthorized', 401);

  const { id } = await params;

  const [design] = await sql`
    SELECT id, title, canvas_state, thumbnail_url, export_url,
           template_id, frame_style, frame_color, status,
           created_at, updated_at
    FROM designs
    WHERE id = ${id} AND user_id = ${uid} AND deleted_at IS NULL`;

  if (!design) return err('Design not found', 404);

  return ok({ design });
}

/**
 * PUT /api/designs/[id] — Update a design's canvas state
 */
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const uid = userId(req);
  if (!uid) return err('Unauthorized', 401);

  const { id } = await params;
  const body = await req.json();
  const { canvasState, title } = body;

  if (!canvasState?.frameData) {
    return err('Invalid canvas state', 400);
  }

  const frameData = canvasState.frameData;

  const [design] = await sql`
    UPDATE designs SET
      canvas_state = ${JSON.stringify(canvasState)},
      title = COALESCE(${title || null}, title),
      frame_style = ${frameData.frameStyle || 'classic'},
      frame_color = ${frameData.frameColor || '#FFFFFF'},
      has_caption = ${!!frameData.bottomCaptionText},
      caption_text = ${frameData.bottomCaptionText || null},
      has_top_label = ${!!frameData.topLabelText},
      top_label_text = ${frameData.topLabelText || null},
      has_spotify_code = ${!!frameData.musicUrl},
      spotify_uri = ${frameData.musicUrl || null},
      updated_at = NOW()
    WHERE id = ${id} AND user_id = ${uid} AND deleted_at IS NULL
    RETURNING id, updated_at`;

  if (!design) return err('Design not found', 404);

  return ok({ id: design.id, updated_at: design.updated_at });
}

/**
 * DELETE /api/designs/[id] — Soft-delete a design
 */
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const uid = userId(req);
  if (!uid) return err('Unauthorized', 401);

  const { id } = await params;

  const [design] = await sql`
    UPDATE designs SET deleted_at = NOW(), updated_at = NOW()
    WHERE id = ${id} AND user_id = ${uid} AND deleted_at IS NULL
    RETURNING id`;

  if (!design) return err('Design not found', 404);

  return ok({ deleted: true });
}
