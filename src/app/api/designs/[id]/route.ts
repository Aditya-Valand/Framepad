import { sql } from '@/lib/db';
import { userId, ok, err } from '@/lib/api';

/**
 * GET /api/designs/[id] — Get single design with full canvas_state
 */
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const uid = userId(req);
  if (!uid) return err('Unauthorized', 401);

  const { id } = await params;

  const [design] = await sql`
    SELECT id, user_id, title, canvas_state, thumbnail_url,
           template_id, frame_style, frame_color, status,
           has_caption, caption_text, has_spotify_code, spotify_uri,
           filter_preset, created_at, updated_at
    FROM designs
    WHERE id = ${id} AND deleted_at IS NULL`;

  if (!design) return err('Design not found', 404);
  if (design.user_id !== uid) return err('Forbidden', 403);

  return ok(design);
}

/**
 * PUT /api/designs/[id] — Update design (auto-save or manual save)
 */
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const uid = userId(req);
  if (!uid) return err('Unauthorized', 401);

  const { id } = await params;
  const body = await req.json();
  const { canvasState, title, thumbnailUrl } = body;

  // Verify ownership
  const [existing] = await sql`
    SELECT id, user_id FROM designs WHERE id = ${id} AND deleted_at IS NULL`;

  if (!existing) return err('Design not found', 404);
  if (existing.user_id !== uid) return err('Forbidden', 403);

  const frameData = canvasState?.frameData;

  // Update design
  if (canvasState) {
    await sql`
      UPDATE designs SET
        canvas_state = ${JSON.stringify(canvasState)},
        title = COALESCE(${title || null}, title),
        thumbnail_url = COALESCE(${thumbnailUrl || null}, thumbnail_url),
        frame_style = COALESCE(${frameData?.frameStyle || null}, frame_style),
        frame_color = COALESCE(${frameData?.frameColor || null}, frame_color),
        has_caption = COALESCE(${frameData ? !!frameData.bottomCaptionText : null}, has_caption),
        caption_text = COALESCE(${frameData?.bottomCaptionText || null}, caption_text),
        has_top_label = COALESCE(${frameData ? !!frameData.topLabelText : null}, has_top_label),
        top_label_text = COALESCE(${frameData?.topLabelText || null}, top_label_text),
        has_spotify_code = COALESCE(${frameData ? !!frameData.musicUrl : null}, has_spotify_code),
        spotify_uri = COALESCE(${frameData?.musicUrl || null}, spotify_uri),
        updated_at = NOW()
      WHERE id = ${id}`;

    // Save version (increment)
    await sql`
      INSERT INTO design_versions (design_id, version_number, canvas_state)
      SELECT ${id}, COALESCE(MAX(version_number), 0) + 1, ${JSON.stringify(canvasState)}
      FROM design_versions WHERE design_id = ${id}`;
  } else {
    // Partial update (e.g. just thumbnail or title)
    await sql`
      UPDATE designs SET
        title = COALESCE(${title || null}, title),
        thumbnail_url = COALESCE(${thumbnailUrl || null}, thumbnail_url),
        updated_at = NOW()
      WHERE id = ${id}`;
  }

  return ok({ id, updated_at: new Date().toISOString() });
}

/**
 * DELETE /api/designs/[id] — Soft-delete design
 */
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const uid = userId(req);
  if (!uid) return err('Unauthorized', 401);

  const { id } = await params;

  // Verify ownership
  const [existing] = await sql`
    SELECT id, user_id FROM designs WHERE id = ${id} AND deleted_at IS NULL`;

  if (!existing) return err('Design not found', 404);
  if (existing.user_id !== uid) return err('Forbidden', 403);

  // Check for active orders
  const [activeOrder] = await sql`
    SELECT oi.id FROM order_items oi
    JOIN orders o ON o.id = oi.order_id
    WHERE oi.design_id = ${id}
    AND o.status NOT IN ('delivered', 'cancelled', 'refunded')
    LIMIT 1`;

  if (activeOrder) {
    return err('Cannot delete design with active orders', 409);
  }

  await sql`UPDATE designs SET deleted_at = NOW() WHERE id = ${id}`;

  return ok({ deleted: true });
}
