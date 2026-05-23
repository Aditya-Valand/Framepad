'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Logo from '@/components/ui/Logo';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') ?? '';

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [reveal, setReveal] = useState(false);

  const strength = (() => {
    if (password.length >= 10 && /[A-Z]/.test(password) && /[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password)) return 3;
    if (password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password)) return 2;
    if (password.length >= 6) return 1;
    return 0;
  })();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!token) { setError('Reset link is invalid. Please request a new one.'); return; }
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    if (password !== confirm) { setError('Passwords do not match.'); return; }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword: password }),
      });
      const data = await res.json() as { error?: string };
      if (!res.ok) {
        setError(data.error ?? 'Something went wrong.');
      } else {
        setSuccess(true);
        setTimeout(() => router.push('/auth'), 2500);
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--cream)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      fontFamily: "'DM Sans', sans-serif",
    }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        <div style={{ marginBottom: 40, display: 'flex', justifyContent: 'center' }}>
          <Logo />
        </div>

        {success ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 32, marginBottom: 16 }}>✓</div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 300, fontStyle: 'italic', marginBottom: 12 }}>
              Password updated.
            </h2>
            <p style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.6 }}>
              Redirecting you to sign in…
            </p>
          </div>
        ) : (
          <>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 38, fontWeight: 300, fontStyle: 'italic', marginBottom: 8, lineHeight: 1.1 }}>
              New password.
            </h1>
            <p style={{ fontSize: 14, fontWeight: 300, color: 'var(--text-2)', marginBottom: 36, lineHeight: 1.5 }}>
              Choose something strong and memorable.
            </p>

            {!token && (
              <div style={{ padding: '12px 16px', borderRadius: 10, background: 'rgba(200,60,60,0.07)', border: '0.5px solid rgba(200,60,60,0.2)', marginBottom: 24 }}>
                <p style={{ fontSize: 13, color: '#c03c3c', margin: 0 }}>
                  Reset link is missing or invalid. Please{' '}
                  <Link href="/auth/forgot-password" style={{ color: 'var(--brown)' }}>request a new one</Link>.
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              {/* Password field */}
              <div style={{ position: 'relative', marginBottom: 22 }}>
                <input
                  type={reveal ? 'text' : 'password'}
                  placeholder=" "
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(''); }}
                  autoComplete="new-password"
                  style={{
                    width: '100%',
                    background: 'transparent',
                    border: 'none',
                    borderBottom: '.5px solid var(--text-3)',
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 14,
                    color: 'var(--text)',
                    padding: '18px 36px 8px 0',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
                <label style={{ position: 'absolute', left: 0, top: password ? 0 : 18, fontSize: password ? 11 : 14, color: 'var(--text-3)', pointerEvents: 'none', transition: 'all .2s ease', textTransform: password ? 'uppercase' : 'none', letterSpacing: password ? '.06em' : 'normal', fontFamily: password ? "'DM Mono', monospace" : "'DM Sans', sans-serif" }}>
                  New password
                </label>
                <button type="button" onClick={() => setReveal(!reveal)} style={{ position: 'absolute', right: 0, top: 18, background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-3)', padding: 4 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
                    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" />
                  </svg>
                </button>
                {/* Strength dots */}
                <div style={{ display: 'flex', gap: 5, marginTop: 8 }}>
                  {[0, 1, 2].map((i) => (
                    <i key={i} style={{ height: 3, flex: 1, background: i < strength ? 'var(--brown)' : 'rgba(26,23,20,.08)', borderRadius: 2, transition: 'background .25s ease', fontStyle: 'normal' }} />
                  ))}
                </div>
              </div>

              {/* Confirm field */}
              <div style={{ position: 'relative', marginBottom: 28 }}>
                <input
                  type="password"
                  placeholder=" "
                  value={confirm}
                  onChange={(e) => { setConfirm(e.target.value); setError(''); }}
                  autoComplete="new-password"
                  style={{
                    width: '100%',
                    background: 'transparent',
                    border: 'none',
                    borderBottom: '.5px solid var(--text-3)',
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 14,
                    color: 'var(--text)',
                    padding: '18px 0 8px',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
                <label style={{ position: 'absolute', left: 0, top: confirm ? 0 : 18, fontSize: confirm ? 11 : 14, color: 'var(--text-3)', pointerEvents: 'none', transition: 'all .2s ease', textTransform: confirm ? 'uppercase' : 'none', letterSpacing: confirm ? '.06em' : 'normal', fontFamily: confirm ? "'DM Mono', monospace" : "'DM Sans', sans-serif" }}>
                  Confirm password
                </label>
              </div>

              {error && (
                <div style={{ padding: '10px 14px', borderRadius: 8, background: 'rgba(200,60,60,0.07)', border: '0.5px solid rgba(200,60,60,0.2)', marginBottom: 20 }}>
                  <p style={{ fontSize: 13, color: '#c03c3c', margin: 0 }}>{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !token}
                style={{ width: '100%', background: 'var(--brown)', color: '#fff', border: 'none', borderRadius: 100, height: 48, fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: loading || !token ? 0.7 : 1, transition: 'opacity .2s' }}
              >
                {loading ? (
                  <span style={{ width: 18, height: 18, border: '1.5px solid rgba(255,255,255,.35)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin .8s linear infinite' }} />
                ) : (
                  <><span>Set new password</span><span>→</span></>
                )}
              </button>
            </form>

            <p style={{ marginTop: 28, fontSize: 13, color: 'var(--text-2)', textAlign: 'center' }}>
              <Link href="/auth" style={{ color: 'var(--brown)', textDecoration: 'none' }}>← Back to sign in</Link>
            </p>
          </>
        )}
      </div>

      <style jsx>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  );
}
