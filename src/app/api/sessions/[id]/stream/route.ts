import { sql } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const send = (data: unknown) => {
        try {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
        } catch {
          // Client disconnected
        }
      };

      // Send initial state immediately
      try {
        const [session] = await sql`
          SELECT canvas_state, slot_a_filled, slot_b_filled,
                 slot_a_label, slot_b_label, slot_a_image_url, slot_b_image_url,
                 status, expires_at, updated_at
          FROM shared_sessions WHERE id = ${id}`;

        if (!session) {
          send({ error: 'not_found' });
          controller.close();
          return;
        }
        send(session);
      } catch {
        send({ error: 'db_error' });
        controller.close();
        return;
      }

      // Poll every 3 seconds — SSE keeps the connection alive
      let lastUpdatedAt = '';
      const interval = setInterval(async () => {
        try {
          const [session] = await sql`
            SELECT canvas_state, slot_a_filled, slot_b_filled,
                   slot_a_label, slot_b_label, slot_a_image_url, slot_b_image_url,
                   status, expires_at, updated_at
            FROM shared_sessions WHERE id = ${id}`;

          if (!session) { clearInterval(interval); controller.close(); return; }

          const ua = String(session.updated_at);
          if (ua !== lastUpdatedAt) {
            lastUpdatedAt = ua;
            send(session);
          }

          if (session.status !== 'active' || new Date(session.expires_at) < new Date()) {
            send({ status: 'expired' });
            clearInterval(interval);
            controller.close();
          }
        } catch {
          // DB hiccup — keep polling
        }
      }, 3000);

      // Clean up when client disconnects (best-effort via AbortSignal is not available in ReadableStream start)
      // The interval will be GC'd when the stream is closed by Next.js timeout or client disconnect
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type':  'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection:      'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  });
}
