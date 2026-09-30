'use client';
import { useState } from 'react';
import { useRazorpay } from '@/hooks/useRazorpay';
import { useAuth } from '@/hooks/useAuth';
import { COIN_PACKS } from '@/lib/coin-constants';

interface Props {
  currentBalance: number | null;
  onClose: () => void;
  onPurchased: (newBalance: number) => void;
}

const PACK_LABELS = {
  starter: { name: 'Starter',    badge: null,              color: '#A39080' },
  popular: { name: 'Popular',    badge: '★ Most Popular',  color: '#8B6F5C' },
  best:    { name: 'Best Value', badge: '💎 Best Deal',    color: '#6B4F3A' },
} as const;

type PackKey = keyof typeof COIN_PACKS;

export function CoinPurchaseSheet({ currentBalance, onClose, onPurchased }: Props) {
  const { openPayment } = useRazorpay();
  const { user } = useAuth();
  const [purchasing, setPurchasing] = useState<PackKey | null>(null);
  const [error, setError] = useState('');

  async function handleBuy(pack: PackKey) {
    setPurchasing(pack);
    setError('');
    try {
      const res = await fetch('/api/coins/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'create_order', pack }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Failed to create order');

      openPayment({
        key: data.key,
        amount: data.amount,
        currency: data.currency,
        order_id: data.razorpay_order_id,
        name: 'Polamuse',
        description: `${COIN_PACKS[pack].coins} Pola Coins`,
        prefill: { email: user?.email },
        onSuccess: async (payment) => {
          const verifyRes = await fetch('/api/coins/purchase', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'verify', pack, ...payment }),
          });
          const verifyData = await verifyRes.json();
          if (verifyRes.ok && verifyData.success) {
            onPurchased(verifyData.balance);
          } else {
            setError('Payment verified but credit failed. Contact support.');
            setPurchasing(null);
          }
        },
        onFailure: (e) => {
          if (e?.reason !== 'dismissed') setError('Payment cancelled.');
          setPurchasing(null);
        },
      });
    } catch (e: any) {
      setError(e.message ?? 'Something went wrong');
      setPurchasing(null);
    }
  }

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(26,23,20,0.55)', backdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        style={{
          width: '100%', maxWidth: 440,
          background: '#FFFCF8',
          borderRadius: '20px 20px 0 0',
          padding: '28px 24px 40px',
          boxShadow: '0 -4px 32px rgba(26,23,20,0.12)',
        }}
      >
        <div style={{ width: 36, height: 4, borderRadius: 2, background: 'rgba(26,23,20,0.15)', margin: '0 auto 24px' }} />

        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 4 }}>
          <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: 22, fontWeight: 500, color: '#1A1714', margin: 0 }}>
            Get Pola Coins
          </h2>
          {currentBalance !== null && (
            <span style={{ fontFamily: '"DM Mono", monospace', fontSize: 12, color: '#A39080' }}>
              🪙 {currentBalance} now
            </span>
          )}
        </div>
        <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 13, color: '#A39080', margin: '0 0 20px', lineHeight: 1.5 }}>
          Use coins to remove watermarks, unlock booth mode, and more.
        </p>

        {error && (
          <div style={{ background: 'rgba(200,60,60,0.07)', border: '0.5px solid rgba(200,60,60,0.2)', borderRadius: 10, padding: '10px 14px', marginBottom: 16, color: '#B03030', fontFamily: '"DM Sans", sans-serif', fontSize: 13 }}>
            {error}
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {(Object.keys(COIN_PACKS) as PackKey[]).map((pack) => {
            const config = COIN_PACKS[pack];
            const label  = PACK_LABELS[pack];
            const isPopular = pack === 'popular';
            const isBuying = purchasing === pack;

            return (
              <button
                key={pack}
                onClick={() => handleBuy(pack)}
                disabled={!!purchasing}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '16px 18px',
                  borderRadius: 14,
                  border: isPopular ? `1.5px solid ${label.color}` : '0.5px solid rgba(26,23,20,0.1)',
                  background: isPopular ? `rgba(139,111,92,0.05)` : 'rgba(26,23,20,0.02)',
                  cursor: purchasing ? 'wait' : 'pointer',
                  opacity: purchasing && !isBuying ? 0.5 : 1,
                  transition: 'opacity .15s',
                  position: 'relative',
                }}
              >
                {label.badge && (
                  <span style={{
                    position: 'absolute', top: -10, left: 14,
                    fontFamily: '"DM Sans", sans-serif', fontSize: 10, fontWeight: 600,
                    color: '#FFFCF8', background: label.color,
                    padding: '2px 8px', borderRadius: 100,
                  }}>
                    {label.badge}
                  </span>
                )}
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 14, fontWeight: 600, color: '#1A1714' }}>
                    {isBuying ? 'Opening payment…' : label.name}
                  </div>
                  <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 12, color: label.color, marginTop: 2 }}>
                    🪙 {config.coins} coins
                  </div>
                </div>
                <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 15, fontWeight: 700, color: '#1A1714' }}>
                  ₹{config.pricePaise / 100}
                </div>
              </button>
            );
          })}
        </div>

        <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 11, color: '#C4B5A6', textAlign: 'center', marginTop: 16 }}>
          Coins never expire · Secure payment via Razorpay
        </p>
      </div>
    </div>
  );
}
