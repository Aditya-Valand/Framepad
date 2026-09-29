import { sql } from '@/lib/db';
import { ok, err, userId } from '@/lib/api';

export async function GET(req: Request) {
  const uid = userId(req);
  if (!uid) return err('Unauthorized', 401);

  const url = new URL(req.url);
  const page  = Math.max(1, parseInt(url.searchParams.get('page')  ?? '1'));
  const limit = Math.min(50, Math.max(1, parseInt(url.searchParams.get('limit') ?? '20')));
  const offset = (page - 1) * limit;

  const [{ total }] = await sql`
    SELECT COUNT(*)::int AS total FROM coin_ledger WHERE user_id = ${uid}
  ` as Array<{ total: number }>;

  const entries = await sql`
    SELECT id, delta, reason, reference_id, created_at
    FROM coin_ledger
    WHERE user_id = ${uid}
    ORDER BY created_at DESC
    LIMIT ${limit} OFFSET ${offset}
  `;

  return ok({
    entries,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  });
}
