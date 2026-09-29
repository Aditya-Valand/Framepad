# Polamuse — Implementation v2.0 Master Plan
> Everything that needs to be built from today. Phased, prioritized, with exact file paths.
> Last updated: 2026-09-29

---

## What Already Exists (DO NOT rebuild)

Before building anything new, here's what's **done and working**:

| System | Status | Key Files |
|--------|--------|-----------|
| **Editor** (canvas, panels, templates, filters, text, Spotify code) | Done | `src/hooks/usePolaroidCanvas.ts`, `src/components/panels/*`, `src/app/editor/page.tsx` |
| **Auth** (email/password, Google OAuth, JWT access+refresh, password reset) | Done | `src/app/api/auth/*`, `src/middleware.ts`, `src/lib/jwt.ts`, `src/hooks/useAuth.ts` |
| **Design Cloud** (save, edit, delete, gallery, batch export) | Done | `src/app/api/designs/*`, `src/app/designs/page.tsx`, `src/hooks/useDesignSave.ts` |
| **Orders + Payments** (cart, checkout, Razorpay, webhook, order tracking) | Done | `src/app/api/orders/*`, `src/app/api/payments/*`, `src/app/order/page.tsx`, `src/store/cart.ts` |
| **Gift Orders** (gift checkbox, gift message, gift box addon pricing) | Done | `src/app/order/page.tsx` (isGift state), `src/app/api/orders/route.ts`, `gift_messages` table |
| **Print Queue** (sheet generation, bin-packing, download, status tracking) | Done | `src/lib/printSheetGenerator.ts`, `src/app/api/admin/print-sheets/*` |
| **Admin Panel** (orders, users, analytics, coupons, pricing, settings, announcements) | Done | `src/app/admin/*`, `src/app/api/admin/*` |
| **Coupon System** (CRUD, validation, usage tracking) | Done | `src/app/api/admin/coupons/*`, `src/app/api/orders/validate-coupon` |
| **Addresses** (CRUD, default selection) | Done | `src/app/api/account/addresses/*` |
| **Email** (password reset template via Resend) | Done | `src/components/emails/PasswordReset.tsx`, `src/lib/resend.ts` |
| **PWA Manifest** (site.webmanifest, icons, add-to-home-screen) | Partial | `public/site.webmanifest` — no service worker yet |
| **Finish Addon** (glossy/matte price addon per item) | Done | `print_finishes` table, pricing API |
| **Database** (35 tables, 6 admin views, 2 migration tables) | Done | `SQLS/polamuse.sql` |

### Existing DB Tables (35 active)

`users`, `user_profiles`, `user_sessions`, `password_reset_tokens`, `templates`, `designs`, `design_versions`, `design_stickers`, `product_types`, `print_finishes`, `print_sizes`, `print_sheet_configs`, `print_sheets`, `addresses`, `orders`, `order_items`, `print_sheet_items`, `gift_messages`, `payments`, `shipments`, `coupons`, `coupon_usages`, `subscription_plans`, `subscriptions`, `subscription_billing_history`, `event_orders`, `admin_activity_logs`, `print_queue_notes`, `site_settings`, `admin_announcements`, `notifications`, `design_events`, `page_views`, `template_print_mapping`, `price_bundles`

---

## What Needs to Be Built

Everything below is **not yet implemented**. Zero code exists for any of these.

---

## PHASE 1 — Watermark + Monetization Foundation (Week 1–2)

> **Goal:** First revenue. User designs a polaroid, downloads with watermark, pays ₹9 to remove it.
> **Revenue unlock:** Layer 1 (watermark flip) starts generating ₹9/download.

### 1.1 — Database: Watermark Unlocks

**New table:** `design_unlocks`

```sql
CREATE TABLE design_unlocks (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  design_id     UUID NOT NULL REFERENCES designs(id) ON DELETE CASCADE,
  user_id       UUID REFERENCES users(id) ON DELETE SET NULL,
  amount_paise  INTEGER NOT NULL DEFAULT 900,
  payment_id    VARCHAR(100),
  paid_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (design_id)
);
CREATE INDEX idx_design_unlocks_user ON design_unlocks(user_id);
```

**Files to create/modify:**
- Run SQL against Neon

### 1.2 — Backend: Watermark Unlock API

**New files:**
| File | Purpose |
|------|---------|
| `src/app/api/designs/[id]/unlock/route.ts` | `POST` — create Razorpay order for ₹9, or verify payment and insert unlock |
| `src/app/api/designs/[id]/download/route.ts` | `GET` — check `design_unlocks`, return clean or watermarked URL |

**Modify:**
| File | Change |
|------|--------|
| `src/middleware.ts` | Add `/api/designs/*/unlock` and `/api/designs/*/download` to `PUBLIC_API` (no auth required) |

**Logic:**
1. `POST /unlock` with `action: "create_order"` → create Razorpay order (900 paise)
2. `POST /unlock` with `action: "verify"` + Razorpay payment details → verify signature → insert `design_unlocks`
3. `GET /download` → `SELECT 1 FROM design_unlocks WHERE design_id = $1` → return `isWatermarked: true/false`

### 1.3 — Frontend: Watermark Rendering

**Modify:** `src/hooks/usePolaroidCanvas.ts`

In the export function, add watermark drawing to an offscreen canvas:

```
Export flow:
  1. Create offscreen canvas (same dimensions)
  2. drawImage(sourceCanvas) onto it
  3. If not unlocked: draw "polamuse.com" text (11px, white, 30% opacity, bottom-right)
  4. Return offscreen.toDataURL('image/png')
```

The watermark is NEVER part of saved design state — only applied at export time.

**Modify:** `src/components/PolaroidView.tsx` — the export callback needs to check unlock status before choosing clean vs watermarked export.

### 1.4 — Frontend: Watermark Removal Modal

**New file:** `src/components/WatermarkModal.tsx`

Triggered when user taps Download and design is not unlocked.

```
Two options:
  1. "Download free" → watermarked PNG
  2. "Remove watermark — ₹9" → Razorpay checkout → on success → clean PNG
```

**Modify:** `src/app/editor/page.tsx` — wire Download button to check unlock status and show modal.

### 1.5 — Validation

**Modify:** `src/lib/validations.ts` — add `unlockDesignSchema`

---

## PHASE 2 — Pola Coins System (Week 3–4)

> **Goal:** Virtual currency live. Users buy coin packs, spend on features.
> **Revenue unlock:** Layer 2 (coin packs at ₹29/₹59/₹99).

### 2.1 — Database: Coin Tables

**New tables:**

```sql
-- Append-only ledger (NEVER store balance directly)
CREATE TABLE coin_ledger (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  delta         INTEGER NOT NULL,
  reason        VARCHAR(100) NOT NULL,
  reference_id  UUID,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_coin_ledger_user ON coin_ledger(user_id);
CREATE INDEX idx_coin_ledger_user_created ON coin_ledger(user_id, created_at DESC);

CREATE VIEW v_coin_balance AS
SELECT user_id, COALESCE(SUM(delta), 0) AS balance
FROM coin_ledger GROUP BY user_id;

-- Payment tracking (separate from ledger for reconciliation)
CREATE TABLE coin_purchases (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id               UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  pack_type             VARCHAR(20) NOT NULL CHECK (pack_type IN ('starter','popular','best')),
  coins_granted         INTEGER NOT NULL,
  amount_paise          INTEGER NOT NULL,
  razorpay_payment_id   VARCHAR(100),
  razorpay_order_id     VARCHAR(100),
  status                VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','paid','failed')),
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  paid_at               TIMESTAMPTZ
);
CREATE INDEX idx_coin_purchases_user ON coin_purchases(user_id);
```

### 2.2 — Backend: Coin Library + API

**New files:**
| File | Purpose |
|------|---------|
| `src/lib/coins.ts` | `getBalance()`, `spendCoins()`, `earnCoins()`, `hasReceivedBonus()`, pack/cost constants |
| `src/app/api/coins/balance/route.ts` | `GET` — return current balance |
| `src/app/api/coins/history/route.ts` | `GET` — paginated ledger entries |
| `src/app/api/coins/purchase/route.ts` | `POST` — create Razorpay order for pack, verify payment, credit coins |
| `src/app/api/coins/spend/route.ts` | `POST` — validate balance, deduct coins, perform unlock side-effect |

**Modify:**
| File | Change |
|------|--------|
| `src/middleware.ts` | Add `/api/coins` to `AUTH_REQUIRED_API` |
| `src/lib/validations.ts` | Add `coinPurchaseSchema`, `coinSpendSchema` |

**Pack definitions (in `src/lib/coins.ts`):**
| Pack | Coins | Price |
|------|-------|-------|
| `starter` | 50 | ₹29 (2900 paise) |
| `popular` | 120 | ₹59 (5900 paise) |
| `best` | 300 | ₹99 (9900 paise) |

**Spend costs:**
| Feature | Coins | Reason string |
|---------|-------|---------------|
| Watermark remove | 10 | `spend_watermark` |
| Premium template | 15 | `spend_template` |
| Booth session | 8 | `spend_booth` |
| Shared canvas | 12 | `spend_canvas` |
| Cloud save (beyond free 3/month) | 3 | `spend_save` |

### 2.3 — Backend: Automatic Coin Bonuses

**Modify existing routes to grant coins on first occurrence:**

| Trigger | Route to modify | Coins | Reason |
|---------|----------------|-------|--------|
| Signup | `src/app/api/auth/signup/route.ts` | +20 | `signup_bonus` |
| First design saved | `src/app/api/designs/route.ts` (POST) | +10 | `first_design` |
| First order placed | `src/app/api/orders/route.ts` (POST) | +15 | `first_order` |

Use `hasReceivedBonus()` before granting to prevent duplicates.

### 2.4 — Frontend: Coin UI

**New files:**
| File | Purpose |
|------|---------|
| `src/hooks/useCoins.ts` | Fetch balance, expose `refresh()` |
| `src/components/CoinBadge.tsx` | Header pill showing balance (tappable → opens purchase sheet) |
| `src/components/CoinPurchaseSheet.tsx` | 3-tier pack selection, Razorpay checkout |
| `src/app/account/coins/page.tsx` | Coin history page (grouped by day) |

**Modify:**
| File | Change |
|------|--------|
| `src/app/editor/page.tsx` | Add `CoinBadge` to desktop sidebar and mobile header |
| `src/components/WatermarkModal.tsx` | Add "Use 10 coins" option alongside ₹9 payment |

### 2.5 — Frontend: Coin-gated Watermark (alternative path)

Update `WatermarkModal.tsx` to offer two paths:
1. ₹9 direct payment (existing from Phase 1)
2. 10 coins (calls `/api/coins/spend` → also inserts `design_unlocks`)

---

## PHASE 3 — Booth Mode (Week 5–6)

> **Goal:** Phone camera becomes a photobooth. 4-shot film strip.
> **Revenue unlock:** Booth sessions cost 8 coins after 3 free/day.

### 3.1 — Database

```sql
CREATE TABLE booth_sessions (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID REFERENCES users(id) ON DELETE SET NULL,
  shots         JSONB NOT NULL,
  strip_url     TEXT,
  layout        VARCHAR(20) NOT NULL DEFAULT 'filmstrip',
  location_tag  VARCHAR(100),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_booth_sessions_user ON booth_sessions(user_id);
```

### 3.2 — Backend

**New files:**
| File | Purpose |
|------|---------|
| `src/app/api/booth/render/route.ts` | `POST` — receive 4 Cloudinary URLs, composite into film strip using `canvas` (node-canvas), upload to Cloudinary, return strip URL |

The render route uses the same `canvas` package already in `package.json` (used by `printSheetGenerator.ts`).

### 3.3 — Frontend

**New files:**
| File | Purpose |
|------|---------|
| `src/hooks/useCamera.ts` | `getUserMedia()`, `takeShot()`, `switchCamera()`, `stopCamera()` |
| `src/hooks/useBoothSession.ts` | 4-shot sequence orchestration: countdown → capture → repeat → assemble |
| `src/app/booth/page.tsx` | Full-screen booth page |
| `src/components/booth/BoothCamera.tsx` | Video feed + capture button + camera flip |
| `src/components/booth/BoothCountdown.tsx` | 3-2-1 countdown overlay with flash effect |
| `src/components/booth/FilmStripResult.tsx` | 4-shot result display + download/share buttons |

**Free tier gate (client-side):**
- localStorage counter keyed by date: `booth_sessions_YYYY-MM-DD`
- First 3 per day: free
- After 3: show coin purchase prompt (8 coins)

**Share:** Use Web Share API (`navigator.share()`) for Instagram/WhatsApp sharing on mobile.

---

## PHASE 4 — Shared Canvas (Week 7–8)

> **Goal:** Two people design one polaroid from different cities.
> **Revenue unlock:** Sessions cost 12 coins.

### 4.1 — Database

```sql
CREATE TABLE shared_sessions (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  creator_user_id   UUID REFERENCES users(id) ON DELETE SET NULL,
  canvas_state      JSONB NOT NULL DEFAULT '{}',
  slot_a_filled     BOOLEAN NOT NULL DEFAULT FALSE,
  slot_b_filled     BOOLEAN NOT NULL DEFAULT FALSE,
  slot_a_label      VARCHAR(50),
  slot_b_label      VARCHAR(50),
  participant_count INTEGER NOT NULL DEFAULT 1,
  status            VARCHAR(20) NOT NULL DEFAULT 'active'
                      CHECK (status IN ('active','completed','expired')),
  expires_at        TIMESTAMPTZ NOT NULL DEFAULT NOW() + INTERVAL '48 hours',
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_shared_sessions_expires ON shared_sessions(expires_at) WHERE status = 'active';
```

### 4.2 — Backend

**New files:**
| File | Purpose |
|------|---------|
| `src/app/api/sessions/route.ts` | `POST` — create session, return share URL |
| `src/app/api/sessions/[id]/route.ts` | `GET` — return session state |
| `src/app/api/sessions/[id]/canvas/route.ts` | `PUT` — update canvas state for a slot |
| `src/app/api/sessions/[id]/stream/route.ts` | `GET` — SSE endpoint, polls DB every 3s, pushes canvas state |

**Modify:**
| File | Change |
|------|--------|
| `src/middleware.ts` | Add `/api/sessions` to `PUBLIC_API` (anyone with link can join) |

### 4.3 — Frontend

**New files:**
| File | Purpose |
|------|---------|
| `src/hooks/useSharedSession.ts` | SSE connection via `EventSource`, slot assignment, debounced canvas sync |
| `src/app/editor/shared/[id]/page.tsx` | Shared editor page (same layout as editor, with session overlay) |
| `src/components/shared/SharedCanvasEditor.tsx` | Dual-slot canvas view with labels |
| `src/components/shared/ShareLinkButton.tsx` | Copy link / share via WhatsApp |

**Modify:**
| File | Change |
|------|--------|
| `src/app/editor/page.tsx` | Add "Make Together" button that creates a session and navigates to `/editor/shared/[id]` |

---

## PHASE 5 — Order Add-ons (Week 9–10)

> **Goal:** Increase average order value with checkout add-ons.
> **Revenue unlock:** Layer 4 — gift wrap, note card, magnet, extra copy.

### 5.1 — Database

```sql
CREATE TABLE order_addons (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id      UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  addon_type    VARCHAR(50) NOT NULL
                  CHECK (addon_type IN ('gift_wrap','note_card','magnet','extra_copy')),
  quantity      INTEGER NOT NULL DEFAULT 1,
  price_paise   INTEGER NOT NULL,
  metadata      JSONB,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_order_addons_order ON order_addons(order_id);
```

### 5.2 — Backend

**New files:**
| File | Purpose |
|------|---------|
| `src/app/api/orders/[id]/addons/route.ts` | `POST` — add addons, `GET` — list addons |

**Add-on pricing (server-side constants, never trust client):**
| Type | Price |
|------|-------|
| `gift_wrap` | 2500 paise (₹25) |
| `note_card` | 2000 paise (₹20) |
| `magnet` | 4900 paise (₹49) |
| `extra_copy` | 5900 paise (₹59) |

**Modify:**
| File | Change |
|------|--------|
| `src/lib/validations.ts` | Add `addonSchema` |
| `src/app/api/orders/route.ts` | Accept `addons` array in order creation, insert into `order_addons`, add to order total |

### 5.3 — Frontend

**New files:**
| File | Purpose |
|------|---------|
| `src/components/order/AddonsPanel.tsx` | Checkbox list of add-ons with live total update |

**Modify:**
| File | Change |
|------|--------|
| `src/app/order/page.tsx` | Insert `AddonsPanel` between order summary and payment button |

---

## PHASE 6 — Gift Send Enhancement (Week 10–11)

> **Goal:** Upgrade the existing gift flow with recipient email notification, public tracking, and upsell.

### 6.1 — Database

```sql
ALTER TABLE orders ADD COLUMN IF NOT EXISTS gift_recipient_name VARCHAR(100);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS gift_recipient_email VARCHAR(255);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS gift_reveal_at TIMESTAMPTZ;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS is_anonymous_gift BOOLEAN DEFAULT FALSE;
```

### 6.2 — Backend

**New files:**
| File | Purpose |
|------|---------|
| `src/app/api/orders/track/[token]/route.ts` | `GET` — public order tracking by order_number (no auth) |
| `src/components/emails/GiftSent.tsx` | "Someone sent you a memory" email template |

**Modify:**
| File | Change |
|------|--------|
| `src/app/api/orders/route.ts` | When `is_gift`, send GiftSent email to `gift_recipient_email` via Resend |
| `src/middleware.ts` | Add `/api/orders/track` to `PUBLIC_API` |
| `src/lib/validations.ts` | Add `giftOrderSchema` for extra gift fields |

### 6.3 — Frontend

**New files:**
| File | Purpose |
|------|---------|
| `src/app/order/track/[token]/page.tsx` | Public tracking page (status, estimated delivery, sender name) |
| `src/components/order/GiftUpsell.tsx` | "Make it a surprise?" upsell prompt when user enters a different address |

**Modify:**
| File | Change |
|------|--------|
| `src/app/order/page.tsx` | Add recipient name/email fields when `isGift`, add anonymous toggle, show `GiftUpsell` for single prints |

---

## PHASE 7 — Occasion Targeting + Referrals (Week 12–13)

> **Goal:** Automated revenue from birthday/anniversary reminders. Viral growth from referrals.

### 7.1 — Database

```sql
CREATE TABLE user_occasions (
  id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id              UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  label                VARCHAR(100) NOT NULL,
  person_name          VARCHAR(100),
  occasion_date        DATE NOT NULL,
  notify_days_before   INTEGER NOT NULL DEFAULT 3,
  last_notified_year   INTEGER,
  is_active            BOOLEAN NOT NULL DEFAULT TRUE,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_user_occasions_user ON user_occasions(user_id);

CREATE TABLE referrals (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  referrer_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  referred_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  coins_granted   BOOLEAN NOT NULL DEFAULT FALSE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (referred_id)
);
CREATE INDEX idx_referrals_referrer ON referrals(referrer_id);
```

### 7.2 — Backend: Occasions

**New files:**
| File | Purpose |
|------|---------|
| `src/app/api/occasions/route.ts` | `GET` — list occasions, `POST` — create occasion |
| `src/app/api/occasions/[id]/route.ts` | `PUT` — edit, `DELETE` — remove |
| `src/app/api/cron/occasions/route.ts` | `GET` — daily cron: find upcoming occasions, send email, update `last_notified_year` |
| `src/components/emails/OccasionReminder.tsx` | "{Person}'s birthday is in 3 days — send a memory?" |

**Modify:**
| File | Change |
|------|--------|
| `src/middleware.ts` | Add `/api/occasions` to `AUTH_REQUIRED_API` |
| `src/lib/validations.ts` | Add `occasionSchema` |

### 7.3 — Backend: Referrals

**Modify:**
| File | Change |
|------|--------|
| `src/app/api/auth/signup/route.ts` | Accept optional `referral_code` in body → look up referrer → insert `referrals` row → `earnCoins(referrer, 25, 'referral')` |

### 7.4 — Frontend

**New files:**
| File | Purpose |
|------|---------|
| `src/components/OccasionForm.tsx` | Add/edit occasion dates |
| `src/app/account/occasions/page.tsx` | Manage saved occasions |

**Modify:**
| File | Change |
|------|--------|
| `src/app/auth/page.tsx` | After signup success, show optional occasion date prompt |
| `src/app/account/page.tsx` | Add "My occasions" and "Referral link" sections |

### 7.5 — Cron Setup

**Create or modify:** `vercel.json`

```json
{
  "crons": [
    { "path": "/api/cron/occasions", "schedule": "30 3 * * *" }
  ]
}
```

(3:30 UTC = 9:00 AM IST)

**New env var:** `CRON_SECRET` — the cron route checks `Authorization: Bearer $CRON_SECRET` header.

---

## PHASE 8 — PWA + Service Worker (Week 13–14)

> **Goal:** Offline editor, push notifications, "app-like" feel.

### 8.1 — Setup

**Install:** `next-pwa` (or manual service worker)

**Modify:** `next.config.ts` — wrap with PWA config:
- Cache Cloudinary images (CacheFirst)
- Cache API responses for templates/pricing (StaleWhileRevalidate)
- Offline fallback for editor page

**Modify:** `src/app/layout.tsx` — add PWA meta tags (apple-web-app-capable, theme-color, etc.)

The `public/site.webmanifest` already exists — just ensure it's linked in the layout `<head>`.

### 8.2 — Push Notifications (optional, Android Chrome only)

For occasion reminders as push notifications instead of just email.

**Install:** `web-push` package

**New files:**
| File | Purpose |
|------|---------|
| `src/app/api/notifications/subscribe/route.ts` | Save push subscription endpoint |
| `src/app/api/cron/push/route.ts` | Send push notifications for upcoming occasions |

---

## PHASE 9 — Admin Monetization Dashboard (Week 14–15)

> **Goal:** Admin can see revenue across all 4 layers.

### 9.1 — Backend

**New files:**
| File | Purpose |
|------|---------|
| `src/app/api/admin/monetization/summary/route.ts` | Layer-by-layer revenue breakdown (watermark, coins, prints, addons) |
| `src/app/api/admin/coins/ledger/route.ts` | All coin transactions (paginated, filterable) |

### 9.2 — Frontend

**New files:**
| File | Purpose |
|------|---------|
| `src/app/admin/monetization/page.tsx` | Revenue dashboard with 4-layer breakdown |

**Modify:**
| File | Change |
|------|--------|
| `src/components/admin/AdminSidebar.tsx` | Add "Monetization" nav item |

---

## Email Templates to Build (across all phases)

| Template | Phase | Trigger |
|----------|-------|---------|
| `GiftSent.tsx` | Phase 6 | Gift order placed → sent to recipient |
| `OccasionReminder.tsx` | Phase 7 | Cron job 3 days before occasion → sent to user |
| `CoinPurchaseReceipt.tsx` | Phase 2 | Coin pack purchased → sent to buyer |
| `WatermarkUnlockReceipt.tsx` | Phase 1 | ₹9 watermark payment → sent to payer |

All go in `src/components/emails/`, sent via existing Resend integration in `src/lib/resend.ts`.

---

## Complete New File Inventory

### Phase 1 — Watermark (4 new files, 4 modified)
```
NEW:
  src/app/api/designs/[id]/unlock/route.ts
  src/app/api/designs/[id]/download/route.ts
  src/components/WatermarkModal.tsx
  src/components/emails/WatermarkUnlockReceipt.tsx

MODIFY:
  src/hooks/usePolaroidCanvas.ts          — watermark on offscreen canvas at export
  src/components/PolaroidView.tsx          — check unlock before export
  src/app/editor/page.tsx                  — wire download button to modal
  src/middleware.ts                         — add to PUBLIC_API
```

### Phase 2 — Pola Coins (9 new files, 5 modified)
```
NEW:
  src/lib/coins.ts
  src/app/api/coins/balance/route.ts
  src/app/api/coins/history/route.ts
  src/app/api/coins/purchase/route.ts
  src/app/api/coins/spend/route.ts
  src/hooks/useCoins.ts
  src/components/CoinBadge.tsx
  src/components/CoinPurchaseSheet.tsx
  src/components/emails/CoinPurchaseReceipt.tsx

MODIFY:
  src/app/editor/page.tsx                  — add CoinBadge to header/sidebar
  src/components/WatermarkModal.tsx         — add coin payment option
  src/app/api/auth/signup/route.ts         — grant signup bonus
  src/app/api/designs/route.ts             — grant first_design bonus
  src/app/api/orders/route.ts              — grant first_order bonus
  src/middleware.ts                         — add /api/coins to auth
  src/lib/validations.ts                   — add schemas
```

### Phase 3 — Booth Mode (7 new files)
```
NEW:
  src/hooks/useCamera.ts
  src/hooks/useBoothSession.ts
  src/app/booth/page.tsx
  src/app/api/booth/render/route.ts
  src/components/booth/BoothCamera.tsx
  src/components/booth/BoothCountdown.tsx
  src/components/booth/FilmStripResult.tsx
```

### Phase 4 — Shared Canvas (7 new files, 2 modified)
```
NEW:
  src/app/api/sessions/route.ts
  src/app/api/sessions/[id]/route.ts
  src/app/api/sessions/[id]/canvas/route.ts
  src/app/api/sessions/[id]/stream/route.ts
  src/hooks/useSharedSession.ts
  src/app/editor/shared/[id]/page.tsx
  src/components/shared/ShareLinkButton.tsx

MODIFY:
  src/app/editor/page.tsx                  — add "Make Together" button
  src/middleware.ts                         — add /api/sessions to PUBLIC_API
```

### Phase 5 — Order Add-ons (2 new files, 3 modified)
```
NEW:
  src/app/api/orders/[id]/addons/route.ts
  src/components/order/AddonsPanel.tsx

MODIFY:
  src/app/order/page.tsx                   — insert AddonsPanel
  src/app/api/orders/route.ts              — accept addons in creation
  src/lib/validations.ts                   — add addonSchema
```

### Phase 6 — Gift Enhancement (4 new files, 3 modified)
```
NEW:
  src/app/api/orders/track/[token]/route.ts
  src/app/order/track/[token]/page.tsx
  src/components/order/GiftUpsell.tsx
  src/components/emails/GiftSent.tsx

MODIFY:
  src/app/order/page.tsx                   — recipient fields, anonymous toggle, upsell
  src/app/api/orders/route.ts              — send gift email on is_gift orders
  src/middleware.ts                         — add /api/orders/track to PUBLIC_API
```

### Phase 7 — Occasions + Referrals (5 new files, 3 modified)
```
NEW:
  src/app/api/occasions/route.ts
  src/app/api/occasions/[id]/route.ts
  src/app/api/cron/occasions/route.ts
  src/components/OccasionForm.tsx
  src/components/emails/OccasionReminder.tsx

MODIFY:
  src/app/api/auth/signup/route.ts         — accept referral_code, grant coins
  src/app/auth/page.tsx                    — occasion prompt after signup
  src/app/account/page.tsx                 — occasions + referral link sections
```

### Phase 8 — PWA (2 new files, 2 modified)
```
NEW:
  src/app/api/notifications/subscribe/route.ts  (optional)
  src/app/api/cron/push/route.ts                (optional)

MODIFY:
  next.config.ts                           — PWA wrapper
  src/app/layout.tsx                       — PWA meta tags
```

### Phase 9 — Admin Monetization (2 new files, 1 modified)
```
NEW:
  src/app/api/admin/monetization/summary/route.ts
  src/app/admin/monetization/page.tsx

MODIFY:
  src/components/admin/AdminSidebar.tsx     — add nav item
```

---

## SQL Migration Order

Run against Neon in this order:

```
Phase 1:  design_unlocks
Phase 2:  coin_ledger + v_coin_balance view + coin_purchases
Phase 3:  booth_sessions
Phase 4:  shared_sessions
Phase 5:  order_addons
Phase 6:  ALTER TABLE orders (gift columns)
Phase 7:  user_occasions + referrals
```

Total: **8 new tables, 1 view, 1 ALTER**

---

## Environment Variables to Add

```
CRON_SECRET=<random-string>          # Auth for cron job routes
NEXT_PUBLIC_APP_URL=https://polamuse.com  # For generating share links
```

No new third-party services needed — everything uses existing Razorpay, Cloudinary, Neon, and Resend.

---

## Totals

| Metric | Count |
|--------|-------|
| New files | ~42 |
| Modified files | ~20 |
| New DB tables | 8 |
| New API routes | ~18 |
| New pages | 6 |
| New components | ~15 |
| New hooks | 5 |
| New email templates | 4 |
| Phases | 9 |
| Estimated timeline | 15 weeks |

---

## Revenue Layers Unlocked Per Phase

| Phase | Layer | Revenue Source |
|-------|-------|---------------|
| 1 | Layer 1 | Watermark flip — ₹9/design |
| 2 | Layer 2 | Coin packs — ₹29/₹59/₹99 |
| 3 | — | Booth mode drives coin usage (8 coins/session) |
| 4 | — | Shared canvas drives coin usage (12 coins/session) |
| 5 | Layer 4 | Checkout add-ons — ₹20–₹59 each |
| 6 | Layer 3 | Gift send upsell — ₹79 → ₹149 |
| 7 | — | Occasion emails drive repeat gift orders |
| 8 | — | PWA retention improves all layers |
| 9 | — | Admin visibility into all revenue |

**Target at 500 MAU:** ₹24,640 gross / ₹16,147 net per month.

---

*Polamuse Implementation v2.0 — Master Plan*
*9 phases · 15 weeks · 42 new files · 8 new tables · 4 revenue layers*
