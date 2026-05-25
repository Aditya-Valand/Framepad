import { sql } from '@/lib/db';
import { ok, err, userId as getUserId, assertNotBanned } from '@/lib/api';
import { z } from 'zod';

export async function GET(req: Request) {
  const uid = getUserId(req);
  if (!uid) return err('Unauthorized', 401);

  try {
    const rows = await sql`
      SELECT u.id, u.email, u.role, u.created_at,
             p.full_name, p.avatar_url, p.phone, p.city, p.state,
             p.total_designs, p.total_orders, p.total_spent_paise,
             p.email_marketing, p.preferred_finish
      FROM users u
      LEFT JOIN user_profiles p ON p.user_id = u.id
      WHERE u.id = ${uid} LIMIT 1
    `;
    if (!rows.length) return err('Not found', 404);
    const r = rows[0];
    return ok({
      id: r.id, email: r.email, role: r.role, createdAt: r.created_at,
      fullName: r.full_name, avatarUrl: r.avatar_url, phone: r.phone,
      city: r.city, state: r.state,
      totalDesigns: r.total_designs ?? 0,
      totalOrders: r.total_orders ?? 0,
      totalSpentPaise: r.total_spent_paise ?? 0,
      emailMarketing: r.email_marketing ?? true,
      preferredFinish: r.preferred_finish ?? 'glossy',
    });
  } catch (e) {
    console.error('[account/profile GET]', e);
    return err('Something went wrong', 500);
  }
}

const updateSchema = z.object({
  fullName: z.string().min(2).max(100).optional(),
  phone: z.string().max(20).optional(),
  city: z.string().max(100).optional(),
  state: z.string().max(100).optional(),
  emailMarketing: z.boolean().optional(),
  preferredFinish: z.enum(['glossy', 'matte']).optional(),
});

export async function PUT(req: Request) {
  const uid = getUserId(req);
  if (!uid) return err('Unauthorized', 401);

  const banned = await assertNotBanned(req);
  if (banned) return banned;

  let body: unknown;
  try { body = await req.json(); } catch { return err('Invalid body', 400); }

  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) return err(parsed.error.issues[0].message, 400);

  const { fullName, phone, city, state, emailMarketing, preferredFinish } = parsed.data;

  try {
    await sql`
      UPDATE user_profiles SET
        full_name        = COALESCE(${fullName ?? null}, full_name),
        phone            = COALESCE(${phone ?? null}, phone),
        city             = COALESCE(${city ?? null}, city),
        state            = COALESCE(${state ?? null}, state),
        email_marketing  = COALESCE(${emailMarketing ?? null}, email_marketing),
        preferred_finish = COALESCE(${preferredFinish ?? null}, preferred_finish),
        updated_at       = NOW()
      WHERE user_id = ${uid}
    `;
    return ok({ success: true });
  } catch (e) {
    console.error('[account/profile PUT]', e);
    return err('Something went wrong', 500);
  }
}
