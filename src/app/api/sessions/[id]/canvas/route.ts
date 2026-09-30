import { ok, err } from '@/lib/api';
import { sql } from '@/lib/db';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let body: { canvasState?: unknown; slot?: string; label?: string; imageUrl?: string };
  try { body = await req.json(); } catch { return err('Invalid JSON', 400); }

  const { canvasState, slot, label, imageUrl } = body;

  if (!slot || !['a', 'b'].includes(slot)) return err('slot must be "a" or "b"', 400);

  // Verify session exists and is active
  const [session] = await sql`
    SELECT id, slot_a_filled, slot_b_filled, status, expires_at
    FROM shared_sessions WHERE id = ${id}`;

  if (!session) return err('Session not found', 404);
  if (session.status !== 'active' || new Date(session.expires_at) < new Date())
    return err('Session expired', 410);

  // Slot B joiner: increment participant count on first join
  const isNewSlotB = slot === 'b' && !session.slot_b_filled;

  if (slot === 'a') {
    await sql`
      UPDATE shared_sessions SET
        canvas_state    = ${JSON.stringify(canvasState ?? {})},
        slot_a_filled   = true,
        slot_a_label    = COALESCE(${label ?? null}, slot_a_label),
        slot_a_image_url= COALESCE(${imageUrl ?? null}, slot_a_image_url),
        updated_at      = NOW()
      WHERE id = ${id}`;
  } else {
    await sql`
      UPDATE shared_sessions SET
        canvas_state       = ${JSON.stringify(canvasState ?? {})},
        slot_b_filled      = true,
        slot_b_label       = COALESCE(${label ?? null}, slot_b_label),
        slot_b_image_url   = COALESCE(${imageUrl ?? null}, slot_b_image_url),
        participant_count  = participant_count + ${isNewSlotB ? 1 : 0},
        updated_at         = NOW()
      WHERE id = ${id}`;
  }

  return ok({ ok: true });
}
