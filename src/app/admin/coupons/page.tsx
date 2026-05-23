'use client';

import { useState } from 'react';
import { AdminShell, PageHeader, Btn, Card, Badge, PillRow, SlidePanel, Toggle } from '@/components/admin';

const COUPONS = [
  { code: 'FIRST10',   type: '% Discount',    value: '10% off', used: 214,  limit: 1000, until: 'Dec 31, 2026', status: 'Active'   },
  { code: 'PRINT79',   type: 'Fixed amount',   value: '₹79 off', used: 88,   limit: null, until: 'Jul 30, 2026', status: 'Active'   },
  { code: 'FREESHIP',  type: 'Free shipping',  value: '—',       used: 462,  limit: 2000, until: 'Dec 31, 2026', status: 'Active'   },
  { code: 'DIWALI25',  type: '% Discount',     value: '25% off', used: 312,  limit: 500,  until: 'Jun 15, 2026', status: 'Active'   },
  { code: 'BUNDLE100', type: 'Fixed amount',   value: '₹100 off',used: 76,   limit: 250,  until: 'Aug 01, 2026', status: 'Active'   },
  { code: 'WEDDING50', type: '% Discount',     value: '50% off', used: 8,    limit: 100,  until: 'Mar 31, 2027', status: 'Active'   },
  { code: 'VALENTINE', type: '% Discount',     value: '15% off', used: 428,  limit: 500,  until: 'Feb 28, 2026', status: 'Expired'  },
  { code: 'LAUNCH20',  type: '% Discount',     value: '20% off', used: 1000, limit: 1000, until: 'Apr 01, 2026', status: 'Expired'  },
  { code: 'TEST5',     type: '% Discount',     value: '5% off',  used: 0,    limit: 100,  until: 'Dec 31, 2026', status: 'Disabled' },
];

const STATUS_BADGE: Record<string, 'good' | 'muted' | 'bad'> = { Active: 'good', Expired: 'muted', Disabled: 'bad' };
const PILLS = [{ label: 'All', count: 12 }, { label: 'Active', count: 8 }, { label: 'Expired', count: 3 }, { label: 'Disabled', count: 1 }];
const TYPES = ['% Discount', 'Fixed amount', 'Free shipping'];

export default function CouponsPage() {
  const [activeFilter, setActiveFilter] = useState(0);
  const [search, setSearch] = useState('');
  const [panelOpen, setPanelOpen] = useState(false);
  const [couponType, setCouponType] = useState(0);
  const [activateNow, setActivateNow] = useState(true);
  const [firstTimeOnly, setFirstTimeOnly] = useState(false);

  const filtered = COUPONS.filter((c) => {
    if (activeFilter === 1 && c.status !== 'Active') return false;
    if (activeFilter === 2 && c.status !== 'Expired') return false;
    if (activeFilter === 3 && c.status !== 'Disabled') return false;
    if (search && !c.code.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <AdminShell>
      <PageHeader title="Coupons" subtitle="12 total · 8 active · 1,240 redemptions this period">
        <Btn variant="primary" onClick={() => setPanelOpen(true)}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M12 5v14M5 12h14"/></svg>
          Create coupon
        </Btn>
      </PageHeader>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '18px', flexWrap: 'wrap' as const }}>
        <input
          type="search"
          placeholder="Search coupon code…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input search"
          style={{ flex: '1', minWidth: '240px', maxWidth: '380px' }}
        />
        <select className="select">
          <option>All types</option>
          {TYPES.map((t) => <option key={t}>{t}</option>)}
        </select>
      </div>

      <PillRow items={PILLS} active={activeFilter} onSelect={setActiveFilter} />

      <Card style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="tbl" style={{ minWidth: '780px' }}>
            <thead>
              <tr>
                {['Code', 'Type', 'Value', 'Used / Limit', 'Valid until', 'Status', ''].map((h) => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => {
                const pct = c.limit ? Math.round((c.used / c.limit) * 100) : 42;
                return (
                  <tr key={c.code}>
                    <td><span className="code-chip">{c.code}</span></td>
                    <td>{c.type}</td>
                    <td className="amount">{c.value}</td>
                    <td>
                      <span className="used-limit">
                        {c.used} / {c.limit ?? '—'}
                        <span className="usage-bar"><span className="usage-fill" style={{ width: `${pct}%` }} /></span>
                      </span>
                    </td>
                    <td className="num" style={{ whiteSpace: 'nowrap' }}>{c.until}</td>
                    <td><Badge variant={STATUS_BADGE[c.status]}>{c.status}</Badge></td>
                    <td>
                      <button className="icon-btn">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 113 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <SlidePanel
        open={panelOpen}
        onClose={() => setPanelOpen(false)}
        title="New coupon"
        meta="Create a discount code"
        footer={
          <>
            <Btn variant="outline" onClick={() => setPanelOpen(false)}>Cancel</Btn>
            <Btn variant="primary">Save coupon</Btn>
          </>
        }
      >
        <div className="field-group">
          <label>Coupon code</label>
          <input
            type="text"
            placeholder="SUMMER15"
            maxLength={20}
            style={{ textTransform: 'uppercase', letterSpacing: '.06em', fontFamily: "'DM Mono', monospace" }}
          />
          <div className="hint">4–20 chars, A–Z and numbers only.</div>
        </div>

        <div className="field-group">
          <label>Type</label>
          <div className="type-switcher">
            {TYPES.map((t, i) => (
              <button key={t} onClick={() => setCouponType(i)} className={`type-option${i === couponType ? ' active' : ''}`}>
                {t}
              </button>
            ))}
          </div>
        </div>

        {couponType < 2 && (
          <div className="field-group">
            <label>{couponType === 0 ? 'Discount %' : 'Amount (₹)'}</label>
            <input type="number" defaultValue={couponType === 0 ? 10 : 79} min={1} />
          </div>
        )}

        <div className="field-group">
          <label>Valid dates</label>
          <div className="date-range">
            <input type="date" defaultValue="2026-05-23" />
            <input type="date" defaultValue="2026-12-31" />
          </div>
        </div>

        <div className="field-group">
          <label>Total usage limit</label>
          <input type="number" placeholder="Leave blank for unlimited" />
        </div>

        <div className="toggle-row">
          <div>
            <div className="toggle-row-label">Activate immediately</div>
            <div className="toggle-row-desc">Customers can use this coupon as soon as you save.</div>
          </div>
          <Toggle on={activateNow} onChange={setActivateNow} />
        </div>

        <div className="toggle-row">
          <div>
            <div className="toggle-row-label">First-time customers only</div>
            <div className="toggle-row-desc">Restrict to users with zero previous orders.</div>
          </div>
          <Toggle on={firstTimeOnly} onChange={setFirstTimeOnly} />
        </div>
      </SlidePanel>
    </AdminShell>
  );
}
