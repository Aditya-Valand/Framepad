# Polamuse — Complete Backend Implementation Plan
> **56 features · 32 client · 24 admin · Next.js 14 · Neon · JWT · Raw SQL · Cloudinary · Razorpay · Resend**

---

## Tech Stack Quick Reference

| Layer | Choice | Reason |
|-------|--------|--------|
| Framework | Next.js 14 App Router | Full-stack, one repo, API routes built-in |
| Database | Neon PostgreSQL | Free, branching, serverless-compatible |
| Auth | Custom JWT (jsonwebtoken + bcryptjs) | Full control, no vendor lock-in |
| DB queries | Raw SQL (`@neondatabase/serverless`) | No ORM, full control, injection-safe tagged templates |
| Images | Cloudinary | Signed direct uploads, no Vercel body limit |
| Payments | Razorpay + UPI QR | India-first, webhook support |
| Email | Resend + React Email | Developer-friendly, free 3K/mo |
| State | Zustand | Lightweight, perfect for canvas state |
| Canvas | fabric.js | Built-in filters, drag/rotate/clip |
| Hosting | Vercel | Zero config, Neon integration |

---

## Architecture Principle

```
Browser (fabric.js)        → 17 features run 100% client-side, zero cost
       ↓ only on 4 triggers
Next.js API Routes         → auth / save design / order / payment
       ↓
Neon PostgreSQL            → 32 tables, raw SQL
Cloudinary                 → images, thumbnails, print files
Razorpay                   → payment orders + webhooks
Resend                     → transactional emails
```

---

## Build Order Overview

| Phase | What | Features | Est. Time |
|-------|------|----------|-----------|
| 1 | Foundation — DB + Auth | F01–F05 | 4–5 days |
| 2 | Editor Core | F06–F18 | 5–6 days |
| 3 | Batch Layouts | F19–F21 | 3–4 days |
| 4 | Design Cloud | F22–F25 | 2 days |
| 5 | Orders & Payments | F26–F31 | 5–6 days |
| 6 | Account | F32 | 1 day |
| 7 | Admin — Orders | A01–A06 | 3–4 days |
| 8 | Admin — Print Queue | A07–A11 | 4–5 days |
| 9 | Admin — Users | A12–A15 | 2–3 days |
| 10 | Admin — Analytics | A16–A19 | 2–3 days |
| 11 | Admin — Coupons | A20–A22 | 2 days |
| 12 | Admin — Settings | A23–A24 | 1 day |

**Total estimated: 34–44 days (solo developer)**

---

---

# PHASE 1 — FOUNDATION

> Build this first. Everything else depends on it.

---

## F01 — Signup

**Type:** Server  
**Estimated time:** 4–6 hours

### Files to create

```
src/
├── app/
│   ├── (public)/signup/page.tsx          ← signup UI form
│   └── api/auth/signup/route.ts          ← API handler
├── lib/
│   ├── db.ts                             ← neon() connection (already done)
│   ├── jwt.ts                            ← signAccessToken, signRefreshToken, verify
│   └── validations.ts                    ← Zod: signupSchema
```

### API route

```
POST /api/auth/signup
Body: { email, fullName, password }
Returns: { user: { id, email, role } } + sets httpOnly cookies
```

### Implementation steps

1. Validate body with Zod `signupSchema` (email format, password min 8 chars)
2. Check `SELECT id FROM users WHERE email = $1` — throw 409 if exists
3. `bcrypt.hash(password, 10)` — store hash, never plain text
4. `INSERT INTO users (email, password_hash) RETURNING id, email, role`
5. `INSERT INTO user_profiles (user_id, full_name) VALUES ($1, $2)`
6. `signAccessToken({ userId, email, role })` — expires 1h
7. `signRefreshToken(userId, sessionId)` — expires 7d
8. `INSERT INTO user_sessions (user_id, refresh_token_hash, expires_at)`
9. Set cookies: `access_token` (httpOnly, Secure, SameSite=Strict), `refresh_token` (same + Path=/api/auth/refresh)
10. Return `{ user }` with 201

### Key code pattern

```typescript
// src/app/api/auth/signup/route.ts
import { sql } from '@/lib/db'
import { signAccessToken, signRefreshToken } from '@/lib/jwt'
import bcrypt from 'bcryptjs'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const schema = z.object({
  email: z.string().email(),
  fullName: z.string().min(2).max(100),
  password: z.string().min(8)
})

export async function POST(req: Request) {
  const body = await req.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }
  const { email, fullName, password } = parsed.data

  const existing = await sql`SELECT id FROM users WHERE email = ${email} LIMIT 1`
  if (existing.length) {
    return NextResponse.json({ error: 'Email already registered' }, { status: 409 })
  }

  const hash = await bcrypt.hash(password, 10)
  const [user] = await sql`
    INSERT INTO users (email, password_hash)
    VALUES (${email}, ${hash})
    RETURNING id, email, role`

  await sql`INSERT INTO user_profiles (user_id, full_name) VALUES (${user.id}, ${fullName})`

  const sessionId = crypto.randomUUID()
  const accessToken  = signAccessToken({ userId: user.id, email, role: user.role })
  const refreshToken = signRefreshToken(user.id, sessionId)
  const refreshHash  = await bcrypt.hash(refreshToken, 8)
  const expiresAt    = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

  await sql`
    INSERT INTO user_sessions (id, user_id, refresh_token_hash, expires_at)
    VALUES (${sessionId}, ${user.id}, ${refreshHash}, ${expiresAt})`

  const res = NextResponse.json({ user: { id: user.id, email, role: user.role } }, { status: 201 })
  res.cookies.set('access_token', accessToken, { httpOnly: true, secure: true, sameSite: 'strict', maxAge: 3600 })
  res.cookies.set('refresh_token', refreshToken, { httpOnly: true, secure: true, sameSite: 'strict', maxAge: 604800, path: '/api/auth/refresh' })
  return res
}
```

---

## F02 — Login

**Type:** Server  
**Estimated time:** 2–3 hours

### Files to create

```
src/app/
├── (public)/login/page.tsx
└── api/auth/login/route.ts
```

### API route

```
POST /api/auth/login
Body: { email, password }
Returns: { user } + sets httpOnly cookies
```

### Implementation steps

1. Validate body with Zod
2. `SELECT id, email, password_hash, role, is_active, is_banned FROM users WHERE email = $1`
3. If not found → 401 (don't say "email not found" — security)
4. If `is_banned = true` → 403 `{ error: 'Account suspended' }`
5. `bcrypt.compare(password, password_hash)` → 401 if false
6. `UPDATE users SET last_login_at = NOW() WHERE id = $1`
7. Create session + sign tokens + set cookies (same as signup step 6–9)
8. Return `{ user }`

---

## F03 — Google OAuth

**Type:** Server  
**Estimated time:** 4–6 hours

### Files to create

```
src/app/api/auth/
├── google/route.ts          ← redirect to Google OAuth URL
└── google/callback/route.ts ← handle callback, create/find user
```

### Implementation steps

1. `/api/auth/google` → redirect to Google OAuth URL with `client_id`, `redirect_uri`, `scope=email profile`
2. Google redirects back to `/api/auth/google/callback?code=xxx`
3. Exchange `code` for access token via Google token endpoint
4. Fetch user info: `{ email, name, picture }` from Google userinfo API
5. `SELECT id, role FROM users WHERE email = $1`
6. If not found: `INSERT INTO users (email, email_verified_at) ...` + `INSERT INTO user_profiles (full_name, avatar_url) ...`
7. Create session + sign tokens + set cookies
8. Redirect to `/editor` or `?redirect` param

### Env vars needed

```
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REDIRECT_URI=https://yourdomain.com/api/auth/google/callback
```

---

## F04 — Logout

**Type:** Server  
**Estimated time:** 1 hour

### API route

```
POST /api/auth/logout
Auth: required
```

### Implementation steps

1. Read `refresh_token` cookie
2. Hash it with bcrypt → find and DELETE from `user_sessions`
3. Clear both cookies: `access_token`, `refresh_token`
4. Return 200

---

## F05 — Forgot / Reset Password

**Type:** Server  
**Estimated time:** 3–4 hours

### Files to create

```
src/app/api/auth/
├── forgot-password/route.ts
└── reset-password/route.ts
src/components/emails/
└── PasswordReset.tsx          ← React Email template
```

### API routes

```
POST /api/auth/forgot-password   Body: { email }
POST /api/auth/reset-password    Body: { token, newPassword }
```

### Implementation steps (forgot)

1. Find user by email — if not found, return 200 anyway (don't leak existence)
2. Generate token: `crypto.randomUUID()`
3. Hash it: `bcrypt.hash(token, 8)`
4. `INSERT INTO password_reset_tokens (user_id, token_hash, expires_at)` — expires 15 min
5. Send email via Resend with reset link: `/reset-password?token=xxx`

### Implementation steps (reset)

1. Find token in `password_reset_tokens` where `used_at IS NULL` and `expires_at > NOW()`
2. Verify token hash matches
3. `bcrypt.hash(newPassword, 10)` → `UPDATE users SET password_hash = $1 WHERE id = $2`
4. `UPDATE password_reset_tokens SET used_at = NOW() WHERE id = $1`
5. DELETE all user sessions (force re-login everywhere)
6. Return 200

---

## Middleware (required before Phase 2 backend)

**File:** `src/middleware.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { verifyAccessToken } from '@/lib/jwt'

const PROTECTED_PAGES = ['/editor', '/order', '/account']
const PROTECTED_API   = ['/api/designs', '/api/orders', '/api/payments', '/api/account']
const ADMIN_PATHS     = ['/admin', '/api/admin']

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const isProtected = PROTECTED_PAGES.some(p => pathname.startsWith(p))
                   || PROTECTED_API.some(p => pathname.startsWith(p))
  const isAdmin = ADMIN_PATHS.some(p => pathname.startsWith(p))

  if (!isProtected && !isAdmin) return NextResponse.next()

  const token = req.cookies.get('access_token')?.value

  if (!token) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.redirect(new URL(`/login?redirect=${pathname}`, req.url))
  }

  try {
    const payload = verifyAccessToken(token)

    if (isAdmin && payload.role !== 'admin') {
      return pathname.startsWith('/api/')
        ? NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        : NextResponse.redirect(new URL('/404', req.url))
    }

    const headers = new Headers(req.headers)
    headers.set('x-user-id',    payload.userId)
    headers.set('x-user-role',  payload.role)
    headers.set('x-user-email', payload.email)
    return NextResponse.next({ request: { headers } })
  } catch {
    // Token expired → try refresh
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Token expired' }, { status: 401 })
    }
    return NextResponse.redirect(new URL(`/api/auth/refresh?next=${pathname}`, req.url))
  }
}

export const config = {
  matcher: ['/editor/:path*', '/order/:path*', '/account/:path*', '/admin/:path*',
            '/api/designs/:path*', '/api/orders/:path*', '/api/payments/:path*',
            '/api/account/:path*', '/api/admin/:path*']
}
```

---

---

# PHASE 2 — EDITOR CORE

> All 13 editor features are client-side (browser). Only F06 has a server component (Cloudinary signed upload).

---

## F06 — Image Upload

**Type:** Both (client + server for signed URL)  
**Estimated time:** 3–4 hours

### Files

```
src/
├── app/api/uploads/sign/route.ts    ← generates Cloudinary signature
├── lib/cloudinary.ts                ← Cloudinary config + sign helper
└── components/canvas/ImageUploader.tsx
```

### API route

```
POST /api/uploads/sign
Auth: required
Body: { folder: 'polamuse/uploads', publicId?: string }
Returns: { signature, timestamp, cloudName, apiKey, uploadUrl }
```

### Implementation steps

1. **Server side** — `src/lib/cloudinary.ts`:
   ```typescript
   import { v2 as cloudinary } from 'cloudinary'
   cloudinary.config({
     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
     api_key:    process.env.CLOUDINARY_API_KEY,
     api_secret: process.env.CLOUDINARY_API_SECRET,
   })

   export function generateSignature(params: Record<string, string>) {
     const timestamp = Math.round(Date.now() / 1000)
     const toSign = Object.entries({ ...params, timestamp })
       .sort(([a],[b]) => a.localeCompare(b))
       .map(([k,v]) => `${k}=${v}`)
       .join('&') + process.env.CLOUDINARY_API_SECRET
     return { signature: require('crypto').createHash('sha1').update(toSign).digest('hex'), timestamp }
   }
   ```

2. **Client side** — `ImageUploader.tsx`:
   - User picks file → `FileReader.readAsDataURL()` for instant preview
   - `POST /api/uploads/sign` → get signature
   - `fetch('https://api.cloudinary.com/v1_1/${cloudName}/image/upload', { method: 'POST', body: formData })`
   - Returns `{ secure_url, public_id }` → load into fabric.js canvas

### Key point
Direct browser → Cloudinary upload bypasses Vercel's 4.5MB body limit entirely.

---

## F07 — Template Selector

**Type:** Both (fetch templates once from server, then client-side)  
**Estimated time:** 2–3 hours

### API route

```
GET /api/templates
Returns: [{ id, slug, name, vibe, thumbnail_url, default_canvas_state, frame_ratio, orientation }]
Cached: revalidate every 24 hours (templates rarely change)
```

### Implementation steps

1. `src/app/api/templates/route.ts` → `SELECT * FROM templates WHERE is_active = true ORDER BY sort_order`
2. Cache with `{ next: { revalidate: 86400 } }` in fetch options
3. Template picker UI shows 9 template cards with thumbnails
4. On select → load `default_canvas_state` JSON into fabric.js canvas via `canvas.loadFromJSON()`

---

## F08–F16 — All Editor Features (Client-side only)

**Type:** Browser — zero server involvement  
**Estimated time:** 10–14 hours total

### File structure

```
src/components/canvas/
├── PolaroidCanvas.tsx        ← main fabric.js canvas component
├── CanvasManager.tsx         ← manages multiple canvases for batch
└── ExportEngine.ts           ← canvas.toDataURL() export helper
src/components/controls/
├── FrameControls.tsx         ← F08: border, color, gradient, texture, shape
├── TextControls.tsx          ← F09: top label + bottom caption
├── EditingControls.tsx       ← F10: brightness, contrast, saturation, warmth
├── FilterPresets.tsx         ← F11: vintage, film, sepia, B&W, faded
├── StickerPanel.tsx          ← F12: built-in + custom stickers
├── MusicControl.tsx          ← F13: Spotify scan code
├── TimestampControl.tsx      ← F14: date label
└── CanvasInteractions.ts     ← F15: drag, zoom, rotate handlers
src/lib/
├── filters.ts                ← filter preset value definitions
├── fonts.ts                  ← font preset definitions
└── textures.ts               ← texture overlay paths
src/store/
├── useFrameStore.ts          ← per-polaroid canvas state
├── useLayoutStore.ts         ← current layout mode
└── useAppStore.ts            ← global app state (sidebar tab etc.)
```

### Fabric.js canvas layer order

```
Layer 0 (bottom):  Frame background rect (white/colored/gradient)
Layer 1:           Texture overlay PNG (grain/wood/matte) — opacity 0.25, evented: false
Layer 2:           User photo (fabric.Image, clipped to image area)
Layer 3:           Sticker elements (fabric.Image, draggable)
Layer 4:           Top label text (fabric.IText)
Layer 5:           Bottom caption text (fabric.IText)
Layer 6 (top):     Spotify/QR code image
```

### Filter application pattern (non-destructive)

```typescript
// src/lib/filters.ts
export const FILTER_PRESETS = {
  none:    { brightness: 0,   contrast: 0,   saturation: 0,   warmth: 0  },
  vintage: { brightness: 10,  contrast: -5,  saturation: -20, warmth: 30 },
  film:    { brightness: 5,   contrast: 10,  saturation: -10, warmth: 10 },
  sepia:   { brightness: 0,   contrast: 5,   saturation: -80, warmth: 40 },
  bw:      { brightness: 0,   contrast: 10,  saturation: -100,warmth: 0  },
  faded:   { brightness: 20,  contrast: -20, saturation: -30, warmth: 5  },
}

// Apply all filters from stored values (never from pixels)
export function applyFilters(img: fabric.Image, edits: EditState) {
  img.filters = []
  if (edits.brightness !== 0)
    img.filters.push(new fabric.Image.filters.Brightness({ brightness: edits.brightness / 100 }))
  if (edits.contrast !== 0)
    img.filters.push(new fabric.Image.filters.Contrast({ contrast: edits.contrast / 100 }))
  if (edits.saturation !== 0)
    img.filters.push(new fabric.Image.filters.Saturation({ saturation: edits.saturation / 100 }))
  img.applyFilters()
}
```

### Spotify scan code (F13)

```typescript
// Fetch from Spotify's public CDN — no API key needed
export function buildSpotifyCodeUrl(url: string): string | null {
  const match = url.match(/spotify\.com\/(track|album|playlist)\/([a-zA-Z0-9]+)/)
  if (!match) return null
  const uri = `spotify:${match[1]}:${match[2]}`
  return `https://scannables.scdn.co/uri/plain/png/FFFFFF/black/640/${uri}`
}
// Load into canvas with crossOrigin: 'anonymous'
```

### Free PNG export (F18)

```typescript
// src/components/canvas/ExportEngine.ts
export function exportPNG(canvas: fabric.Canvas, filename = 'polamuse.png') {
  const dataURL = canvas.toDataURL({ format: 'png', quality: 1, multiplier: 2 })
  const a = document.createElement('a')
  a.download = filename
  a.href = dataURL
  a.click()
}
```

### Guest auto-save (F17)

```typescript
// Debounced save to localStorage every 2 seconds
const debouncedSave = useMemo(() => debounce((state: CanvasState) => {
  localStorage.setItem('polamuse_pending_design', JSON.stringify(state))
}, 2000), [])

// On mount: restore from localStorage if exists
useEffect(() => {
  const saved = localStorage.getItem('polamuse_pending_design')
  if (saved) canvas.loadFromJSON(JSON.parse(saved), canvas.renderAll.bind(canvas))
}, [])
```

---

---

# PHASE 3 — BATCH LAYOUTS

**Type:** Browser only  
**Estimated time:** 3–4 hours

## F19 — Film Strip Layout

```
src/components/layouts/FilmStripLayout.tsx
```

### Implementation

- 3–4 independent `PolaroidCanvas` instances in a horizontal flex row
- Shared frame style via `useLayoutStore`
- Individual image upload + caption per cell
- Export: composite all canvases onto an offscreen canvas via `offscreen.getContext('2d').drawImage()`

```typescript
async function exportFilmStrip(canvases: fabric.Canvas[], gap = 16) {
  const totalW = canvases.reduce((w, c) => w + c.width!, 0) + gap * (canvases.length - 1)
  const h = canvases[0].height!
  const out = document.createElement('canvas')
  out.width = totalW * 2; out.height = h * 2
  const ctx = out.getContext('2d')!
  ctx.scale(2, 2)
  let x = 0
  for (const c of canvases) {
    const img = new Image()
    img.src = c.toDataURL({ format: 'png', multiplier: 1 })
    await new Promise(r => img.onload = r)
    ctx.drawImage(img, x, 0)
    x += c.width! + gap
  }
  const a = document.createElement('a')
  a.download = 'filmstrip.png'; a.href = out.toDataURL('image/png'); a.click()
}
```

## F20 — Grid Layout

```
src/components/layouts/GridLayout.tsx
```

Same pattern as film strip but 2D. 2×2 or 3×3 grid. Adjustable gap slider.

## F21 — Scrapbook Layout

```
src/components/layouts/ScrapbookLayout.tsx
```

### Implementation

- One large master `fabric.Canvas` (1200×900)
- Each Polaroid: rendered as PNG via `polaroidCanvas.toDataURL()` → loaded as `fabric.Image` on master canvas
- Free drag + rotation + z-order (bringForward / sendBackwards)
- Background color picker
- Max 8 Polaroids
- Export: `masterCanvas.toDataURL({ format: 'png', multiplier: 2 })`

---

---

# PHASE 4 — DESIGN CLOUD SAVE

**Estimated time:** 2 days

## F22 — Save Design to Cloud

### API route

```
POST /api/designs
Auth: required
Body: { canvas_state, template_id?, title?, frame_style, has_caption, caption_text, has_spotify_code, spotify_uri, filter_preset, thumbnail_url? }
Returns: { id, created_at }

PUT /api/designs/:id
Auth: required (owner only)
Body: same as POST
Returns: { id, updated_at }
```

### Files

```
src/app/api/designs/
├── route.ts          ← GET (list) + POST (create)
└── [id]/route.ts     ← GET (single) + PUT (update) + DELETE (soft delete)
```

### Key implementation

```typescript
// POST /api/designs — upsert with version history
const [design] = await sql`
  INSERT INTO designs
    (user_id, template_id, canvas_state, frame_style, has_caption,
     caption_text, has_spotify_code, spotify_uri, filter_preset, status)
  VALUES
    (${userId}, ${templateId}, ${JSON.stringify(canvasState)}, ${frameStyle},
     ${hasCaption}, ${caption}, ${hasSpotify}, ${spotifyUri}, ${filterPreset}, 'draft')
  RETURNING id, created_at`

// Save version
const versions = await sql`SELECT COUNT(*) as n FROM design_versions WHERE design_id = ${design.id}`
await sql`
  INSERT INTO design_versions (design_id, version_number, canvas_state)
  VALUES (${design.id}, ${Number(versions[0].n) + 1}, ${JSON.stringify(canvasState)})`
```

### Intent preservation (guest → login → order)

```typescript
// In order page: check localStorage on mount
useEffect(() => {
  const pending = localStorage.getItem('polamuse_pending_design')
  if (pending && isLoggedIn) {
    // Auto-save to cloud and clear localStorage
    saveDesign(JSON.parse(pending)).then(() => {
      localStorage.removeItem('polamuse_pending_design')
    })
  }
}, [isLoggedIn])
```

## F23 — View Saved Designs

```
GET /api/designs
Auth: required
Returns: [{ id, title, thumbnail_url, frame_style, status, created_at, updated_at }]
Sorted: updated_at DESC
```

## F24 — Edit Saved Design

Load design → `canvas.loadFromJSON(design.canvas_state, ...)` → edit → PUT to save.
Auto-increment `version_number` on each save.

## F25 — Delete Design

```
DELETE /api/designs/:id
Auth: required
Check: SELECT order_items WHERE design_id = $1 — refuse if active orders exist
Action: UPDATE designs SET deleted_at = NOW()
```

---

---

# PHASE 5 — ORDERS & PAYMENTS

**Estimated time:** 5–6 days

## F26 — Order Page

### Files

```
src/app/(protected)/order/page.tsx
src/app/api/
├── orders/route.ts                    ← GET list + POST create
├── orders/[id]/route.ts               ← GET single order
└── orders/[id]/payment/route.ts       ← POST create Razorpay order
```

### Flow

```
1. User lands on /order with designId in URL params
2. Fetch design + product_types + print_finishes + print_sizes from API
3. User selects: product type, finish, size, gift toggle
4. Price calculated client-side: base_price + size_addon + finish_addon - discount
5. POST /api/orders → creates order + order_items row (status: pending_payment)
```

### Create order (raw SQL transaction)

```typescript
// POST /api/orders
await sql`BEGIN`
try {
  const [order] = await sql`
    INSERT INTO orders (user_id, subtotal_paise, total_paise, order_type, shipping_address_id, is_gift)
    VALUES (${userId}, ${subtotal}, ${total}, 'standard', ${addressId}, ${isGift})
    RETURNING id, order_number`

  await sql`
    INSERT INTO order_items
      (order_id, design_id, product_type_id, print_finish_id, print_size_id,
       quantity, unit_price_paise, total_price_paise, design_snapshot_url)
    VALUES
      (${order.id}, ${designId}, ${productTypeId}, ${finishId}, ${sizeId},
       ${qty}, ${unitPrice}, ${totalPrice}, ${snapshotUrl})`

  // Update design status
  await sql`UPDATE designs SET status = 'ordered' WHERE id = ${designId}`

  await sql`COMMIT`
  return order
} catch (err) {
  await sql`ROLLBACK`
  throw err
}
```

## F27 — Apply Coupon

```
POST /api/orders/validate-coupon
Auth: required
Body: { code, orderTotal }
Returns: { valid: true, discountPaise, couponId } or { valid: false, reason }
```

### Validation logic

```typescript
const [coupon] = await sql`
  SELECT * FROM coupons
  WHERE code = ${code}
    AND is_active = true
    AND valid_from <= NOW()
    AND (valid_until IS NULL OR valid_until >= NOW())`

if (!coupon) return { valid: false, reason: 'Invalid or expired coupon' }
if (coupon.total_usage_limit && coupon.usage_count >= coupon.total_usage_limit)
  return { valid: false, reason: 'Coupon limit reached' }

// Check per-user limit
const [usage] = await sql`
  SELECT COUNT(*) as n FROM coupon_usages
  WHERE coupon_id = ${coupon.id} AND user_id = ${userId}`
if (Number(usage.n) >= coupon.per_user_limit)
  return { valid: false, reason: 'Already used this coupon' }
```

## F28 — Shipping Address

```
GET  /api/account/addresses         ← list saved addresses
POST /api/account/addresses         ← save new address
PUT  /api/account/addresses/:id     ← update
```

## F29 — Payment (Razorpay + UPI)

### Files

```
src/lib/razorpay.ts
src/app/api/
├── orders/[id]/payment/route.ts    ← create Razorpay order
├── payments/verify/route.ts        ← verify after client pays
└── payments/webhook/route.ts       ← Razorpay webhook backup
```

### Full payment flow

```typescript
// Step 1: Create Razorpay order (server)
// POST /api/orders/:id/payment
import Razorpay from 'razorpay'
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})
const rzpOrder = await razorpay.orders.create({
  amount: totalPaise,
  currency: 'INR',
  receipt: orderNumber,
})
// Return rzpOrder.id to client

// Step 2: Client opens Razorpay modal
// (in browser) options.key = NEXT_PUBLIC_RAZORPAY_KEY_ID
// On success: { razorpay_payment_id, razorpay_order_id, razorpay_signature }

// Step 3: Verify (server)
// POST /api/payments/verify
import crypto from 'crypto'
const expected = crypto
  .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
  .update(`${razorpayOrderId}|${razorpayPaymentId}`)
  .digest('hex')
if (expected !== razorpaySignature) return 401

// Idempotency check
const [existing] = await sql`SELECT id FROM payments WHERE provider_payment_id = ${razorpayPaymentId}`
if (existing) return { ok: true, message: 'already processed' }

// Confirm order (transaction)
await sql`BEGIN`
await sql`UPDATE orders SET status = 'confirmed', confirmed_at = NOW() WHERE id = ${orderId}`
await sql`INSERT INTO payments (order_id, provider_payment_id, amount_paise, status, payment_method)
          VALUES (${orderId}, ${razorpayPaymentId}, ${amount}, 'captured', ${method})`
await sql`COMMIT`

// After confirm: generate print file + send email
await generatePrintFile(orderId)
await sendOrderConfirmationEmail(orderId)

// Step 4: Webhook (backup — handles connection drops)
// POST /api/payments/webhook
// Same idempotency check → same confirm logic
// Verify: crypto.createHmac('sha256', WEBHOOK_SECRET).update(rawBody).digest('hex')
```

### Print file generation (after payment)

```typescript
// After order confirmed: generate 2x PNG and save to Cloudinary
async function generatePrintFile(orderItemId: string) {
  const [item] = await sql`SELECT * FROM order_items WHERE id = ${orderItemId}`
  // Re-render canvas server-side using node-canvas + fabric
  // OR: the client already has export_url from their design export → use that
  // Simpler approach: use design.export_url as print_ready_url if already exported
  const [design] = await sql`SELECT export_url FROM designs WHERE id = ${item.design_id}`
  if (design.export_url) {
    await sql`UPDATE order_items SET print_ready_url = ${design.export_url} WHERE id = ${orderItemId}`
  }
}
```

## F30 — Order History

```
GET /api/orders
Auth: required
Returns: [{ id, order_number, status, total_paise, created_at, item_count }]
```

## F31 — Order Tracking

```
GET /api/orders/:id
Auth: required (owner only: WHERE user_id = x-user-id header)
Returns: full order with shipment tracking, items, payment status
```

---

---

# PHASE 6 — ACCOUNT

## F32 — Profile & Preferences

```
GET /api/account/profile
PUT /api/account/profile
Body: { fullName, phone, city, state, defaultFontPreset, defaultFrameStyle, preferredFinish, emailMarketing }
```

```typescript
// PUT /api/account/profile
const userId = req.headers.get('x-user-id')!
await sql`
  UPDATE user_profiles
  SET full_name = ${fullName}, phone = ${phone}, city = ${city},
      default_font_preset = ${fontPreset}, preferred_finish = ${finish},
      updated_at = NOW()
  WHERE user_id = ${userId}`
```

---

---

# PHASE 7 — ADMIN: ORDER MANAGEMENT

> All admin routes: `x-user-role` header must be `admin` (enforced by middleware)

## A01 — Orders Dashboard

```
GET /api/admin/orders
Query params: status?, search?, page?, limit?, dateFrom?, dateTo?, orderType?
Returns: paginated orders from v_admin_orders view
```

```typescript
// Dynamic WHERE building (safe with tagged templates)
const rows = await sql`
  SELECT * FROM v_admin_orders
  WHERE 1=1
    ${status ? sql`AND status = ${status}` : sql``}
    ${search ? sql`AND (order_number ILIKE ${'%'+search+'%'} OR customer_email ILIKE ${'%'+search+'%'})` : sql``}
  ORDER BY created_at DESC
  LIMIT ${limit} OFFSET ${(page-1)*limit}`
```

## A02 — Order Detail View

```
GET /api/admin/orders/:id
Returns: full order + items + payment + shipment + gift_message + customer profile
```

## A03 — Update Order Status

```
PUT /api/admin/orders/:id/status
Body: { status, internalNote? }
```

```typescript
// Log the change
await sql`BEGIN`
await sql`UPDATE orders SET status = ${status}, updated_at = NOW() WHERE id = ${orderId}`
await sql`
  INSERT INTO admin_activity_logs (admin_user_id, action, entity_type, entity_id, old_value, new_value)
  VALUES (${adminId}, 'order.status_changed', 'order', ${orderId},
          ${JSON.stringify({ status: oldStatus })}, ${JSON.stringify({ status })})`
await sql`COMMIT`

// Trigger emails on specific status changes
if (status === 'shipped') await sendShippedEmail(orderId)
if (status === 'delivered') await sendDeliveredEmail(orderId)
```

## A04 — Add Tracking Number

```
POST /api/admin/orders/:id/ship
Body: { trackingNumber, carrier, trackingUrl }
```

```typescript
await sql`BEGIN`
await sql`
  INSERT INTO shipments (order_id, tracking_number, carrier, tracking_url, status, shipped_at)
  VALUES (${orderId}, ${trackingNumber}, ${carrier}, ${trackingUrl}, 'in_transit', NOW())`
await sql`UPDATE orders SET status = 'shipped', updated_at = NOW() WHERE id = ${orderId}`
await sql`COMMIT`
await sendShippedEmail(orderId) // sends tracking link to customer
```

## A05 — Download Print File

```
GET /api/admin/orders/items/:itemId/print-file
Returns: redirect to Cloudinary print_ready_url or signed download URL
```

## A06 — Internal Notes

```
PUT /api/admin/orders/:id/notes
Body: { internalNotes }
Action: UPDATE orders SET internal_notes = $1 WHERE id = $2
```

---

---

# PHASE 8 — ADMIN: PRINT QUEUE & SHEET SYSTEM

## A07 — Print Queue View

```
GET /api/admin/print-queue
Query: size_slug?, finish_slug?
Returns: all items from v_print_queue view, grouped by size+finish
```

```typescript
// Shows grouping: "Classic Glossy — 12 items — fits 2 sheets of 6"
const queue = await sql`SELECT * FROM v_print_queue ORDER BY finish_slug, size_slug, confirmed_at`
// Group in JS by size_slug + finish_slug
```

## A08 — Generate Print Sheet

```
POST /api/admin/print-sheets/generate
Body: { sizeSlug, finishSlug, paperSize?: 'A4' }
```

### Implementation

```typescript
// 1. Get config for this size
const [config] = await sql`
  SELECT psc.* FROM print_sheet_configs psc
  JOIN print_sizes ps ON ps.id = psc.print_size_id
  WHERE ps.slug = ${sizeSlug} AND psc.paper_size = ${paperSize}`

// 2. Get pending items for this size+finish (up to capacity)
const items = await sql`
  SELECT oi.id, oi.design_snapshot_url
  FROM order_items oi
  JOIN print_sizes ps ON ps.id = oi.print_size_id
  JOIN print_finishes pf ON pf.id = oi.print_finish_id
  WHERE ps.slug = ${sizeSlug}
    AND pf.slug = ${finishSlug}
    AND oi.print_status = 'pending'
    AND oi.print_sheet_id IS NULL
  ORDER BY oi.created_at ASC
  LIMIT ${config.items_per_sheet}`

// 3. Create print sheet
const [sheet] = await sql`
  INSERT INTO print_sheets (print_finish_id, print_size_id, config_id, paper_size, capacity, items_count, status)
  VALUES (${finishId}, ${sizeId}, ${config.id}, ${paperSize}, ${config.items_per_sheet}, ${items.length}, 'generating')
  RETURNING id, sheet_number`

// 4. Assign each item to a position on the sheet
await sql`BEGIN`
for (let i = 0; i < items.length; i++) {
  const col = i % config.columns
  const row = Math.floor(i / config.columns)
  await sql`
    INSERT INTO print_sheet_items (sheet_id, order_item_id, position, col, row, design_snapshot_url)
    VALUES (${sheet.id}, ${items[i].id}, ${i+1}, ${col}, ${row}, ${items[i].design_snapshot_url})`
  await sql`
    UPDATE order_items SET print_status = 'assigned_to_sheet', print_sheet_id = ${sheet.id}
    WHERE id = ${items[i].id}`
}
await sql`COMMIT`

// 5. Generate composite PNG (using Cloudinary's multi-layer API or node-canvas)
const compositeUrl = await generateSheetComposite(sheet.id, items, config)
await sql`
  UPDATE print_sheets SET sheet_url = ${compositeUrl}, status = 'generated', generated_at = NOW()
  WHERE id = ${sheet.id}`
```

### Sheet composite generation

```typescript
// Option A: Cloudinary multi-layer transformation (no node-canvas needed)
// Construct a Cloudinary URL that overlays each polaroid at its (x,y) position
// https://cloudinary.com/documentation/layers

// Option B: node-canvas (simpler, more control)
// npm install canvas
import { createCanvas, loadImage } from 'canvas'

async function generateSheetComposite(sheetId: string, items: SheetItem[], config: SheetConfig) {
  const DPI_MULTIPLIER = 4 // 300 DPI equivalent
  const canvas = createCanvas(
    config.paper_width_mm * DPI_MULTIPLIER,
    config.paper_height_mm * DPI_MULTIPLIER
  )
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = '#FFFFFF'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  for (const item of items) {
    const img = await loadImage(item.design_snapshot_url)
    const x = (config.margin_mm + item.col * (config.item_width_mm + config.gap_mm)) * DPI_MULTIPLIER
    const y = (config.margin_mm + item.row * (config.item_height_mm + config.gap_mm)) * DPI_MULTIPLIER
    const w = config.item_width_mm * DPI_MULTIPLIER
    const h = config.item_height_mm * DPI_MULTIPLIER
    ctx.drawImage(img, x, y, w, h)
  }

  const buffer = canvas.toBuffer('image/png')
  const result = await cloudinary.uploader.upload_stream(
    { folder: 'polamuse/print-sheets', public_id: `sheet-${sheetId}` },
    (err, res) => res?.secure_url
  )
  return result
}
```

## A09 — Download Print Sheet

```
GET /api/admin/print-sheets/:id/download
Returns: redirect to sheet_url (Cloudinary URL)
```

## A10 — Mark Sheet Sent to Shop

```
PUT /api/admin/print-sheets/:id/sent
Body: { printShopName, sentAt, costPaise, notes? }
```

```typescript
await sql`BEGIN`
await sql`UPDATE print_sheets SET status = 'sent', sent_to_shop_at = ${sentAt}, print_shop_name = ${shopName} WHERE id = ${sheetId}`
await sql`INSERT INTO print_queue_notes (print_sheet_id, admin_user_id, note, print_shop_name, cost_paise, sent_at) VALUES (...)`
await sql`COMMIT`
```

## A11 — Mark Sheet Printed

```
PUT /api/admin/print-sheets/:id/printed
```

```typescript
// Update sheet + all items on this sheet
await sql`BEGIN`
await sql`UPDATE print_sheets SET status = 'printed', printed_at = NOW() WHERE id = ${sheetId}`
await sql`UPDATE order_items SET print_status = 'printed' WHERE print_sheet_id = ${sheetId}`
// Update parent orders to 'printing' if all their items are printed
await sql`
  UPDATE orders SET status = 'printing'
  WHERE id IN (
    SELECT DISTINCT order_id FROM order_items WHERE print_sheet_id = ${sheetId}
  )`
await sql`COMMIT`
```

---

---

# PHASE 9 — ADMIN: USER MANAGEMENT

## A12 — Users List

```
GET /api/admin/users
Query: search?, banned?, page?, limit?
Returns: rows from v_admin_users view
```

## A13 — User Detail

```
GET /api/admin/users/:id
Returns: profile + orders (last 10) + designs (last 10 thumbnails) + stats
```

```typescript
const [profile] = await sql`SELECT * FROM v_admin_users WHERE id = ${userId}`
const orders    = await sql`SELECT * FROM v_admin_orders WHERE customer_id = ${userId} ORDER BY created_at DESC LIMIT 10`
const designs   = await sql`SELECT id, title, thumbnail_url, status, created_at FROM designs WHERE user_id = ${userId} AND deleted_at IS NULL ORDER BY created_at DESC LIMIT 10`
```

## A14 — Ban / Unban User

```
PUT /api/admin/users/:id/ban    Body: { reason }
PUT /api/admin/users/:id/unban
```

```typescript
// Ban
await sql`UPDATE users SET is_banned = true, ban_reason = ${reason}, banned_at = NOW(), banned_by = ${adminId} WHERE id = ${userId}`
// Delete all active sessions (force logout)
await sql`DELETE FROM user_sessions WHERE user_id = ${userId}`
// Log
await sql`INSERT INTO admin_activity_logs (admin_user_id, action, entity_type, entity_id, new_value) VALUES (${adminId}, 'user.banned', 'user', ${userId}, ${JSON.stringify({ reason })})`
```

## A15 — View User's Designs

Covered by A13 — designs are returned in the user detail endpoint.

---

---

# PHASE 10 — ADMIN: ANALYTICS

## A16 — Revenue Dashboard

```
GET /api/admin/analytics/revenue?period=daily|weekly|monthly
Returns: rows from v_daily_revenue view, aggregated as needed
```

```typescript
// Daily: SELECT * FROM v_daily_revenue LIMIT 30
// Weekly: GROUP BY date_trunc('week', day)
// Monthly: GROUP BY date_trunc('month', day)
```

## A17 — Orders by Status

```
GET /api/admin/analytics/orders
Returns: { status, count, total_paise } for each status
```

```typescript
await sql`
  SELECT status, COUNT(*) as count, SUM(total_paise) as total_paise
  FROM orders
  WHERE confirmed_at IS NOT NULL
  GROUP BY status`
```

## A18 — Template Analytics

```
GET /api/admin/analytics/templates
Returns: rows from v_template_analytics view
```

## A19 — Design Funnel

```
GET /api/admin/analytics/funnel
Returns: { total_created, total_exported, total_ordered, export_rate, order_rate }
```

```typescript
const [funnel] = await sql`
  SELECT
    COUNT(*)                                                AS total_created,
    COUNT(*) FILTER (WHERE status IN ('exported','ordered')) AS total_exported,
    COUNT(*) FILTER (WHERE status = 'ordered')               AS total_ordered,
    ROUND(COUNT(*) FILTER (WHERE status IN ('exported','ordered'))::NUMERIC / NULLIF(COUNT(*),0) * 100, 1) AS export_rate,
    ROUND(COUNT(*) FILTER (WHERE status = 'ordered')::NUMERIC / NULLIF(COUNT(*),0) * 100, 1) AS order_rate
  FROM designs WHERE deleted_at IS NULL`
```

---

---

# PHASE 11 — ADMIN: COUPONS

## A20 — Create Coupon

```
POST /api/admin/coupons
Body: { code, type, value, minOrderPaise, maxDiscountPaise?, totalUsageLimit?, perUserLimit, validFrom, validUntil?, description }
```

```typescript
// Validate: code must be uppercase, alphanumeric
const code = body.code.toUpperCase().replace(/[^A-Z0-9]/g, '')
const [existing] = await sql`SELECT id FROM coupons WHERE code = ${code}`
if (existing) return 409

await sql`
  INSERT INTO coupons (code, type, value, min_order_paise, max_discount_paise,
    total_usage_limit, per_user_limit, valid_from, valid_until, description, created_by)
  VALUES (${code}, ${type}, ${value}, ${minOrder}, ${maxDiscount},
    ${usageLimit}, ${perUserLimit}, ${validFrom}, ${validUntil}, ${description}, ${adminId})`
```

## A21 — Coupon List

```
GET /api/admin/coupons
Returns: all coupons with usage_count, is_active, valid status
```

```typescript
await sql`
  SELECT *, 
    CASE WHEN valid_until < NOW() THEN 'expired'
         WHEN NOT is_active THEN 'disabled'
         ELSE 'active' END AS current_status
  FROM coupons ORDER BY created_at DESC`
```

## A22 — Coupon Usage Log

```
GET /api/admin/coupons/:id/usages
Returns: { order_number, customer_email, discount_applied_paise, used_at }
```

---

---

# PHASE 12 — ADMIN: SETTINGS & ANNOUNCEMENTS

## A23 — Site Settings

```
GET /api/admin/settings
Returns: all rows from site_settings

PUT /api/admin/settings/:key
Body: { value }
```

```typescript
// Read a setting anywhere in the app
export async function getSetting(key: string) {
  const [row] = await sql`SELECT value FROM site_settings WHERE key = ${key}`
  return row?.value
}
// Example: check if orders are paused
const acceptingOrders = await getSetting('order_acceptance_active') // true/false
```

## A24 — Announcements / Banners

```
GET  /api/admin/announcements       ← list all
POST /api/admin/announcements       ← create
PUT  /api/admin/announcements/:id   ← update/toggle is_active
DELETE /api/admin/announcements/:id ← remove
```

```typescript
// Public route for the site to fetch active banners
GET /api/announcements  (no auth)
→ SELECT * FROM admin_announcements
  WHERE is_active = true
    AND (starts_at IS NULL OR starts_at <= NOW())
    AND (ends_at IS NULL OR ends_at >= NOW())
    AND target IN ('all', {loggedIn ? 'logged_in' : 'all'})
```

---

---

# EMAIL TEMPLATES (Resend + React Email)

## Files

```
src/components/emails/
├── OrderConfirmed.tsx    ← order number, items, estimated delivery
├── OrderShipped.tsx      ← tracking number + link, carrier
├── OrderDelivered.tsx    ← "Your Polamuse arrived" + reorder link
└── PasswordReset.tsx     ← reset link (expires 15 min)
```

## Send helper

```typescript
// src/lib/resend.ts
import { Resend } from 'resend'
const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendEmail({ to, subject, react }: {
  to: string, subject: string, react: React.ReactElement
}) {
  await resend.emails.send({
    from: `PolaMuse <${process.env.FROM_EMAIL}>`,
    to, subject,
    react,
  })
}

// Usage
await sendEmail({
  to: customer.email,
  subject: `Your order ${order.order_number} is confirmed 🎉`,
  react: <OrderConfirmed order={order} />,
})
```

---

---

# SHARED UTILITIES

## src/lib/jwt.ts

```typescript
import jwt from 'jsonwebtoken'
export interface JWTPayload { userId: string; email: string; role: 'customer' | 'admin' }
export const signAccessToken  = (p: JWTPayload) => jwt.sign(p, process.env.JWT_ACCESS_SECRET!, { expiresIn: '1h' })
export const signRefreshToken = (userId: string, sessionId: string) =>
  jwt.sign({ userId, sessionId }, process.env.JWT_REFRESH_SECRET!, { expiresIn: '7d' })
export const verifyAccessToken  = (t: string) => jwt.verify(t, process.env.JWT_ACCESS_SECRET!) as JWTPayload
export const verifyRefreshToken = (t: string) => jwt.verify(t, process.env.JWT_REFRESH_SECRET!) as { userId: string; sessionId: string }
```

## src/lib/db.ts

```typescript
import { neon, neonConfig } from '@neondatabase/serverless'
neonConfig.fetchConnectionCache = true
if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL not set')
export const sql = neon(process.env.DATABASE_URL)
export async function withTransaction<T>(fn: (sql: typeof sql) => Promise<T>): Promise<T> {
  await sql`BEGIN`
  try { const r = await fn(sql); await sql`COMMIT`; return r }
  catch (e) { await sql`ROLLBACK`; throw e }
}
```

## Error response helper

```typescript
// src/lib/api.ts
export const ok   = (data: unknown, status = 200) => Response.json(data, { status })
export const err  = (message: string, status = 400) => Response.json({ error: message }, { status })
export const userId = (req: Request) => req.headers.get('x-user-id')!
export const userRole = (req: Request) => req.headers.get('x-user-role')!
```

---

---

# COMPLETE FILE STRUCTURE

```
polamuse/
├── src/
│   ├── app/
│   │   ├── (public)/
│   │   │   ├── page.tsx                       ← landing page
│   │   │   ├── login/page.tsx
│   │   │   └── signup/page.tsx
│   │   ├── (protected)/
│   │   │   ├── editor/page.tsx                ← fabric.js editor
│   │   │   ├── editor/[id]/page.tsx
│   │   │   ├── order/page.tsx
│   │   │   ├── order/[id]/page.tsx
│   │   │   └── account/page.tsx
│   │   ├── admin/
│   │   │   ├── page.tsx                       ← admin dashboard
│   │   │   ├── orders/page.tsx
│   │   │   ├── orders/[id]/page.tsx
│   │   │   ├── print-queue/page.tsx
│   │   │   ├── print-sheets/page.tsx
│   │   │   ├── users/page.tsx
│   │   │   ├── users/[id]/page.tsx
│   │   │   ├── analytics/page.tsx
│   │   │   ├── coupons/page.tsx
│   │   │   └── settings/page.tsx
│   │   └── api/
│   │       ├── auth/
│   │       │   ├── signup/route.ts
│   │       │   ├── login/route.ts
│   │       │   ├── logout/route.ts
│   │       │   ├── refresh/route.ts
│   │       │   ├── me/route.ts
│   │       │   ├── google/route.ts
│   │       │   ├── google/callback/route.ts
│   │       │   ├── forgot-password/route.ts
│   │       │   └── reset-password/route.ts
│   │       ├── uploads/sign/route.ts
│   │       ├── templates/route.ts
│   │       ├── designs/
│   │       │   ├── route.ts
│   │       │   └── [id]/
│   │       │       ├── route.ts
│   │       │       └── export/route.ts
│   │       ├── orders/
│   │       │   ├── route.ts
│   │       │   ├── validate-coupon/route.ts
│   │       │   └── [id]/
│   │       │       ├── route.ts
│   │       │       └── payment/route.ts
│   │       ├── payments/
│   │       │   ├── verify/route.ts
│   │       │   └── webhook/route.ts
│   │       ├── account/
│   │       │   ├── profile/route.ts
│   │       │   └── addresses/
│   │       │       ├── route.ts
│   │       │       └── [id]/route.ts
│   │       ├── announcements/route.ts
│   │       └── admin/
│   │           ├── orders/
│   │           │   ├── route.ts
│   │           │   └── [id]/
│   │           │       ├── route.ts
│   │           │       ├── status/route.ts
│   │           │       ├── ship/route.ts
│   │           │       └── notes/route.ts
│   │           ├── print-queue/route.ts
│   │           ├── print-sheets/
│   │           │   ├── route.ts
│   │           │   ├── generate/route.ts
│   │           │   └── [id]/
│   │           │       ├── download/route.ts
│   │           │       ├── sent/route.ts
│   │           │       └── printed/route.ts
│   │           ├── users/
│   │           │   ├── route.ts
│   │           │   └── [id]/
│   │           │       ├── route.ts
│   │           │       ├── ban/route.ts
│   │           │       └── unban/route.ts
│   │           ├── analytics/
│   │           │   ├── revenue/route.ts
│   │           │   ├── orders/route.ts
│   │           │   ├── templates/route.ts
│   │           │   └── funnel/route.ts
│   │           ├── coupons/
│   │           │   ├── route.ts
│   │           │   └── [id]/
│   │           │       ├── route.ts
│   │           │       └── usages/route.ts
│   │           ├── settings/route.ts
│   │           └── announcements/
│   │               ├── route.ts
│   │               └── [id]/route.ts
│   ├── components/
│   │   ├── canvas/
│   │   │   ├── PolaroidCanvas.tsx
│   │   │   ├── CanvasManager.tsx
│   │   │   └── ExportEngine.ts
│   │   ├── controls/
│   │   │   ├── FrameControls.tsx
│   │   │   ├── TextControls.tsx
│   │   │   ├── EditingControls.tsx
│   │   │   ├── FilterPresets.tsx
│   │   │   ├── StickerPanel.tsx
│   │   │   ├── MusicControl.tsx
│   │   │   └── TimestampControl.tsx
│   │   ├── layouts/
│   │   │   ├── SingleLayout.tsx
│   │   │   ├── FilmStripLayout.tsx
│   │   │   ├── GridLayout.tsx
│   │   │   └── ScrapbookLayout.tsx
│   │   ├── emails/
│   │   │   ├── OrderConfirmed.tsx
│   │   │   ├── OrderShipped.tsx
│   │   │   ├── OrderDelivered.tsx
│   │   │   └── PasswordReset.tsx
│   │   └── ui/
│   │       ├── Sidebar.tsx
│   │       ├── SliderInput.tsx
│   │       └── ColorPicker.tsx
│   ├── lib/
│   │   ├── db.ts
│   │   ├── jwt.ts
│   │   ├── api.ts
│   │   ├── cloudinary.ts
│   │   ├── razorpay.ts
│   │   ├── resend.ts
│   │   ├── filters.ts
│   │   ├── fonts.ts
│   │   ├── textures.ts
│   │   └── validations.ts
│   └── store/
│       ├── useFrameStore.ts
│       ├── useLayoutStore.ts
│       └── useAppStore.ts
├── middleware.ts
├── .env.local
└── package.json
```

---

*End of Polamuse Backend Implementation Plan — v1.0*  
*56 features · 12 phases · 34–44 days (solo)*