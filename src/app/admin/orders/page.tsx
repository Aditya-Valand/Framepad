'use client';

import { useState } from 'react';
import { AdminShell, PageHeader, Btn, Card, Badge, PillRow, SlidePanel } from '@/components/admin';

const STATUSES = ['All', 'Pending', 'Confirmed', 'Printing', 'Shipped', 'Delivered', 'Cancelled'];
const STATUS_COUNTS = [342, 12, 34, 23, 41, 218, 14];
const STATUS_MAP: Record<string, 'good' | 'warn' | 'bad' | 'info' | 'brown' | 'muted'> = {
  Confirmed: 'good', Pending: 'warn', Printing: 'brown', Shipped: 'info', Delivered: 'good', Cancelled: 'bad',
};

const ORDERS = [
  { id: '00342', num: '#PM-2026-00342', name: 'Priya Sharma',  email: 'priya.s@gmail.com',       items: '1 × Classic · Glossy',       amt: '₹79',  status: 'Confirmed', date: '23 May · 14:32' },
  { id: '00341', num: '#PM-2026-00341', name: 'Rohan Kapoor',  email: 'rohan.k@hey.com',          items: '10 × Classic · Matte',        amt: '₹590', status: 'Pending',   date: '23 May · 14:18' },
  { id: '00340', num: '#PM-2026-00340', name: 'Anika Reddy',   email: 'anika.r@gmail.com',        items: '5 × Classic · Glossy',        amt: '₹349', status: 'Printing',  date: '23 May · 13:50' },
  { id: '00339', num: '#PM-2026-00339', name: 'Vikram Singh',  email: 'vik.singh@outlook.com',    items: '1 × Classic · Glossy',        amt: '₹79',  status: 'Shipped',   date: '23 May · 12:42' },
  { id: '00338', num: '#PM-2026-00338', name: 'Meera Iyer',    email: 'meera.iyer@gmail.com',     items: '20 × Classic · Matte',        amt: '₹999', status: 'Delivered', date: '23 May · 11:24' },
  { id: '00337', num: '#PM-2026-00337', name: 'Kabir Joshi',   email: 'kabir.j@gmail.com',        items: '1 × Instax Mini · Glossy',   amt: '₹79',  status: 'Confirmed', date: '23 May · 10:30' },
  { id: '00336', num: '#PM-2026-00336', name: 'Nisha Patel',   email: 'nisha.p@gmail.com',        items: '5 × Vintage · Matte',         amt: '₹349', status: 'Printing',  date: '22 May · 21:55' },
  { id: '00335', num: '#PM-2026-00335', name: 'Sahil Bansal',  email: 'sahil.b@hey.com',          items: '1 × Classic · Glossy',        amt: '₹79',  status: 'Cancelled', date: '22 May · 18:14' },
  { id: '00334', num: '#PM-2026-00334', name: 'Tanvi Sen',     email: 'tanvi.s@gmail.com',        items: '20 × Movie Poster · Glossy',  amt: '₹999', status: 'Delivered', date: '22 May · 16:02' },
  { id: '00333', num: '#PM-2026-00333', name: 'Devansh Roy',   email: 'dev.roy@gmail.com',        items: '10 × Classic · Glossy',      amt: '₹590', status: 'Shipped',   date: '22 May · 14:38' },
];

export default function OrdersPage() {
  const [activeFilter, setActiveFilter] = useState(0);
  const [panelOrder, setPanelOrder] = useState<typeof ORDERS[number] | null>(null);
  const [search, setSearch] = useState('');

  const filtered = ORDERS.filter((o) => {
    if (activeFilter > 0 && o.status !== STATUSES[activeFilter]) return false;
    if (search && !o.num.toLowerCase().includes(search.toLowerCase()) && !o.email.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <AdminShell>
      <PageHeader title="Orders" subtitle="342 total · 23 in print queue · 8 today">
        <Btn variant="outline">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
          Export CSV
        </Btn>
      </PageHeader>

      {/* Toolbar */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '14px', flexWrap: 'wrap' as const }}>
        <input
          type="search"
          placeholder="Search by order number or email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input search"
          style={{ flex: '1', minWidth: '240px', maxWidth: '380px' }}
        />
        <select className="select">
          <option>All statuses</option>
          {STATUSES.slice(1).map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>

      <PillRow
        items={STATUSES.map((s, i) => ({ label: s, count: STATUS_COUNTS[i] }))}
        active={activeFilter}
        onSelect={setActiveFilter}
      />

      <Card style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="tbl" style={{ minWidth: '820px' }}>
            <thead>
              <tr>
                {['Order #', 'Customer', 'Items', 'Amount', 'Status', 'Date', ''].map((h) => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((order) => (
                <tr key={order.id} onClick={() => setPanelOrder(order)}>
                  <td className="num">{order.num}</td>
                  <td>
                    <div className="who">
                      <div className="av">{order.name[0]}</div>
                      <div>
                        <div className="nm">{order.name}</div>
                        <div className="em">{order.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ whiteSpace: 'nowrap' }}>{order.items}</td>
                  <td className="amount">{order.amt}</td>
                  <td><Badge variant={STATUS_MAP[order.status]}>{order.status}</Badge></td>
                  <td className="num">{order.date}</td>
                  <td>
                    <button className="icon-btn">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px 12px', borderTop: '.5px solid var(--border)', fontFamily: "'DM Mono', monospace", fontSize: '11px', color: 'var(--text-3)', letterSpacing: '.04em' }}>
          <span>Showing 1–{filtered.length} of 342</span>
          <div style={{ display: 'flex', gap: '4px' }}>
            {['‹', '1', '2', '3', '…', '35', '›'].map((p, i) => (
              <button key={i} style={{ width: '30px', height: '30px', borderRadius: '8px', border: '.5px solid var(--border)', background: p === '1' ? 'var(--text)' : '#fff', color: p === '1' ? '#fff' : 'var(--text-2)', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", fontSize: '12px' }}>
                {p}
              </button>
            ))}
          </div>
        </div>
      </Card>

      <SlidePanel
        open={!!panelOrder}
        onClose={() => setPanelOrder(null)}
        title={panelOrder?.num ?? ''}
        meta="23 May 2026 · 14:32"
        footer={
          <>
            <Btn variant="outline">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
              Download print file
            </Btn>
            <Btn variant="primary">Save changes</Btn>
          </>
        }
      >
        {panelOrder && <OrderDetail order={panelOrder} />}
      </SlidePanel>
    </AdminShell>
  );
}

function OrderDetail({ order }: { order: typeof ORDERS[number] }) {
  const [status, setStatus] = useState(order.status);
  const showTracking = status === 'Shipped' || status === 'Delivered';

  return (
    <>
      {/* Preview */}
      <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '14px', alignItems: 'start', marginBottom: '22px', padding: '14px', borderRadius: '14px', background: 'var(--cream-soft)', border: '.5px solid var(--border)' }}>
        <div style={{ width: '90px', background: '#fff', borderRadius: '2px', boxShadow: '0 4px 12px rgba(26,23,20,.08)' }}>
          <div style={{ margin: '4px 4px 0', height: '78px', borderRadius: '1px', background: 'linear-gradient(135deg,#e8d5c0,#c4a882)' }} />
          <div style={{ height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontFamily: "'Dancing Script', cursive", fontSize: '10px', color: '#5a4a3a' }}>always you</span>
          </div>
        </div>
        <div>
          <div style={{ fontSize: '14px', fontWeight: 500, marginBottom: '4px' }}>{order.name}</div>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '11px', color: 'var(--text-2)', letterSpacing: '.02em', textDecoration: 'underline', textUnderlineOffset: '2px' }}>{order.email}</div>
          <div style={{ marginTop: '8px', fontSize: '12.5px', color: 'var(--text-2)', lineHeight: 1.6 }}>
            {order.items}<br />Spotify code: &quot;Iris&quot; — Goo Goo Dolls<br />Caption: <em>always you</em>
          </div>
        </div>
      </div>

      {/* Shipping */}
      <div className="field-group">
        <label>Shipping address</label>
        <div style={{ fontSize: '12.5px', color: 'var(--text-2)', lineHeight: 1.7, padding: '10px 0' }}>
          {order.name}<br />2B, Hillside Apts, Pali Hill<br />Bandra West, Mumbai 400050<br />+91 98201 22345
        </div>
      </div>

      {/* Status */}
      <div className="field-group">
        <label>Status</label>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          {STATUSES.slice(1).map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>

      {showTracking && (
        <div className="field-group" style={{ animation: 'admin-fadeIn .25s ease' }}>
          <label>Tracking number</label>
          <input type="text" placeholder="e.g. DTDC-IN-202600342" />
          <div className="hint">Customer will be notified on WhatsApp once saved.</div>
        </div>
      )}

      {/* Internal note */}
      <div className="field-group">
        <label>Internal note</label>
        <textarea placeholder="Add a note for the team (not visible to customer)…" />
      </div>

      {/* Payment */}
      <div className="field-group">
        <label>Payment</label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div style={{ padding: '12px', borderRadius: '10px', background: '#fff', border: '.5px solid var(--border)' }}>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '9px', color: 'var(--text-3)', letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: '4px' }}>Total</div>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '22px', fontWeight: 300, fontStyle: 'italic', lineHeight: 1 }}>{order.amt}</div>
          </div>
          <div style={{ padding: '12px', borderRadius: '10px', background: '#fff', border: '.5px solid var(--border)' }}>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '9px', color: 'var(--text-3)', letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: '4px' }}>Method</div>
            <div style={{ fontSize: '14px', marginTop: '4px' }}>UPI · GPay</div>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '10px', color: 'var(--text-3)', letterSpacing: '.14em', textTransform: 'uppercase', marginBottom: '10px' }}>Timeline</div>
        <div style={{ position: 'relative', paddingLeft: '22px' }}>
          <div style={{ position: 'absolute', left: '6px', top: '6px', bottom: '6px', width: '.5px', background: 'var(--border)' }} />
          {[
            { ev: 'Order placed',         when: '23 May · 14:32', done: true },
            { ev: 'Payment confirmed',    when: '23 May · 14:32', done: true },
            { ev: 'Confirmed by admin',   when: '23 May · 14:35', current: true },
            { ev: 'Sent to print',        when: '—' },
            { ev: 'Shipped',              when: '—' },
          ].map((t, i) => (
            <div key={i} style={{ position: 'relative', padding: '6px 0 14px', fontSize: '12.5px' }}>
              <div style={{ position: 'absolute', left: '-19px', top: '9px', width: '9px', height: '9px', borderRadius: '50%', background: t.current ? '#0F6E56' : t.done ? 'var(--brown)' : 'var(--cream-deep)', border: `1.5px solid ${t.current ? '#0F6E56' : t.done ? 'var(--brown)' : 'var(--text-3)'}`, boxShadow: t.current ? '0 0 0 3px rgba(15,110,86,.2)' : 'none' }} />
              <div style={{ fontWeight: 500, color: 'var(--text)' }}>{t.ev}</div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '10px', color: 'var(--text-3)', letterSpacing: '.04em', marginTop: '2px' }}>{t.when}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
