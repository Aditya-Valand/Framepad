import { sql } from '@/lib/db';
import { ok, err, userId } from '@/lib/api';
import { NextRequest } from 'next/server';

// A06 — Internal Notes
// PUT /api/admin/orders/:id/notes
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const adminId = userId(req);
  if (!adminId) return err('Unauthorized', 401);

  const { id } = await params;

  try {
    const body = await req.json();
    const { internalNotes } = body;

    if (typeof internalNotes !== 'string') {
      return err('internalNotes must be a string', 400);
    }

    // Verify order exists
    const [order] = await sql`SELECT id FROM orders WHERE id = ${id}`;
    if (!order) return err('Order not found', 404);

    // Update internal notes
    await sql`
      UPDATE orders
      SET internal_notes = ${internalNotes || null}, updated_at = NOW()
      WHERE id = ${id}
    `;

    // Log admin action
    await sql`
      INSERT INTO admin_activity_logs (admin_user_id, action, entity_type, entity_id, new_value)
      VALUES (
        ${adminId},
        'order.notes_updated',
        'order',
        ${id},
        ${JSON.stringify({ internalNotes: internalNotes.substring(0, 100) })}
      )
    `;

    return ok({ success: true });
  } catch (error) {
    console.error('Admin update notes error:', error);
    return err('Failed to update internal notes', 500);
  }
}
