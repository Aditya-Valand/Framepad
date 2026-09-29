import { sql } from '@/lib/db';
import { ok, err, userId } from '@/lib/api';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id: designId } = await params;
  const uid = userId(req);
  if (!uid) return err('Unauthorized', 401);

  const [design] = await sql`
    SELECT id, export_url FROM designs
    WHERE id = ${designId} AND deleted_at IS NULL
  ` as Array<{ id: string; export_url: string | null }>;
  if (!design) return err('Design not found', 404);

  const [unlock] = await sql`
    SELECT id FROM design_unlocks WHERE design_id = ${designId}
  `;

  return ok({
    design_id: designId,
    is_unlocked: !!unlock,
    export_url: design.export_url,
  });
}
