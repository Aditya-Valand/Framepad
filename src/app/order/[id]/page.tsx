'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import Logo from '@/components/ui/Logo';
import { useAuth } from '@/hooks/useAuth';

const STATUS_STEPS = ['pending_payment', 'confirmed', 'processing', 'printing', 'shipped', 'delivered'];
const STATUS_LABELS: Record<string, string> = {
  pending_payment: 'Awaiting Payment',
  payment_failed: 'Payment Failed',
  confirmed: 'Confirmed',
  processing: 'Processing',
  printing: 'Printing',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
  refunded: 'Refunded',
};

export default function OrderDetailPageWrapper() {
  return (
    <Suspense fallback={<div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#EDE6DC' }}><div className="animate-spin rounded-full h-8 w-8 border-2 border-[#8B6F5C] border-t-transparent" /></div>}>
      <OrderDetailPage />
    </Suspense>
  );
}

function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const justPaid = searchParams.get('success') === 'true';
  const { user, loading: authLoading } = useAuth();

  const [order, setOrder] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [payment, setPayment] = useState<any>(null);
  const [shipment, setShipment] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id || !user) return;
    fetch(`/api/orders/${id}`)
      .then(r => r.json())
      .then(data => {
        setOrder(data.order);
        setItems(data.items || []);
        setPayment(data.payment);
        setShipment(data.shipment);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id, user]);

  if (authLoading || loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#EDE6DC' }}>
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#8B6F5C] border-t-transparent" />
      </div>
    );
  }

  if (!order) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#EDE6DC', flexDirection: 'column', gap: 12 }}>
        <p style={{ color: '#5C4A3A', fontSize: 14 }}>Order not found</p>
        <Link href="/designs" style={{ color: '#8B6F5C', fontSize: 13 }}>← Back to designs</Link>
      </div>
    );
  }

  const formatPrice = (paise: number) => `₹${(paise / 100).toFixed(paise % 100 === 0 ? 0 : 2)}`;
  const formatDate = (d: string) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  const currentStepIdx = STATUS_STEPS.indexOf(order.status);

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #EDE6DC 0%, #DDD4C8 100%)', fontFamily: "'DM Sans', sans-serif" }}>
      {/* Header */}
      <header style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 24px', borderBottom: '0.5px solid rgba(26,23,20,0.08)',
        background: 'rgba(251,248,244,0.97)', backdropFilter: 'blur(20px)',
        position: 'sticky', top: 0, zIndex: 50,
      }}>
        <Link href="/designs" style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#5C4A3A', textDecoration: 'none', fontSize: 13 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          My Designs
        </Link>
        <Logo size="sm" />
      </header>

      <main style={{ maxWidth: 640, margin: '0 auto', padding: '32px 20px 80px' }}>
        {/* Success banner */}
        {justPaid && (
          <div style={{
            padding: '16px 20px', borderRadius: 12, marginBottom: 24,
            background: 'rgba(76,175,80,0.06)', border: '1px solid rgba(76,175,80,0.2)',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: 24, marginBottom: 4 }}>🎉</div>
            <p style={{ fontSize: 14, fontWeight: 600, color: '#2E7D32', margin: 0 }}>Payment Successful!</p>
            <p style={{ fontSize: 12, color: '#4CAF50', margin: '4px 0 0' }}>Your prints are being prepared</p>
          </div>
        )}

        {/* Order header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
          <div>
            <h1 style={{ fontSize: 18, fontWeight: 600, color: '#1A1714', margin: 0 }}>Order {order.order_number}</h1>
            <p style={{ fontSize: 12, color: '#A39080', margin: '4px 0 0' }}>Placed {formatDate(order.created_at)}</p>
          </div>
          <span style={{
            padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600,
            background: order.status === 'delivered' ? 'rgba(76,175,80,0.1)' : order.status === 'cancelled' ? 'rgba(211,47,47,0.1)' : 'rgba(139,111,92,0.1)',
            color: order.status === 'delivered' ? '#2E7D32' : order.status === 'cancelled' ? '#D32F2F' : '#8B6F5C',
          }}>
            {STATUS_LABELS[order.status] || order.status}
          </span>
        </div>

        {/* Status Timeline */}
        {currentStepIdx >= 0 && (
          <div style={{ padding: '20px 16px', borderRadius: 12, background: '#FFFCF8', border: '0.5px solid rgba(26,23,20,0.08)', marginBottom: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', padding: '0 8px' }}>
              {/* Progress bar */}
              <div style={{ position: 'absolute', top: 9, left: 30, right: 30, height: 2, background: 'rgba(26,23,20,0.08)', borderRadius: 1 }} />
              <div style={{ position: 'absolute', top: 9, left: 30, width: `${(currentStepIdx / (STATUS_STEPS.length - 1)) * (100 - 10)}%`, height: 2, background: '#8B6F5C', borderRadius: 1, transition: 'width 0.3s ease' }} />
              {STATUS_STEPS.map((step, i) => (
                <div key={step} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', zIndex: 1 }}>
                  <div style={{
                    width: 20, height: 20, borderRadius: '50%',
                    background: i <= currentStepIdx ? '#8B6F5C' : '#fff',
                    border: i <= currentStepIdx ? '2px solid #8B6F5C' : '2px solid rgba(26,23,20,0.15)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {i < currentStepIdx && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>}
                    {i === currentStepIdx && <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#fff' }} />}
                  </div>
                  <span style={{ fontSize: 9, color: i <= currentStepIdx ? '#5C4A3A' : '#A39080', marginTop: 6, textAlign: 'center', maxWidth: 50 }}>
                    {STATUS_LABELS[step]?.split(' ').pop()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tracking */}
        {shipment && shipment.tracking_number && (
          <div style={{ padding: '16px', borderRadius: 12, background: '#FFFCF8', border: '0.5px solid rgba(26,23,20,0.08)', marginBottom: 24 }}>
            <h3 style={{ fontSize: 13, fontWeight: 600, color: '#1A1714', margin: '0 0 8px' }}>Tracking</h3>
            <p style={{ fontSize: 13, color: '#5C4A3A', margin: 0 }}>
              {shipment.carrier && <span style={{ fontWeight: 500 }}>{shipment.carrier} — </span>}
              {shipment.tracking_number}
            </p>
            {shipment.tracking_url && (
              <a href={shipment.tracking_url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: '#8B6F5C', fontWeight: 500, marginTop: 4, display: 'inline-block' }}>
                Track Package →
              </a>
            )}
          </div>
        )}

        {/* Items */}
        <div style={{ padding: '16px', borderRadius: 12, background: '#FFFCF8', border: '0.5px solid rgba(26,23,20,0.08)', marginBottom: 24 }}>
          <h3 style={{ fontSize: 13, fontWeight: 600, color: '#1A1714', margin: '0 0 12px' }}>Items ({items.length})</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {items.map((item: any) => (
              <div key={item.id} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <div style={{ width: 48, height: 56, borderRadius: 4, background: '#f5f0ea', overflow: 'hidden', flexShrink: 0 }}>
                  {item.thumbnail_url && <img src={item.thumbnail_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 13, fontWeight: 500, color: '#1A1714', margin: 0 }}>{item.design_title || 'Untitled'}</p>
                  <p style={{ fontSize: 11, color: '#A39080', margin: '2px 0 0' }}>{item.size_name} · {item.finish_name}</p>
                </div>
                <span style={{ fontSize: 13, fontWeight: 500, color: '#1A1714' }}>{formatPrice(item.total_price_paise)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Payment summary */}
        <div style={{ padding: '16px', borderRadius: 12, background: '#FFFCF8', border: '0.5px solid rgba(26,23,20,0.08)' }}>
          <h3 style={{ fontSize: 13, fontWeight: 600, color: '#1A1714', margin: '0 0 12px' }}>Payment</h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
            <span style={{ color: '#5C4A3A' }}>Subtotal</span>
            <span style={{ color: '#1A1714' }}>{formatPrice(order.subtotal_paise)}</span>
          </div>
          {order.discount_paise > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginTop: 4 }}>
              <span style={{ color: '#4CAF50' }}>Discount</span>
              <span style={{ color: '#4CAF50' }}>- {formatPrice(order.discount_paise)}</span>
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginTop: 4 }}>
            <span style={{ color: '#5C4A3A' }}>Shipping</span>
            <span style={{ color: order.shipping_paise === 0 ? '#4CAF50' : '#1A1714' }}>{order.shipping_paise === 0 ? 'FREE' : formatPrice(order.shipping_paise)}</span>
          </div>
          <div style={{ borderTop: '1px solid rgba(26,23,20,0.08)', margin: '8px 0' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, fontWeight: 600 }}>
            <span style={{ color: '#1A1714' }}>Total</span>
            <span style={{ color: '#1A1714' }}>{formatPrice(order.total_paise)}</span>
          </div>
          {payment && (
            <p style={{ fontSize: 11, color: '#A39080', margin: '8px 0 0' }}>
              Paid via {payment.payment_method || 'Razorpay'} · {formatDate(payment.created_at)}
            </p>
          )}
        </div>

        {/* Shipping address */}
        {order.addr_line1 && (
          <div style={{ marginTop: 24, padding: '16px', borderRadius: 12, background: '#FFFCF8', border: '0.5px solid rgba(26,23,20,0.08)' }}>
            <h3 style={{ fontSize: 13, fontWeight: 600, color: '#1A1714', margin: '0 0 8px' }}>Shipping To</h3>
            <p style={{ fontSize: 13, color: '#1A1714', fontWeight: 500, margin: 0 }}>{order.addr_name}</p>
            <p style={{ fontSize: 12, color: '#5C4A3A', margin: '4px 0 0' }}>
              {order.addr_line1}{order.addr_line2 ? `, ${order.addr_line2}` : ''}<br />
              {order.addr_city}, {order.addr_state} — {order.addr_pincode}
            </p>
            <p style={{ fontSize: 12, color: '#A39080', margin: '4px 0 0' }}>{order.addr_phone}</p>
          </div>
        )}
      </main>
    </div>
  );
}
