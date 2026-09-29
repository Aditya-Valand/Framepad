'use client';

interface Props {
  balance: number | null;
  loading?: boolean;
  onClick: () => void;
}

export function CoinBadge({ balance, loading, onClick }: Props) {
  if (loading || balance === null) return null;

  return (
    <button
      onClick={onClick}
      title="Pola Coins — tap to buy more"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        padding: '5px 10px 5px 8px',
        borderRadius: 100,
        border: '0.5px solid rgba(139,111,92,0.22)',
        background: 'rgba(139,111,92,0.06)',
        cursor: 'pointer',
        fontFamily: '"DM Mono", monospace',
        fontSize: 12,
        fontWeight: 600,
        color: '#8B6F5C',
        letterSpacing: '.02em',
        transition: 'background .15s',
        flexShrink: 0,
      }}
      onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(139,111,92,0.12)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(139,111,92,0.06)'; }}
    >
      <span style={{ fontSize: 13 }}>🪙</span>
      {balance}
    </button>
  );
}
