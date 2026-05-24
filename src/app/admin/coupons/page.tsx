'use client';

import { useState, useEffect, useCallback } from 'react';
import { AdminShell, PageHeader, Btn, Card, Badge, PillRow, SlidePanel, Toggle } from '@/components/admin';

// ─── types ────────────────────────────────────────────────────────────────────

interface Coupon {
  id: string;
  code: string;
  description: string | null;
  type: string;
  value: number;
  minOrderPaise: number;
  maxDiscountPaise: number | null;
  totalUsageLimit: number | null;
  usageCount: number;
  perUserLimit: number;
  applicableTo: string;
  validFrom: string;
  validUntil: string | null;
  isActive: boolean;
  status: 'active' | 'expired' | 'disabled';
}

interface Usage {
  id: string;
  orderNumber: string;
  customerEmail: string;
  discountAppliedPaise: number;
  usedAt: string;
}

interface FormState {
  code: string;
  couponType: number;
  value: string;
  minOrderRs: string;
  maxDiscountRs: string;
  totalUsageLimit: string;
  perUserLimit: string;
  validFrom: string;
  validUntil: string;
  description: string;
  activateNow: boolean;
  firstTimeOnly: boolean;
}

// ─── constants ────────────────────────────────────────────────────────────────

const TYPES    = ['% Discount', 'Fixed amount', 'Free shipping'];
const TYPE_MAP = ['percentage', 'fixed_amount', 'free_shipping'] as const;

const STATUS_BADGE: Record<string, 'good' | 'muted' | 'bad'> = {
  active: 'good', expired: 'muted', disabled: 'bad',
};

const today = new Date().toISOString().slice(0, 10);

const DEFAULT_FORM: FormState = {
  code: '', couponType: 0, value: '10', minOrderRs: '0',
  maxDiscountRs: '', totalUsageLimit: '', perUserLimit: '1',
  validFrom: today, validUntil: '', description: '',
  activateNow: true, firstTimeOnly: false,
};

// ─── helpers ──────────────────────────────────────────────────────────────────

function formatValue(type: string, value: number) {
  if (type === 'percentage')   return `${value}% off`;
  if (type === 'fixed_amount') return `₹${Math.round(value / 100)} off`;
  return '—';
}

function formatDate(iso: string | null) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

function couponToForm(c: Coupon): FormState {
  const typeIdx = TYPE_MAP.indexOf(c.type as typeof TYPE_MAP[number]);
  return {
    code:           c.code,
    couponType:     typeIdx >= 0 ? typeIdx : 0,
    value:          c.type === 'fixed_amount' ? String(Math.round(c.value / 100)) : String(c.value),
    minOrderRs:     String(Math.round(c.minOrderPaise / 100)),
    maxDiscountRs:  c.maxDiscountPaise != null ? String(Math.round(c.maxDiscountPaise / 100)) : '',
    totalUsageLimit: c.totalUsageLimit != null ? String(c.totalUsageLimit) : '',
    perUserLimit:   String(c.perUserLimit),
    validFrom:      c.validFrom ? c.validFrom.slice(0, 10) : today,
    validUntil:     c.validUntil ? c.validUntil.slice(0, 10) : '',
    description:    c.description ?? '',
    activateNow:    c.isActive,
    firstTimeOnly:  c.applicableTo === 'first_order',
  };
}

function formToBody(form: FormState) {
  const type = TYPE_MAP[form.couponType];
  const value = type === 'fixed_amount'
    ? Math.round(parseFloat(form.value || '0') * 100)
    : parseFloat(form.value || '0');

  return {
    code:            form.code.toUpperCase().replace(/[^A-Z0-9]/g, ''),
    type,
    value,
    minOrderPaise:   Math.round(parseFloat(form.minOrderRs || '0') * 100),
    maxDiscountPaise: form.maxDiscountRs ? Math.round(parseFloat(form.maxDiscountRs) * 100) : null,
    totalUsageLimit:  form.totalUsageLimit ? parseInt(form.totalUsageLimit) : null,
    perUserLimit:    parseInt(form.perUserLimit || '1'),
    applicableTo:    form.firstTimeOnly ? 'first_order' : 'all',
    validFrom:       form.validFrom || new Date().toISOString(),
    validUntil:      form.validUntil || null,
    description:     form.description || null,
    isActive:        form.activateNow,
  };
}

// ─── component ────────────────────────────────────────────────────────────────

export default function CouponsPage() {
  const [coupons,       setCoupons]       = useState<Coupon[]>([]);
  const [counts,        setCounts]        = useState({ total: 0, active: 0, expired: 0, disabled: 0 });
  const [loading,       setLoading]       = useState(true);
  const [activeFilter,  setActiveFilter]  = useState(0);
  const [search,        setSearch]        = useState('');
  const [typeFilter,    setTypeFilter]    = useState('');
  const [panelMode,     setPanelMode]     = useState<null | 'create' | 'edit' | 'usages'>(null);
  const [editingId,     setEditingId]     = useState<string | null>(null);
  const [form,          setForm]          = useState<FormState>(DEFAULT_FORM);
  const [saving,        setSaving]        = useState(false);
  const [saveError,     setSaveError]     = useState('');
  const [usagesTitle,   setUsagesTitle]   = useState('');
  const [usages,        setUsages]        = useState<Usage[]>([]);
  const [usagesLoading, setUsagesLoading] = useState(false);

  // ── load ──────────────────────────────────────────────────────────────────
  const loadCoupons = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/coupons');
      const json = await res.json();
      if (json.coupons) {
        setCoupons(json.coupons);
        setCounts(json.counts);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadCoupons(); }, [loadCoupons]);

  // ── filter ────────────────────────────────────────────────────────────────
  const filtered = coupons.filter((c) => {
    if (activeFilter === 1 && c.status !== 'active')   return false;
    if (activeFilter === 2 && c.status !== 'expired')  return false;
    if (activeFilter === 3 && c.status !== 'disabled') return false;
    if (search     && !c.code.toLowerCase().includes(search.toLowerCase())) return false;
    if (typeFilter && c.type !== typeFilter) return false;
    return true;
  });

  const pills = [
    { label: 'All',      count: counts.total    },
    { label: 'Active',   count: counts.active   },
    { label: 'Expired',  count: counts.expired  },
    { label: 'Disabled', count: counts.disabled },
  ];

  // ── panel helpers ─────────────────────────────────────────────────────────
  function setField<K extends keyof FormState>(key: K, val: FormState[K]) {
    setForm(f => ({ ...f, [key]: val }));
  }

  function openCreate() {
    setEditingId(null);
    setForm(DEFAULT_FORM);
    setSaveError('');
    setPanelMode('create');
  }

  function openEdit(c: Coupon) {
    setEditingId(c.id);
    setForm(couponToForm(c));
    setSaveError('');
    setPanelMode('edit');
  }

  async function openUsages(c: Coupon) {
    setUsagesTitle(`Usages for ${c.code}`);
    setUsages([]);
    setPanelMode('usages');
    setUsagesLoading(true);
    try {
      const res  = await fetch(`/api/admin/coupons/${c.id}/usages`);
      const json = await res.json();
      if (json.usages) setUsages(json.usages);
    } finally {
      setUsagesLoading(false);
    }
  }

  function closePanel() {
    setPanelMode(null);
    setEditingId(null);
    setSaveError('');
  }

  // ── save ──────────────────────────────────────────────────────────────────
  async function handleSave() {
    setSaving(true);
    setSaveError('');
    const body = formToBody(form);
    try {
      const url    = panelMode === 'edit' ? `/api/admin/coupons/${editingId}` : '/api/admin/coupons';
      const method = panelMode === 'edit' ? 'PATCH' : 'POST';
      const res    = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(body),
      });
      const json = await res.json();
      if (!res.ok) { setSaveError(json.error || 'Failed to save'); return; }
      await loadCoupons();
      closePanel();
    } finally {
      setSaving(false);
    }
  }

  // ── render ────────────────────────────────────────────────────────────────
  return (
    <AdminShell>
      <PageHeader
        title="Coupons"
        subtitle={`${counts.total} total · ${counts.active} active · ${coupons.reduce((s, c) => s + c.usageCount, 0)} redemptions`}
      >
        <Btn variant="primary" onClick={openCreate}>
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
        <select className="select" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
          <option value="">All types</option>
          <option value="percentage">% Discount</option>
          <option value="fixed_amount">Fixed amount</option>
          <option value="free_shipping">Free shipping</option>
        </select>
      </div>

      <PillRow items={pills} active={activeFilter} onSelect={setActiveFilter} />

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
              {loading && (
                <tr><td colSpan={7} style={{ textAlign: 'center', padding: '32px', fontFamily: "'DM Mono', monospace", fontSize: '12px', color: 'var(--text-3)' }}>Loading…</td></tr>
              )}
              {!loading && filtered.length === 0 && (
                <tr><td colSpan={7} style={{ textAlign: 'center', padding: '32px', fontFamily: "'DM Mono', monospace", fontSize: '12px', color: 'var(--text-3)' }}>No coupons found</td></tr>
              )}
              {filtered.map((c) => {
                const pct = c.totalUsageLimit ? Math.round((c.usageCount / c.totalUsageLimit) * 100) : 40;
                return (
                  <tr key={c.id}>
                    <td><span className="code-chip">{c.code}</span></td>
                    <td>{TYPES[TYPE_MAP.indexOf(c.type as typeof TYPE_MAP[number])] ?? c.type}</td>
                    <td className="amount">{formatValue(c.type, c.value)}</td>
                    <td>
                      <button
                        style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', textAlign: 'left' }}
                        onClick={() => openUsages(c)}
                        title="View usage log"
                      >
                        <span className="used-limit">
                          {c.usageCount} / {c.totalUsageLimit ?? '∞'}
                          <span className="usage-bar"><span className="usage-fill" style={{ width: `${Math.min(pct, 100)}%` }} /></span>
                        </span>
                      </button>
                    </td>
                    <td className="num" style={{ whiteSpace: 'nowrap' }}>{formatDate(c.validUntil)}</td>
                    <td><Badge variant={STATUS_BADGE[c.status]}>{c.status.charAt(0).toUpperCase() + c.status.slice(1)}</Badge></td>
                    <td>
                      <button className="icon-btn" onClick={() => openEdit(c)} title="Edit">
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

      {/* Create / Edit Panel */}
      <SlidePanel
        open={panelMode === 'create' || panelMode === 'edit'}
        onClose={closePanel}
        title={panelMode === 'edit' ? `Edit ${editingId ? coupons.find(c => c.id === editingId)?.code : ''}` : 'New coupon'}
        meta={panelMode === 'edit' ? 'Update coupon details' : 'Create a discount code'}
        footer={
          <>
            <Btn variant="outline" onClick={closePanel}>Cancel</Btn>
            <Btn variant="primary" disabled={saving} onClick={handleSave}>
              {saving ? 'Saving…' : panelMode === 'edit' ? 'Save changes' : 'Save coupon'}
            </Btn>
          </>
        }
      >
        {saveError && (
          <div style={{ padding: '10px 14px', background: 'rgba(156,58,42,.08)', borderRadius: '8px', fontFamily: "'DM Mono', monospace", fontSize: '12px', color: '#9C3A2A', marginBottom: '16px' }}>
            {saveError}
          </div>
        )}

        <div className="field-group">
          <label>Coupon code</label>
          <input
            type="text"
            placeholder="SUMMER15"
            maxLength={50}
            value={form.code}
            onChange={(e) => setField('code', e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))}
            disabled={panelMode === 'edit'}
            style={{ textTransform: 'uppercase', letterSpacing: '.06em', fontFamily: "'DM Mono', monospace" }}
          />
          <div className="hint">3–50 chars, A–Z and numbers only.</div>
        </div>

        {panelMode === 'create' && (
          <div className="field-group">
            <label>Type</label>
            <div className="type-switcher">
              {TYPES.map((t, i) => (
                <button key={t} onClick={() => setField('couponType', i)} className={`type-option${i === form.couponType ? ' active' : ''}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>
        )}

        {form.couponType < 2 && (
          <div className="field-group">
            <label>{form.couponType === 0 ? 'Discount %' : 'Amount (₹)'}</label>
            <input
              type="number"
              value={form.value}
              onChange={(e) => setField('value', e.target.value)}
              min={1}
              max={form.couponType === 0 ? 100 : undefined}
            />
          </div>
        )}

        <div className="field-group">
          <label>Min order value (₹)</label>
          <input
            type="number"
            value={form.minOrderRs}
            onChange={(e) => setField('minOrderRs', e.target.value)}
            min={0}
            placeholder="0"
          />
          <div className="hint">Minimum cart value to apply this coupon.</div>
        </div>

        {form.couponType === 0 && (
          <div className="field-group">
            <label>Max discount cap (₹)</label>
            <input
              type="number"
              value={form.maxDiscountRs}
              onChange={(e) => setField('maxDiscountRs', e.target.value)}
              min={1}
              placeholder="Leave blank for no cap"
            />
          </div>
        )}

        <div className="field-group">
          <label>Valid dates</label>
          <div className="date-range">
            <input type="date" value={form.validFrom} onChange={(e) => setField('validFrom', e.target.value)} />
            <input type="date" value={form.validUntil} onChange={(e) => setField('validUntil', e.target.value)} placeholder="No end date" />
          </div>
        </div>

        <div className="field-group">
          <label>Total usage limit</label>
          <input
            type="number"
            value={form.totalUsageLimit}
            onChange={(e) => setField('totalUsageLimit', e.target.value)}
            placeholder="Leave blank for unlimited"
            min={1}
          />
        </div>

        <div className="field-group">
          <label>Per-user limit</label>
          <input
            type="number"
            value={form.perUserLimit}
            onChange={(e) => setField('perUserLimit', e.target.value)}
            min={1}
            placeholder="1"
          />
        </div>

        <div className="field-group">
          <label>Description (optional)</label>
          <input
            type="text"
            value={form.description}
            onChange={(e) => setField('description', e.target.value)}
            placeholder="Internal note about this coupon"
            maxLength={255}
          />
        </div>

        <div className="toggle-row">
          <div>
            <div className="toggle-row-label">Activate immediately</div>
            <div className="toggle-row-desc">Customers can use this coupon as soon as you save.</div>
          </div>
          <Toggle on={form.activateNow} onChange={(v) => setField('activateNow', v)} />
        </div>

        <div className="toggle-row">
          <div>
            <div className="toggle-row-label">First-time customers only</div>
            <div className="toggle-row-desc">Restrict to users with zero previous orders.</div>
          </div>
          <Toggle on={form.firstTimeOnly} onChange={(v) => setField('firstTimeOnly', v)} />
        </div>
      </SlidePanel>

      {/* Usage Log Panel */}
      <SlidePanel
        open={panelMode === 'usages'}
        onClose={closePanel}
        title={usagesTitle}
        meta="Redemption log"
        footer={<Btn variant="outline" onClick={closePanel}>Close</Btn>}
      >
        {usagesLoading && (
          <div style={{ padding: '32px 0', textAlign: 'center', fontFamily: "'DM Mono', monospace", fontSize: '12px', color: 'var(--text-3)' }}>Loading…</div>
        )}
        {!usagesLoading && usages.length === 0 && (
          <div style={{ padding: '32px 0', textAlign: 'center', fontFamily: "'DM Mono', monospace", fontSize: '12px', color: 'var(--text-3)' }}>No usages yet</div>
        )}
        {usages.map((u) => (
          <div key={u.id} style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '8px', padding: '12px 0', borderBottom: '.5px solid var(--border)' }}>
            <div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '12px', letterSpacing: '.04em', color: 'var(--text)' }}>{u.orderNumber}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-3)', marginTop: '3px' }}>{u.customerEmail}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '12px', color: 'var(--brown)' }}>−₹{Math.round(u.discountAppliedPaise / 100)}</div>
              <div style={{ fontSize: '11px', color: 'var(--text-3)', marginTop: '3px' }}>
                {new Date(u.usedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </div>
            </div>
          </div>
        ))}
      </SlidePanel>
    </AdminShell>
  );
}
