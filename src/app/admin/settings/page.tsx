'use client';

import { useEffect, useState, useCallback } from 'react';
import { AdminShell, PageHeader, Btn, Toggle, SlidePanel, Badge } from '@/components/admin';

// ─── Types ─────────────────────────────────────────────────────────────────

interface RawSettings {
  order_acceptance_active: boolean;
  free_shipping_threshold_paise: number;
  estimated_delivery: string;
  default_currency: string;
  maintenance_mode: boolean;
  free_download_enabled: boolean;
  max_designs_per_user: number;
  guest_checkout_enabled: boolean;
  from_email: string;
  whatsapp_notifications_enabled: boolean;
  admin_daily_digest_enabled: boolean;
  low_stock_alerts_enabled: boolean;
}

interface Announcement {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'promo';
  target: 'all' | 'logged_in' | 'admin';
  is_active: boolean;
  starts_at: string | null;
  ends_at: string | null;
  current_status: 'active' | 'disabled' | 'scheduled' | 'expired';
  created_at: string;
}

interface AnnForm {
  title: string;
  message: string;
  type: Announcement['type'];
  target: Announcement['target'];
  isActive: boolean;
  startsAt: string;
  endsAt: string;
}

const DEFAULTS: RawSettings = {
  order_acceptance_active: true,
  free_shipping_threshold_paise: 49900,
  estimated_delivery: '3–5 days',
  default_currency: 'INR',
  maintenance_mode: false,
  free_download_enabled: true,
  max_designs_per_user: 100,
  guest_checkout_enabled: true,
  from_email: 'hello@polamuse.in',
  whatsapp_notifications_enabled: true,
  admin_daily_digest_enabled: true,
  low_stock_alerts_enabled: false,
};

const EMPTY_ANN_FORM: AnnForm = {
  title: '',
  message: '',
  type: 'info',
  target: 'all',
  isActive: true,
  startsAt: '',
  endsAt: '',
};

type PanelMode = 'create' | 'edit';

// ─── Helpers ───────────────────────────────────────────────────────────────

async function putSetting(key: string, value: unknown) {
  await fetch(`/api/admin/settings/${key}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ value }),
  });
}

function annToForm(a: Announcement): AnnForm {
  return {
    title:    a.title,
    message:  a.message,
    type:     a.type,
    target:   a.target,
    isActive: a.is_active,
    startsAt: a.starts_at ? a.starts_at.slice(0, 16) : '',
    endsAt:   a.ends_at   ? a.ends_at.slice(0, 16)   : '',
  };
}

function statusBadgeVariant(s: Announcement['current_status']): 'good' | 'muted' | 'info' | 'warn' {
  if (s === 'active')    return 'good';
  if (s === 'scheduled') return 'info';
  return 'muted';
}

function typeBadgeVariant(t: Announcement['type']): 'info' | 'warn' | 'good' | 'brown' {
  if (t === 'warning') return 'warn';
  if (t === 'success') return 'good';
  if (t === 'promo')   return 'brown';
  return 'info';
}

// ─── Sub-components ────────────────────────────────────────────────────────

function SettingsSection({ icon, title, children }: {
  icon: React.ReactNode;
  title: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="settings-section">
      <div className="settings-section-head">
        <div className="settings-section-icon">{icon}</div>
        <div className="settings-section-title">{title}</div>
      </div>
      {children}
    </section>
  );
}

function SettingsRow({ label, desc, children }: {
  label: string;
  desc?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="settings-row">
      <div>
        <div className="settings-row-label">{label}</div>
        {desc && <div className="settings-row-desc">{desc}</div>}
      </div>
      <div style={{ flexShrink: 0 }}>{children}</div>
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────

export default function SettingsPage() {
  const [settings, setSettings] = useState<RawSettings>(DEFAULTS);
  const [loading,  setLoading]  = useState(true);
  const [saving,   setSaving]   = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);

  // input-only state (saved with button)
  const [freeShippingRs, setFreeShippingRs] = useState('499');
  const [estimatedDel,   setEstimatedDel]   = useState('3–5 days');
  const [maxDesigns,     setMaxDesigns]     = useState('100');
  const [fromEmail,      setFromEmail]      = useState('hello@polamuse.in');
  const [currency,       setCurrency]       = useState('INR');

  // announcements state
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [annLoading,    setAnnLoading]    = useState(true);
  const [panelOpen,     setPanelOpen]     = useState(false);
  const [panelMode,     setPanelMode]     = useState<PanelMode>('create');
  const [editingAnn,    setEditingAnn]    = useState<Announcement | null>(null);
  const [annForm,       setAnnForm]       = useState<AnnForm>(EMPTY_ANN_FORM);
  const [annSaving,     setAnnSaving]     = useState(false);

  // ── Load settings ──────────────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      try {
        const res  = await fetch('/api/admin/settings');
        const json = await res.json();
        if (json.settings) {
          const s = { ...DEFAULTS, ...json.settings } as RawSettings;
          setSettings(s);
          setFreeShippingRs(String(Math.round((s.free_shipping_threshold_paise ?? 49900) / 100)));
          setEstimatedDel(s.estimated_delivery ?? '3–5 days');
          setMaxDesigns(String(s.max_designs_per_user ?? 100));
          setFromEmail(s.from_email ?? 'hello@polamuse.in');
          setCurrency(s.default_currency ?? 'INR');
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // ── Load announcements ──────────────────────────────────────────────────
  const loadAnnouncements = useCallback(async () => {
    setAnnLoading(true);
    try {
      const res  = await fetch('/api/admin/announcements');
      const json = await res.json();
      setAnnouncements(json.announcements ?? []);
    } finally {
      setAnnLoading(false);
    }
  }, []);

  useEffect(() => { loadAnnouncements(); }, [loadAnnouncements]);

  // ── Toggle settings (immediate) ─────────────────────────────────────────
  async function handleToggle(key: keyof RawSettings, value: boolean) {
    setSettings(prev => ({ ...prev, [key]: value }));
    await putSetting(key, value);
  }

  // ── Save input-based settings ────────────────────────────────────────────
  async function handleSave() {
    setSaving(true);
    try {
      await Promise.all([
        putSetting('free_shipping_threshold_paise', Math.round(Number(freeShippingRs) * 100)),
        putSetting('estimated_delivery',            estimatedDel),
        putSetting('default_currency',              currency),
        putSetting('max_designs_per_user',          Number(maxDesigns)),
        putSetting('from_email',                    fromEmail),
      ]);
      const now = new Date();
      setLastSaved(now.toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }));
    } finally {
      setSaving(false);
    }
  }

  // ── Announcements helpers ─────────────────────────────────────────────
  function openCreate() {
    setPanelMode('create');
    setEditingAnn(null);
    setAnnForm(EMPTY_ANN_FORM);
    setPanelOpen(true);
  }

  function openEdit(a: Announcement) {
    setPanelMode('edit');
    setEditingAnn(a);
    setAnnForm(annToForm(a));
    setPanelOpen(true);
  }

  async function toggleAnnActive(a: Announcement) {
    await fetch(`/api/admin/announcements/${a.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !a.is_active }),
    });
    await loadAnnouncements();
  }

  async function deleteAnn(id: string) {
    if (!confirm('Delete this announcement?')) return;
    await fetch(`/api/admin/announcements/${id}`, { method: 'DELETE' });
    await loadAnnouncements();
  }

  async function submitAnnForm(e: React.FormEvent) {
    e.preventDefault();
    setAnnSaving(true);
    try {
      const body = {
        title:    annForm.title,
        message:  annForm.message,
        type:     annForm.type,
        target:   annForm.target,
        isActive: annForm.isActive,
        startsAt: annForm.startsAt || null,
        endsAt:   annForm.endsAt   || null,
      };
      if (panelMode === 'create') {
        await fetch('/api/admin/announcements', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
      } else if (editingAnn) {
        await fetch(`/api/admin/announcements/${editingAnn.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
      }
      setPanelOpen(false);
      await loadAnnouncements();
    } finally {
      setAnnSaving(false);
    }
  }

  // ────────────────────────────────────────────────────────────────────────

  return (
    <AdminShell>
      <PageHeader title="Settings" subtitle="Site, orders, pricing and notification configuration.">
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '10px', letterSpacing: '.1em', color: 'var(--text-3)', textTransform: 'uppercase' }}>
          {lastSaved ? `Last saved · ${lastSaved}` : loading ? 'Loading…' : 'Unsaved changes'}
        </span>
      </PageHeader>

      <div style={{ maxWidth: '760px' }}>
        {/* Banners */}
        {!settings.order_acceptance_active && (
          <div className="settings-banner warn">
            <div className="settings-banner-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            </div>
            <div>
              <div className="settings-banner-title">Orders are paused</div>
              <div className="settings-banner-desc">Customers see a &quot;back soon&quot; message at checkout. Toggle below to resume.</div>
            </div>
          </div>
        )}
        {settings.maintenance_mode && (
          <div className="settings-banner warn">
            <div className="settings-banner-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            </div>
            <div>
              <div className="settings-banner-title">Maintenance mode is ON</div>
              <div className="settings-banner-desc">All visitors see the maintenance page instead of the site.</div>
            </div>
          </div>
        )}

        {/* ── Orders & Pricing ─────────────────────────────────────────── */}
        <SettingsSection
          icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M3 5h18l-2 14H5L3 5z"/><path d="M8 9h8"/></svg>}
          title={<><em>Orders</em> &amp; pricing</>}
        >
          <SettingsRow label="Accept new orders" desc='When off, customers see a polite "back soon" message at checkout.'>
            <Toggle on={settings.order_acceptance_active} onChange={v => handleToggle('order_acceptance_active', v)} />
          </SettingsRow>
          <SettingsRow label="Free shipping above (₹)" desc="Orders at or above this amount ship free. Set to 0 to always charge shipping.">
            <input
              type="number" value={freeShippingRs} min={0} className="settings-input"
              style={{ textAlign: 'right' }} onChange={e => setFreeShippingRs(e.target.value)}
            />
          </SettingsRow>
          <SettingsRow label="Estimated delivery" desc="Shown on the product page and order confirmation email.">
            <input type="text" value={estimatedDel} className="settings-input" onChange={e => setEstimatedDel(e.target.value)} />
          </SettingsRow>
          <SettingsRow label="Default order currency" desc="Used for new product prices and payment processing.">
            <select className="settings-select" value={currency} onChange={e => setCurrency(e.target.value)}>
              <option value="INR">INR · ₹ Indian Rupee</option>
              <option value="USD">USD · $ US Dollar</option>
              <option value="GBP">GBP · £ British Pound</option>
            </select>
          </SettingsRow>
        </SettingsSection>

        {/* ── Site ──────────────────────────────────────────────────── */}
        <SettingsSection
          icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>}
          title={<><em>Site</em></>}
        >
          <SettingsRow label="Maintenance mode" desc="Shows the maintenance page to everyone except logged-in admins.">
            <Toggle on={settings.maintenance_mode} onChange={v => handleToggle('maintenance_mode', v)} danger />
          </SettingsRow>
          <SettingsRow label="Free PNG download enabled" desc="Allow users to download their designs as PNG without ordering a print.">
            <Toggle on={settings.free_download_enabled} onChange={v => handleToggle('free_download_enabled', v)} />
          </SettingsRow>
          <SettingsRow label="Max designs per user" desc="Per account, saved across sessions. Set 0 for unlimited.">
            <input
              type="number" value={maxDesigns} min={0} className="settings-input"
              style={{ textAlign: 'right' }} onChange={e => setMaxDesigns(e.target.value)}
            />
          </SettingsRow>
          <SettingsRow label="Guest checkout" desc="Let visitors order without creating an account.">
            <Toggle on={settings.guest_checkout_enabled} onChange={v => handleToggle('guest_checkout_enabled', v)} />
          </SettingsRow>
        </SettingsSection>

        {/* ── Notifications ─────────────────────────────────────────── */}
        <SettingsSection
          icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>}
          title={<><em>Notifications</em></>}
        >
          <SettingsRow label="From email" desc="Order receipts, shipping updates and password resets are sent from this address.">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="email" value={fromEmail} className="settings-input"
                style={{ minWidth: '240px' }} onChange={e => setFromEmail(e.target.value)}
              />
              <Btn variant="outline" size="sm">Send test →</Btn>
            </div>
          </SettingsRow>
          <SettingsRow label="WhatsApp tracking updates" desc="Notify customers on WhatsApp when status changes to Shipped or Delivered.">
            <Toggle on={settings.whatsapp_notifications_enabled} onChange={v => handleToggle('whatsapp_notifications_enabled', v)} />
          </SettingsRow>
          <SettingsRow label="Daily admin digest" desc="A summary of yesterday's orders, sent to your inbox at 9 AM IST.">
            <Toggle on={settings.admin_daily_digest_enabled} onChange={v => handleToggle('admin_daily_digest_enabled', v)} />
          </SettingsRow>
          <SettingsRow label="Low print stock alerts" desc="Email when print queue exceeds a threshold so you can batch-generate sheets.">
            <Toggle on={settings.low_stock_alerts_enabled} onChange={v => handleToggle('low_stock_alerts_enabled', v)} />
          </SettingsRow>
        </SettingsSection>

        {/* ── Save footer ──────────────────────────────────────────── */}
        <div className="settings-footer">
          <Btn variant="outline" onClick={() => window.location.reload()}>Discard changes</Btn>
          <Btn variant="primary" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving…' : 'Save settings'}
          </Btn>
        </div>

        {/* ── Announcements ────────────────────────────────────────── */}
        <SettingsSection
          icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M22 17H2a3 3 0 000 6h20a3 3 0 000-6z"/><path d="M5 17V8a7 7 0 0114 0v9"/></svg>}
          title={<><em>Announcements</em></>}
        >
          <div style={{ padding: '4px 0 12px', display: 'flex', justifyContent: 'flex-end' }}>
            <Btn variant="primary" size="sm" onClick={openCreate}>+ New announcement</Btn>
          </div>

          {annLoading ? (
            <div style={{ padding: '16px 0', textAlign: 'center', color: 'var(--text-3)', fontSize: '13px' }}>Loading…</div>
          ) : announcements.length === 0 ? (
            <div style={{ padding: '24px 0', textAlign: 'center', color: 'var(--text-3)', fontSize: '13px' }}>No announcements yet</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {announcements.map(a => (
                <div
                  key={a.id}
                  style={{
                    display: 'flex', alignItems: 'flex-start', gap: '12px',
                    padding: '12px 14px',
                    background: 'var(--surface-1)',
                    border: '0.5px solid var(--border)',
                    borderRadius: '8px',
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '4px' }}>
                      <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-1)' }}>{a.title}</span>
                      <Badge variant={typeBadgeVariant(a.type)}>{a.type}</Badge>
                      <Badge variant={statusBadgeVariant(a.current_status)}>{a.current_status}</Badge>
                      <Badge variant="muted">{a.target}</Badge>
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {a.message}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                    <Toggle on={a.is_active} onChange={() => toggleAnnActive(a)} />
                    <Btn variant="ghost" size="sm" onClick={() => openEdit(a)}>Edit</Btn>
                    <Btn variant="ghost" size="sm" onClick={() => deleteAnn(a.id)}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
                    </Btn>
                  </div>
                </div>
              ))}
            </div>
          )}
        </SettingsSection>
      </div>

      {/* ── Announcement SlidePanel ──────────────────────────────────── */}
      <SlidePanel
        open={panelOpen}
        onClose={() => setPanelOpen(false)}
        title={panelMode === 'create' ? 'New announcement' : 'Edit announcement'}
      >
        <form onSubmit={submitAnnForm} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div>
            <label className="sp-label">Title</label>
            <input
              required type="text" value={annForm.title} maxLength={200}
              placeholder="e.g. Site maintenance on Saturday"
              className="sp-input"
              onChange={e => setAnnForm(f => ({ ...f, title: e.target.value }))}
            />
          </div>
          <div>
            <label className="sp-label">Message</label>
            <textarea
              required rows={3} value={annForm.message}
              placeholder="Full announcement text shown to users…"
              className="sp-input" style={{ resize: 'vertical' }}
              onChange={e => setAnnForm(f => ({ ...f, message: e.target.value }))}
            />
          </div>
          <div>
            <label className="sp-label">Type</label>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {(['info', 'warning', 'success', 'promo'] as const).map(t => (
                <button key={t} type="button" onClick={() => setAnnForm(f => ({ ...f, type: t }))}
                  style={{
                    padding: '5px 14px', borderRadius: '6px', fontSize: '12px', fontWeight: 600,
                    cursor: 'pointer', textTransform: 'capitalize',
                    border: annForm.type === t ? '1.5px solid var(--brand)' : '1px solid var(--border)',
                    background: annForm.type === t ? 'var(--brand-bg)' : 'transparent',
                    color: annForm.type === t ? 'var(--brand)' : 'var(--text-2)',
                  }}
                >{t}</button>
              ))}
            </div>
          </div>
          <div>
            <label className="sp-label">Audience</label>
            <select className="sp-input" value={annForm.target}
              onChange={e => setAnnForm(f => ({ ...f, target: e.target.value as AnnForm['target'] }))}>
              <option value="all">Everyone</option>
              <option value="logged_in">Logged-in users only</option>
              <option value="admin">Admins only</option>
            </select>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label className="sp-label">Starts at (optional)</label>
              <input type="datetime-local" value={annForm.startsAt} className="sp-input"
                onChange={e => setAnnForm(f => ({ ...f, startsAt: e.target.value }))} />
            </div>
            <div>
              <label className="sp-label">Ends at (optional)</label>
              <input type="datetime-local" value={annForm.endsAt} className="sp-input"
                onChange={e => setAnnForm(f => ({ ...f, endsAt: e.target.value }))} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-1)' }}>Active</div>
              <div style={{ fontSize: '12px', color: 'var(--text-3)' }}>Show this announcement on the site</div>
            </div>
            <Toggle on={annForm.isActive} onChange={v => setAnnForm(f => ({ ...f, isActive: v }))} />
          </div>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', paddingTop: '4px' }}>
            <Btn variant="outline" type="button" onClick={() => setPanelOpen(false)}>Cancel</Btn>
            <Btn variant="primary" type="submit" disabled={annSaving}>
              {annSaving ? 'Saving…' : panelMode === 'create' ? 'Create' : 'Save changes'}
            </Btn>
          </div>
        </form>
      </SlidePanel>
    </AdminShell>
  );
}
