# Order System — Complete Implementation Plan

> **Goal:** User selects designs from "My Designs" → configures print options → pays → receives polaroid prints.  
> **Admin:** Manages product types, pricing, and order fulfillment from the admin panel.

---

## User Flow

```
1. /designs — User selects 1+ designs (checkbox mode)
2. Click "Order Selected" → navigates to /order?ids=uuid1,uuid2,uuid3
3. /order — For each design: choose product type, finish, size
4. Enter/select shipping address
5. Optional: apply coupon code
6. See price breakdown → click "Pay Now"
7. Razorpay modal opens → pay via UPI/card/netbanking
8. Payment verified → order confirmed → email sent
9. User can track order status at /order/[id]
```

---

## Architecture

```
Client (/designs)              → Select designs, navigate to /order
Client (/order)                → Configure items, apply coupon, submit
  ↓
POST /api/orders               → Create order + items (pending_payment)
POST /api/orders/[id]/payment  → Create Razorpay order
  ↓ (Razorpay modal in browser)
POST /api/payments/verify      → Verify signature, confirm order
POST /api/payments/webhook     → Backup verification (connection drops)
  ↓
Email via Resend               → Order confirmation
Admin /admin/orders            → Manage fulfillment
```

---

## Database Tables

### Already exist in `polamuse.sql`:
- `product_types` — with seed data (single, pack-of-3, pack-of-5, custom-set, gift-box)
- `print_finishes` — glossy, matte
- `print_sizes` — classic, instax-mini, square, wide, 5x7
- `orders` — full order with status workflow
- `order_items` — links order ↔ design ↔ product config
- `payments` — Razorpay integration
- `shipments` — tracking
- `addresses` — saved shipping addresses
- `coupons` + `coupon_usages` — discount system

### New: Admin pricing management table

The existing `product_types` table already has `base_price_paise` and `discount_percentage`. For full admin control over pricing tiers, we add a **pricing rules** table:

```sql
-- Flexible pricing: admin can set quantity-based pricing tiers
-- e.g., 1 print = ₹79, 5 prints = ₹349 (30% off), 10 prints = ₹590 (25% off)
CREATE TABLE pricing_tiers (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name              VARCHAR(100) NOT NULL,          -- "Single", "Pack of 5", "Bulk 20"
  slug              VARCHAR(50)  NOT NULL UNIQUE,   -- "single", "pack-5", "bulk-20"
  quantity          INTEGER      NOT NULL,          -- number of prints included
  base_price_paise  INTEGER      NOT NULL,          -- price for this tier
  per_unit_paise    INTEGER      GENERATED ALWAYS AS (base_price_paise / quantity) STORED,
  discount_pct      INTEGER      NOT NULL DEFAULT 0, -- display discount %
  description       TEXT,
  -- Extras included
  includes_sleeve   BOOLEAN      NOT NULL DEFAULT TRUE,
  includes_envelope BOOLEAN      NOT NULL DEFAULT FALSE,
  includes_gift_box BOOLEAN      NOT NULL DEFAULT FALSE,
  includes_tissue   BOOLEAN      NOT NULL DEFAULT FALSE,
  -- State
  is_active         BOOLEAN      NOT NULL DEFAULT TRUE,
  sort_order        INTEGER      NOT NULL DEFAULT 0,
  -- Add-on pricing (per item overrides)
  matte_addon_paise INTEGER      NOT NULL DEFAULT 500,   -- extra per print for matte
  -- Timestamps
  created_at        TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- Seed default pricing
INSERT INTO pricing_tiers (slug, name, quantity, base_price_paise, discount_pct, description, includes_envelope, sort_order) VALUES
  ('single',   'Single Print',    1,   7900,  0,  'One polaroid in a kraft sleeve',       FALSE, 1),
  ('pack-3',   'Pack of 3',       3,  19900, 16,  '3 prints in a craft envelope',         TRUE,  2),
  ('pack-5',   'Pack of 5',       5,  29900, 25,  '5 prints in a premium envelope',       TRUE,  3),
  ('pack-10',  'Pack of 10',     10,  49900, 37,  '10 prints — best for events',          TRUE,  4),
  ('pack-20',  'Bulk 20',        20,  89900, 43,  '20 prints — wedding/party pack',       TRUE,  5),
  ('gift-box', 'Gift Box',        5,  49900, 15,  'Curated box with tissue + ribbon',     TRUE,  6);

-- Size-specific add-on pricing (some sizes cost more)
CREATE TABLE size_addons (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  print_size_id     UUID NOT NULL REFERENCES print_sizes(id),
  addon_paise       INTEGER NOT NULL DEFAULT 0,     -- extra per print
  is_active         BOOLEAN NOT NULL DEFAULT TRUE,
  UNIQUE (print_size_id)
);

INSERT INTO size_addons (print_size_id, addon_paise)
SELECT id, CASE slug
  WHEN 'classic' THEN 0
  WHEN 'instax-mini' THEN 0
  WHEN 'square' THEN 200
  WHEN 'wide' THEN 500
  WHEN '5x7' THEN 1000
END
FROM print_sizes;
```

---

## API Routes

### New routes to create:

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/pricing` | GET | Public — fetch active pricing tiers + sizes + finishes |
| `/api/orders` | POST | Create order (authenticated) |
| `/api/orders` | GET | List user's orders |
| `/api/orders/[id]` | GET | Single order detail |
| `/api/orders/[id]/payment` | POST | Create Razorpay payment order |
| `/api/payments/verify` | POST | Verify Razorpay payment signature |
| `/api/payments/webhook` | POST | Razorpay webhook (no auth, signature verified) |
| `/api/orders/validate-coupon` | POST | Validate & calculate coupon discount |
| `/api/account/addresses` | GET/POST | List/create addresses |
| `/api/account/addresses/[id]` | PUT/DELETE | Update/remove address |
| `/api/admin/pricing` | GET/POST/PUT/DELETE | Admin CRUD pricing tiers |
| `/api/admin/pricing/sizes` | GET/PUT | Admin manage size add-ons |

---

## File Structure

```
src/
├── app/
│   ├── order/
│   │   ├── page.tsx                    ← REWRITE: full order page
│   │   └── [id]/
│   │       └── page.tsx                ← Order detail/tracking page
│   ├── designs/
│   │   └── page.tsx                    ← ADD: select mode + "Order" button
│   ├── api/
│   │   ├── pricing/
│   │   │   └── route.ts               ← GET public pricing data
│   │   ├── orders/
│   │   │   ├── route.ts               ← GET list + POST create
│   │   │   ├── validate-coupon/
│   │   │   │   └── route.ts           ← POST validate coupon
│   │   │   └── [id]/
│   │   │       ├── route.ts           ← GET order detail
│   │   │       └── payment/
│   │   │           └── route.ts       ← POST create Razorpay order
│   │   ├── payments/
│   │   │   ├── verify/
│   │   │   │   └── route.ts           ← POST verify payment
│   │   │   └── webhook/
│   │   │       └── route.ts           ← POST Razorpay webhook
│   │   ├── account/
│   │   │   └── addresses/
│   │   │       ├── route.ts           ← GET/POST addresses
│   │   │       └── [id]/
│   │   │           └── route.ts       ← PUT/DELETE address
│   │   └── admin/
│   │       └── pricing/
│   │           ├── route.ts           ← GET/POST/PUT/DELETE tiers
│   │           └── sizes/
│   │               └── route.ts       ← GET/PUT size addons
│   ├── admin/
│   │   └── pricing/
│   │       └── page.tsx               ← Admin pricing management UI
├── components/
│   ├── order/
│   │   ├── DesignSelector.tsx          ← Grid of user's designs with checkboxes
│   │   ├── OrderItemCard.tsx           ← Single item config (size, finish)
│   │   ├── PriceSummary.tsx            ← Live price breakdown
│   │   ├── AddressForm.tsx             ← Shipping address form
│   │   ├── AddressSelector.tsx         ← Pick from saved addresses
│   │   ├── CouponInput.tsx             ← Coupon code validator
│   │   ├── PaymentButton.tsx           ← Razorpay checkout trigger
│   │   └── OrderTracker.tsx            ← Status timeline
│   └── admin/
│       └── PricingManager.tsx          ← Admin pricing CRUD table
├── hooks/
│   └── useRazorpay.ts                  ← Load Razorpay script + open modal
└── lib/
    └── razorpay.ts                     ← Server: create order, verify
```

---

## Detailed Implementation

---

### Step 1: Design Selection (My Designs Page)

**Modify:** `src/app/designs/page.tsx`

Add a "select mode" toggle:

```typescript
const [selectMode, setSelectMode] = useState(false);
const [selected, setSelected] = useState<Set<string>>(new Set());

// Toggle selection
const toggleSelect = (id: string) => {
  setSelected((prev) => {
    const next = new Set(prev);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    return next;
  });
};

// Header actions
{selectMode ? (
  <>
    <span>{selected.size} selected</span>
    <button onClick={() => { setSelectMode(false); setSelected(new Set()); }}>Cancel</button>
    <Link href={`/order?ids=${Array.from(selected).join(',')}`}>
      Order {selected.size} print{selected.size > 1 ? 's' : ''}
    </Link>
  </>
) : (
  <>
    <button onClick={() => setSelectMode(true)}>Select & Order</button>
    <Link href="/editor">New Design</Link>
  </>
)}
```

Each design card gets a checkbox overlay when `selectMode` is true.

---

### Step 2: Public Pricing API

**File:** `src/app/api/pricing/route.ts`

```typescript
// GET /api/pricing — no auth required
// Returns: { tiers, sizes, finishes }
// Cached on client, rarely changes

export async function GET() {
  const tiers = await sql`
    SELECT id, slug, name, quantity, base_price_paise, per_unit_paise,
           discount_pct, description, includes_sleeve, includes_envelope,
           includes_gift_box, includes_tissue, matte_addon_paise
    FROM pricing_tiers WHERE is_active = true ORDER BY sort_order`;

  const sizes = await sql`
    SELECT ps.id, ps.slug, ps.name, ps.width_mm, ps.height_mm,
           ps.orientation, COALESCE(sa.addon_paise, 0) as addon_paise
    FROM print_sizes ps
    LEFT JOIN size_addons sa ON sa.print_size_id = ps.id AND sa.is_active = true
    WHERE ps.is_active = true
    ORDER BY ps.price_addon_paise`;

  const finishes = await sql`
    SELECT id, slug, name, description, price_addon_paise
    FROM print_finishes WHERE is_active = true`;

  return ok({ tiers, sizes, finishes });
}
```

---

### Step 3: Order Page (Complete Rewrite)

**File:** `src/app/order/page.tsx`

**Layout:**
```
┌────────────────────────────────────────────────────────────┐
│  [← Back]         Order Your Prints              [Logo]    │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  STEP 1: YOUR DESIGNS                                      │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  ┌─────┐ ┌─────┐ ┌─────┐                          │   │
│  │  │ img │ │ img │ │ img │  ← thumbnails from ?ids   │   │
│  │  │  ×  │ │  ×  │ │  ×  │  (can remove)            │   │
│  │  └─────┘ └─────┘ └─────┘                          │   │
│  │  [+ Add more from My Designs]                       │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                            │
│  STEP 2: PRINT OPTIONS                                     │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Tier:   ( ) Single  ( ) Pack 5  (•) Pack 10       │   │
│  │  Size:   [Classic ▾]                                │   │
│  │  Finish: (•) Glossy  ( ) Matte (+₹5/print)        │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                            │
│  STEP 3: SHIPPING ADDRESS                                  │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  [Saved addr 1]  [Saved addr 2]  [+ New]           │   │
│  │  ─ or ─                                             │   │
│  │  Full name: ___________                             │   │
│  │  Phone: ___________                                 │   │
│  │  Address: ___________                               │   │
│  │  City: _______  PIN: _______  State: _______       │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                            │
│  STEP 4: COUPON (optional)                                 │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Code: [________] [Apply]   ✓ FIRST20 — 20% off   │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                            │
├────────────────────────────────────────────────────────────┤
│  PRICE BREAKDOWN                                           │
│  3 prints × Pack of 10 tier .............. ₹499.00        │
│  Matte finish (+₹5/print × 3) ........... + ₹15.00       │
│  Size: Wide (+₹5/print × 3) ............. + ₹15.00       │
│  Subtotal ............................... ₹529.00         │
│  Coupon FIRST20 (-20%) .................. - ₹105.80       │
│  Shipping ............................... FREE             │
│  ─────────────────────────────────────────────────        │
│  TOTAL .................................. ₹423.20         │
│                                                            │
│  [Pay ₹423.20]                                            │
└────────────────────────────────────────────────────────────┘
```

**Key state:**
```typescript
interface OrderState {
  designIds: string[];          // from URL ?ids=...
  designs: Design[];            // fetched design data
  tierId: string | null;        // selected pricing tier
  sizeId: string;               // selected print size
  finishId: string;             // selected finish
  addressId: string | null;     // existing address or null (new)
  newAddress: AddressForm;      // form fields for new address
  couponCode: string;
  couponDiscount: number;       // paise
  couponId: string | null;
  isGift: boolean;
  giftMessage: string;
}
```

**Price calculation (client-side):**
```typescript
function calculatePrice(state: OrderState, pricing: PricingData) {
  const tier = pricing.tiers.find(t => t.id === state.tierId);
  if (!tier) return null;

  const numDesigns = state.designs.length;
  const sizeAddon = pricing.sizes.find(s => s.id === state.sizeId)?.addon_paise || 0;
  const finishAddon = state.finishId === matte.id ? tier.matte_addon_paise : 0;

  // Base: tier price covers `tier.quantity` prints
  // If user has more designs than tier quantity, they need multiple tiers
  const tiersNeeded = Math.ceil(numDesigns / tier.quantity);
  const basePaise = tier.base_price_paise * tiersNeeded;

  // Add-ons per print
  const addOnPerPrint = sizeAddon + finishAddon;
  const totalAddons = addOnPerPrint * numDesigns;

  const subtotal = basePaise + totalAddons;
  const discount = state.couponDiscount;
  const shipping = subtotal >= 50000 ? 0 : 4900; // Free above ₹500 (from site_settings)
  const total = subtotal - discount + shipping;

  return { basePaise, totalAddons, subtotal, discount, shipping, total, tiersNeeded };
}
```

---

### Step 4: Create Order API

**File:** `src/app/api/orders/route.ts`

```typescript
// POST /api/orders
export async function POST(req: Request) {
  const uid = userId(req);
  if (!uid) return err('Unauthorized', 401);

  const body = await req.json();
  const { designIds, tierId, sizeId, finishId, addressId, couponId, isGift, giftMessage } = body;

  // Validate inputs
  if (!Array.isArray(designIds) || designIds.length === 0 || designIds.length > 20)
    return err('1-20 designs required', 400);
  if (!tierId || !sizeId || !finishId) return err('Missing print options', 400);
  if (!addressId) return err('Shipping address required', 400);

  // Verify designs belong to user
  const designs = await sql`
    SELECT id FROM designs WHERE id = ANY(${designIds}) AND user_id = ${uid} AND deleted_at IS NULL`;
  if (designs.length !== designIds.length) return err('Invalid designs', 400);

  // Fetch pricing
  const [tier] = await sql`SELECT * FROM pricing_tiers WHERE id = ${tierId} AND is_active = true`;
  if (!tier) return err('Invalid pricing tier', 400);

  const [size] = await sql`
    SELECT ps.*, COALESCE(sa.addon_paise, 0) as addon_paise
    FROM print_sizes ps LEFT JOIN size_addons sa ON sa.print_size_id = ps.id
    WHERE ps.id = ${sizeId}`;
  const [finish] = await sql`SELECT * FROM print_finishes WHERE id = ${finishId}`;
  if (!size || !finish) return err('Invalid size or finish', 400);

  // Calculate price server-side (authoritative)
  const numDesigns = designIds.length;
  const tiersNeeded = Math.ceil(numDesigns / tier.quantity);
  const basePaise = tier.base_price_paise * tiersNeeded;
  const finishAddon = finish.slug === 'matte' ? tier.matte_addon_paise : 0;
  const addOnPerPrint = size.addon_paise + finishAddon;
  const totalAddons = addOnPerPrint * numDesigns;
  const subtotal = basePaise + totalAddons;

  // Coupon validation
  let discountPaise = 0;
  if (couponId) {
    const couponResult = await validateCoupon(couponId, uid, subtotal);
    if (couponResult.valid) discountPaise = couponResult.discountPaise;
  }

  // Shipping (free above threshold from site_settings)
  const [setting] = await sql`SELECT value FROM site_settings WHERE key = 'free_shipping_threshold_paise'`;
  const freeThreshold = parseInt(setting?.value || '50000');
  const shippingPaise = subtotal >= freeThreshold ? 0 : 4900;

  const totalPaise = subtotal - discountPaise + shippingPaise;
  const unitPricePaise = Math.round(totalPaise / numDesigns);

  // Create order in transaction
  await sql`BEGIN`;
  try {
    const [order] = await sql`
      INSERT INTO orders (
        user_id, subtotal_paise, discount_paise, shipping_paise, total_paise,
        order_type, shipping_address_id, coupon_id, is_gift
      ) VALUES (
        ${uid}, ${subtotal}, ${discountPaise}, ${shippingPaise}, ${totalPaise},
        ${isGift ? 'gift' : 'standard'}, ${addressId}, ${couponId || null}, ${!!isGift}
      ) RETURNING id, order_number`;

    // Create order items (one per design)
    for (const designId of designIds) {
      await sql`
        INSERT INTO order_items (
          order_id, design_id, product_type_id, print_finish_id, print_size_id,
          quantity, unit_price_paise, total_price_paise
        ) VALUES (
          ${order.id}, ${designId}, ${tier.id}, ${finishId}, ${sizeId},
          1, ${unitPricePaise}, ${unitPricePaise}
        )`;
    }

    // Gift message
    if (isGift && giftMessage) {
      await sql`
        INSERT INTO gift_messages (order_id, from_name, message)
        VALUES (${order.id}, ${''}, ${giftMessage})`;
    }

    // Record coupon usage
    if (couponId && discountPaise > 0) {
      await sql`
        INSERT INTO coupon_usages (coupon_id, user_id, order_id, discount_applied_paise)
        VALUES (${couponId}, ${uid}, ${order.id}, ${discountPaise})`;
      await sql`
        UPDATE coupons SET usage_count = usage_count + 1 WHERE id = ${couponId}`;
    }

    await sql`COMMIT`;
    return ok({ id: order.id, orderNumber: order.order_number, totalPaise }, 201);
  } catch (e) {
    await sql`ROLLBACK`;
    console.error('[POST /api/orders]', e);
    return err('Failed to create order', 500);
  }
}
```

---

### Step 5: Razorpay Payment

**File:** `src/lib/razorpay.ts`

```typescript
import Razorpay from 'razorpay';

export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export function verifyPaymentSignature(
  orderId: string,
  paymentId: string,
  signature: string
): boolean {
  const crypto = require('crypto');
  const expected = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');
  return expected === signature;
}
```

**File:** `src/app/api/orders/[id]/payment/route.ts`

```typescript
// POST /api/orders/[id]/payment — create Razorpay order
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const uid = userId(req);
  const { id } = await params;

  const [order] = await sql`
    SELECT id, order_number, total_paise, status
    FROM orders WHERE id = ${id} AND user_id = ${uid}`;

  if (!order) return err('Order not found', 404);
  if (order.status !== 'pending_payment') return err('Order already paid', 400);

  const rzpOrder = await razorpay.orders.create({
    amount: order.total_paise,
    currency: 'INR',
    receipt: order.order_number,
  });

  return ok({
    razorpayOrderId: rzpOrder.id,
    amount: order.total_paise,
    currency: 'INR',
    orderNumber: order.order_number,
    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
  });
}
```

**File:** `src/app/api/payments/verify/route.ts`

```typescript
// POST /api/payments/verify
export async function POST(req: Request) {
  const uid = userId(req);
  const { razorpayPaymentId, razorpayOrderId, razorpaySignature, orderId } = await req.json();

  // Verify signature
  if (!verifyPaymentSignature(razorpayOrderId, razorpayPaymentId, razorpaySignature)) {
    return err('Invalid payment signature', 401);
  }

  // Idempotency
  const [existing] = await sql`
    SELECT id FROM payments WHERE provider_payment_id = ${razorpayPaymentId}`;
  if (existing) return ok({ message: 'Already processed' });

  // Confirm order
  const [order] = await sql`
    SELECT id, total_paise FROM orders WHERE id = ${orderId} AND user_id = ${uid}`;
  if (!order) return err('Order not found', 404);

  await sql`BEGIN`;
  await sql`
    UPDATE orders SET status = 'confirmed', confirmed_at = NOW(), updated_at = NOW()
    WHERE id = ${orderId}`;
  await sql`
    INSERT INTO payments (order_id, provider_payment_id, provider_order_id, amount_paise, status, payment_method)
    VALUES (${orderId}, ${razorpayPaymentId}, ${razorpayOrderId}, ${order.total_paise}, 'captured', 'razorpay')`;
  await sql`
    UPDATE designs SET status = 'ordered' WHERE id IN (
      SELECT design_id FROM order_items WHERE order_id = ${orderId}
    )`;
  // Update user stats
  await sql`
    UPDATE user_profiles SET total_orders = total_orders + 1, total_spent_paise = total_spent_paise + ${order.total_paise}
    WHERE user_id = ${uid}`;
  await sql`COMMIT`;

  // Send confirmation email (non-blocking)
  sendOrderConfirmationEmail(orderId).catch(console.error);

  return ok({ message: 'Payment confirmed', orderId });
}
```

**File:** `src/hooks/useRazorpay.ts`

```typescript
'use client';
import { useCallback, useRef, useEffect } from 'react';

declare global {
  interface Window { Razorpay: any; }
}

export function useRazorpay() {
  const loaded = useRef(false);

  useEffect(() => {
    if (loaded.current || typeof window === 'undefined') return;
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => { loaded.current = true; };
    document.body.appendChild(script);
  }, []);

  const openPayment = useCallback(async (options: {
    key: string;
    amount: number;
    currency: string;
    order_id: string;
    name: string;
    description: string;
    prefill?: { email?: string; contact?: string };
    onSuccess: (response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) => void;
    onFailure?: (error: any) => void;
  }) => {
    if (!window.Razorpay) throw new Error('Razorpay not loaded');

    const rzp = new window.Razorpay({
      key: options.key,
      amount: options.amount,
      currency: options.currency,
      order_id: options.order_id,
      name: options.name,
      description: options.description,
      prefill: options.prefill,
      handler: options.onSuccess,
      modal: { ondismiss: () => options.onFailure?.({ reason: 'dismissed' }) },
      theme: { color: '#8B6F5C' },
    });
    rzp.open();
  }, []);

  return { openPayment };
}
```

---

### Step 6: Webhook (Backup)

**File:** `src/app/api/payments/webhook/route.ts`

```typescript
// POST /api/payments/webhook — Razorpay calls this
// NO AUTH (Razorpay doesn't send our JWT)
// Verified by webhook signature

export async function POST(req: Request) {
  const rawBody = await req.text();
  const signature = req.headers.get('x-razorpay-signature');

  const crypto = require('crypto');
  const expected = crypto
    .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET!)
    .update(rawBody)
    .digest('hex');

  if (expected !== signature) {
    return new Response('Invalid signature', { status: 401 });
  }

  const event = JSON.parse(rawBody);

  if (event.event === 'payment.captured') {
    const payment = event.payload.payment.entity;
    const rzpOrderId = payment.order_id;

    // Find our order by razorpay order_id
    const [existingPayment] = await sql`
      SELECT id FROM payments WHERE provider_order_id = ${rzpOrderId} AND status = 'captured'`;
    if (existingPayment) return ok({ message: 'Already processed' }); // idempotent

    // Find order
    const [order] = await sql`
      SELECT o.id, o.total_paise, o.user_id FROM orders o
      JOIN payments p ON p.order_id = o.id
      WHERE p.provider_order_id = ${rzpOrderId}`;

    if (!order) {
      // Payment created via webhook before verify endpoint — create payment record
      // This handles connection drops where client never got to /verify
      // ... same confirm logic as verify route
    }
  }

  return ok({ received: true });
}
```

**Important:** Add `/api/payments/webhook` to middleware exclusions (no auth check).

---

### Step 7: Coupon Validation

**File:** `src/app/api/orders/validate-coupon/route.ts`

```typescript
// POST /api/orders/validate-coupon
export async function POST(req: Request) {
  const uid = userId(req);
  if (!uid) return err('Unauthorized', 401);

  const { code, subtotalPaise } = await req.json();
  if (!code) return err('Code required', 400);

  const [coupon] = await sql`
    SELECT * FROM coupons
    WHERE code = ${code.toUpperCase().trim()}
      AND is_active = true
      AND valid_from <= NOW()
      AND (valid_until IS NULL OR valid_until >= NOW())`;

  if (!coupon) return ok({ valid: false, reason: 'Invalid or expired coupon' });

  // Check limits
  if (coupon.total_usage_limit && coupon.usage_count >= coupon.total_usage_limit)
    return ok({ valid: false, reason: 'Coupon usage limit reached' });

  const [usage] = await sql`
    SELECT COUNT(*)::int as n FROM coupon_usages
    WHERE coupon_id = ${coupon.id} AND user_id = ${uid}`;
  if (usage.n >= coupon.per_user_limit)
    return ok({ valid: false, reason: 'You have already used this coupon' });

  // Min order check
  if (subtotalPaise < coupon.min_order_paise)
    return ok({ valid: false, reason: `Minimum order ₹${(coupon.min_order_paise / 100).toFixed(0)} required` });

  // Calculate discount
  let discountPaise = 0;
  if (coupon.type === 'percentage') {
    discountPaise = Math.round(subtotalPaise * coupon.value / 100);
    if (coupon.max_discount_paise) discountPaise = Math.min(discountPaise, coupon.max_discount_paise);
  } else if (coupon.type === 'fixed_amount') {
    discountPaise = coupon.value;
  } else if (coupon.type === 'free_shipping') {
    discountPaise = 4900; // shipping cost
  }

  return ok({ valid: true, discountPaise, couponId: coupon.id, type: coupon.type, description: coupon.description });
}
```

---

### Step 8: Address Management

**File:** `src/app/api/account/addresses/route.ts`

```typescript
// GET — list user's saved addresses
export async function GET(req: Request) {
  const uid = userId(req);
  const addresses = await sql`
    SELECT * FROM addresses WHERE user_id = ${uid} ORDER BY is_default DESC, created_at DESC`;
  return ok({ addresses });
}

// POST — save new address
export async function POST(req: Request) {
  const uid = userId(req);
  const { fullName, phone, line1, line2, landmark, city, state, pincode, label, isDefault } = await req.json();

  // Validation
  if (!fullName || !phone || !line1 || !city || !state || !pincode)
    return err('Required fields missing', 400);
  if (!/^\d{6}$/.test(pincode)) return err('Invalid PIN code', 400);
  if (!/^\d{10}$/.test(phone.replace(/\D/g, ''))) return err('Invalid phone', 400);

  // If setting as default, unset others
  if (isDefault) {
    await sql`UPDATE addresses SET is_default = false WHERE user_id = ${uid}`;
  }

  const [addr] = await sql`
    INSERT INTO addresses (user_id, full_name, phone, line1, line2, landmark, city, state, pincode, label, is_default)
    VALUES (${uid}, ${fullName}, ${phone}, ${line1}, ${line2 || null}, ${landmark || null},
            ${city}, ${state}, ${pincode}, ${label || null}, ${!!isDefault})
    RETURNING id`;

  return ok({ id: addr.id }, 201);
}
```

---

### Step 9: Admin Pricing Management

**File:** `src/app/api/admin/pricing/route.ts`

```typescript
// GET — list all pricing tiers (admin)
export async function GET(req: Request) {
  if (userRole(req) !== 'admin') return err('Forbidden', 403);
  const tiers = await sql`SELECT * FROM pricing_tiers ORDER BY sort_order`;
  return ok({ tiers });
}

// POST — create new tier
export async function POST(req: Request) {
  if (userRole(req) !== 'admin') return err('Forbidden', 403);
  const { slug, name, quantity, basePricePaise, discountPct, description,
          includesSleeve, includesEnvelope, includesGiftBox, includesTissue,
          matteAddonPaise, sortOrder } = await req.json();

  const [tier] = await sql`
    INSERT INTO pricing_tiers (
      slug, name, quantity, base_price_paise, discount_pct, description,
      includes_sleeve, includes_envelope, includes_gift_box, includes_tissue,
      matte_addon_paise, sort_order
    ) VALUES (
      ${slug}, ${name}, ${quantity}, ${basePricePaise}, ${discountPct || 0},
      ${description || null}, ${!!includesSleeve}, ${!!includesEnvelope},
      ${!!includesGiftBox}, ${!!includesTissue}, ${matteAddonPaise || 500}, ${sortOrder || 0}
    ) RETURNING id`;

  return ok({ id: tier.id }, 201);
}

// PUT — update tier
export async function PUT(req: Request) {
  if (userRole(req) !== 'admin') return err('Forbidden', 403);
  const { id, ...fields } = await req.json();
  if (!id) return err('ID required', 400);

  await sql`
    UPDATE pricing_tiers SET
      name = ${fields.name}, quantity = ${fields.quantity},
      base_price_paise = ${fields.basePricePaise},
      discount_pct = ${fields.discountPct || 0},
      description = ${fields.description || null},
      matte_addon_paise = ${fields.matteAddonPaise || 500},
      is_active = ${fields.isActive !== false},
      sort_order = ${fields.sortOrder || 0},
      updated_at = NOW()
    WHERE id = ${id}`;

  return ok({ updated: true });
}

// DELETE — deactivate (soft)
export async function DELETE(req: Request) {
  if (userRole(req) !== 'admin') return err('Forbidden', 403);
  const { id } = await req.json();
  await sql`UPDATE pricing_tiers SET is_active = false, updated_at = NOW() WHERE id = ${id}`;
  return ok({ deactivated: true });
}
```

---

### Step 10: Order History & Tracking

**File:** `src/app/api/orders/route.ts` (GET)

```typescript
export async function GET(req: Request) {
  const uid = userId(req);
  if (!uid) return err('Unauthorized', 401);

  const orders = await sql`
    SELECT o.id, o.order_number, o.status, o.total_paise, o.is_gift,
           o.created_at, o.confirmed_at, o.estimated_delivery_at,
           (SELECT COUNT(*)::int FROM order_items WHERE order_id = o.id) as item_count,
           s.tracking_number, s.carrier, s.tracking_url
    FROM orders o
    LEFT JOIN shipments s ON s.order_id = o.id
    WHERE o.user_id = ${uid}
    ORDER BY o.created_at DESC`;

  return ok({ orders });
}
```

**File:** `src/app/order/[id]/page.tsx`

Shows full order detail with:
- Order number + status badge
- Items list with design thumbnails
- Timeline (ordered → confirmed → printing → shipped → delivered)
- Tracking link (when available)
- Payment receipt info

---

## Env Variables Required

```env
# Razorpay
RAZORPAY_KEY_ID=rzp_live_xxx
RAZORPAY_KEY_SECRET=xxx
RAZORPAY_WEBHOOK_SECRET=xxx
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_xxx   # exposed to client

# Already configured
DATABASE_URL=...
RESEND_API_KEY=...
JWT_ACCESS_SECRET=...
```

---

## Middleware Updates

```typescript
// Add to matcher:
'/api/orders/:path*',
'/api/payments/verify',
'/api/account/addresses/:path*',

// EXCLUDE from auth (webhook has its own signature verification):
// '/api/payments/webhook'
// '/api/pricing' (public)
```

---

## Security Considerations

| Concern | Mitigation |
|---------|-----------|
| Price manipulation | Server recalculates price from DB; never trusts client total |
| Double-payment | Idempotency check on `provider_payment_id` UNIQUE |
| Stolen design IDs | Verify `designs.user_id = requester` before creating order |
| Webhook spoofing | HMAC-SHA256 signature verification with `RAZORPAY_WEBHOOK_SECRET` |
| Coupon abuse | Per-user limit + total limit + valid dates enforced server-side |
| Address injection | PIN/phone regex validation; length limits |
| Race conditions | Transaction wraps order creation |

---

## Order Status Workflow

```
pending_payment  →  confirmed  →  processing  →  printing  →  shipped  →  delivered
       ↓                                                                       
  payment_failed                                                cancelled
                                                                refunded
```

State transitions (who triggers):
- `pending_payment → confirmed`: Payment verify API (automatic)
- `confirmed → processing`: Admin marks processing
- `processing → printing`: Admin assigns to print sheet
- `printing → shipped`: Admin adds tracking number
- `shipped → delivered`: Admin marks delivered (or auto via tracking API)
- Any → `cancelled`: Admin only (triggers refund flow)

---

## Email Triggers

| Event | Email | Template |
|-------|-------|----------|
| Order confirmed | Order confirmation + items list | `OrderConfirmed.tsx` |
| Order shipped | Tracking number + link | `OrderShipped.tsx` |
| Order delivered | Delivery confirmation + reorder CTA | `OrderDelivered.tsx` |

---

## Implementation Order

| Step | Task | Depends On | Time |
|------|------|-----------|------|
| 1 | Run SQL migration (pricing_tiers + size_addons) | — | 15 min |
| 2 | Create `/api/pricing` (public) | Step 1 | 30 min |
| 3 | Create `/api/account/addresses` CRUD | — | 1 hr |
| 4 | Add select mode to `/designs` page | — | 1 hr |
| 5 | Create `/api/orders` POST (create order) | Steps 1-3 | 2 hrs |
| 6 | Create `/api/orders/validate-coupon` | Step 1 | 45 min |
| 7 | Rewrite `/order` page (full UI) | Steps 2-6 | 4-5 hrs |
| 8 | Create `src/lib/razorpay.ts` + payment API | — | 1.5 hrs |
| 9 | Create `useRazorpay` hook + wire payment button | Step 8 | 1 hr |
| 10 | Create `/api/payments/verify` | Step 8 | 1 hr |
| 11 | Create `/api/payments/webhook` | Step 8 | 1 hr |
| 12 | Create `/api/orders` GET + `/api/orders/[id]` GET | Step 5 | 1 hr |
| 13 | Create `/order/[id]` tracking page | Step 12 | 2 hrs |
| 14 | Create admin pricing CRUD API + UI | Step 1 | 2 hrs |
| 15 | Email templates (confirmed, shipped, delivered) | — | 2 hrs |
| 16 | Middleware updates + webhook exclusion | — | 20 min |
| 17 | Testing + edge cases | All | 2 hrs |

**Total: ~20-22 hours (2.5-3 days)**

---

## Admin Pricing UI

Located at `/admin/pricing` — table with:
- List all tiers (active/inactive)
- Inline edit: name, price, quantity, discount %
- Toggle active/inactive
- Create new tier
- Manage size add-ons separately
- Preview: "Pack of 5 — ₹299 (₹59.80/print, 25% off)"

---

## Key Decisions

1. **Pricing is tier-based, not per-item**: Simplifies UX. User picks a tier (Pack of 5, Pack of 10), then their selected designs fill that tier.
2. **Server is price authority**: Client shows estimated price, but server recalculates from DB on order creation.
3. **No cart**: Direct checkout flow. Select designs → configure → pay. No persistent cart table needed.
4. **Razorpay (not Stripe)**: India-first, UPI support, lower fees.
5. **Webhook as backup**: Primary flow uses client-side verify. Webhook catches connection drops.
6. **Soft-delete pricing tiers**: Never hard-delete (existing orders reference them).
