'use client';

import { useState, useEffect, useCallback, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import Logo from '@/components/ui/Logo';
import { useAuth } from '@/hooks/useAuth';
import { useRazorpay } from '@/hooks/useRazorpay';
import { useCart } from '@/store/cart';


interface Design {
  id: string;
  title: string;
  thumbnail_url: string | null;
  canvas_state: { version: number; frameData: Record<string, unknown> } | null;
  template_id: string | null;
}

interface TemplatePricing {
  template_id: string;
  template_name: string;
  first_print_paise: number;
  extra_print_paise: number;
  items_per_sheet: number;
}

interface PriceBundle {
  id: string;
  template_id: string;
  bundle_name: string;
  quantity: number;
  price_paise: number;
}

interface PrintFinish {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  price_addon_paise: number;
}

interface Address {
  id: string;
  label: string | null;
  full_name: string;
  phone: string;
  line1: string;
  line2: string | null;
  city: string;
  state: string;
  pincode: string;
  is_default: boolean;
}

interface CouponResult {
  valid: boolean;
  reason?: string;
  discountPaise?: number;
  couponId?: string;
  type?: string;
  description?: string;
}

// ----- Order Page -----
export default function OrderPageWrapper() {
  return (
    <Suspense fallback={
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(180deg,#EDE6DC 0%,#DDD4C8 100%)' }}>
        <div style={{ width: 28, height: 28, borderRadius: '50%', border: '2px solid rgba(139,99,71,0.2)', borderTopColor: '#8B6347', animation: 'spin 0.8s linear infinite' }} />
      </div>
    }>
      <OrderPage />
    </Suspense>
  );
}

function OrderPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading: authLoading } = useAuth();
  const { openPayment } = useRazorpay();
  const cart = useCart();

  const [designs, setDesigns] = useState<Design[]>([]);
  const [loadingDesigns, setLoadingDesigns] = useState(true);

  const [templatePricing, setTemplatePricing] = useState<TemplatePricing[]>([]);
  const [bundles, setBundles] = useState<PriceBundle[]>([]);
  const [finishes, setFinishes] = useState<PrintFinish[]>([]);
  const [giftBoxPaise, setGiftBoxPaise] = useState(14900);
  const [sheetSaverEnabled, setSheetSaverEnabled] = useState(true);
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(50000);

  const [selectedFinish, setSelectedFinish] = useState<string>('');
  const [wantGiftBox, setWantGiftBox] = useState(false);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<string>('');
  const [showNewAddress, setShowNewAddress] = useState(false);
  const [newAddr, setNewAddr] = useState({
    fullName: '', phone: '', line1: '', line2: '', landmark: '', city: '', state: '', pincode: '', label: '',
  });

  const [couponCode, setCouponCode] = useState('');
  const [couponResult, setCouponResult] = useState<CouponResult | null>(null);
  const [validatingCoupon, setValidatingCoupon] = useState(false);

  const [isGift, setIsGift] = useState(false);
  const [giftMessage, setGiftMessage] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/pricing')
      .then(r => r.json())
      .then(data => {
        setTemplatePricing(data.templatePricing || []);
        setBundles(data.bundles || []);
        setFinishes(data.finishes || []);
        setGiftBoxPaise(data.giftBoxPaise || 14900);
        setFreeShippingThreshold(data.freeShippingThresholdPaise || 50000);
        setSheetSaverEnabled(data.sheetSaverEnabled !== false);
        if (data.finishes?.length) setSelectedFinish(data.finishes[0].id);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const urlIds = searchParams.get('ids');
    const idList = urlIds ? urlIds.split(',').filter(Boolean) : cart.getDesignIds();
    if (idList.length === 0) { setLoadingDesigns(false); return; }
    if (urlIds && idList.length > 0) { cart.setItems(idList); }
    fetch(`/api/designs?ids=${idList.join(',')}`)
      .then(r => r.json())
      .then(data => { setDesigns(data.designs || []); })
      .catch(() => {})
      .finally(() => setLoadingDesigns(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  useEffect(() => {
    if (!user) return;
    fetch('/api/account/addresses')
      .then(r => r.json())
      .then(data => {
        setAddresses(data.addresses || []);
        const def = (data.addresses || []).find((a: Address) => a.is_default);
        if (def) setSelectedAddress(def.id);
      })
      .catch(() => {});
  }, [user]);

  const priceBreakdown = useMemo(() => {
    if (designs.length === 0 || !selectedFinish || templatePricing.length === 0) return null;
    const fn = finishes.find(f => f.id === selectedFinish);
    if (!fn) return null;

    const typeCount: Record<string, { count: number; tp: TemplatePricing }> = {};
    for (const d of designs) {
      const tp = templatePricing.find(t => t.template_id === d.template_id);
      const fallback = templatePricing.find(t => t.template_id === 'polaroid-classic') || templatePricing[0];
      const matched = tp || fallback;
      const key = matched.template_id;
      if (!typeCount[key]) typeCount[key] = { count: 0, tp: matched };
      typeCount[key].count++;
    }

    let printsPaise = 0;
    const breakdown: { name: string; count: number; bundleName?: string; bundleQty?: number; bundlePrice?: number; extraCount?: number; extraPrice: number; total: number }[] = [];
    for (const [templateId, { count, tp }] of Object.entries(typeCount)) {
      const templateBundles = bundles.filter(b => b.template_id === templateId).sort((a, b) => b.quantity - a.quantity);
      const bestBundle = templateBundles.find(b => b.quantity <= count);
      let total: number;
      if (bestBundle) {
        const extraCount = count - bestBundle.quantity;
        const extraTotal = extraCount * tp.extra_print_paise;
        total = bestBundle.price_paise + extraTotal;
        breakdown.push({ name: tp.template_name, count, bundleName: bestBundle.bundle_name, bundleQty: bestBundle.quantity, bundlePrice: bestBundle.price_paise, extraCount, extraPrice: tp.extra_print_paise, total });
      } else {
        const first = tp.first_print_paise;
        const extras = (count - 1) * tp.extra_print_paise;
        total = first + extras;
        breakdown.push({ name: tp.template_name, count, extraPrice: tp.extra_print_paise, total });
      }
      printsPaise += total;
    }

    const finishAddonTotal = fn.price_addon_paise * designs.length;
    const giftBoxTotal = wantGiftBox ? giftBoxPaise : 0;
    const subtotal = printsPaise + finishAddonTotal + giftBoxTotal;
    const couponDiscount = couponResult?.valid ? (couponResult.discountPaise || 0) : 0;
    const shipping = subtotal >= freeShippingThreshold ? 0 : 4900;
    const total = subtotal - couponDiscount + shipping;

    return { printsPaise, breakdown, finishAddonTotal, giftBoxTotal, subtotal, couponDiscount, shipping, total, fn };
  }, [designs, templatePricing, bundles, finishes, selectedFinish, wantGiftBox, giftBoxPaise, freeShippingThreshold, couponResult]);

  const sheetSaverTips = useMemo(() => {
    if (!sheetSaverEnabled || designs.length === 0 || templatePricing.length === 0) return [];
    const tips: { templateName: string; current: number; sheetSize: number; needed: number; costPaise: number }[] = [];
    const typeCount: Record<string, { count: number; tp: TemplatePricing }> = {};
    for (const d of designs) {
      const tp = templatePricing.find(t => t.template_id === d.template_id);
      const fallback = templatePricing.find(t => t.template_id === 'polaroid-classic') || templatePricing[0];
      const matched = tp || fallback;
      if (!typeCount[matched.template_id]) typeCount[matched.template_id] = { count: 0, tp: matched };
      typeCount[matched.template_id].count++;
    }
    for (const [, { count, tp }] of Object.entries(typeCount)) {
      const remainder = count % tp.items_per_sheet;
      if (remainder > 0 && remainder >= tp.items_per_sheet / 2) {
        const needed = tp.items_per_sheet - remainder;
        if (needed > 0 && needed <= 3) {
          tips.push({ templateName: tp.template_name, current: count, sheetSize: tp.items_per_sheet, needed, costPaise: needed * tp.extra_print_paise });
        }
      }
    }
    return tips;
  }, [designs, templatePricing, sheetSaverEnabled]);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setValidatingCoupon(true);
    try {
      const res = await fetch('/api/orders/validate-coupon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponCode, subtotalPaise: priceBreakdown?.subtotal || 0 }),
      });
      const data = await res.json();
      setCouponResult(data);
    } catch {
      setCouponResult({ valid: false, reason: 'Network error' });
    } finally {
      setValidatingCoupon(false);
    }
  };

  const handleSaveAddress = async () => {
    const res = await fetch('/api/account/addresses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...newAddr, isDefault: addresses.length === 0 }),
    });
    if (res.ok) {
      const data = await res.json();
      const saved = { ...newAddr, id: data.address.id, is_default: addresses.length === 0, line2: newAddr.line2 || null, label: newAddr.label || null } as unknown as Address;
      setAddresses(prev => [...prev, saved]);
      setSelectedAddress(data.address.id);
      setShowNewAddress(false);
    }
  };

  const removeDesign = (id: string) => {
    setDesigns(prev => prev.filter(d => d.id !== id));
    cart.removeItem(id);
  };

  const handleSubmit = async () => {
    setError('');
    if (designs.length === 0) { setError('Select at least one design'); return; }
    if (!selectedFinish) { setError('Select a finish'); return; }

    const addressId = selectedAddress;
    const isNewAddressForm = showNewAddress || addresses.length === 0;
    if (!addressId && !isNewAddressForm) { setError('Select or add a shipping address'); return; }

    let finalAddressId = addressId;
    if (isNewAddressForm && !addressId) {
      const res = await fetch('/api/account/addresses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newAddr, isDefault: true }),
      });
      if (!res.ok) { setError('Failed to save address'); return; }
      const data = await res.json();
      finalAddressId = data.address.id;
    }

    setSubmitting(true);
    try {
      const orderRes = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          designIds: designs.map(d => d.id),
          finishId: selectedFinish,
          addressId: finalAddressId,
          couponId: couponResult?.valid ? couponResult.couponId : null,
          wantGiftBox,
          isGift,
          giftMessage: isGift ? giftMessage : null,
        }),
      });

      if (!orderRes.ok) {
        const data = await orderRes.json();
        setError(data.error || 'Failed to create order');
        setSubmitting(false);
        return;
      }

      const { id: orderId, totalPaise } = await orderRes.json();

      const payRes = await fetch(`/api/orders/${orderId}/payment`, { method: 'POST' });
      if (!payRes.ok) { setError('Failed to initiate payment'); setSubmitting(false); return; }
      const payData = await payRes.json();

      openPayment({
        key: payData.key,
        amount: payData.amount,
        currency: payData.currency,
        order_id: payData.razorpayOrderId,
        name: 'Polamuse',
        description: `Order ${payData.orderNumber}`,
        prefill: { email: user?.email || undefined, name: user?.fullName || undefined },
        onSuccess: async (response) => {
          const verifyRes = await fetch('/api/payments/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpayPaymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
              razorpaySignature: response.razorpay_signature,
              orderId,
            }),
          });
          if (verifyRes.ok) {
            cart.clearCart();
            router.push(`/order/${orderId}?success=true`);
          } else {
            setError('Payment verification failed. Contact support if amount was deducted.');
          }
          setSubmitting(false);
        },
        onFailure: () => {
          setError('Payment was cancelled or failed. Your order is saved — you can retry payment.');
          setSubmitting(false);
        },
      });
    } catch {
      setError('Something went wrong. Please try again.');
      setSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(180deg,#EDE6DC 0%,#DDD4C8 100%)' }}>
        <div style={{ width: 28, height: 28, borderRadius: '50%', border: '2px solid rgba(139,99,71,0.2)', borderTopColor: '#8B6347', animation: 'spin 0.8s linear infinite' }} />
      </div>
    );
  }

  const formatPrice = (paise: number) => `₹${(paise / 100).toFixed(paise % 100 === 0 ? 0 : 2)}`;

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg,#EDE6DC 0%,#DDD4C8 100%)', fontFamily: "'DM Sans', sans-serif" }}>

      {/* ── Header ── */}
      <header style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 24px',
        borderBottom: '0.5px solid rgba(26,23,20,0.08)',
        background: 'rgba(251,248,244,0.97)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        position: 'sticky', top: 0, zIndex: 50,
      }}>
        <Link href="/designs" style={{
          display: 'flex', alignItems: 'center', gap: 6,
          color: '#5C4A3A', textDecoration: 'none', fontSize: 13, fontWeight: 400,
          opacity: 0.8, transition: 'opacity .15s',
        }}
          onMouseEnter={e => { e.currentTarget.style.opacity = '1'; }}
          onMouseLeave={e => { e.currentTarget.style.opacity = '0.8'; }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Back
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 16 }}>🖼️</span>
          <span style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 18, fontWeight: 300, fontStyle: 'italic',
            color: '#1A1714', letterSpacing: '-.01em',
          }}>
            Order prints
          </span>
        </div>

        <Logo size="sm" />
      </header>

      <main style={{ maxWidth: 640, margin: '0 auto', padding: '32px 20px 140px' }}>

        {/* ── Print Preview ── */}
        {!loadingDesigns && designs.length > 0 && designs[0].thumbnail_url && (
          <div style={{
            marginBottom: 28, borderRadius: 20, overflow: 'hidden',
            background: '#F5EDE3',
            boxShadow: 'inset 0 2px 8px rgba(26,23,20,0.06), 0 4px 24px rgba(26,23,20,0.08)',
            border: '0.5px solid rgba(26,23,20,0.07)',
          }}>
            {/* Wall area */}
            <div style={{
              padding: '36px 28px 24px',
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              background: 'linear-gradient(180deg,#F0E6D8 0%,#F5EDE3 100%)',
            }}>
              {/* Nail */}
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#C9B5A8', marginBottom: 0, boxShadow: '0 1px 3px rgba(26,23,20,0.2)', zIndex: 2, position: 'relative', top: 6 }} />

              {/* Polaroid stack */}
              <div style={{ position: 'relative', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', minHeight: 220 }}>
                {/* Back polaroids for multi-design */}
                {designs.length > 2 && designs[2].thumbnail_url && (
                  <div style={{
                    position: 'absolute', top: 8, left: '50%',
                    transform: 'translateX(-50%) translateX(18px) rotate(5deg)',
                    width: 140, background: '#fff',
                    boxShadow: '0 4px 16px rgba(26,23,20,0.12)',
                    borderRadius: 3, padding: '7px 7px 28px', zIndex: 1,
                  }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={designs[2].thumbnail_url} alt="" style={{ width: '100%', display: 'block', aspectRatio: '1/1.1', objectFit: 'cover' }} />
                  </div>
                )}
                {designs.length > 1 && designs[1].thumbnail_url && (
                  <div style={{
                    position: 'absolute', top: 4, left: '50%',
                    transform: 'translateX(-50%) translateX(-14px) rotate(-4deg)',
                    width: 148, background: '#fff',
                    boxShadow: '0 4px 20px rgba(26,23,20,0.14)',
                    borderRadius: 3, padding: '8px 8px 30px', zIndex: 2,
                  }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={designs[1].thumbnail_url} alt="" style={{ width: '100%', display: 'block', aspectRatio: '1/1.1', objectFit: 'cover' }} />
                  </div>
                )}
                {/* Main polaroid */}
                <div style={{
                  position: 'relative', zIndex: 3,
                  background: '#fff',
                  padding: '9px 9px 36px',
                  borderRadius: 3,
                  boxShadow: '0 8px 32px rgba(26,23,20,0.18), 0 2px 8px rgba(26,23,20,0.1)',
                  transform: 'rotate(-2deg)',
                  width: 164,
                }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={designs[0].thumbnail_url}
                    alt={designs[0].title || 'Your design'}
                    style={{ width: '100%', display: 'block', aspectRatio: '1/1.1', objectFit: 'cover' }}
                  />
                </div>
              </div>

              {designs.length > 1 && (
                <p style={{ margin: '16px 0 0', fontSize: 12, color: '#A39080', fontStyle: 'italic' }}>
                  + {designs.length - 1} more design{designs.length > 2 ? 's' : ''}
                </p>
              )}
            </div>

            {/* Badge bar */}
            <div style={{ padding: '10px 20px', display: 'flex', justifyContent: 'center' }}>
              <span style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: 9.5, letterSpacing: '.12em',
                textTransform: 'uppercase' as const,
                color: '#A39080',
              }}>
                300 DPI · Ships in 3–5 days
              </span>
            </div>
          </div>
        )}

        {/* STEP 1: Designs */}
        <Section title="Your Designs" step={1}>
          {loadingDesigns ? (
            <div style={{ padding: 36, display: 'flex', justifyContent: 'center' }}>
              <div style={{ width: 22, height: 22, borderRadius: '50%', border: '2px solid rgba(139,99,71,0.2)', borderTopColor: '#8B6347', animation: 'spin 0.8s linear infinite' }} />
            </div>
          ) : designs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '28px 16px' }}>
              <p style={{ color: '#5C4A3A', fontSize: 14, marginBottom: 10 }}>No designs selected</p>
              <Link href="/designs" style={{ color: '#8B6347', fontWeight: 500, fontSize: 13 }}>← Go to My Designs to select</Link>
            </div>
          ) : (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {designs.map((d) => {
                  const tp = templatePricing.find(t => t.template_id === d.template_id);
                  const typeName = tp?.template_name || 'Classic';
                  return (
                    <DesignCard
                      key={d.id}
                      design={d}
                      typeName={typeName}
                      onRemove={() => removeDesign(d.id)}
                    />
                  );
                })}
              </div>
              <div style={{ fontSize: 11.5, color: '#A39080', marginTop: 10, fontFamily: "'DM Mono', monospace", letterSpacing: '.04em' }}>
                {designs.length} design{designs.length > 1 ? 's' : ''} selected
              </div>
              <div style={{ display: 'flex', gap: 16, marginTop: 12 }}>
                <Link href="/designs?modify=true" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#8B6347', fontWeight: 500, textDecoration: 'none' }}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  Modify selection
                </Link>
                <Link href="/designs" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#8B6347', fontWeight: 500, textDecoration: 'none' }}>
                  + Add more
                </Link>
              </div>
            </>
          )}
        </Section>

        {/* STEP 2: Print Options */}
        <Section title="Print Options" step={2}>
          {/* Finish */}
          <div style={{ fontSize: 10, fontFamily: "'DM Mono', monospace", letterSpacing: '.1em', textTransform: 'uppercase' as const, color: '#A39080', marginBottom: 10 }}>Finish</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' as const }}>
            {finishes.map(fn => (
              <button
                key={fn.id}
                onClick={() => setSelectedFinish(fn.id)}
                style={{
                  flex: 1, minWidth: 120,
                  padding: '14px 16px', borderRadius: 12,
                  border: selectedFinish === fn.id ? '1.5px solid #8B6347' : '0.5px solid rgba(26,23,20,0.1)',
                  background: selectedFinish === fn.id ? 'rgba(139,99,71,0.04)' : 'rgba(255,255,255,0.7)',
                  cursor: 'pointer', transition: 'all 0.15s ease', textAlign: 'left' as const,
                  boxShadow: selectedFinish === fn.id ? '0 2px 12px rgba(139,99,71,0.1)' : 'none',
                }}
              >
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 500, color: '#1A1714', marginBottom: 2 }}>{fn.name}</div>
                {fn.price_addon_paise > 0 && (
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: '#A39080', marginBottom: fn.description ? 3 : 0 }}>+{formatPrice(fn.price_addon_paise)}/ea</div>
                )}
                {fn.description && <div style={{ fontSize: 11, color: '#A39080', lineHeight: 1.4 }}>{fn.description}</div>}
              </button>
            ))}
          </div>

          {/* Gift Box addon */}
          <button
            onClick={() => setWantGiftBox(!wantGiftBox)}
            style={{
              marginTop: 12, width: '100%', textAlign: 'left' as const,
              padding: '14px 16px', borderRadius: 12, cursor: 'pointer',
              border: wantGiftBox ? '1.5px solid rgba(139,99,71,0.35)' : '0.5px solid rgba(26,23,20,0.08)',
              background: wantGiftBox ? 'rgba(139,99,71,0.04)' : 'rgba(255,255,255,0.55)',
              display: 'flex', alignItems: 'center', gap: 12, transition: 'all .15s ease',
            }}
          >
            <span style={{ fontSize: 20 }}>🎁</span>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 14, fontWeight: 500, color: '#1A1714', fontFamily: "'DM Sans', sans-serif" }}>Add Gift Box</span>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: '#A39080' }}>+{formatPrice(giftBoxPaise)}</span>
              </div>
              <div style={{ fontSize: 11, color: '#A39080', marginTop: 2 }}>Premium box with tissue paper & ribbon</div>
            </div>
            <div style={{
              width: 18, height: 18, borderRadius: '50%',
              border: wantGiftBox ? '2px solid #8B6347' : '1.5px solid rgba(26,23,20,0.18)',
              background: wantGiftBox ? '#8B6347' : 'transparent',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all .15s ease', flexShrink: 0,
            }}>
              {wantGiftBox && (
                <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              )}
            </div>
          </button>

          {/* Auto-detected sizes */}
          {designs.length > 0 && templatePricing.length > 0 && (
            <div style={{
              marginTop: 12, padding: '10px 14px', borderRadius: 8,
              background: 'rgba(139,99,71,0.04)', border: '0.5px solid rgba(139,99,71,0.1)',
              display: 'flex', flexWrap: 'wrap' as const, gap: 6, alignItems: 'center',
            }}>
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9.5, letterSpacing: '.08em', color: '#A39080', textTransform: 'uppercase' as const }}>Sizes detected:</span>
              {Array.from(new Set(designs.map(d => {
                const tp = templatePricing.find(t => t.template_id === d.template_id);
                return tp?.template_name || 'Classic';
              }))).map(name => (
                <span key={name} style={{
                  padding: '2px 9px', borderRadius: 100,
                  background: 'rgba(139,99,71,0.08)', border: '0.5px solid rgba(139,99,71,0.14)',
                  fontFamily: "'DM Mono', monospace", fontSize: 9.5, color: '#8B6347',
                }}>{name}</span>
              ))}
            </div>
          )}
        </Section>

        {/* STEP 3: Shipping Address */}
        <Section title="Shipping Address" step={3}>
          {addresses.length > 0 && !showNewAddress && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {addresses.map(a => (
                <button
                  key={a.id}
                  onClick={() => setSelectedAddress(a.id)}
                  style={{
                    display: 'flex', alignItems: 'stretch',
                    gap: 0, padding: 0, borderRadius: 12, textAlign: 'left' as const, width: '100%',
                    border: selectedAddress === a.id ? '1.5px solid #8B6347' : '0.5px solid rgba(26,23,20,0.1)',
                    background: selectedAddress === a.id ? 'rgba(139,99,71,0.03)' : 'rgba(255,255,255,0.6)',
                    cursor: 'pointer', transition: 'all 0.15s ease', overflow: 'hidden',
                    boxShadow: selectedAddress === a.id ? '0 2px 12px rgba(139,99,71,0.1)' : 'none',
                  }}
                  onMouseEnter={e => { if (selectedAddress !== a.id) e.currentTarget.style.transform = 'translateY(-1px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'none'; }}
                >
                  {/* Left accent stripe */}
                  <div style={{
                    width: 3, flexShrink: 0,
                    background: selectedAddress === a.id ? '#8B6347' : 'transparent',
                    borderRadius: '2px 0 0 2px',
                    transition: 'background .15s ease',
                  }} />
                  <div style={{ padding: '12px 14px', flex: 1 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 600, color: '#1A1714', fontFamily: "'DM Sans', sans-serif", marginBottom: 3 }}>
                      {a.full_name}
                      {a.label && <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9.5, color: '#A39080', fontWeight: 400, marginLeft: 8 }}>{a.label}</span>}
                    </div>
                    <div style={{ fontSize: 12, color: '#5C4A3A', lineHeight: 1.5 }}>{a.line1}{a.line2 ? `, ${a.line2}` : ''}</div>
                    <div style={{ fontSize: 12, color: '#A39080', marginTop: 1 }}>{a.city}, {a.state} — {a.pincode}</div>
                  </div>
                </button>
              ))}
              <button onClick={() => setShowNewAddress(true)} style={{
                fontSize: 12, color: '#8B6347', fontWeight: 500,
                background: 'none', border: '0.5px dashed rgba(139,99,71,0.3)',
                borderRadius: 10, cursor: 'pointer', padding: '10px 14px',
                textAlign: 'left' as const, transition: 'background .14s',
              }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(139,99,71,0.04)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'none'; }}
              >
                + Add new address
              </button>
            </div>
          )}

          {(showNewAddress || addresses.length === 0) && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <InputField label="Full Name" value={newAddr.fullName} onChange={v => setNewAddr(p => ({ ...p, fullName: v }))} />
                <InputField label="Phone" value={newAddr.phone} onChange={v => setNewAddr(p => ({ ...p, phone: v }))} type="tel" />
              </div>
              <InputField label="Address Line 1" value={newAddr.line1} onChange={v => setNewAddr(p => ({ ...p, line1: v }))} />
              <InputField label="Address Line 2 (optional)" value={newAddr.line2} onChange={v => setNewAddr(p => ({ ...p, line2: v }))} />
              <InputField label="Landmark (optional)" value={newAddr.landmark} onChange={v => setNewAddr(p => ({ ...p, landmark: v }))} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                <InputField label="City" value={newAddr.city} onChange={v => setNewAddr(p => ({ ...p, city: v }))} />
                <InputField label="PIN Code" value={newAddr.pincode} onChange={v => setNewAddr(p => ({ ...p, pincode: v }))} />
                <InputField label="State" value={newAddr.state} onChange={v => setNewAddr(p => ({ ...p, state: v }))} />
              </div>
              {addresses.length > 0 && (
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={handleSaveAddress} style={{ padding: '10px 18px', borderRadius: 10, fontSize: 13, fontWeight: 500, border: 'none', cursor: 'pointer', background: '#8B6347', color: '#fff', fontFamily: 'inherit' }}>Save Address</button>
                  <button onClick={() => setShowNewAddress(false)} style={{ padding: '10px 18px', borderRadius: 10, fontSize: 13, fontWeight: 500, cursor: 'pointer', background: 'transparent', color: '#5C4A3A', border: '0.5px solid rgba(26,23,20,0.12)', fontFamily: 'inherit' }}>Cancel</button>
                </div>
              )}
            </div>
          )}
        </Section>

        {/* STEP 4: Coupon */}
        <Section title="Coupon Code" step={4} optional>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              type="text"
              placeholder="Enter code"
              value={couponCode}
              onChange={e => { setCouponCode(e.target.value.toUpperCase()); setCouponResult(null); }}
              style={{
                flex: 1, padding: '11px 14px', borderRadius: 8, fontSize: 13,
                border: '0.5px solid rgba(26,23,20,0.12)',
                background: 'rgba(255,255,255,0.8)',
                outline: 'none', fontFamily: 'inherit',
                textTransform: 'uppercase' as const,
                letterSpacing: '.06em',
              }}
              onFocus={e => { e.currentTarget.style.border = '1px solid rgba(139,99,71,0.5)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(139,99,71,0.08)'; }}
              onBlur={e => { e.currentTarget.style.border = '0.5px solid rgba(26,23,20,0.12)'; e.currentTarget.style.boxShadow = 'none'; }}
            />
            <button
              onClick={handleApplyCoupon}
              disabled={validatingCoupon || !couponCode.trim()}
              style={{
                padding: '11px 18px', borderRadius: 10, fontSize: 13, fontWeight: 500,
                border: 'none', cursor: validatingCoupon ? 'not-allowed' : 'pointer',
                background: '#8B6347', color: '#fff', fontFamily: 'inherit',
                opacity: (validatingCoupon || !couponCode.trim()) ? 0.5 : 1,
                transition: 'opacity .15s',
              }}
            >
              {validatingCoupon ? '...' : 'Apply'}
            </button>
          </div>
          {couponResult && (
            <div style={{
              marginTop: 8, fontSize: 12, lineHeight: 1.5,
              color: couponResult.valid ? '#2d8a4e' : '#C0604A',
              padding: '8px 12px', borderRadius: 8,
              background: couponResult.valid ? 'rgba(45,138,78,0.06)' : 'rgba(192,96,74,0.06)',
            }}>
              {couponResult.valid
                ? `✓ ${couponResult.description || 'Coupon applied'} — saves ${formatPrice(couponResult.discountPaise || 0)}`
                : `✗ ${couponResult.reason}`}
            </div>
          )}
        </Section>

        {/* STEP 5: Gift Options */}
        <Section title="Gift Options" step={5} optional>
          <button
            onClick={() => setIsGift(!isGift)}
            style={{
              width: '100%', textAlign: 'left' as const,
              padding: '12px 14px', borderRadius: 10, cursor: 'pointer',
              border: isGift ? '1.5px solid rgba(139,99,71,0.3)' : '0.5px solid rgba(26,23,20,0.08)',
              background: isGift ? 'rgba(139,99,71,0.04)' : 'rgba(255,255,255,0.5)',
              display: 'flex', alignItems: 'center', gap: 10, transition: 'all .15s ease',
            }}
          >
            <div style={{
              width: 18, height: 18, borderRadius: '50%',
              border: isGift ? '2px solid #8B6347' : '1.5px solid rgba(26,23,20,0.18)',
              background: isGift ? '#8B6347' : 'transparent',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all .15s ease', flexShrink: 0,
            }}>
              {isGift && (
                <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              )}
            </div>
            <span style={{ fontSize: 13, fontWeight: 500, color: '#1A1714', fontFamily: "'DM Sans', sans-serif" }}>This is a gift</span>
          </button>
          {isGift && (
            <textarea
              placeholder="Write a gift message (optional, max 500 chars)"
              value={giftMessage}
              onChange={e => setGiftMessage(e.target.value.slice(0, 500))}
              maxLength={500}
              style={{
                marginTop: 10, width: '100%', padding: '11px 14px', borderRadius: 8,
                fontSize: 13, border: '0.5px solid rgba(26,23,20,0.12)',
                background: 'rgba(255,255,255,0.8)',
                resize: 'vertical' as const, minHeight: 70, fontFamily: 'inherit', outline: 'none',
                lineHeight: 1.6,
              }}
              onFocus={e => { e.currentTarget.style.border = '1px solid rgba(139,99,71,0.5)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(139,99,71,0.08)'; }}
              onBlur={e => { e.currentTarget.style.border = '0.5px solid rgba(26,23,20,0.12)'; e.currentTarget.style.boxShadow = 'none'; }}
            />
          )}
        </Section>

        {/* ── Price Summary (dark card) ── */}
        {priceBreakdown && (
          <div style={{
            marginTop: 24, borderRadius: 16,
            background: 'rgba(26,23,20,0.97)',
            border: '0.5px solid rgba(26,23,20,0.3)',
            boxShadow: '0 8px 40px rgba(26,23,20,0.18)',
            overflow: 'hidden',
          }}>
            <div style={{ padding: '20px 20px 0' }}>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: '.2em', textTransform: 'uppercase' as const, color: 'rgba(242,237,228,0.35)', marginBottom: 16 }}>
                Price breakdown
              </div>

              {priceBreakdown.breakdown.map((b, i) => (
                <PriceLine key={i}
                  label={b.bundleName
                    ? `${b.bundleName} (${b.bundleQty}pc)${b.extraCount ? ` + ${b.extraCount} extra × ${formatPrice(b.extraPrice)}` : ''}`
                    : b.count === 1
                      ? `${b.name} (1 print)`
                      : `${b.name} (1st + ${b.count - 1} × ${formatPrice(b.extraPrice)})`}
                  value={b.total}
                  dark
                />
              ))}
              {priceBreakdown.finishAddonTotal > 0 && (
                <PriceLine label={`${priceBreakdown.fn.name} finish (+${formatPrice(priceBreakdown.fn.price_addon_paise)}/ea)`} value={priceBreakdown.finishAddonTotal} dark />
              )}
              {priceBreakdown.giftBoxTotal > 0 && (
                <PriceLine label="Gift Box" value={priceBreakdown.giftBoxTotal} dark />
              )}

              <div style={{ borderTop: '0.5px solid rgba(242,237,228,0.08)', margin: '12px 0 8px' }} />
              <PriceLine label="Subtotal" value={priceBreakdown.subtotal} bold dark />
              {priceBreakdown.couponDiscount > 0 && (
                <PriceLine label="Coupon discount" value={-priceBreakdown.couponDiscount} green dark />
              )}
              <PriceLine label="Shipping" value={priceBreakdown.shipping} free={priceBreakdown.shipping === 0} dark />
            </div>

            {/* Total row */}
            <div style={{
              borderTop: '0.5px solid rgba(242,237,228,0.1)',
              margin: '12px 0 0',
              padding: '16px 20px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9.5, letterSpacing: '.18em', textTransform: 'uppercase' as const, color: 'rgba(242,237,228,0.4)' }}>
                Total
              </div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 32, fontWeight: 300, color: 'rgba(242,237,228,0.95)', lineHeight: 1, letterSpacing: '-.01em' }}>
                {formatPrice(priceBreakdown.total)}
              </div>
            </div>
          </div>
        )}

        {/* ── Sheet Saver Tip ── */}
        {sheetSaverTips.length > 0 && (
          <div style={{
            marginTop: 14, padding: '12px 16px', borderRadius: 12,
            background: 'rgba(139,99,71,0.06)', border: '0.5px solid rgba(139,99,71,0.18)',
            display: 'flex', gap: 10, alignItems: 'flex-start',
          }}>
            <span style={{ color: '#8B6347', fontSize: 12, marginTop: 1, flexShrink: 0 }}>✦</span>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#8B6347', marginBottom: 4 }}>Sheet Saver</div>
              {sheetSaverTips.map((tip, i) => (
                <div key={i} style={{ fontSize: 12, color: '#7A6E65', lineHeight: 1.6 }}>
                  Add {tip.needed} more {tip.templateName} for just {formatPrice(tip.costPaise)} to complete your print sheet.
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Error ── */}
        {error && (
          <div style={{
            marginTop: 16, padding: '12px 16px', borderRadius: 10,
            background: 'rgba(192,64,45,0.06)', border: '0.5px solid rgba(192,64,45,0.2)',
            fontSize: 13, color: '#C0604A', lineHeight: 1.5,
          }}>
            {error}
          </div>
        )}

        {/* ── CTA Button ── */}
        <button
          onClick={handleSubmit}
          disabled={submitting || designs.length === 0 || !priceBreakdown}
          style={{
            width: '100%', marginTop: 20,
            padding: '17px 28px', borderRadius: 14,
            background: (submitting || designs.length === 0 || !priceBreakdown)
              ? 'rgba(139,99,71,0.4)'
              : 'linear-gradient(135deg,#9B7B68 0%,#8B6347 50%,#7A5538 100%)',
            color: '#fff', fontSize: 16, fontWeight: 500,
            border: 'none', cursor: (submitting || designs.length === 0 || !priceBreakdown) ? 'not-allowed' : 'pointer',
            boxShadow: (submitting || !priceBreakdown) ? 'none' : 'inset 0 1px 0 rgba(255,255,255,0.14), 0 4px 20px rgba(139,99,71,0.3)',
            transition: 'all 0.2s ease', fontFamily: 'inherit',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          }}
          onMouseEnter={e => { if (!submitting && designs.length > 0 && priceBreakdown) { e.currentTarget.style.boxShadow = 'inset 0 1px 0 rgba(255,255,255,0.14), 0 8px 28px rgba(139,99,71,0.38)'; e.currentTarget.style.transform = 'translateY(-1px)'; } }}
          onMouseLeave={e => { e.currentTarget.style.boxShadow = 'inset 0 1px 0 rgba(255,255,255,0.14), 0 4px 20px rgba(139,99,71,0.3)'; e.currentTarget.style.transform = 'none'; }}
        >
          {submitting ? (
            <>
              <div style={{ width: 16, height: 16, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', animation: 'spin 0.8s linear infinite' }} />
              Processing...
            </>
          ) : priceBreakdown ? (
            <>
              <span>Pay</span>
              <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 300, lineHeight: 1 }}>{formatPrice(priceBreakdown.total)}</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </>
          ) : (
            'Select options to continue'
          )}
        </button>

        {/* DEV: Bypass payment button */}
        <button
          onClick={async () => {
            setSubmitting(true);
            setError('');
            try {
              let finalAddressId = selectedAddress;
              if (showNewAddress) {
                const addrRes = await fetch('/api/account/addresses', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(newAddr),
                });
                if (!addrRes.ok) { setError('Failed to save address'); setSubmitting(false); return; }
                const addrData = await addrRes.json();
                finalAddressId = addrData.id;
              }
              const orderRes = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  designIds: designs.map(d => d.id),
                  finishId: selectedFinish,
                  addressId: finalAddressId,
                  couponId: couponResult?.valid ? couponResult.couponId : null,
                  wantGiftBox,
                  isGift,
                  giftMessage: isGift ? giftMessage : null,
                }),
              });
              if (!orderRes.ok) {
                const data = await orderRes.json();
                setError(data.error || 'Failed to create order');
                setSubmitting(false);
                return;
              }
              const { id: orderId } = await orderRes.json();
              const bypassRes = await fetch(`/api/orders/${orderId}/bypass-payment`, { method: 'POST' });
              if (bypassRes.ok) {
                cart.clearCart();
                router.push(`/order/${orderId}?success=true`);
              } else {
                setError('Bypass failed');
              }
            } catch {
              setError('Bypass failed');
            } finally {
              setSubmitting(false);
            }
          }}
          disabled={submitting || designs.length === 0 || !priceBreakdown}
          style={{
            width: '100%', marginTop: 10, padding: '12px 24px', borderRadius: 10,
            background: 'transparent', color: 'rgba(192,64,45,0.7)',
            fontSize: 11, fontWeight: 500, border: '0.5px dashed rgba(192,64,45,0.25)',
            cursor: 'pointer', fontFamily: 'inherit',
            opacity: (submitting || designs.length === 0 || !priceBreakdown) ? 0.4 : 1,
          }}
        >
          ⚡ DEV: Skip Payment &amp; Confirm Order
        </button>

      </main>

      <style jsx global>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

// ── Helper Components ──

function Section({ title, step, optional, children }: { title: string; step: number; optional?: boolean; children: React.ReactNode }) {
  const stepStr = step < 10 ? `0${step}` : `${step}`;
  return (
    <div style={{ marginTop: 20 }}>
      {/* Section header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, paddingLeft: 2 }}>
        <span style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: 9, letterSpacing: '.16em', textTransform: 'uppercase' as const,
          color: '#C4A882',
        }}>
          STEP {stepStr}
        </span>
        <span style={{ width: 1, height: 12, background: 'rgba(26,23,20,0.12)', display: 'inline-block' }} />
        <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600, color: '#1A1714', margin: 0 }}>{title}</h2>
        {optional && (
          <span style={{
            background: 'rgba(139,99,71,0.08)', borderRadius: 100,
            padding: '2px 8px', fontSize: 9, color: '#A39080',
            fontFamily: "'DM Mono', monospace", letterSpacing: '.06em',
          }}>
            optional
          </span>
        )}
      </div>
      <div style={{
        padding: '20px',
        borderRadius: 16,
        background: 'rgba(255,252,248,0.92)',
        border: '0.5px solid rgba(26,23,20,0.07)',
        boxShadow: '0 2px 8px rgba(26,23,20,0.04), 0 8px 32px rgba(26,23,20,0.06)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}>
        {children}
      </div>
    </div>
  );
}

function DesignCard({ design, typeName, onRemove }: { design: Design; typeName: string; onRemove: () => void }) {
  const [removeHovered, setRemoveHovered] = useState(false);

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '8px 10px', borderRadius: 10,
      background: '#fff', border: '0.5px solid rgba(26,23,20,0.08)',
      boxShadow: '0 1px 4px rgba(26,23,20,0.04)',
    }}>
      {/* Thumbnail or placeholder */}
      <div style={{
        width: 40, height: 50, borderRadius: 2, flexShrink: 0, overflow: 'hidden',
        background: 'linear-gradient(135deg,#EDE6DC,#DDD4C8)',
        boxShadow: '0 1px 6px rgba(26,23,20,0.1)',
      }}>
        {design.thumbnail_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={design.thumbnail_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(139,99,71,0.4)" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
          </div>
        )}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 500, color: '#1A1714', fontFamily: "'DM Sans', sans-serif", overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>
          {design.title || 'Untitled'}
        </div>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9.5, color: '#A39080', marginTop: 2, letterSpacing: '.04em' }}>
          {typeName}
        </div>
      </div>

      {/* Remove button */}
      <button
        onMouseEnter={() => setRemoveHovered(true)}
        onMouseLeave={() => setRemoveHovered(false)}
        onClick={onRemove}
        style={{
          width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
          background: removeHovered ? 'rgba(192,96,74,0.1)' : 'rgba(26,23,20,0.06)',
          border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', padding: 0, transition: 'background .14s',
        }}
        title="Remove from order"
      >
        <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke={removeHovered ? '#C0604A' : '#7A6E65'} strokeWidth="2.5" strokeLinecap="round">
          <path d="M18 6L6 18M6 6l12 12"/>
        </svg>
      </button>
    </div>
  );
}

function InputField({ label, value, onChange, type = 'text' }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <div>
      <label style={{
        display: 'block',
        fontFamily: "'DM Mono', monospace",
        fontSize: 9.5, letterSpacing: '.1em', textTransform: 'uppercase' as const,
        color: '#A39080', marginBottom: 6,
      }}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{
          width: '100%', padding: '11px 14px', borderRadius: 8, fontSize: 13,
          border: '0.5px solid rgba(26,23,20,0.12)',
          background: 'rgba(255,255,255,0.8)',
          outline: 'none', fontFamily: 'inherit', color: '#1A1714',
          transition: 'border .15s, box-shadow .15s',
        }}
        onFocus={e => { e.currentTarget.style.border = '1px solid rgba(139,99,71,0.5)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(139,99,71,0.08)'; }}
        onBlur={e => { e.currentTarget.style.border = '0.5px solid rgba(26,23,20,0.12)'; e.currentTarget.style.boxShadow = 'none'; }}
      />
    </div>
  );
}

function PriceLine({ label, value, bold, large, green, free, dark }: { label: string; value: number; bold?: boolean; large?: boolean; green?: boolean; free?: boolean; dark?: boolean }) {
  const formatP = (paise: number) => {
    if (paise === 0 && free) return (
      <span style={{
        fontFamily: "'DM Mono', monospace", fontSize: 9.5, letterSpacing: '.08em',
        background: 'rgba(45,138,78,0.18)', color: '#4ade80',
        padding: '2px 8px', borderRadius: 100,
      }}>FREE</span>
    );
    const sign = paise < 0 ? '− ' : '';
    return `${sign}₹${(Math.abs(paise) / 100).toFixed(Math.abs(paise) % 100 === 0 ? 0 : 2)}`;
  };
  const textColor = dark
    ? (green ? '#6ee7a0' : free ? '#6ee7a0' : bold ? 'rgba(242,237,228,0.9)' : 'rgba(242,237,228,0.55)')
    : (green ? '#2d8a4e' : free ? '#2d8a4e' : '#1A1714');

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '3px 0', fontSize: large ? 15 : 12.5 }}>
      <span style={{ color: dark ? 'rgba(242,237,228,0.5)' : '#5C4A3A', fontWeight: bold ? 600 : 400, fontFamily: "'DM Sans', sans-serif" }}>{label}</span>
      <span style={{ color: textColor, fontWeight: bold ? 600 : 500, fontFamily: "'DM Mono', monospace", fontSize: large ? 14 : 12 }}>{formatP(value)}</span>
    </div>
  );
}
