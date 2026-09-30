import { ok, err } from '@/lib/api';
import { sql } from '@/lib/db';

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const [session] = await sql`
    SELECT
      id,
      canvas_state,
      slot_a_filled,
      slot_b_filled,
      slot_a_label,
      slot_b_label,
      slot_a_image_url,
      slot_b_image_url,
      participant_count,
      status,
      expires_at,
      updated_at
    FROM shared_sessions
    WHERE id = ${id}`;

  if (!session) return err('Session not found', 404);
  if (session.status === 'expired' || new Date(session.expires_at) < new Date())
    return err('Session expired', 410);

  return ok({ session });
}
