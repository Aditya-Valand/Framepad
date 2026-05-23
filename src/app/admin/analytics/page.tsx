'use client';

import { useState } from 'react';
import { AdminShell, PageHeader, StatCard } from '@/components/admin';

const TOP_TEMPLATES = [
  { name: 'Classic Polaroid', pct: 38, width: '88%' },
  { name: 'Instax Mini',      pct: 18, width: '42%' },
  { name: 'Vintage 600',      pct: 14, width: '32%' },
  { name: 'Movie Poster',     pct: 11, width: '26%' },
  { name: 'Instax Square',    pct: 8,  width: '20%' },
];

const FUNNEL = [
  { label: 'Designs created',        pct: '100%',  count: '1,240', width: '100%'  },
  { label: 'Exported (PNG download)', pct: '54.8%', count: '680',   width: '54.8%' },
  { label: 'Ordered (paid print)',    pct: '25.2%', count: '312',   width: '25.2%' },
];

const PERIODS = ['7d', '30d', '90d', 'All time'];

export default function AnalyticsPage() {
  const [period, setPeriod] = useState(1);

  return (
    <AdminShell>
      <PageHeader title="Analytics" subtitle="Revenue, funnel and template insights · last 30 days vs previous 30">
        <div className="period-pills">
          {PERIODS.map((p, i) => (
            <button key={p} onClick={() => setPeriod(i)} className={`period-btn${i === period ? ' active' : ''}`}>
              {p}
            </button>
          ))}
        </div>
      </PageHeader>

      <div className="stat-row">
        <StatCard label="Revenue"       value="₹2.84L" delta="▲ 22.4% vs prev period" deltaType="up"   />
        <StatCard label="Orders"        value="486"     delta="▲ 14.8%"                deltaType="up"   />
        <StatCard label="Avg order val" value="₹584"   delta="▲ 6.5%"                 deltaType="up"   />
        <StatCard label="New users"     value="128"     delta="▼ 3.2%"                 deltaType="down" />
      </div>

      {/* Revenue Chart */}
      <div className="card" style={{ marginBottom: '18px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '18px', gap: '14px' }}>
          <div>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '22px', fontWeight: 300, fontStyle: 'italic', lineHeight: 1.1 }}>Revenue</div>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '38px', fontWeight: 300, fontStyle: 'italic', lineHeight: 1, marginTop: '4px', letterSpacing: '-.01em' }}>₹2,84,400</div>
            <div style={{ marginTop: '6px', fontFamily: "'DM Mono', monospace", fontSize: '11px', letterSpacing: '.04em', color: '#0F6E56' }}>▲ ₹52,100 vs prev 30 days</div>
          </div>
          <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontFamily: "'DM Mono', monospace", fontSize: '10px', letterSpacing: '.08em', color: 'var(--text-2)', textTransform: 'uppercase' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--brown)', display: 'inline-block' }} />This period
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontFamily: "'DM Mono', monospace", fontSize: '10px', letterSpacing: '.08em', color: 'var(--text-2)', textTransform: 'uppercase' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--text-3)', display: 'inline-block' }} />Previous
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
            <text x="6" y="46">₹15k</text>
            <text x="6" y="96">₹10k</text>
            <text x="6" y="146">₹5k</text>
            <text x="6" y="196">₹0</text>
          </g>
          <path className="lineSec" d="M50,170 L110,160 L170,155 L230,158 L290,148 L350,142 L410,150 L470,138 L530,128 L590,135 L650,130 L710,122 L770,118 L830,124 L890,116" />
          <path className="area"   d="M50,160 L110,148 L170,140 L230,144 L290,128 L350,118 L410,124 L470,108 L530,92 L590,100 L650,84 L710,72 L770,60 L830,68 L890,52 L890,220 L50,220 Z" />
          <path className="line"   d="M50,160 L110,148 L170,140 L230,144 L290,128 L350,118 L410,124 L470,108 L530,92 L590,100 L650,84 L710,72 L770,60 L830,68 L890,52" />
          <circle className="dot" cx="890" cy="52" r="4" />
          <g className="axis">
            <text x="50"  y="234" textAnchor="middle">Apr 24</text>
            <text x="240" y="234" textAnchor="middle">May 1</text>
            <text x="450" y="234" textAnchor="middle">May 8</text>
            <text x="670" y="234" textAnchor="middle">May 15</text>
            <text x="890" y="234" textAnchor="end">May 23</text>
          </g>
        </svg>
      </div>

      {/* Two Col: Funnel + Templates */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px', marginBottom: '18px' }}>
        {/* Funnel */}
        <div className="card">
          <div style={{ marginBottom: '18px' }}>
            <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '22px', fontWeight: 300, fontStyle: 'italic' }}>Design funnel</span>
            <span style={{ marginLeft: '8px', fontFamily: "'DM Mono', monospace", fontSize: '11px', color: 'var(--text-3)', letterSpacing: '.04em' }}>Last 30 days</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', paddingBlock: '8px' }}>
            {FUNNEL.map((f, i) => (
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
                {i < FUNNEL.length - 1 && (
                  <div style={{ position: 'absolute', right: '-2px', top: '52px', fontFamily: "'DM Mono', monospace", fontSize: '10px', color: '#9C3A2A', letterSpacing: '.04em' }}>
                    ↓ {i === 0 ? '45%' : '54%'} drop-off ({i === 0 ? '560' : '368'})
                  </div>
                )}
              </div>
            ))}
          </div>
          <div style={{ marginTop: '18px', paddingTop: '14px', borderTop: '.5px solid var(--border)', fontFamily: "'DM Mono', monospace", fontSize: '11px', color: 'var(--text-3)', letterSpacing: '.04em' }}>
            ✦ 46% of exporters end up ordering — strong intent signal
          </div>
        </div>

        {/* Templates */}
        <div className="card">
          <div style={{ marginBottom: '18px' }}>
            <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '22px', fontWeight: 300, fontStyle: 'italic' }}>Top templates</span>
            <span style={{ marginLeft: '8px', fontFamily: "'DM Mono', monospace", fontSize: '11px', color: 'var(--text-3)', letterSpacing: '.04em' }}>By share of orders</span>
          </div>
          {TOP_TEMPLATES.map((t) => (
            <div key={t.name} style={{ display: 'grid', gridTemplateColumns: '130px 1fr 40px', alignItems: 'center', gap: '14px', padding: '10px 0', borderBottom: '.5px solid var(--border)' }}>
              <div style={{ fontSize: '13px', color: 'var(--text)' }}>{t.name}</div>
              <div style={{ height: '10px', borderRadius: '100px', overflow: 'hidden', background: 'var(--cream-soft)' }}>
                <div style={{ width: t.width, height: '100%', borderRadius: '100px', background: 'var(--brown)', transition: 'width 1s ease' }} />
              </div>
              <div style={{ textAlign: 'right', fontFamily: "'DM Mono', monospace", fontSize: '11px', color: 'var(--text-2)', letterSpacing: '.02em' }}>{t.pct}%</div>
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
              <circle cx="85" cy="85" r="64" fill="none" stroke="#0F6E56" strokeWidth="22" strokeDasharray="256.0 402.12" strokeDashoffset="0" />
              <circle cx="85" cy="85" r="64" fill="none" stroke="#3A6B86" strokeWidth="22" strokeDasharray="48.3 402.12"  strokeDashoffset="-256.0" />
              <circle cx="85" cy="85" r="64" fill="none" stroke="#8B6347" strokeWidth="22" strokeDasharray="26.9 402.12"  strokeDashoffset="-304.3" />
              <circle cx="85" cy="85" r="64" fill="none" stroke="#C4A882" strokeWidth="22" strokeDasharray="39.8 402.12"  strokeDashoffset="-331.2" />
              <circle cx="85" cy="85" r="64" fill="none" stroke="#B86415" strokeWidth="22" strokeDasharray="14.1 402.12"  strokeDashoffset="-371.0" />
              <circle cx="85" cy="85" r="64" fill="none" stroke="#9C3A2A" strokeWidth="22" strokeDasharray="16.5 402.12"  strokeDashoffset="-385.1" />
            </svg>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '38px', fontWeight: 300, fontStyle: 'italic', lineHeight: 1, letterSpacing: '-.01em' }}>342</div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '10px', color: 'var(--text-3)', letterSpacing: '.12em', textTransform: 'uppercase', marginTop: '4px' }}>Total orders</div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '9px' }}>
            {[
              { color: '#0F6E56', label: 'Delivered', count: '218 · 63.7%' },
              { color: '#3A6B86', label: 'Shipped',   count: '41 · 12.0%'  },
              { color: '#C4A882', label: 'Confirmed', count: '34 · 9.9%'   },
              { color: '#8B6347', label: 'Printing',  count: '23 · 6.7%'   },
              { color: '#9C3A2A', label: 'Cancelled', count: '14 · 4.1%'   },
              { color: '#B86415', label: 'Pending',   count: '12 · 3.5%'   },
            ].map((row) => (
              <div key={row.label} style={{ display: 'grid', gridTemplateColumns: '14px 1fr auto', alignItems: 'center', gap: '10px', fontSize: '12.5px' }}>
                <span style={{ width: '9px', height: '9px', borderRadius: '50%', background: row.color, display: 'block' }} />
                <span>{row.label}</span>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '11px', color: 'var(--text-2)', letterSpacing: '.02em' }}>{row.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
