'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCoins } from '@/hooks/useCoins';
import { useAuth } from '@/hooks/useAuth';
import { COIN_COSTS } from '@/lib/coin-constants';

export default function NewSharedSessionPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { balance, loading: coinsLoading } = useCoins();
  const [label, setLabel]       = useState('');
  const [creating, setCreating] = useState(false);
  const [error, setError]       = useState('');

  const cost = COIN_COSTS.canvas;
  const canAfford = balance !== null && balance >= cost;

  async function handleCreate() {
    setError('');
    setCreating(true);
    try {
      const res = await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ label: label.trim() || (user?.email?.split('@')[0] ?? 'Creator') }),
      });
      const data = await res.json() as { sessionId?: string; error?: string };
      if (!res.ok) { setError(data.error ?? 'Failed to create session'); return; }
      router.push(`/editor/shared/${data.sessionId}`);
    } catch {
      setError('Network error — please retry');
    } finally {
      setCreating(false);
    }
  }

  return (
    <div style={{ minHeight: '100dvh', background: '#EDE6DC', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 420, background: '#FFFCF8', borderRadius: 20, padding: '32px 28px', boxShadow: '0 4px 32px rgba(26,23,20,0.08)', border: '0.5px solid rgba(26,23,20,0.08)' }}>

        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: 26, fontWeight: 500, color: '#1A1714', margin: 0 }}>
            Shared Canvas
          </h1>
          <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 13, color: '#A39080', marginTop: 6, lineHeight: 1.5 }}>
            Share a link with a friend. Each person adds their own photo. Live synced for 48 hours.
          </p>
        </div>

        {/* Coin cost */}
        <div style={{ background: 'rgba(139,111,92,0.06)', border: '0.5px solid rgba(139,111,92,0.15)', borderRadius: 10, padding: '12px 14px', marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 13, color: '#5C4A3A' }}>Cost per session</span>
          <span style={{ fontFamily: '"DM Mono", monospace', fontSize: 14, fontWeight: 600, color: '#8B6F5C' }}>🪙 {cost} coins</span>
        </div>

        {/* Balance */}
        {!coinsLoading && (
          <div style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 12, color: canAfford ? '#2D7A4F' : '#B03030', marginBottom: 16 }}>
            Your balance: 🪙 {balance ?? 0} coins
            {!canAfford && (
              <a href="/account/coins" style={{ marginLeft: 8, color: '#8B6F5C', textDecoration: 'underline' }}>Get more</a>
            )}
          </div>
        )}

        {/* Name input */}
        {user && (
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 12, color: '#A39080', display: 'block', marginBottom: 6 }}>
              Your name in this session
            </label>
            <input
              type="text"
              placeholder={user.email?.split('@')[0] ?? 'Your name'}
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              maxLength={50}
              style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '0.5px solid rgba(26,23,20,0.12)', background: 'rgba(26,23,20,0.02)', fontFamily: '"DM Sans", sans-serif', fontSize: 14, color: '#1A1714', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>
        )}

        {/* Error */}
        {error && (
          <div style={{ background: 'rgba(200,60,60,0.07)', border: '0.5px solid rgba(200,60,60,0.2)', borderRadius: 8, padding: '10px 14px', marginBottom: 16, color: '#B03030', fontFamily: '"DM Sans", sans-serif', fontSize: 13 }}>
            {error}
          </div>
        )}

        {/* Action */}
        {!user && !authLoading ? (
          <a href="/auth?redirect=/editor/shared/new" style={{ display: 'block', textAlign: 'center', padding: '12px 20px', borderRadius: 100, background: '#8B6F5C', color: '#fff', fontFamily: '"DM Sans", sans-serif', fontSize: 13, fontWeight: 500, textDecoration: 'none' }}>
            Sign in to start
          </a>
        ) : (
          <button
            onClick={handleCreate}
            disabled={creating || !canAfford || coinsLoading}
            style={{
              width: '100%', padding: '13px 20px', borderRadius: 100, border: 'none',
              background: canAfford && !creating ? '#8B6F5C' : 'rgba(139,111,92,0.35)',
              color: '#fff', fontFamily: '"DM Sans", sans-serif', fontSize: 14, fontWeight: 500,
              cursor: canAfford && !creating ? 'pointer' : 'not-allowed', transition: 'background .15s',
            }}
          >
            {creating ? 'Creating…' : `Start session — 🪙 ${cost} coins`}
          </button>
        )}

        <p style={{ textAlign: 'center', marginTop: 14, fontFamily: '"DM Sans", sans-serif', fontSize: 11, color: '#C4B5A6' }}>
          Session lasts 48 hours · Public link, no login required for guests
        </p>
      </div>
    </div>
  );
}
