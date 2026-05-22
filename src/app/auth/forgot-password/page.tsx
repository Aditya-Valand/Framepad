'use client';

import { useState } from 'react';
import Link from 'next/link';
import Logo from '@/components/ui/Logo';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) {
      setError('Enter a valid email address.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });
      if (!res.ok) {
        const data = await res.json() as { error?: string };
        setError(data.error ?? 'Something went wrong.');
      } else {
        setSent(true);
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

        {sent ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>✉️</div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 32, fontWeight: 300, fontStyle: 'italic', marginBottom: 12 }}>
              Check your inbox.
            </h2>
            <p style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.6, marginBottom: 32 }}>
              If <strong>{email}</strong> is registered, we&apos;ve sent a password reset link.
              It expires in 15 minutes.
            </p>
            <Link href="/auth" style={{ color: 'var(--brown)', fontSize: 14, textDecoration: 'none', fontWeight: 500 }}>
              ← Back to sign in
            </Link>
          </div>
        ) : (
          <>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 38, fontWeight: 300, fontStyle: 'italic', marginBottom: 8, lineHeight: 1.1 }}>
              Forgot password?
            </h1>
            <p style={{ fontSize: 14, fontWeight: 300, color: 'var(--text-2)', marginBottom: 36, lineHeight: 1.5 }}>
              Enter your email and we&apos;ll send a reset link.
            </p>

            <form onSubmit={handleSubmit} noValidate>
              <div style={{ position: 'relative', marginBottom: 28 }}>
                <input
                  type="email"
                  placeholder=" "
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(''); }}
                  autoComplete="email"
                  style={{
                    width: '100%',
                    background: 'transparent',
                    border: 'none',
                    borderBottom: error ? '.5px solid #c03c3c' : '.5px solid var(--text-3)',
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 14,
                    color: 'var(--text)',
                    padding: '18px 0 8px',
                    outline: 'none',
                    boxSizing: 'border-box',
                    transition: 'border-color .25s ease',
                  }}
                />
                <label style={{ position: 'absolute', left: 0, top: email ? 0 : 18, fontSize: email ? 11 : 14, color: 'var(--text-3)', pointerEvents: 'none', transition: 'all .2s ease', textTransform: email ? 'uppercase' : 'none', letterSpacing: email ? '.06em' : 'normal', fontFamily: email ? "'DM Mono', monospace" : "'DM Sans', sans-serif" }}>
                  Email address
                </label>
              </div>

              {error && (
                <div style={{ padding: '10px 14px', borderRadius: 8, background: 'rgba(200,60,60,0.07)', border: '0.5px solid rgba(200,60,60,0.2)', marginBottom: 20 }}>
                  <p style={{ fontSize: 13, color: '#c03c3c', margin: 0 }}>{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                style={{ width: '100%', background: 'var(--brown)', color: '#fff', border: 'none', borderRadius: 100, height: 48, fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: loading ? 0.7 : 1, transition: 'opacity .2s' }}
              >
                {loading ? (
                  <span style={{ width: 18, height: 18, border: '1.5px solid rgba(255,255,255,.35)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin .8s linear infinite' }} />
                ) : (
                  <><span>Send reset link</span><span>→</span></>
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
