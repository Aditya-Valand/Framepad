import { cookies } from 'next/headers';
import { sql } from '@/lib/db';
import { verifyAccessToken } from '@/lib/jwt';
import { ok, err } from '@/lib/api';

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value;

  if (!token) return err('Unauthorized', 401);

  let payload: { userId: string; email: string; role: string };
  try {
    payload = verifyAccessToken(token);
  } catch {
    return err('Unauthorized', 401);
  }

  try {
    const rows = await sql`
      SELECT u.id, u.email, u.role, u.created_at,
             p.full_name, p.avatar_url, p.phone
      FROM users u
      LEFT JOIN user_profiles p ON p.user_id = u.id
      WHERE u.id = ${payload.userId}
      LIMIT 1
    `;

    if (!rows.length) return err('User not found', 404);

    const user = rows[0];
    return ok({
      id: user.id,
      email: user.email,
      role: user.role,
      createdAt: user.created_at,
      fullName: user.full_name,
      avatarUrl: user.avatar_url,
      phone: user.phone,
    });
  } catch (e) {
    console.error('[me]', e);
    return err('Something went wrong', 500);
  }
}
