'use client';
import { useState } from 'react';
import { useRazorpay } from '@/hooks/useRazorpay';
import { useAuth } from '@/hooks/useAuth';

interface Props {
  designId: string;
  coinBalance: number | null;
  onUnlocked: () => void;
  onDownloadFree: () => void;
  onClose: () => void;
}

const COIN_COST = 10;
const PRICE_PAISE = 900;

export function WatermarkModal({ designId, coinBalance, onUnlocked, onDownloadFree, onClose }: Props) {
  const { openPayment } = useRazorpay();
  const { user } = useAuth();
  const [paying, setPaying] = useState(false);
  const [spending, setSpending] = useState(false);
  const [error, setError] = useState('');

  const canSpendCoins = typeof coinBalance === 'number' && coinBalance >= COIN_COST;

  async function handlePayment() {
    setPaying(true);
    setError('');
    try {
      const res = await fetch(`/api/designs/${designId}/unlock`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'create_order' }),
      });
      const data = await res.json();
      if (data.already_unlocked) { onUnlocked(); return; }
      if (!res.ok) throw new Error(data.error ?? 'Failed to create order');

      openPayment({
        key: data.key,
        amount: data.amount,
        currency: data.currency,
        order_id: data.razorpay_order_id,
        name: 'Polamuse',
        description: 'Remove watermark from your design',
        prefill: { email: user?.email },
        onSuccess: async (payment) => {
          const verifyRes = await fetch(`/api/designs/${designId}/unlock`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'verify', ...payment }),
          });
          if (verifyRes.ok) {
            onUnlocked();
          } else {
            setError('Payment verification failed. Contact support.');
            setPaying(false);
          }
        },
        onFailure: (e) => {
          if (e?.reason !== 'dismissed') setError('Payment cancelled.');
          setPaying(false);
        },
      });
    } catch (e: any) {
      setError(e.message ?? 'Something went wrong');
      setPaying(false);
    }
  }

  async function handleCoins() {
    setSpending(true);
    setError('');
    try {
      const res = await fetch(`/api/designs/${designId}/unlock`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'spend_coins' }),
      });
      const data = await res.json();
      if (res.ok && (data.unlocked || data.already_unlocked)) {
        onUnlocked();
      } else {
        setError(data.error ?? 'Failed to spend coins');
      }
    } catch {
      setError('Something went wrong');
    } finally {
      setSpending(false);
    }
  }

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(26,23,20,0.55)', backdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
        padding: '0 0 env(safe-area-inset-bottom)',
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        style={{
          width: '100%', maxWidth: 440,
          background: '#FFFCF8',
          borderRadius: '20px 20px 0 0',
          padding: '28px 24px 32px',
          boxShadow: '0 -4px 32px rgba(26,23,20,0.12)',
        }}
      >
        {/* Handle */}
        <div style={{ width: 36, height: 4, borderRadius: 2, background: 'rgba(26,23,20,0.15)', margin: '0 auto 24px' }} />

        <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: 22, fontWeight: 500, color: '#1A1714', margin: '0 0 4px' }}>
          Download your photo
        </h2>
        <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 13, color: '#A39080', margin: '0 0 24px', lineHeight: 1.5 }}>
          Free download includes a small watermark. Remove it instantly.
        </p>

        {error && (
          <div style={{ background: 'rgba(200,60,60,0.07)', border: '0.5px solid rgba(200,60,60,0.2)', borderRadius: 10, padding: '10px 14px', marginBottom: 16, color: '#B03030', fontFamily: '"DM Sans", sans-serif', fontSize: 13 }}>
            {error}
          </div>
        )}

        {/* Option 1 — Pay ₹9 */}
        <button
          onClick={handlePayment}
          disabled={paying || spending}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '16px 18px',
            background: paying ? 'rgba(139,111,92,0.08)' : 'linear-gradient(135deg, #8B6F5C, #7A6050)',
            borderRadius: 14, border: 'none', cursor: paying ? 'wait' : 'pointer',
            marginBottom: 10, transition: 'opacity .15s',
            opacity: spending ? 0.5 : 1,
          }}
        >
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 14, fontWeight: 600, color: paying ? '#8B6F5C' : '#FFFCF8' }}>
              {paying ? 'Opening payment…' : 'Remove watermark'}
            </div>
            <div style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 12, color: paying ? '#A39080' : 'rgba(255,252,248,0.7)', marginTop: 2 }}>
              One-time · This design only
            </div>
          </div>
          <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 15, fontWeight: 600, color: paying ? '#8B6F5C' : '#FFFCF8' }}>
            ₹9
          </div>
        </button>

        {/* Option 2 — Spend coins */}
        <button
          onClick={handleCoins}
          disabled={!canSpendCoins || spending || paying}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '16px 18px',
            background: 'rgba(26,23,20,0.03)',
            borderRadius: 14,
            border: `0.5px solid ${canSpendCoins ? 'rgba(139,111,92,0.25)' : 'rgba(26,23,20,0.08)'}`,
            cursor: canSpendCoins && !spending && !paying ? 'pointer' : 'not-allowed',
            marginBottom: 16, opacity: spending ? 0.7 : 1, transition: 'opacity .15s',
          }}
        >
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 14, fontWeight: 500, color: canSpendCoins ? '#1A1714' : '#C4B5A6' }}>
              {spending ? 'Spending coins…' : 'Use Pola Coins'}
            </div>
            <div style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 12, color: '#A39080', marginTop: 2 }}>
              {canSpendCoins
                ? `Your balance: ${coinBalance} coins`
                : coinBalance === null ? 'Sign in to use coins' : `Need ${COIN_COST} coins — you have ${coinBalance}`}
            </div>
          </div>
          <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 13, fontWeight: 600, color: canSpendCoins ? '#8B6F5C' : '#C4B5A6' }}>
            {COIN_COST}🪙
          </div>
        </button>

        {/* Free download with watermark */}
        <button
          onClick={onDownloadFree}
          style={{
            width: '100%', padding: '13px 18px',
            background: 'transparent', border: 'none', cursor: 'pointer',
            fontFamily: '"DM Sans", sans-serif', fontSize: 13, color: '#A39080',
            textDecoration: 'underline', textUnderlineOffset: 3,
          }}
        >
          Download free (with watermark)
        </button>
      </div>
    </div>
  );
}
