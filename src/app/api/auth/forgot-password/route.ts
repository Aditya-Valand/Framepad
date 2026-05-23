import bcrypt from 'bcryptjs';
import { sql } from '@/lib/db';
import { sendEmail } from '@/lib/resend';
import { forgotPasswordSchema } from '@/lib/validations';
import { ok, err } from '@/lib/api';
import { PasswordResetEmail } from '@/components/emails/PasswordReset';
import { createElement } from 'react';

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return err('Invalid request body', 400);
  }

  const parsed = forgotPasswordSchema.safeParse(body);
  if (!parsed.success) {
    return err(parsed.error.issues[0].message, 400);
  }

  const { email } = parsed.data;
  const normalizedEmail = email.toLowerCase().trim();

  // Always return 200 to prevent user enumeration
  try {
    const users = await sql`
      SELECT id FROM users WHERE email = ${normalizedEmail} LIMIT 1
    `;

    if (users.length === 0) {
      return ok({ message: 'If that email is registered, a reset link has been sent.' });
    }

    const userId = users[0].id;
    const token = crypto.randomUUID();
    const tokenHash = await bcrypt.hash(token, 8);
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Invalidate any existing unused tokens for this user
    await sql`
      UPDATE password_reset_tokens
      SET used_at = NOW()
      WHERE user_id = ${userId} AND used_at IS NULL
    `;

    await sql`
      INSERT INTO password_reset_tokens (user_id, token_hash, expires_at)
      VALUES (${userId}, ${tokenHash}, ${expiresAt})
    `;

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000';
    const resetUrl = `${baseUrl}/auth/reset-password?token=${token}`;

    await sendEmail({
      to: normalizedEmail,
      subject: 'Reset your Polamuse password',
      react: createElement(PasswordResetEmail, { resetUrl, expiresInMinutes: 15 }),
    });
  } catch (e) {
    console.error('[forgot-password]', e);
    // Still return 200 to not leak info
  }

  return ok({ message: 'If that email is registered, a reset link has been sent.' });
}
