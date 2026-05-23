import { Resend } from 'resend';
import type { ReactElement } from 'react';

let resendClient: Resend | null = null;

function getResend(): Resend {
  if (!resendClient) {
    const key = process.env.RESEND_API_KEY;
    if (!key) throw new Error('RESEND_API_KEY is not set');
    resendClient = new Resend(key);
  }
  return resendClient;
}

export async function sendEmail({
  to,
  subject,
  react,
}: {
  to: string;
  subject: string;
  react: ReactElement;
}) {
  const from = process.env.FROM_EMAIL ?? 'Polamuse <noreply@polamuse.com>';
  const resend = getResend();

  const { error } = await resend.emails.send({ from, to, subject, react });
  if (error) throw new Error(`Email send failed: ${error.message}`);
}
