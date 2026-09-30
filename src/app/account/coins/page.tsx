'use client';
import { useEffect, useState, useCallback } from 'react';

interface LedgerEntry {
  id: string;
  delta: number;
  reason: string;
  reference_id: string | null;
  created_at: string;
}

const REASON_LABELS: Record<string, string> = {
  signup_bonus:       'Signup bonus',
  first_design:       'First design saved',
  first_order:        'First print ordered',
  referral:           'Referral reward',
  purchase_starter:   'Purchased Starter pack',
  purchase_popular:   'Purchased Popular pack',
  purchase_best:      'Purchased Best Value pack',
  spend_watermark:    'Watermark removed',
  spend_template:     'Premium template unlocked',
  spend_booth:        'Booth session',
  spend_filmstrip:    'Film strip download',
  spend_canvas:       'Shared canvas session',
  spend_canvas_extend:'Session extended',
  spend_save:         'Cloud save',
  spend_batch_download:'Batch download',
};

function groupByDay(entries: LedgerEntry[]) {
  const groups: Record<string, LedgerEntry[]> = {};
  for (const e of entries) {
    const day = new Date(e.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
    if (!groups[day]) groups[day] = [];
    groups[day].push(e);
  }
  return groups;
}

export default function CoinsPage() {
  const [entries, setEntries] = useState<LedgerEntry[]>([]);
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const load = useCallback(async (p: number) => {
    setLoading(true);
    try {
      const [balRes, histRes] = await Promise.all([
        fetch('/api/coins/balance'),
        fetch(`/api/coins/history?page=${p}&limit=30`),
      ]);
      if (balRes.ok) setBalance((await balRes.json()).balance);
      if (histRes.ok) {
        const data = await histRes.json();
        setEntries(data.entries);
        setTotalPages(data.pagination.pages);
        setPage(p);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(1); }, [load]);

  const groups = groupByDay(entries);

  return (
    <div style={{ minHeight: '100dvh', background: '#EDE6DC', padding: '24px 16px 40px' }}>
      <div style={{ maxWidth: 480, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <a href="/account" style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 13, color: '#A39080', textDecoration: 'none' }}>
            ← Account
          </a>
          <h1 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: 28, fontWeight: 500, color: '#1A1714', margin: '12px 0 0' }}>
            Pola Coins
          </h1>
        </div>

        {/* Balance card */}
        <div style={{
          background: '#FFFCF8',
          border: '0.5px solid rgba(26,23,20,0.08)',
          borderRadius: 16,
          padding: '20px 20px',
          marginBottom: 20,
          display: 'flex', alignItems: 'center', gap: 14,
        }}>
          <span style={{ fontSize: 32 }}>🪙</span>
          <div>
            <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 28, fontWeight: 700, color: '#1A1714', lineHeight: 1 }}>
              {balance ?? '—'}
            </div>
            <div style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 12, color: '#A39080', marginTop: 3 }}>
              coins available
            </div>
          </div>
        </div>

        {/* History */}
        <div style={{ background: '#FFFCF8', border: '0.5px solid rgba(26,23,20,0.08)', borderRadius: 16, overflow: 'hidden' }}>
          {loading ? (
            <div style={{ padding: 32, textAlign: 'center', color: '#A39080', fontFamily: '"DM Sans", sans-serif', fontSize: 14 }}>
              Loading…
            </div>
          ) : entries.length === 0 ? (
            <div style={{ padding: 32, textAlign: 'center', color: '#A39080', fontFamily: '"DM Sans", sans-serif', fontSize: 14 }}>
              No transactions yet
            </div>
          ) : (
            Object.entries(groups).map(([day, dayEntries]) => (
              <div key={day}>
                <div style={{ padding: '10px 18px 6px', fontFamily: '"DM Sans", sans-serif', fontSize: 11, fontWeight: 600, color: '#B5A49A', textTransform: 'uppercase', letterSpacing: '.08em', borderBottom: '0.5px solid rgba(26,23,20,0.05)' }}>
                  {day}
                </div>
                {dayEntries.map((e, i) => (
                  <div
                    key={e.id}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '13px 18px',
                      borderBottom: i < dayEntries.length - 1 ? '0.5px solid rgba(26,23,20,0.05)' : 'none',
                    }}
                  >
                    <div style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 13, color: '#1A1714' }}>
                      {REASON_LABELS[e.reason] ?? e.reason}
                    </div>
                    <div style={{
                      fontFamily: '"DM Mono", monospace', fontSize: 13, fontWeight: 600,
                      color: e.delta > 0 ? '#2D7A4F' : '#A39080',
                    }}>
                      {e.delta > 0 ? `+${e.delta}` : e.delta} 🪙
                    </div>
                  </div>
                ))}
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 16 }}>
            <button
              onClick={() => load(page - 1)}
              disabled={page <= 1 || loading}
              style={{ padding: '8px 16px', borderRadius: 100, border: '0.5px solid rgba(26,23,20,0.12)', background: 'transparent', color: '#8B6F5C', fontFamily: '"DM Sans", sans-serif', fontSize: 13, cursor: 'pointer', opacity: page <= 1 ? 0.4 : 1 }}
            >
              ← Prev
            </button>
            <span style={{ padding: '8px 12px', fontFamily: '"DM Sans", sans-serif', fontSize: 13, color: '#A39080' }}>
              {page} / {totalPages}
            </span>
            <button
              onClick={() => load(page + 1)}
              disabled={page >= totalPages || loading}
              style={{ padding: '8px 16px', borderRadius: 100, border: '0.5px solid rgba(26,23,20,0.12)', background: 'transparent', color: '#8B6F5C', fontFamily: '"DM Sans", sans-serif', fontSize: 13, cursor: 'pointer', opacity: page >= totalPages ? 0.4 : 1 }}
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
