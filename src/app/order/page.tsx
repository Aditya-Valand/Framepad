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
    <Suspense fallback={<div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#EDE6DC' }}><div className="animate-spin rounded-full h-8 w-8 border-2 border-[#8B6F5C] border-t-transparent" /></div>}>
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

  // Design selection
  const [designs, setDesigns] = useState<Design[]>([]);
  const [loadingDesigns, setLoadingDesigns] = useState(true);

  // Pricing data
  const [templatePricing, setTemplatePricing] = useState<TemplatePricing[]>([]);
  const [bundles, setBundles] = useState<PriceBundle[]>([]);
  const [finishes, setFinishes] = useState<PrintFinish[]>([]);
  const [giftBoxPaise, setGiftBoxPaise] = useState(14900);
  const [sheetSaverEnabled, setSheetSaverEnabled] = useState(true);
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(50000);

  // Selections
  const [selectedFinish, setSelectedFinish] = useState<string>('');
  const [wantGiftBox, setWantGiftBox] = useState(false);
  // Address
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<string>('');
  const [showNewAddress, setShowNewAddress] = useState(false);
  const [newAddr, setNewAddr] = useState({
    fullName: '', phone: '', line1: '', line2: '', landmark: '', city: '', state: '', pincode: '', label: '',
  });

  // Coupon
  const [couponCode, setCouponCode] = useState('');
  const [couponResult, setCouponResult] = useState<CouponResult | null>(null);
  const [validatingCoupon, setValidatingCoupon] = useState(false);

  // Gift
  const [isGift, setIsGift] = useState(false);
  const [giftMessage, setGiftMessage] = useState('');

  // Submit state
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Fetch pricing data
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

  // Fetch designs from cart store (URL params as fallback)
  useEffect(() => {
    // Priority: URL params > cart store
    const urlIds = searchParams.get('ids');
    const idList = urlIds
      ? urlIds.split(',').filter(Boolean)
      : cart.getDesignIds();

    if (idList.length === 0) { setLoadingDesigns(false); return; }

    // Sync URL params into cart if they came from URL
    if (urlIds && idList.length > 0) {
      cart.setItems(idList);
    }

    fetch(`/api/designs?ids=${idList.join(',')}`)
      .then(r => r.json())
      .then(data => {
        setDesigns(data.designs || []);
      })
      .catch(() => {})
      .finally(() => setLoadingDesigns(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // Fetch addresses
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

  // Price calculation — bundles + individual extra pricing
  const priceBreakdown = useMemo(() => {
    if (designs.length === 0 || !selectedFinish || templatePricing.length === 0) return null;

    const fn = finishes.find(f => f.id === selectedFinish);
    if (!fn) return null;

    // Group designs by template type and calculate price
    const typeCount: Record<string, { count: number; tp: TemplatePricing }> = {};
    for (const d of designs) {
      const tp = templatePricing.find(t => t.template_id === d.template_id);
      const fallback = templatePricing.find(t => t.template_id === 'polaroid-classic') || templatePricing[0];
      const matched = tp || fallback;
      const key = matched.template_id;
      if (!typeCount[key]) typeCount[key] = { count: 0, tp: matched };
      typeCount[key].count++;
    }

    // Calculate: find best bundle for each type, extras use extra_print_paise
    let printsPaise = 0;
    const breakdown: { name: string; count: number; bundleName?: string; bundleQty?: number; bundlePrice?: number; extraCount?: number; extraPrice: number; total: number }[] = [];
    for (const [templateId, { count, tp }] of Object.entries(typeCount)) {
      // Find bundles for this template, sorted by quantity desc
      const templateBundles = bundles
        .filter(b => b.template_id === templateId)
        .sort((a, b) => b.quantity - a.quantity);

      // Find the best bundle (largest that fits within count)
      const bestBundle = templateBundles.find(b => b.quantity <= count);

      let total: number;
      if (bestBundle) {
        // Bundle price + extras beyond bundle quantity
        const extraCount = count - bestBundle.quantity;
        const extraTotal = extraCount * tp.extra_print_paise;
        total = bestBundle.price_paise + extraTotal;
        breakdown.push({
          name: tp.template_name, count,
          bundleName: bestBundle.bundle_name, bundleQty: bestBundle.quantity,
          bundlePrice: bestBundle.price_paise, extraCount, extraPrice: tp.extra_print_paise, total,
        });
      } else {
        // No bundle fits — use individual pricing (first + extras)
        const first = tp.first_print_paise;
        const extras = (count - 1) * tp.extra_print_paise;
        total = first + extras;
        breakdown.push({ name: tp.template_name, count, extraPrice: tp.extra_print_paise, total });
      }
      printsPaise += total;
    }

    // Finish addon
    const finishAddonTotal = fn.price_addon_paise * designs.length;

    // Gift box
    const giftBoxTotal = wantGiftBox ? giftBoxPaise : 0;

    const subtotal = printsPaise + finishAddonTotal + giftBoxTotal;

    // Coupon
    const couponDiscount = couponResult?.valid ? (couponResult.discountPaise || 0) : 0;

    // Shipping
    const shipping = subtotal >= freeShippingThreshold ? 0 : 4900;
    const total = subtotal - couponDiscount + shipping;

    return { printsPaise, breakdown, finishAddonTotal, giftBoxTotal, subtotal, couponDiscount, shipping, total, fn };
  }, [designs, templatePricing, bundles, finishes, selectedFinish, wantGiftBox, giftBoxPaise, freeShippingThreshold, couponResult]);

  // Sheet Saver recommendation
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
        // More than half the sheet used — suggest filling it
        const needed = tp.items_per_sheet - remainder;
        if (needed > 0 && needed <= 3) {
          tips.push({
            templateName: tp.template_name,
            current: count,
            sheetSize: tp.items_per_sheet,
            needed,
            costPaise: needed * tp.extra_print_paise,
          });
        }
      }
    }
    return tips;
  }, [designs, templatePricing, sheetSaverEnabled]);

  // Validate coupon
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

  // Save new address
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

  // Remove design
  const removeDesign = (id: string) => {
    setDesigns(prev => prev.filter(d => d.id !== id));
    cart.removeItem(id);
  };

  // Submit order
  const handleSubmit = async () => {
    setError('');
    if (designs.length === 0) { setError('Select at least one design'); return; }
    if (!selectedFinish) { setError('Select a finish'); return; }

    const addressId = selectedAddress;
    const isNewAddressForm = showNewAddress || addresses.length === 0;
    if (!addressId && !isNewAddressForm) { setError('Select or add a shipping address'); return; }

    // If new address, save it first
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
      // 1. Create order
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

      // 2. Create Razorpay payment order
      const payRes = await fetch(`/api/orders/${orderId}/payment`, { method: 'POST' });
      if (!payRes.ok) { setError('Failed to initiate payment'); setSubmitting(false); return; }
      const payData = await payRes.json();

      // 3. Open Razorpay modal
      openPayment({
        key: payData.key,
        amount: payData.amount,
        currency: payData.currency,
        order_id: payData.razorpayOrderId,
        name: 'Polamuse',
        description: `Order ${payData.orderNumber}`,
        prefill: { email: user?.email || undefined, name: user?.fullName || undefined },
        onSuccess: async (response) => {
          // 4. Verify payment
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

  // --- Auth check ---
  if (authLoading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#EDE6DC' }}>
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#8B6F5C] border-t-transparent" />
      </div>
    );
  }

  const formatPrice = (paise: number) => `₹${(paise / 100).toFixed(paise % 100 === 0 ? 0 : 2)}`;

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
          Back
        </Link>
        <h1 style={{ fontSize: 16, fontWeight: 600, color: '#1A1714', margin: 0 }}>Order Your Prints</h1>
        <Logo size="sm" />
      </header>

      <main style={{ maxWidth: 640, margin: '0 auto', padding: '32px 20px 120px' }}>
        {/* STEP 1: Designs */}
        <Section title="Your Designs" step={1}>
          {loadingDesigns ? (
            <div style={{ padding: 40, textAlign: 'center' }}>
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-[#8B6F5C] border-t-transparent" style={{ margin: '0 auto' }} />
            </div>
          ) : designs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px 16px' }}>
              <p style={{ color: '#5C4A3A', fontSize: 14 }}>No designs selected</p>
              <Link href="/designs" style={{ color: '#8B6F5C', fontWeight: 500, fontSize: 13 }}>← Go to My Designs to select</Link>
            </div>
          ) : (
            <>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, padding: '4px 0' }}>
                {(() => {
                  // Group by template type for summary
                  const typeCounts: Record<string, number> = {};
                  for (const d of designs) {
                    const tp = templatePricing.find(t => t.template_id === d.template_id);
                    const name = tp?.template_name || 'Classic';
                    typeCounts[name] = (typeCounts[name] || 0) + 1;
                  }
                  return Object.entries(typeCounts).map(([name, count]) => (
                    <span key={name} style={{
                      padding: '8px 14px', borderRadius: 8, fontSize: 13, fontWeight: 500,
                      background: '#fff', border: '0.5px solid rgba(26,23,20,0.08)',
                      color: '#1A1714',
                    }}>
                      {name} <span style={{ color: '#8B6F5C' }}>×{count}</span>
                    </span>
                  ));
                })()}
              </div>
              <div style={{ fontSize: 12, color: '#A39080', marginTop: 8 }}>
                {designs.length} design{designs.length > 1 ? 's' : ''} total
              </div>
              <div style={{ display: 'flex', gap: 16, marginTop: 12 }}>
                <Link href="/designs?modify=true" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#8B6F5C', fontWeight: 500, textDecoration: 'none' }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  Modify selection
                </Link>
                <Link href="/designs" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#8B6F5C', fontWeight: 500, textDecoration: 'none' }}>
                  + Add more designs
                </Link>
              </div>
            </>
          )}
        </Section>

        {/* STEP 2: Print Options */}
        <Section title="Print Options" step={2}>
          {/* Finish */}
          <Label>Finish</Label>
          <div style={{ display: 'flex', gap: 8 }}>
            {finishes.map(fn => (
              <button
                key={fn.id}
                onClick={() => setSelectedFinish(fn.id)}
                style={{
                  padding: '10px 16px', borderRadius: 8, fontSize: 13,
                  border: selectedFinish === fn.id ? '2px solid #8B6F5C' : '1px solid rgba(26,23,20,0.1)',
                  background: selectedFinish === fn.id ? 'rgba(139,111,92,0.04)' : '#fff',
                  cursor: 'pointer', transition: 'all 0.15s ease',
                }}
              >
                <span style={{ fontWeight: 500, color: '#1A1714' }}>{fn.name}</span>
                {fn.price_addon_paise > 0 && (
                  <span style={{ fontSize: 11, color: '#A39080', marginLeft: 4 }}>+{formatPrice(fn.price_addon_paise)}/ea</span>
                )}
                {fn.description && <p style={{ fontSize: 11, color: '#A39080', margin: '2px 0 0' }}>{fn.description}</p>}
              </button>
            ))}
          </div>

          {/* Gift Box addon */}
          <div style={{ marginTop: 16, padding: '12px 14px', borderRadius: 8, border: '1px solid rgba(26,23,20,0.06)', background: '#fff' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 13, color: '#1A1714' }}>
              <input type="checkbox" checked={wantGiftBox} onChange={e => setWantGiftBox(e.target.checked)} style={{ accentColor: '#8B6F5C' }} />
              <div>
                <span style={{ fontWeight: 500 }}>Add Gift Box</span>
                <span style={{ fontSize: 12, color: '#A39080', marginLeft: 8 }}>+{formatPrice(giftBoxPaise)}</span>
                <p style={{ fontSize: 11, color: '#A39080', margin: '2px 0 0' }}>Premium box with tissue paper & ribbon</p>
              </div>
            </label>
          </div>

          {/* Auto-detected info */}
          {designs.length > 0 && templatePricing.length > 0 && (
            <div style={{ marginTop: 14, padding: '10px 12px', borderRadius: 6, background: 'rgba(139,111,92,0.04)', fontSize: 11, color: '#5C4A3A' }}>
              <span style={{ fontWeight: 500 }}>Print sizes auto-detected from your designs:</span>
              <div style={{ marginTop: 4, display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                {Array.from(new Set(designs.map(d => {
                  const tp = templatePricing.find(t => t.template_id === d.template_id);
                  return tp?.template_name || 'Classic';
                }))).map(name => (
                  <span key={name} style={{ padding: '2px 8px', borderRadius: 4, background: 'rgba(139,111,92,0.08)', fontSize: 11 }}>{name}</span>
                ))}
              </div>
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
                    display: 'flex', flexDirection: 'column', gap: 2,
                    padding: '12px 16px', borderRadius: 8, textAlign: 'left', width: '100%',
                    border: selectedAddress === a.id ? '2px solid #8B6F5C' : '1px solid rgba(26,23,20,0.1)',
                    background: selectedAddress === a.id ? 'rgba(139,111,92,0.04)' : '#fff',
                    cursor: 'pointer', transition: 'all 0.15s ease',
                  }}
                >
                  <span style={{ fontSize: 13, fontWeight: 500, color: '#1A1714' }}>
                    {a.full_name} {a.label && <span style={{ fontSize: 11, color: '#A39080' }}>({a.label})</span>}
                  </span>
                  <span style={{ fontSize: 12, color: '#5C4A3A' }}>{a.line1}{a.line2 ? `, ${a.line2}` : ''}</span>
                  <span style={{ fontSize: 12, color: '#A39080' }}>{a.city}, {a.state} — {a.pincode}</span>
                </button>
              ))}
              <button onClick={() => setShowNewAddress(true)} style={{ fontSize: 12, color: '#8B6F5C', fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer', padding: '8px 0', textAlign: 'left' }}>
                + Add new address
              </button>
            </div>
          )}

          {(showNewAddress || addresses.length === 0) && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
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
                  <button onClick={handleSaveAddress} style={{ ...btnStyle, background: '#8B6F5C', color: '#fff' }}>Save Address</button>
                  <button onClick={() => setShowNewAddress(false)} style={{ ...btnStyle, background: 'transparent', color: '#5C4A3A', border: '1px solid rgba(26,23,20,0.1)' }}>Cancel</button>
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
                flex: 1, padding: '10px 14px', borderRadius: 8, fontSize: 13,
                border: '1px solid rgba(26,23,20,0.1)', background: '#fff',
                outline: 'none', fontFamily: 'inherit', textTransform: 'uppercase',
              }}
            />
            <button
              onClick={handleApplyCoupon}
              disabled={validatingCoupon || !couponCode.trim()}
              style={{ ...btnStyle, background: '#8B6F5C', color: '#fff', opacity: validatingCoupon ? 0.6 : 1 }}
            >
              {validatingCoupon ? '...' : 'Apply'}
            </button>
          </div>
          {couponResult && (
            <div style={{ marginTop: 8, fontSize: 12, color: couponResult.valid ? '#4CAF50' : '#D32F2F' }}>
              {couponResult.valid
                ? `✓ ${couponResult.description || 'Coupon applied'} — saves ${formatPrice(couponResult.discountPaise || 0)}`
                : `✗ ${couponResult.reason}`}
            </div>
          )}
        </Section>

        {/* Gift option */}
        <Section title="Gift Options" step={5} optional>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, color: '#1A1714' }}>
            <input type="checkbox" checked={isGift} onChange={e => setIsGift(e.target.checked)} style={{ accentColor: '#8B6F5C' }} />
            This is a gift
          </label>
          {isGift && (
            <textarea
              placeholder="Write a gift message (optional, max 500 chars)"
              value={giftMessage}
              onChange={e => setGiftMessage(e.target.value.slice(0, 500))}
              maxLength={500}
              style={{
                marginTop: 10, width: '100%', padding: '10px 14px', borderRadius: 8,
                fontSize: 13, border: '1px solid rgba(26,23,20,0.1)', background: '#fff',
                resize: 'vertical', minHeight: 60, fontFamily: 'inherit', outline: 'none',
              }}
            />
          )}
        </Section>

        {/* Price Summary */}
        {priceBreakdown && (
          <div style={{
            marginTop: 24, padding: '20px 16px', borderRadius: 12,
            background: '#FFFCF8', border: '0.5px solid rgba(26,23,20,0.08)',
            boxShadow: '0 4px 20px rgba(26,23,20,0.04)',
          }}>
            <h3 style={{ fontSize: 13, fontWeight: 600, color: '#1A1714', margin: '0 0 12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Price Breakdown</h3>
            {priceBreakdown.breakdown.map((b, i) => (
              <div key={i}>
                <PriceLine
                  label={b.bundleName
                    ? `${b.bundleName} (${b.bundleQty}pc)${b.extraCount ? ` + ${b.extraCount} extra × ${formatPrice(b.extraPrice)}` : ''}`
                    : b.count === 1
                      ? `${b.name} (1 print)`
                      : `${b.name} (1st + ${b.count - 1} × ${formatPrice(b.extraPrice)})`}
                  value={b.total}
                />
              </div>
            ))}
            {priceBreakdown.finishAddonTotal > 0 && (
              <PriceLine label={`${priceBreakdown.fn.name} finish (+${formatPrice(priceBreakdown.fn.price_addon_paise)}/ea)`} value={priceBreakdown.finishAddonTotal} />
            )}
            {priceBreakdown.giftBoxTotal > 0 && (
              <PriceLine label="Gift Box" value={priceBreakdown.giftBoxTotal} />
            )}
            <div style={{ borderTop: '0.5px solid rgba(26,23,20,0.08)', margin: '8px 0' }} />
            <PriceLine label="Subtotal" value={priceBreakdown.subtotal} bold />
            {priceBreakdown.couponDiscount > 0 && (
              <PriceLine label="Coupon discount" value={-priceBreakdown.couponDiscount} green />
            )}
            <PriceLine label="Shipping" value={priceBreakdown.shipping} free={priceBreakdown.shipping === 0} />
            <div style={{ borderTop: '1px solid rgba(26,23,20,0.12)', margin: '8px 0' }} />
            <PriceLine label="Total" value={priceBreakdown.total} bold large />
          </div>
        )}

        {/* Sheet Saver Tip */}
        {sheetSaverTips.length > 0 && (
          <div style={{
            marginTop: 16, padding: '12px 16px', borderRadius: 10,
            background: 'linear-gradient(135deg, #F0FFF4, #E6FFFA)',
            border: '0.5px solid rgba(45,138,78,0.2)',
          }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#2d8a4e', marginBottom: 6 }}>
              💡 Sheet Saver Tip
            </div>
            {sheetSaverTips.map((tip, i) => (
              <div key={i} style={{ fontSize: 11, color: '#1A1714', lineHeight: 1.6 }}>
                Add {tip.needed} more {tip.templateName} for just {formatPrice(tip.costPaise)} to complete your print sheet & save more!
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {error && (
          <div style={{ marginTop: 16, padding: '10px 14px', borderRadius: 8, background: 'rgba(211,47,47,0.06)', border: '1px solid rgba(211,47,47,0.2)', fontSize: 13, color: '#D32F2F' }}>
            {error}
          </div>
        )}

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={submitting || designs.length === 0 || !priceBreakdown}
          style={{
            width: '100%', marginTop: 24, padding: '16px 24px', borderRadius: 12,
            background: submitting ? '#B5A99E' : '#8B6F5C', color: '#fff',
            fontSize: 15, fontWeight: 600, border: 'none', cursor: submitting ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s ease', boxShadow: '0 4px 16px rgba(139,111,92,0.3)',
          }}
        >
          {submitting ? 'Processing...' : priceBreakdown ? `Pay ${formatPrice(priceBreakdown.total)}` : 'Select options to continue'}
        </button>

        {/* DEV: Bypass payment button */}
        <button
          onClick={async () => {
            setSubmitting(true);
            setError('');
            try {
              // Create order first
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

              // Bypass payment
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
            width: '100%', marginTop: 10, padding: '12px 24px', borderRadius: 12,
            background: 'transparent', color: '#D32F2F',
            fontSize: 12, fontWeight: 500, border: '1px dashed rgba(211,47,47,0.4)', cursor: 'pointer',
          }}
        >
          ⚡ DEV: Skip Payment &amp; Confirm Order
        </button>
      </main>
    </div>
  );
}

// --- Helper Components ---

function Section({ title, step, optional, children }: { title: string; step: number; optional?: boolean; children: React.ReactNode }) {
  return (
    <div style={{ marginTop: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <span style={{ width: 22, height: 22, borderRadius: '50%', background: '#8B6F5C', color: '#fff', fontSize: 11, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{step}</span>
        <h2 style={{ fontSize: 14, fontWeight: 600, color: '#1A1714', margin: 0 }}>{title}</h2>
        {optional && <span style={{ fontSize: 11, color: '#A39080', fontStyle: 'italic' }}>optional</span>}
      </div>
      <div style={{ padding: '16px', borderRadius: 12, background: '#FFFCF8', border: '0.5px solid rgba(26,23,20,0.08)' }}>
        {children}
      </div>
    </div>
  );
}

function Label({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return <div style={{ fontSize: 12, fontWeight: 500, color: '#5C4A3A', marginBottom: 8, ...style }}>{children}</div>;
}

function InputField({ label, value, onChange, type = 'text' }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: 11, color: '#A39080', marginBottom: 4 }}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{
          width: '100%', padding: '9px 12px', borderRadius: 6, fontSize: 13,
          border: '1px solid rgba(26,23,20,0.1)', background: '#fff', outline: 'none',
          fontFamily: 'inherit',
        }}
      />
    </div>
  );
}

function PriceLine({ label, value, bold, large, green, free }: { label: string; value: number; bold?: boolean; large?: boolean; green?: boolean; free?: boolean }) {
  const formatPrice = (paise: number) => {
    if (paise === 0 && free) return 'FREE';
    const sign = paise < 0 ? '- ' : '';
    return `${sign}₹${(Math.abs(paise) / 100).toFixed(Math.abs(paise) % 100 === 0 ? 0 : 2)}`;
  };
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '3px 0', fontSize: large ? 15 : 13 }}>
      <span style={{ color: green ? '#4CAF50' : '#5C4A3A', fontWeight: bold ? 600 : 400 }}>{label}</span>
      <span style={{ color: green ? '#4CAF50' : free ? '#4CAF50' : '#1A1714', fontWeight: bold ? 600 : 500 }}>{formatPrice(value)}</span>
    </div>
  );
}

const btnStyle: React.CSSProperties = {
  padding: '9px 16px', borderRadius: 8, fontSize: 13, fontWeight: 500,
  border: 'none', cursor: 'pointer', fontFamily: 'inherit',
};
