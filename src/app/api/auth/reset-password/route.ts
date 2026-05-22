import bcrypt from 'bcryptjs';
import { sql } from '@/lib/db';
import { resetPasswordSchema } from '@/lib/validations';
import { ok, err } from '@/lib/api';

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return err('Invalid request body', 400);
  }

  const parsed = resetPasswordSchema.safeParse(body);
  if (!parsed.success) {
    return err(parsed.error.issues[0].message, 400);
  }

  const { token, newPassword } = parsed.data;

  try {
    const tokens = await sql`
      SELECT id, user_id, token_hash
      FROM password_reset_tokens
      WHERE used_at IS NULL
        AND expires_at > NOW()
      ORDER BY created_at DESC
    ` as Array<{ id: string; user_id: string; token_hash: string }>;

    let matchedToken: { id: string; user_id: string } | null = null;
    for (const t of tokens) {
      const match = await bcrypt.compare(token, t.token_hash);
      if (match) {
        matchedToken = t;
        break;
      }
    }

    if (!matchedToken) {
      return err('Reset link is invalid or has expired.', 400);
    }

    const newHash = await bcrypt.hash(newPassword, 10);

    await sql`
      UPDATE users SET password_hash = ${newHash}, updated_at = NOW()
      WHERE id = ${matchedToken.user_id}
    `;

    await sql`
      UPDATE password_reset_tokens SET used_at = NOW()
      WHERE id = ${matchedToken.id}
    `;

    // Invalidate all sessions — force re-login everywhere
    await sql`
      DELETE FROM user_sessions WHERE user_id = ${matchedToken.user_id}
    `;

    return ok({ message: 'Password reset successfully. Please sign in.' });
  } catch (e) {
    console.error('[reset-password]', e);
    return err('Something went wrong. Please try again.', 500);
  }
}
