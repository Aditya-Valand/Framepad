'use client';

import { useState } from 'react';
import { AdminShell, PageHeader, Btn, Toggle } from '@/components/admin';

export default function SettingsPage() {
  const [acceptOrders, setAcceptOrders] = useState(true);
  const [maintenance, setMaintenance] = useState(false);
  const [freeDownload, setFreeDownload] = useState(true);
  const [guestCheckout, setGuestCheckout] = useState(true);
  const [whatsapp, setWhatsapp] = useState(true);
  const [dailyDigest, setDailyDigest] = useState(true);
  const [lowStockAlerts, setLowStockAlerts] = useState(false);

  return (
    <AdminShell>
      <PageHeader title="Settings" subtitle="Site, orders, pricing and notification configuration.">
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '10px', letterSpacing: '.1em', color: 'var(--text-3)', textTransform: 'uppercase' }}>
          Last saved · 22 May, 16:04
        </span>
      </PageHeader>

      <div style={{ maxWidth: '760px' }}>
        {!acceptOrders && (
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
        {maintenance && (
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

        <SettingsSection
          icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M3 5h18l-2 14H5L3 5z"/><path d="M8 9h8"/></svg>}
          title={<><em>Orders</em> &amp; pricing</>}
        >
          <SettingsRow label="Accept new orders" desc="When off, customers see a polite &quot;back soon&quot; message at checkout.">
            <Toggle on={acceptOrders} onChange={setAcceptOrders} />
          </SettingsRow>
          <SettingsRow label="Free shipping above" desc="Orders at or above this amount ship free. Set to 0 to always charge shipping.">
            <input type="number" defaultValue={499} min={0} className="settings-input" style={{ textAlign: 'right' }} />
          </SettingsRow>
          <SettingsRow label="Estimated delivery" desc="Shown on the product page and order confirmation email.">
            <input type="text" defaultValue="3–5 days" className="settings-input" />
          </SettingsRow>
          <SettingsRow label="Default order currency" desc="Used for new product prices and payment processing.">
            <select className="settings-select">
              <option>INR · ₹ Indian Rupee</option>
              <option>USD · $ US Dollar</option>
              <option>GBP · £ British Pound</option>
            </select>
          </SettingsRow>
        </SettingsSection>

        <SettingsSection
          icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>}
          title={<><em>Site</em></>}
        >
          <SettingsRow label="Maintenance mode" desc="Shows the maintenance page to everyone except logged-in admins.">
            <Toggle on={maintenance} onChange={setMaintenance} danger />
          </SettingsRow>
          <SettingsRow label="Free PNG download enabled" desc="Allow users to download their designs as PNG without ordering a print.">
            <Toggle on={freeDownload} onChange={setFreeDownload} />
          </SettingsRow>
          <SettingsRow label="Max designs per user" desc="Per account, saved across sessions. Set 0 for unlimited.">
            <input type="number" defaultValue={100} min={0} className="settings-input" style={{ textAlign: 'right' }} />
          </SettingsRow>
          <SettingsRow label="Guest checkout" desc="Let visitors order without creating an account.">
            <Toggle on={guestCheckout} onChange={setGuestCheckout} />
          </SettingsRow>
        </SettingsSection>

        <SettingsSection
          icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>}
          title={<><em>Notifications</em></>}
        >
          <SettingsRow label="From email" desc="Order receipts, shipping updates and password resets are sent from this address.">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input type="email" defaultValue="hello@polamuse.in" className="settings-input" style={{ minWidth: '240px' }} />
              <Btn variant="outline" size="sm">Send test →</Btn>
            </div>
          </SettingsRow>
          <SettingsRow label="WhatsApp tracking updates" desc="Notify customers on WhatsApp when status changes to Shipped or Delivered.">
            <Toggle on={whatsapp} onChange={setWhatsapp} />
          </SettingsRow>
          <SettingsRow label="Daily admin digest" desc="A summary of yesterday's orders, sent to your inbox at 9 AM IST.">
            <Toggle on={dailyDigest} onChange={setDailyDigest} />
          </SettingsRow>
          <SettingsRow label="Low print stock alerts" desc="Email when print queue exceeds a threshold so you can batch-generate sheets.">
            <Toggle on={lowStockAlerts} onChange={setLowStockAlerts} />
          </SettingsRow>
        </SettingsSection>

        <div className="settings-footer">
          <Btn variant="outline">Discard changes</Btn>
          <Btn variant="primary">Save settings</Btn>
        </div>
      </div>
    </AdminShell>
  );
}

function SettingsSection({ icon, title, children }: { icon: React.ReactNode; title: React.ReactNode; children: React.ReactNode }) {
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

function SettingsRow({ label, desc, children }: { label: string; desc: string; children: React.ReactNode }) {
  return (
    <div className="settings-row">
      <div>
        <div className="settings-row-label">{label}</div>
        <div className="settings-row-desc">{desc}</div>
      </div>
      <div style={{ flexShrink: 0 }}>{children}</div>
    </div>
  );
}
