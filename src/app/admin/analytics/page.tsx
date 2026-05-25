'use client';

import { useState, useEffect, useCallback } from 'react';
import { AdminShell, PageHeader, StatCard } from '@/components/admin';

const PERIODS     = ['7d', '30d', '90d', 'All time'];
const PERIOD_KEYS = ['7d', '30d', '90d', 'all'];
const CIRC        = 402.12; // 2π × r64

const STATUS_CONFIG: Record<string, { color: string; label: string; order: number }> = {
  delivered:       { color: '#0F6E56', label: 'Delivered',  order: 0 },
  shipped:         { color: '#3A6B86', label: 'Shipped',    order: 1 },
  confirmed:       { color: '#C4A882', label: 'Confirmed',  order: 2 },
  processing:      { color: '#8B6347', label: 'Processing', order: 3 },
  printing:        { color: '#8B6347', label: 'Printing',   order: 4 },
  cancelled:       { color: '#9C3A2A', label: 'Cancelled',  order: 5 },
  pending_payment: { color: '#B86415', label: 'Pending',    order: 6 },
  refunded:        { color: '#6B6B6B', label: 'Refunded',   order: 7 },
};

interface DailyRevenue { day: string; revenuePaise: number; orderCount: number }
interface CurrentStats { revenuePaise: number; orderCount: number; avgOrderPaise: number; newUsers: number }
interface StatusRow    { status: string; count: number; totalPaise: number; pct: number }
interface TemplateRow  { id: number; name: string; slug: string; sharePct: number; orderedDesigns: number; orderConversionPct: number }
interface FunnelData   { totalCreated: number; totalExported: number; totalOrdered: number; exportRate: number; orderRate: number; conversionRate: number }

function formatRupees(paise: number) {
  const rs = paise / 100;
  if (rs >= 100000) return `₹${(rs / 100000).toFixed(2)}L`;
  if (rs >= 1000)   return `₹${Math.round(rs).toLocaleString('en-IN')}`;
  return `₹${Math.round(rs)}`;
}

function niceMax(paise: number) {
  if (paise <= 0) return 1;
  const exp = Math.pow(10, Math.floor(Math.log10(paise)));
  return Math.ceil(paise / exp) * exp;
}

function formatDelta(curr: number, prev: number, isRupees = false) {
  if (!prev) return null;
  const d    = ((curr - prev) / prev) * 100;
  const arrow = d >= 0 ? '▲' : '▼';
  const pct   = Math.abs(d).toFixed(1);
  const extra = isRupees ? ` (${formatRupees(Math.abs(curr - prev))})` : '';
  return {
    text:  `${arrow} ${pct}%${extra} vs prev period`,
    color: d >= 0 ? '#0F6E56' : '#9C3A2A',
    type:  (d >= 0 ? 'up' : 'down') as 'up' | 'down',
  };
}

function buildSvgPath(daily: DailyRevenue[], maxPaise: number) {
  if (daily.length < 2) return { line: '', area: '' };
  const pts = daily.map((d, i) => ({
    x: 50 + (i / (daily.length - 1)) * 840,
    y: 220 - (d.revenuePaise / maxPaise) * 170,
  }));
  const line  = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
  const last  = pts[pts.length - 1];
  const first = pts[0];
  const area  = `${line} L${last.x.toFixed(1)},220 L${first.x.toFixed(1)},220 Z`;
  return { line, area };
}

function xAxisLabels(daily: DailyRevenue[]) {
  if (daily.length < 2) return [];
  const n    = daily.length - 1;
  const idxs = [0, Math.floor(n * 0.25), Math.floor(n * 0.5), Math.floor(n * 0.75), n];
  return [...new Set(idxs)].map(i => ({
    x:     50 + (i / n) * 840,
    label: new Date(daily[i].day as string).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
  }));
}

export default function AnalyticsPage() {
  const [period,    setPeriod]    = useState(1);
  const [loading,   setLoading]   = useState(true);
  const [revenue,   setRevenue]   = useState<{ current: CurrentStats; previous: CurrentStats; dailyRevenue: DailyRevenue[] } | null>(null);
  const [orders,    setOrders]    = useState<{ statuses: StatusRow[]; total: number } | null>(null);
  const [templates, setTemplates] = useState<{ templates: TemplateRow[] } | null>(null);
  const [funnel,    setFunnel]    = useState<FunnelData | null>(null);

  const fetchAll = useCallback(async (idx: number) => {
    setLoading(true);
    const p = PERIOD_KEYS[idx];
    try {
      const [rr, or, tr, fr] = await Promise.all([
        fetch(`/api/admin/analytics/revenue?period=${p}`),
        fetch('/api/admin/analytics/orders'),
        fetch('/api/admin/analytics/templates'),
        fetch('/api/admin/analytics/funnel'),
      ]);
      const [rj, oj, tj, fj] = await Promise.all([rr.json(), or.json(), tr.json(), fr.json()]);
      if (rj.current)                    setRevenue({ current: rj.current, previous: rj.previous, dailyRevenue: rj.dailyRevenue });
      if (oj.statuses)                   setOrders({ statuses: oj.statuses, total: oj.total });
      if (tj.templates)                  setTemplates({ templates: tj.templates });
      if (fj.totalCreated !== undefined) setFunnel(fj);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(period); }, [period, fetchAll]);

  // ── derived ────────────────────────────────────────────────────────────────
  const revDelta  = revenue ? formatDelta(revenue.current.revenuePaise,  revenue.previous.revenuePaise,  true) : null;
  const ordDelta  = revenue ? formatDelta(revenue.current.orderCount,     revenue.previous.orderCount) : null;
  const avgDelta  = revenue ? formatDelta(revenue.current.avgOrderPaise,  revenue.previous.avgOrderPaise, true) : null;
  const userDelta = revenue ? formatDelta(revenue.current.newUsers,       revenue.previous.newUsers) : null;

  // Chart
  const chartMaxPaise = revenue?.dailyRevenue.length
    ? niceMax(Math.max(...revenue.dailyRevenue.map(d => d.revenuePaise)))
    : 1500000;
  const { line: chartLine, area: chartArea } = revenue?.dailyRevenue.length
    ? buildSvgPath(revenue.dailyRevenue, chartMaxPaise)
    : { line: '', area: '' };
  const xLabels = revenue?.dailyRevenue.length ? xAxisLabels(revenue.dailyRevenue) : [];
  const lastPt  = revenue?.dailyRevenue.length
    ? (() => {
        const last = revenue.dailyRevenue[revenue.dailyRevenue.length - 1];
        const n    = revenue.dailyRevenue.length - 1;
        return { x: 50 + (n / Math.max(n, 1)) * 840, y: 220 - (last.revenuePaise / chartMaxPaise) * 170 };
      })()
    : null;

  // Donut segments
  const donutSegments = (() => {
    if (!orders) return [];
    const sorted = [...orders.statuses].sort((a, b) =>
      (STATUS_CONFIG[a.status]?.order ?? 99) - (STATUS_CONFIG[b.status]?.order ?? 99)
    );
    let offset = 0;
    return sorted.map(s => {
      const arc  = orders.total > 0 ? (s.count / orders.total) * CIRC : 0;
      const item = { ...s, arc, offset };
      offset += arc;
      return item;
    });
  })();

  // Funnel bars
  const funnelRows = funnel ? [
    { label: 'Designs created',         pct: '100%',                  count: funnel.totalCreated.toLocaleString('en-IN'),  width: '100%' },
    { label: 'Exported (PNG download)', pct: `${funnel.exportRate}%`, count: funnel.totalExported.toLocaleString('en-IN'), width: `${Math.max(funnel.exportRate, 2)}%` },
    { label: 'Ordered (paid print)',    pct: `${funnel.orderRate}%`,  count: funnel.totalOrdered.toLocaleString('en-IN'),  width: `${Math.max(funnel.orderRate, 2)}%` },
  ] : [
    { label: 'Designs created',         pct: '—', count: '—', width: '100%' },
    { label: 'Exported (PNG download)', pct: '—', count: '—', width: '0%'   },
    { label: 'Ordered (paid print)',    pct: '—', count: '—', width: '0%'   },
  ];

  // Templates
  const topTemplates = templates?.templates.slice(0, 5) ?? [];
  const maxShare     = topTemplates.length ? Math.max(...topTemplates.map(t => t.sharePct), 1) : 1;

  const periodLabel = period === 3 ? 'All time' : `Last ${PERIOD_KEYS[period]}`;

  return (
    <AdminShell>
      <PageHeader title="Analytics" subtitle={`Revenue, funnel and template insights · ${periodLabel}`}>
        <div className="period-pills">
          {PERIODS.map((p, i) => (
            <button key={p} onClick={() => setPeriod(i)} className={`period-btn${i === period ? ' active' : ''}`}>
              {p}
            </button>
          ))}
        </div>
      </PageHeader>

      <div className="stat-row">
        <StatCard
          label="Revenue"
          value={revenue ? formatRupees(revenue.current.revenuePaise) : '—'}
          delta={revDelta?.text ?? (loading ? '…' : 'No prior data')}
          deltaType={revDelta?.type ?? 'up'}
        />
        <StatCard
          label="Orders"
          value={revenue ? String(revenue.current.orderCount) : '—'}
          delta={ordDelta?.text ?? (loading ? '…' : 'No prior data')}
          deltaType={ordDelta?.type ?? 'up'}
        />
        <StatCard
          label="Avg order val"
          value={revenue ? formatRupees(revenue.current.avgOrderPaise) : '—'}
          delta={avgDelta?.text ?? (loading ? '…' : 'No prior data')}
          deltaType={avgDelta?.type ?? 'up'}
        />
        <StatCard
          label="New users"
          value={revenue ? String(revenue.current.newUsers) : '—'}
          delta={userDelta?.text ?? (loading ? '…' : 'No prior data')}
          deltaType={userDelta?.type ?? 'up'}
        />
      </div>

      {/* Revenue Chart */}
      <div className="card" style={{ marginBottom: '18px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '18px', gap: '14px' }}>
          <div>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '22px', fontWeight: 300, fontStyle: 'italic', lineHeight: 1.1 }}>Revenue</div>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '38px', fontWeight: 300, fontStyle: 'italic', lineHeight: 1, marginTop: '4px', letterSpacing: '-.01em' }}>
              {revenue ? formatRupees(revenue.current.revenuePaise) : '—'}
            </div>
            {revDelta && (
              <div style={{ marginTop: '6px', fontFamily: "'DM Mono', monospace", fontSize: '11px', letterSpacing: '.04em', color: revDelta.color }}>
                {revDelta.text}
              </div>
            )}
          </div>
          <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontFamily: "'DM Mono', monospace", fontSize: '10px', letterSpacing: '.08em', color: 'var(--text-2)', textTransform: 'uppercase' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--brown)', display: 'inline-block' }} />
              This period
            </span>
          </div>
        </div>

        <svg className="admin-area-chart" viewBox="0 0 920 240" preserveAspectRatio="none">
          <defs>
            <linearGradient id="brownArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="#8B6347" stopOpacity=".22" />
              <stop offset="100%" stopColor="#8B6347" stopOpacity="0"   />
            </linearGradient>
          </defs>
          <g className="grid">
            <line x1="0" y1="50"  x2="920" y2="50"  />
            <line x1="0" y1="100" x2="920" y2="100" />
            <line x1="0" y1="150" x2="920" y2="150" />
            <line x1="0" y1="200" x2="920" y2="200" />
          </g>
          <g className="axis">
            <text x="6" y="46">{formatRupees(chartMaxPaise)}</text>
            <text x="6" y="96">{formatRupees(chartMaxPaise * 0.75)}</text>
            <text x="6" y="146">{formatRupees(chartMaxPaise * 0.5)}</text>
            <text x="6" y="196">{formatRupees(chartMaxPaise * 0.25)}</text>
          </g>
          {chartLine ? (
            <>
              <path className="area" d={chartArea} />
              <path className="line" d={chartLine} />
              {lastPt && <circle className="dot" cx={lastPt.x.toFixed(1)} cy={lastPt.y.toFixed(1)} r="4" />}
              <g className="axis">
                {xLabels.map((lbl, i) => (
                  <text key={i} x={lbl.x} y="234" textAnchor="middle">{lbl.label}</text>
                ))}
              </g>
            </>
          ) : (
            <text x="460" y="130" textAnchor="middle" style={{ fontFamily: "'DM Mono', monospace", fontSize: '13px', fill: 'var(--text-3)' }}>
              {loading ? 'Loading…' : 'No revenue data for this period'}
            </text>
          )}
        </svg>
      </div>

      {/* Two Col: Funnel + Templates */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px', marginBottom: '18px' }}>

        {/* Funnel */}
        <div className="card">
          <div style={{ marginBottom: '18px' }}>
            <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '22px', fontWeight: 300, fontStyle: 'italic' }}>Design funnel</span>
            <span style={{ marginLeft: '8px', fontFamily: "'DM Mono', monospace", fontSize: '11px', color: 'var(--text-3)', letterSpacing: '.04em' }}>All time</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', paddingBlock: '8px' }}>
            {funnelRows.map((f, i) => (
              <div key={f.label} style={{ position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '6px' }}>
                  <div style={{ fontSize: '13.5px', fontWeight: 500, color: 'var(--text)' }}>{f.label}</div>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '11px', color: 'var(--text-3)', letterSpacing: '.04em' }}>{f.pct} · {f.count}</div>
                </div>
                <div style={{ height: '38px', borderRadius: '10px', overflow: 'hidden', background: 'var(--cream-soft)', position: 'relative' }}>
                  <div style={{ width: f.width, height: '100%', borderRadius: '10px', display: 'flex', alignItems: 'center', padding: '0 14px', background: 'linear-gradient(90deg, var(--brown) 0%, var(--brown-light) 100%)', fontFamily: "'Cormorant Garamond', serif", fontSize: '20px', color: '#fff', fontStyle: 'italic', fontWeight: 300, lineHeight: 1, transition: 'width 1s ease' }}>
                    {f.count}
                  </div>
                </div>
                {i < funnelRows.length - 1 && funnel && (
                  <div style={{ position: 'absolute', right: '-2px', top: '52px', fontFamily: "'DM Mono', monospace", fontSize: '10px', color: '#9C3A2A', letterSpacing: '.04em' }}>
                    {i === 0
                      ? `↓ ${(100 - funnel.exportRate).toFixed(1)}% drop-off (${(funnel.totalCreated - funnel.totalExported).toLocaleString('en-IN')})`
                      : `↓ ${(funnel.exportRate - funnel.orderRate).toFixed(1)}% drop-off (${(funnel.totalExported - funnel.totalOrdered).toLocaleString('en-IN')})`
                    }
                  </div>
                )}
              </div>
            ))}
          </div>
          <div style={{ marginTop: '18px', paddingTop: '14px', borderTop: '.5px solid var(--border)', fontFamily: "'DM Mono', monospace", fontSize: '11px', color: 'var(--text-3)', letterSpacing: '.04em' }}>
            {funnel
              ? `✦ ${funnel.conversionRate}% of exporters end up ordering — ${funnel.conversionRate >= 30 ? 'strong' : 'moderate'} intent signal`
              : '✦ Loading funnel data…'
            }
          </div>
        </div>

        {/* Templates */}
        <div className="card">
          <div style={{ marginBottom: '18px' }}>
            <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '22px', fontWeight: 300, fontStyle: 'italic' }}>Top templates</span>
            <span style={{ marginLeft: '8px', fontFamily: "'DM Mono', monospace", fontSize: '11px', color: 'var(--text-3)', letterSpacing: '.04em' }}>By share of orders</span>
          </div>
          {topTemplates.length === 0 && (
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '11px', color: 'var(--text-3)', padding: '12px 0' }}>
              {loading ? 'Loading…' : 'No template data yet'}
            </div>
          )}
          {topTemplates.map((t) => (
            <div key={t.slug} style={{ display: 'grid', gridTemplateColumns: '130px 1fr 40px', alignItems: 'center', gap: '14px', padding: '10px 0', borderBottom: '.5px solid var(--border)' }}>
              <div style={{ fontSize: '13px', color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.name}</div>
              <div style={{ height: '10px', borderRadius: '100px', overflow: 'hidden', background: 'var(--cream-soft)' }}>
                <div style={{ width: `${(t.sharePct / maxShare) * 100}%`, height: '100%', borderRadius: '100px', background: 'var(--brown)', transition: 'width 1s ease' }} />
              </div>
              <div style={{ textAlign: 'right', fontFamily: "'DM Mono', monospace", fontSize: '11px', color: 'var(--text-2)', letterSpacing: '.02em' }}>{t.sharePct}%</div>
            </div>
          ))}
        </div>
      </div>

      {/* Donut: Orders by Status */}
      <div className="card">
        <div style={{ marginBottom: '18px' }}>
          <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '22px', fontWeight: 300, fontStyle: 'italic' }}>Orders by status</span>
          <span style={{ marginLeft: '8px', fontFamily: "'DM Mono', monospace", fontSize: '11px', color: 'var(--text-3)', letterSpacing: '.04em' }}>Current snapshot</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', alignItems: 'center', gap: '28px' }}>
          <div style={{ position: 'relative', width: '170px', height: '170px', flexShrink: 0 }}>
            <svg viewBox="0 0 170 170" style={{ transform: 'rotate(-90deg)', width: '100%', height: '100%' }}>
              <circle cx="85" cy="85" r="64" fill="none" stroke="var(--cream-soft)" strokeWidth="22" />
              {donutSegments.map((seg) => (
                <circle
                  key={seg.status}
                  cx="85" cy="85" r="64"
                  fill="none"
                  stroke={STATUS_CONFIG[seg.status]?.color ?? '#999'}
                  strokeWidth="22"
                  strokeDasharray={`${seg.arc.toFixed(2)} ${CIRC}`}
                  strokeDashoffset={`${(-seg.offset).toFixed(2)}`}
                />
              ))}
            </svg>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '38px', fontWeight: 300, fontStyle: 'italic', lineHeight: 1, letterSpacing: '-.01em' }}>
                {orders ? orders.total : '—'}
              </div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '10px', color: 'var(--text-3)', letterSpacing: '.12em', textTransform: 'uppercase', marginTop: '4px' }}>Total orders</div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '9px' }}>
            {donutSegments.map((seg) => (
              <div key={seg.status} style={{ display: 'grid', gridTemplateColumns: '14px 1fr auto', alignItems: 'center', gap: '10px', fontSize: '12.5px' }}>
                <span style={{ width: '9px', height: '9px', borderRadius: '50%', background: STATUS_CONFIG[seg.status]?.color ?? '#999', display: 'block' }} />
                <span>{STATUS_CONFIG[seg.status]?.label ?? seg.status}</span>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '11px', color: 'var(--text-2)', letterSpacing: '.02em' }}>{seg.count} · {seg.pct}%</span>
              </div>
            ))}
            {donutSegments.length === 0 && (
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '11px', color: 'var(--text-3)' }}>
                {loading ? 'Loading…' : 'No order data yet'}
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
