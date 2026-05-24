'use client';

import { useState, useEffect, useCallback } from 'react';
import { AdminShell, PageHeader, Card, CardHeader, Btn, Badge } from '@/components/admin';

interface TemplatePricing {
  id: string;
  template_id: string;
  template_name: string;
  print_size_id: string;
  size_slug: string;
  size_name: string;
  items_per_sheet: number;
  first_print_paise: number;
  extra_print_paise: number;
  is_active: boolean;
}

interface PrintSize {
  id: string;
  slug: string;
  name: string;
  width_mm: number;
  height_mm: number;
  items_per_sheet: number | null;
  columns: number | null;
  rows: number | null;
}

interface Bundle {
  id: string;
  template_id: string;
  bundle_name: string;
  quantity: number;
  price_paise: number;
  is_active: boolean;
  sort_order: number;
}

interface PrintFinish {
  id: string;
  slug: string;
  name: string;
  price_addon_paise: number;
  is_active: boolean;
}

interface SiteSetting {
  key: string;
  value: string;
  description: string;
}

export default function AdminPricingPage() {
  const [templates, setTemplates] = useState<TemplatePricing[]>([]);
  const [bundles, setBundles] = useState<Bundle[]>([]);
  const [printSizes, setPrintSizes] = useState<PrintSize[]>([]);
  const [finishes, setFinishes] = useState<PrintFinish[]>([]);
  const [settings, setSettings] = useState<SiteSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ firstPrintPaise: 0, extraPrintPaise: 0, itemsPerSheet: 6, printSizeId: '' });
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'individual' | 'bundles' | 'settings'>('individual');
  // Bundle form
  const [bundleForm, setBundleForm] = useState({ templateId: '', bundleName: '', quantity: 3, pricePaise: 9900 });
  const [showBundleForm, setShowBundleForm] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const [pricingRes, settingsRes] = await Promise.all([
        fetch('/api/admin/pricing'),
        fetch('/api/admin/pricing/sizes'),
      ]);
      const pricingData = await pricingRes.json();
      const settingsData = await settingsRes.json();
      setTemplates(pricingData.templatePricing || []);
      setBundles(pricingData.bundles || []);
      setPrintSizes(pricingData.printSizes || []);
      setFinishes(settingsData.finishes || []);
      setSettings(settingsData.settings || []);
    } catch { /* */ }
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const startEdit = (t: TemplatePricing) => {
    setEditingId(t.template_id);
    setEditForm({
      firstPrintPaise: t.first_print_paise,
      extraPrintPaise: t.extra_print_paise,
      itemsPerSheet: t.items_per_sheet,
      printSizeId: t.print_size_id,
    });
  };

  const saveEdit = async () => {
    if (!editingId) return;
    setSaving(true);
    await fetch('/api/admin/pricing', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        templateId: editingId,
        firstPrintPaise: editForm.firstPrintPaise,
        extraPrintPaise: editForm.extraPrintPaise,
        itemsPerSheet: editForm.itemsPerSheet,
        printSizeId: editForm.printSizeId,
      }),
    });
    setEditingId(null);
    setSaving(false);
    fetchData();
  };

  const toggleActive = async (templateId: string, currentActive: boolean) => {
    await fetch('/api/admin/pricing', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ templateId, isActive: !currentActive }),
    });
    fetchData();
  };

  const updateSetting = async (key: string, value: string) => {
    await fetch('/api/admin/pricing/sizes', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key, value }),
    });
    fetchData();
  };

  const saveBundle = async () => {
    setSaving(true);
    await fetch('/api/admin/pricing', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'bundle',
        templateId: bundleForm.templateId,
        bundleName: bundleForm.bundleName,
        quantity: bundleForm.quantity,
        pricePaise: bundleForm.pricePaise,
      }),
    });
    setShowBundleForm(false);
    setBundleForm({ templateId: '', bundleName: '', quantity: 3, pricePaise: 9900 });
    setSaving(false);
    fetchData();
  };

  const deleteBundle = async (bundleId: string) => {
    await fetch('/api/admin/pricing', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'bundle', bundleId }),
    });
    fetchData();
  };

  const formatPrice = (paise: number) => `₹${(paise / 100).toFixed(paise % 100 === 0 ? 0 : 2)}`;

  // Group bundles by template
  const bundlesByTemplate: Record<string, Bundle[]> = {};
  bundles.forEach(b => {
    if (!bundlesByTemplate[b.template_id]) bundlesByTemplate[b.template_id] = [];
    bundlesByTemplate[b.template_id].push(b);
  });

  if (loading) {
    return (
      <AdminShell>
        <PageHeader title="Pricing" subtitle="Loading..." />
        <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#8B6F5C] border-t-transparent" />
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell>
      <PageHeader title="Pricing Configuration" subtitle="3-layer pricing: Individual + Bundles + Smart Upsell">
        <Btn variant="outline" onClick={() => fetchData()}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M1 4v6h6M23 20v-6h-6"/><path d="M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15"/></svg>
          Refresh
        </Btn>
      </PageHeader>

      {/* Tab Navigation */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 20, background: '#F7F3EC', borderRadius: 10, padding: 4 }}>
        {(['individual', 'bundles', 'settings'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              flex: 1, padding: '10px 16px', borderRadius: 8, fontSize: 13, fontWeight: 500,
              border: 'none', cursor: 'pointer', transition: 'all .15s',
              background: activeTab === tab ? '#fff' : 'transparent',
              color: activeTab === tab ? '#1A1714' : '#A39080',
              boxShadow: activeTab === tab ? '0 1px 3px rgba(0,0,0,0.06)' : 'none',
            }}
          >
            {tab === 'individual' ? '① Individual Pricing' : tab === 'bundles' ? '② Bundle Packs' : '③ Settings & Finishes'}
          </button>
        ))}
      </div>

      {/* ═══ TAB 1: Individual Pricing ═══ */}
      {activeTab === 'individual' && (
        <>
          <Card>
            <CardHeader title="Per-Piece Pricing" action={`${templates.length} templates`} />
            <p style={{ fontSize: 12, color: '#A39080', margin: '-8px 0 16px', padding: '0 4px' }}>
              First print of each type = base price. Additional prints of same type = discounted extra price.
              Sheet coverage shows how much of an A4 sheet each polaroid occupies.
            </p>
            <div style={{ overflowX: 'auto' }}>
              <table className="tbl">
                <thead>
                  <tr>
                    <th>Template</th>
                    <th>Print Size</th>
                    <th>Sheet Coverage</th>
                    <th>1st Print</th>
                    <th>Extra Print</th>
                    <th>Example (3pc)</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {templates.map(t => (
                    <tr key={t.template_id} style={{ opacity: t.is_active ? 1 : 0.5 }}>
                      {editingId === t.template_id ? (
                        <>
                          <td><strong>{t.template_name}</strong></td>
                          <td>
                            <select
                              value={editForm.printSizeId}
                              onChange={e => {
                                const sz = printSizes.find(s => s.id === e.target.value);
                                setEditForm(p => ({
                                  ...p,
                                  printSizeId: e.target.value,
                                  itemsPerSheet: sz?.items_per_sheet || p.itemsPerSheet,
                                }));
                              }}
                              className="admin-input-sm"
                              style={{ width: 'auto', height: 30 }}
                            >
                              {printSizes.map(s => (
                                <option key={s.id} value={s.id}>
                                  {s.name} ({s.width_mm}×{s.height_mm}mm)
                                </option>
                              ))}
                            </select>
                          </td>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                              <span style={{ fontSize: 11, color: '#A39080' }}>1/</span>
                              <input
                                type="number"
                                value={editForm.itemsPerSheet}
                                onChange={e => setEditForm(p => ({ ...p, itemsPerSheet: parseInt(e.target.value) || 1 }))}
                                className="admin-input-sm"
                                style={{ width: 40 }}
                                min={1}
                              />
                              <span style={{ fontSize: 11, color: '#A39080' }}>of A4</span>
                            </div>
                          </td>
                          <td>
                            <div className="price-input">
                              <span>₹</span>
                              <input
                                type="number"
                                value={editForm.firstPrintPaise / 100}
                                onChange={e => setEditForm(p => ({ ...p, firstPrintPaise: Math.round(parseFloat(e.target.value) * 100) || 0 }))}
                                className="admin-input-sm"
                                step="1"
                              />
                            </div>
                          </td>
                          <td>
                            <div className="price-input">
                              <span>₹</span>
                              <input
                                type="number"
                                value={editForm.extraPrintPaise / 100}
                                onChange={e => setEditForm(p => ({ ...p, extraPrintPaise: Math.round(parseFloat(e.target.value) * 100) || 0 }))}
                                className="admin-input-sm"
                                step="1"
                              />
                            </div>
                          </td>
                          <td className="num">{formatPrice(editForm.firstPrintPaise + editForm.extraPrintPaise * 2)}</td>
                          <td><Badge variant={t.is_active ? 'good' : 'muted'}>{t.is_active ? 'Active' : 'Off'}</Badge></td>
                          <td>
                            <div style={{ display: 'flex', gap: 6 }}>
                              <Btn variant="primary" onClick={saveEdit} disabled={saving}>{saving ? '...' : 'Save'}</Btn>
                              <Btn variant="outline" onClick={() => setEditingId(null)}>Cancel</Btn>
                            </div>
                          </td>
                        </>
                      ) : (
                        <>
                          <td><strong>{t.template_name}</strong></td>
                          <td><span className="num">{t.size_name}</span></td>
                          <td>
                            <span className="num" style={{ background: '#F1E8DC', padding: '3px 8px', borderRadius: 4 }}>
                              1/{t.items_per_sheet} of A4
                            </span>
                          </td>
                          <td className="amount">{formatPrice(t.first_print_paise)}</td>
                          <td className="amount">{formatPrice(t.extra_print_paise)}</td>
                          <td className="num">{formatPrice(t.first_print_paise + t.extra_print_paise * 2)}</td>
                          <td><Badge variant={t.is_active ? 'good' : 'muted'}>{t.is_active ? 'Active' : 'Off'}</Badge></td>
                          <td>
                            <div style={{ display: 'flex', gap: 6 }}>
                              <Btn variant="outline" onClick={() => startEdit(t)}>Edit</Btn>
                              <Btn variant="outline" onClick={() => toggleActive(t.template_id, t.is_active)}>
                                {t.is_active ? 'Disable' : 'Enable'}
                              </Btn>
                            </div>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Quick Price Calculator */}
          <Card>
            <CardHeader title="Quick Price Calculator" />
            <p style={{ fontSize: 12, color: '#A39080', margin: '-8px 0 12px' }}>
              Individual pricing breakdown per template
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
              {templates.filter(t => t.is_active).map(t => (
                <div key={t.template_id} style={{ padding: '12px 14px', borderRadius: 8, background: '#f9f6f2', border: '0.5px solid rgba(26,23,20,0.06)' }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#1A1714', marginBottom: 4 }}>{t.template_name}</div>
                  <div style={{ fontSize: 10, color: '#A39080', marginBottom: 6 }}>Sheet: 1/{t.items_per_sheet} of A4</div>
                  <div style={{ fontSize: 11, color: '#5C4A3A', lineHeight: 1.8 }}>
                    1 pc: {formatPrice(t.first_print_paise)}<br />
                    3 pc: {formatPrice(t.first_print_paise + t.extra_print_paise * 2)}<br />
                    6 pc: {formatPrice(t.first_print_paise + t.extra_print_paise * 5)}<br />
                    9 pc: {formatPrice(t.first_print_paise + t.extra_print_paise * 8)}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </>
      )}

      {/* ═══ TAB 2: Bundle Pricing ═══ */}
      {activeTab === 'bundles' && (
        <>
          <Card>
            <CardHeader title="Bundle Packs" />
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: -8, marginBottom: 8 }}>
              <Btn variant="primary" onClick={() => setShowBundleForm(true)}>+ Add Bundle</Btn>
            </div>
            <p style={{ fontSize: 12, color: '#A39080', margin: '-8px 0 16px', padding: '0 4px' }}>
              Bundles encourage higher order value. Customers see bundles as recommended options.
              Extra pieces beyond bundles use individual extra-print pricing.
            </p>

            {/* Add bundle form */}
            {showBundleForm && (
              <div style={{ padding: 16, background: '#f9f6f2', borderRadius: 10, marginBottom: 16, border: '0.5px solid rgba(26,23,20,0.08)' }}>
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>New Bundle</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 80px 100px auto', gap: 10, alignItems: 'end' }}>
                  <div>
                    <label style={{ fontSize: 11, color: '#A39080', display: 'block', marginBottom: 4 }}>Template</label>
                    <select
                      value={bundleForm.templateId}
                      onChange={e => setBundleForm(p => ({ ...p, templateId: e.target.value }))}
                      className="admin-input-sm"
                      style={{ width: '100%', height: 34 }}
                    >
                      <option value="">Select...</option>
                      {templates.filter(t => t.is_active).map(t => (
                        <option key={t.template_id} value={t.template_id}>{t.template_name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: 11, color: '#A39080', display: 'block', marginBottom: 4 }}>Bundle Name</label>
                    <input
                      value={bundleForm.bundleName}
                      onChange={e => setBundleForm(p => ({ ...p, bundleName: e.target.value }))}
                      placeholder="e.g. 3 Classic Pack"
                      className="admin-input-sm"
                      style={{ width: '100%', height: 34 }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 11, color: '#A39080', display: 'block', marginBottom: 4 }}>Qty</label>
                    <input
                      type="number"
                      value={bundleForm.quantity}
                      onChange={e => setBundleForm(p => ({ ...p, quantity: parseInt(e.target.value) || 1 }))}
                      className="admin-input-sm"
                      style={{ width: '100%', height: 34 }}
                      min={2}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 11, color: '#A39080', display: 'block', marginBottom: 4 }}>Price (₹)</label>
                    <input
                      type="number"
                      value={bundleForm.pricePaise / 100}
                      onChange={e => setBundleForm(p => ({ ...p, pricePaise: Math.round(parseFloat(e.target.value) * 100) || 0 }))}
                      className="admin-input-sm"
                      style={{ width: '100%', height: 34 }}
                      step="1"
                    />
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <Btn variant="primary" onClick={saveBundle} disabled={saving || !bundleForm.templateId || !bundleForm.bundleName}>
                      {saving ? '...' : 'Save'}
                    </Btn>
                    <Btn variant="outline" onClick={() => setShowBundleForm(false)}>Cancel</Btn>
                  </div>
                </div>
              </div>
            )}

            {/* Bundle list grouped by template */}
            {templates.filter(t => t.is_active && bundlesByTemplate[t.template_id]?.length).map(t => (
              <div key={t.template_id} style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#1A1714', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                  {t.template_name}
                  <span style={{ fontSize: 10, color: '#A39080', fontWeight: 400 }}>
                    (Individual: {formatPrice(t.first_print_paise)} first, {formatPrice(t.extra_print_paise)} extra)
                  </span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 10 }}>
                  {(bundlesByTemplate[t.template_id] || []).map(b => {
                    const perPiece = b.price_paise / b.quantity;
                    const individualTotal = t.first_print_paise + t.extra_print_paise * (b.quantity - 1);
                    const savings = individualTotal - b.price_paise;
                    return (
                      <div key={b.id} style={{
                        padding: '12px 14px', borderRadius: 10, background: '#fff',
                        border: '0.5px solid rgba(26,23,20,0.08)', position: 'relative',
                      }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: '#1A1714' }}>{b.bundle_name}</div>
                        <div style={{ fontSize: 20, fontWeight: 700, color: '#7a5540', margin: '4px 0' }}>
                          {formatPrice(b.price_paise)}
                        </div>
                        <div style={{ fontSize: 11, color: '#5C4A3A' }}>
                          {b.quantity} prints · {formatPrice(perPiece)}/ea
                        </div>
                        {savings > 0 && (
                          <div style={{ fontSize: 10, color: '#2d8a4e', marginTop: 4, fontWeight: 500 }}>
                            Save {formatPrice(savings)} vs individual
                          </div>
                        )}
                        <button
                          onClick={() => deleteBundle(b.id)}
                          style={{
                            position: 'absolute', top: 8, right: 8, width: 22, height: 22,
                            borderRadius: 6, border: '0.5px solid rgba(26,23,20,0.1)', background: '#fff',
                            cursor: 'pointer', fontSize: 12, color: '#A39080', display: 'flex',
                            alignItems: 'center', justifyContent: 'center',
                          }}
                          title="Delete bundle"
                        >×</button>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Templates without bundles */}
            {templates.filter(t => t.is_active && !bundlesByTemplate[t.template_id]?.length).length > 0 && (
              <div style={{ marginTop: 16, padding: '12px 16px', background: '#FFF8F0', borderRadius: 8, border: '0.5px solid rgba(184,100,21,0.15)' }}>
                <div style={{ fontSize: 12, color: '#B86415', fontWeight: 500, marginBottom: 4 }}>
                  Templates without bundles:
                </div>
                <div style={{ fontSize: 11, color: '#5C4A3A' }}>
                  {templates.filter(t => t.is_active && !bundlesByTemplate[t.template_id]?.length).map(t => t.template_name).join(', ')}
                </div>
                <div style={{ fontSize: 10, color: '#A39080', marginTop: 4 }}>
                  These use individual pricing only. Add bundles to encourage higher order value.
                </div>
              </div>
            )}
          </Card>

          {/* Bundle vs Individual Comparison */}
          <Card>
            <CardHeader title="Bundle Value Comparison" />
            <p style={{ fontSize: 12, color: '#A39080', margin: '-8px 0 12px' }}>
              How bundles compare to individual pricing — customers see this savings incentive
            </p>
            <div style={{ overflowX: 'auto' }}>
              <table className="tbl">
                <thead>
                  <tr>
                    <th>Bundle</th>
                    <th>Qty</th>
                    <th>Bundle Price</th>
                    <th>Individual Price</th>
                    <th>Savings</th>
                    <th>Per Piece</th>
                  </tr>
                </thead>
                <tbody>
                  {bundles.filter(b => b.is_active).map(b => {
                    const t = templates.find(tp => tp.template_id === b.template_id);
                    if (!t) return null;
                    const individualTotal = t.first_print_paise + t.extra_print_paise * (b.quantity - 1);
                    const savings = individualTotal - b.price_paise;
                    const pct = Math.round((savings / individualTotal) * 100);
                    return (
                      <tr key={b.id}>
                        <td><strong>{b.bundle_name}</strong></td>
                        <td className="num">{b.quantity}</td>
                        <td className="amount">{formatPrice(b.price_paise)}</td>
                        <td className="num" style={{ textDecoration: 'line-through', color: '#A39080' }}>{formatPrice(individualTotal)}</td>
                        <td>
                          {savings > 0 ? (
                            <Badge variant="good">-{pct}% ({formatPrice(savings)})</Badge>
                          ) : (
                            <Badge variant="muted">No savings</Badge>
                          )}
                        </td>
                        <td className="num">{formatPrice(b.price_paise / b.quantity)}/ea</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}

      {/* ═══ TAB 3: Settings & Finishes ═══ */}
      {activeTab === 'settings' && (
        <>
          {/* Finishes */}
          <Card>
            <CardHeader title="Print Finishes" />
            <div style={{ overflowX: 'auto' }}>
              <table className="tbl">
                <thead>
                  <tr>
                    <th>Finish</th>
                    <th>Addon Price</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {finishes.map(f => (
                    <tr key={f.id}>
                      <td><strong>{f.name}</strong> <span className="num">({f.slug})</span></td>
                      <td className="amount">{f.price_addon_paise > 0 ? formatPrice(f.price_addon_paise) + '/ea' : 'Included'}</td>
                      <td><Badge variant={f.is_active ? 'good' : 'muted'}>{f.is_active ? 'Active' : 'Off'}</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Order Settings */}
          <Card>
            <CardHeader title="Order Settings" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: '4px 0' }}>
              {settings.map(s => (
                <div key={s.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500, color: '#1A1714' }}>
                      {s.key === 'gift_box_addon_paise' ? 'Gift Box Addon' :
                       s.key === 'sheet_saver_enabled' ? 'Sheet Saver Upsell' : 'Free Shipping Threshold'}
                    </div>
                    <div style={{ fontSize: 11, color: '#A39080' }}>{s.description}</div>
                  </div>
                  {s.key === 'sheet_saver_enabled' ? (
                    <button
                      onClick={() => updateSetting(s.key, s.value === 'true' ? 'false' : 'true')}
                      style={{
                        width: 44, height: 24, borderRadius: 12, border: 'none', cursor: 'pointer',
                        background: s.value === 'true' ? '#7a5540' : '#E5DDD4',
                        position: 'relative', transition: 'background .2s',
                      }}
                    >
                      <div style={{
                        width: 18, height: 18, borderRadius: 9, background: '#fff',
                        position: 'absolute', top: 3,
                        left: s.value === 'true' ? 23 : 3, transition: 'left .2s',
                      }} />
                    </button>
                  ) : (
                    <div className="price-input">
                      <span>₹</span>
                      <input
                        type="number"
                        defaultValue={Number(s.value || 0) / 100}
                        onBlur={e => {
                          const paise = Math.round(parseFloat(e.target.value) * 100);
                          if (paise > 0) updateSetting(s.key, String(paise));
                        }}
                        className="admin-input-sm"
                        style={{ width: 80 }}
                        step="1"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>

          {/* Sheet Saver Info */}
          <Card>
            <CardHeader title="③ Smart Upsell — Sheet Saver" />
            <div style={{ padding: '4px 0', fontSize: 12, color: '#5C4A3A', lineHeight: 1.7 }}>
              <p style={{ marginBottom: 8 }}>
                When enabled, the order page shows a recommendation when a customer can fill unused sheet space.
              </p>
              <div style={{ background: '#f9f6f2', borderRadius: 8, padding: 12, border: '0.5px solid rgba(26,23,20,0.06)' }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#1A1714', marginBottom: 6 }}>How it works:</div>
                <ul style={{ fontSize: 11, color: '#5C4A3A', paddingLeft: 16, margin: 0, lineHeight: 2 }}>
                  <li>Classic = 9 per A4 sheet → if customer has 7, suggest &ldquo;Add 2 more for just ₹{((templates.find(t => t.template_id === 'polaroid-classic')?.extra_print_paise || 800) * 2 / 100).toFixed(0)} to fill your sheet&rdquo;</li>
                  <li>Instax Wide = 2 per A4 → if customer has 1, suggest adding 1 more</li>
                  <li>Optimizes your sheet utilization = less waste</li>
                  <li>Customer perceives it as helpful savings advice</li>
                </ul>
              </div>
            </div>
          </Card>
        </>
      )}
    </AdminShell>
  );
}
