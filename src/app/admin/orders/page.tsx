'use client';

import { useState, useEffect, useCallback } from 'react';
import { AdminShell, PageHeader, Btn, Card, Badge, PillRow, SlidePanel } from '@/components/admin';

const STATUSES = ['All', 'pending_payment', 'confirmed', 'processing', 'printing', 'shipped', 'delivered', 'cancelled'];
const STATUS_LABELS: Record<string, string> = {
  All: 'All',
  pending_payment: 'Pending',
  confirmed: 'Confirmed',
  processing: 'Processing',
  printing: 'Printing',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};
const STATUS_MAP: Record<string, 'good' | 'warn' | 'bad' | 'info' | 'brown' | 'muted'> = {
  confirmed: 'good', pending_payment: 'warn', processing: 'brown', printing: 'brown', shipped: 'info', delivered: 'good', cancelled: 'bad', refunded: 'bad', payment_failed: 'bad',
};

interface Order {
  id: string;
  order_number: string;
  status: string;
  order_type: string;
  total_paise: number;
  discount_paise: number;
  is_gift: boolean;
  confirmed_at: string | null;
  created_at: string;
  updated_at: string;
  internal_notes: string | null;
  customer_name: string | null;
  customer_email: string;
  customer_id: string;
  item_count: number;
  total_prints: number;
  payment_status: string | null;
  payment_method: string | null;
  tracking_number: string | null;
  carrier: string | null;
  shipping_city: string | null;
  shipping_state: string | null;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  const day = d.getDate();
  const month = d.toLocaleString('en-US', { month: 'short' });
  const hours = d.getHours().toString().padStart(2, '0');
  const mins = d.getMinutes().toString().padStart(2, '0');
  return `${day} ${month} · ${hours}:${mins}`;
}

function formatAmount(paise: number) {
  return `₹${(paise / 100).toLocaleString('en-IN')}`;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState(0);
  const [panelOrder, setPanelOrder] = useState<Order | null>(null);
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 20, total: 0, totalPages: 0 });
  const [statusCounts, setStatusCounts] = useState<Record<string, number>>({});

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('page', pagination.page.toString());
      params.set('limit', '20');
      if (activeFilter > 0) params.set('status', STATUSES[activeFilter]);
      if (search) params.set('search', search);

      const res = await fetch(`/api/admin/orders?${params}`);
      if (!res.ok) throw new Error('Failed to fetch orders');
      const data = await res.json();
      setOrders(data.orders);
      setPagination(data.pagination);
      setStatusCounts(data.statusCounts);
    } catch (e) {
      console.error('Failed to fetch orders:', e);
    } finally {
      setLoading(false);
    }
  }, [activeFilter, search, pagination.page]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const totalOrders = Object.values(statusCounts).reduce((a, b) => a + b, 0);
  const statusCountsArr = STATUSES.map((s) => s === 'All' ? totalOrders : (statusCounts[s] || 0));

  return (
    <AdminShell>
      <PageHeader title="Orders" subtitle={`${totalOrders} total · ${statusCounts['printing'] || 0} in print queue`}>
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
      </div>

      <PillRow
        items={STATUSES.map((s, i) => ({ label: STATUS_LABELS[s] || s, count: statusCountsArr[i] }))}
        active={activeFilter}
        onSelect={(i: number) => { setActiveFilter(i); setPagination(p => ({ ...p, page: 1 })); }}
      />

      <Card style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-3)' }}>Loading orders…</div>
          ) : orders.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-3)' }}>No orders found</div>
          ) : (
          <table className="tbl" style={{ minWidth: '820px' }}>
            <thead>
              <tr>
                {['Order #', 'Customer', 'Items', 'Amount', 'Status', 'Date', ''].map((h) => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} onClick={() => setPanelOrder(order)}>
                  <td className="num">{order.order_number}</td>
                  <td>
                    <div className="who">
                      <div className="av">{(order.customer_name || order.customer_email)[0].toUpperCase()}</div>
                      <div>
                        <div className="nm">{order.customer_name || 'Unknown'}</div>
                        <div className="em">{order.customer_email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ whiteSpace: 'nowrap' }}>{order.total_prints} × {order.item_count} item{order.item_count > 1 ? 's' : ''}</td>
                  <td className="amount">{formatAmount(order.total_paise)}</td>
                  <td><Badge variant={STATUS_MAP[order.status] || 'muted'}>{STATUS_LABELS[order.status] || order.status}</Badge></td>
                  <td className="num">{formatDate(order.created_at)}</td>
                  <td>
                    <button className="icon-btn">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          )}
        </div>

        {/* Pagination */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px 12px', borderTop: '.5px solid var(--border)', fontFamily: "'DM Mono', monospace", fontSize: '11px', color: 'var(--text-3)', letterSpacing: '.04em' }}>
          <span>Showing {orders.length > 0 ? ((pagination.page - 1) * pagination.limit + 1) : 0}–{Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}</span>
          <div style={{ display: 'flex', gap: '4px' }}>
            <button
              disabled={pagination.page <= 1}
              onClick={() => setPagination(p => ({ ...p, page: p.page - 1 }))}
              style={{ width: '30px', height: '30px', borderRadius: '8px', border: '.5px solid var(--border)', background: '#fff', color: 'var(--text-2)', cursor: pagination.page <= 1 ? 'not-allowed' : 'pointer', fontFamily: "'DM Sans', sans-serif", fontSize: '12px', opacity: pagination.page <= 1 ? 0.5 : 1 }}
            >‹</button>
            <span style={{ display: 'flex', alignItems: 'center', padding: '0 8px', fontSize: '12px' }}>
              {pagination.page} / {pagination.totalPages || 1}
            </span>
            <button
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => setPagination(p => ({ ...p, page: p.page + 1 }))}
              style={{ width: '30px', height: '30px', borderRadius: '8px', border: '.5px solid var(--border)', background: '#fff', color: 'var(--text-2)', cursor: pagination.page >= pagination.totalPages ? 'not-allowed' : 'pointer', fontFamily: "'DM Sans', sans-serif", fontSize: '12px', opacity: pagination.page >= pagination.totalPages ? 0.5 : 1 }}
            >›</button>
          </div>
        </div>
      </Card>

      <SlidePanel
        open={!!panelOrder}
        onClose={() => setPanelOrder(null)}
        title={panelOrder?.order_number ?? ''}
        meta={panelOrder ? formatDate(panelOrder.created_at) : ''}
      >
        {panelOrder && <OrderDetail order={panelOrder} onUpdate={fetchOrders} />}
      </SlidePanel>
    </AdminShell>
  );
}

function OrderDetail({ order, onUpdate }: { order: Order; onUpdate: () => void }) {
  const [status, setStatus] = useState(order.status);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [carrier, setCarrier] = useState('');
  const [internalNote, setInternalNote] = useState(order.internal_notes || '');
  const [saving, setSaving] = useState(false);
  const [detail, setDetail] = useState<Record<string, unknown> | null>(null);
  const showTracking = status === 'shipped' || status === 'delivered';

  // Fetch full detail
  useEffect(() => {
    fetch(`/api/admin/orders/${order.id}`)
      .then(res => res.ok ? res.json() : null)
      .then(data => { if (data) setDetail(data); })
      .catch(() => {});
  }, [order.id]);

  const handleSave = async () => {
    setSaving(true);
    try {
      // Update status if changed
      if (status !== order.status) {
        await fetch(`/api/admin/orders/${order.id}/status`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status }),
        });
      }

      // Add tracking if shipping
      if (showTracking && trackingNumber) {
        await fetch(`/api/admin/orders/${order.id}/ship`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ trackingNumber, carrier }),
        });
      }

      // Save internal notes
      if (internalNote !== (order.internal_notes || '')) {
        await fetch(`/api/admin/orders/${order.id}/notes`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ internalNotes: internalNote }),
        });
      }

      onUpdate();
    } catch (e) {
      console.error('Save failed:', e);
    } finally {
      setSaving(false);
    }
  };

  const handleDownload = async () => {
    // Get order items from detail to find the item IDs
    const items = (detail?.items as { id: string }[]) || [];
    if (items.length === 0) {
      alert('No items found for this order');
      return;
    }
    // Download the first item's print file (opens in new tab)
    for (const item of items) {
      window.open(`/api/admin/orders/items/${item.id}/print-file`, '_blank');
    }
  };

  const address = detail?.address as Record<string, string> | null;
  const timeline = (detail?.timeline as { event: string; timestamp: string | null; done: boolean }[]) || [];

  return (
    <>
      {/* Preview */}
      <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '14px', alignItems: 'start', marginBottom: '22px', padding: '14px', borderRadius: '14px', background: 'var(--cream-soft)', border: '.5px solid var(--border)' }}>
        <div style={{ width: '90px', background: '#fff', borderRadius: '2px', boxShadow: '0 4px 12px rgba(26,23,20,.08)' }}>
          <div style={{ margin: '4px 4px 0', height: '78px', borderRadius: '1px', background: 'linear-gradient(135deg,#e8d5c0,#c4a882)' }} />
          <div style={{ height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontFamily: "'Dancing Script', cursive", fontSize: '10px', color: '#5a4a3a' }}>polamuse</span>
          </div>
        </div>
        <div>
          <div style={{ fontSize: '14px', fontWeight: 500, marginBottom: '4px' }}>{order.customer_name || 'Unknown'}</div>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '11px', color: 'var(--text-2)', letterSpacing: '.02em', textDecoration: 'underline', textUnderlineOffset: '2px' }}>{order.customer_email}</div>
          <div style={{ marginTop: '8px', fontSize: '12.5px', color: 'var(--text-2)', lineHeight: 1.6 }}>
            {order.total_prints} prints · {order.item_count} item{order.item_count > 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {/* Shipping */}
      <div className="field-group">
        <label>Shipping address</label>
        <div style={{ fontSize: '12.5px', color: 'var(--text-2)', lineHeight: 1.7, padding: '10px 0' }}>
          {address ? (
            <>{address.full_name}<br />{address.line1}{address.line2 ? `, ${address.line2}` : ''}<br />{address.city}, {address.state} {address.pincode}<br />{address.phone}</>
          ) : (
            <span style={{ color: 'var(--text-3)' }}>No address on file</span>
          )}
        </div>
      </div>

      {/* Status */}
      <div className="field-group">
        <label>Status</label>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          {STATUSES.slice(1).map((s) => <option key={s} value={s}>{STATUS_LABELS[s] || s}</option>)}
        </select>
      </div>

      {showTracking && (
        <div className="field-group" style={{ animation: 'admin-fadeIn .25s ease' }}>
          <label>Tracking number</label>
          <input
            type="text"
            placeholder="e.g. DTDC-IN-202600342"
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
          />
          <input
            type="text"
            placeholder="Carrier (e.g. DTDC, Delhivery)"
            value={carrier}
            onChange={(e) => setCarrier(e.target.value)}
            style={{ marginTop: '6px' }}
          />
          <div className="hint">Customer will be notified once saved.</div>
        </div>
      )}

      {/* Internal note */}
      <div className="field-group">
        <label>Internal note</label>
        <textarea
          placeholder="Add a note for the team (not visible to customer)…"
          value={internalNote}
          onChange={(e) => setInternalNote(e.target.value)}
        />
      </div>

      {/* Action buttons */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        <button
          onClick={handleDownload}
          style={{ flex: '1', padding: '10px', borderRadius: '10px', background: '#fff', color: 'var(--text, #1A1714)', border: '.5px solid var(--border, rgba(26,23,20,0.08))', cursor: 'pointer', fontWeight: 500, fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
          Download
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          style={{ flex: '1', padding: '10px', borderRadius: '10px', background: 'var(--brown, #8B6F5C)', color: '#fff', border: 'none', cursor: saving ? 'not-allowed' : 'pointer', fontWeight: 500, fontSize: '13px', opacity: saving ? 0.7 : 1 }}
        >
          {saving ? 'Saving…' : 'Save changes'}
        </button>
      </div>

      {/* Payment */}
      <div className="field-group">
        <label>Payment</label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div style={{ padding: '12px', borderRadius: '10px', background: '#fff', border: '.5px solid var(--border)' }}>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '9px', color: 'var(--text-3)', letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: '4px' }}>Total</div>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '22px', fontWeight: 300, fontStyle: 'italic', lineHeight: 1 }}>{formatAmount(order.total_paise)}</div>
          </div>
          <div style={{ padding: '12px', borderRadius: '10px', background: '#fff', border: '.5px solid var(--border)' }}>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '9px', color: 'var(--text-3)', letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: '4px' }}>Method</div>
            <div style={{ fontSize: '14px', marginTop: '4px' }}>{order.payment_method || '—'}</div>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '10px', color: 'var(--text-3)', letterSpacing: '.14em', textTransform: 'uppercase', marginBottom: '10px' }}>Timeline</div>
        <div style={{ position: 'relative', paddingLeft: '22px' }}>
          <div style={{ position: 'absolute', left: '6px', top: '6px', bottom: '6px', width: '.5px', background: 'var(--border)' }} />
          {timeline.length > 0 ? timeline.map((t, i) => {
            const isCurrent = t.done && (i === timeline.length - 1 || !timeline[i + 1]?.done);
            return (
              <div key={i} style={{ position: 'relative', padding: '6px 0 14px', fontSize: '12.5px' }}>
                <div style={{ position: 'absolute', left: '-19px', top: '9px', width: '9px', height: '9px', borderRadius: '50%', background: isCurrent ? '#0F6E56' : t.done ? 'var(--brown)' : 'var(--cream-deep)', border: `1.5px solid ${isCurrent ? '#0F6E56' : t.done ? 'var(--brown)' : 'var(--text-3)'}`, boxShadow: isCurrent ? '0 0 0 3px rgba(15,110,86,.2)' : 'none' }} />
                <div style={{ fontWeight: 500, color: 'var(--text)' }}>{t.event}</div>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '10px', color: 'var(--text-3)', letterSpacing: '.04em', marginTop: '2px' }}>{t.timestamp ? formatDate(t.timestamp) : '—'}</div>
              </div>
            );
          }) : (
            <div style={{ fontSize: '12px', color: 'var(--text-3)', padding: '10px 0' }}>
              Order placed · {formatDate(order.created_at)}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
