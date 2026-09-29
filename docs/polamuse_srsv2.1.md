# Polamuse — Software Requirements Specification
> Version 2.1 · Full Product Vision · Emotion-first photo memory platform
> Stack: Next.js 14 · Neon PostgreSQL · Cloudinary · Razorpay · Resend · PWA
> Monetization: 4-layer combination model · No subscriptions · Charge at emotional peak

---

## Table of Contents

1. [Product Vision](#1-product-vision)
2. [Target Users & Personas](#2-target-users--personas)
3. [Complete Feature List](#3-complete-feature-list)
4. [User Flows](#4-user-flows)
5. [Tech Stack — Full Decision](#5-tech-stack--full-decision)
6. [Current Code — What to Fix](#6-current-code--what-to-fix)
7. [PWA Setup](#7-pwa-setup)
8. [New Backend — APIs & DB](#8-new-backend--apis--db)
9. [Monetization Model](#9-monetization-model)
10. [Build Phases](#10-build-phases)

---

---

# 1. Product Vision

## What Polamuse Is

Polamuse is a **mobile-first emotional photo memory platform** for people who want to
turn digital photos into something that feels physical, personal, and giftable —
without needing a printer, a photobooth machine, or any hardware.

The core insight: **emotion is the purchase trigger, the polaroid is the vehicle.**

## What Polamuse Is NOT

- Not a generic photo editor (not competing with Canva or VSCO)
- Not a professional photography tool
- Not a hardware photobooth business
- Not a mass-scale print service (not competing with Zoomin)

## The Emotional Core

Every feature must answer one of these three questions:

```
1. Can I make something beautiful with my photos right now?
2. Can I share this with someone I care about?
3. Can I send this to someone who isn't here with me?
```

If a feature doesn't answer one of these, it doesn't belong.

## One-Line Pitch

> "Polamuse turns your phone camera into a polaroid — design it, share it, send it."

---

---

# 2. Target Users & Personas

## Persona 1 — Rhea, 21, Engineering student, Nagpur

- In a long distance relationship. Boyfriend moved to Bangalore for job.
- Posts aesthetic content on Instagram. Uses Huji, VSCO, Grainy Cam.
- Pain: WhatsApp photos feel cheap. Wants to give him something physical.
- Will pay: ₹9 for watermark removal without thinking. ₹149 for a gift print on his birthday.
- Won't pay: monthly subscription — commitment anxiety even at low price.
- Discovers Polamuse: Instagram reel by a couple creator she follows.

## Persona 2 — Arjun, 24, Working professional, Pune

- Best friends from college scattered across India after graduation.
- Wants to create something for their friend's birthday that's not just a WhatsApp forward.
- Pain: everything online looks generic and templated.
- Will pay: ₹149-299 one time for a birthday gift print.
- Discovers Polamuse: friend shares a designed polaroid on Instagram story.

## Persona 3 — Meera, 19, College student, Delhi

- Goes to fests, farewell parties, friend trips.
- Wants the photobooth aesthetic without finding an actual photobooth.
- Pain: phone camera is great but Instagram posts look like everyone else's.
- Will pay: ₹29 coin pack to unlock unlimited booth mode right now at the party.
- Won't pay: ₹49/month subscription decided in advance before she knows if she likes it.
- Discovers Polamuse: friend uses booth mode at a farewell party, posts the strip.

## Persona 4 — Vikram, 28, NRI, Dubai

- Wants to send something physical to his parents/girlfriend in India.
- Pain: international shipping from abroad is expensive and complicated.
- Will pay: ₹299-499 for a curated gift box shipped anywhere in India.
- Discovers Polamuse: Google search "send photo gift to India."

---

---

# 3. Complete Feature List

## MODULE 1 — Core Editor (existing, needs mobile fixes)

| ID | Feature | Priority | Type |
|----|---------|----------|------|
| E01 | Photo upload from camera roll | P0 | Client |
| E02 | Live camera capture (mobile) | P0 | Client |
| E03 | 9 polaroid frame templates | P0 | Client |
| E04 | Frame customisation (color, border, texture) | P0 | Client |
| E05 | Top label + bottom caption text | P0 | Client |
| E06 | Font presets (5 options) | P1 | Client |
| E07 | Filter sliders (brightness, contrast, saturation, warmth) | P0 | Client |
| E08 | One-tap filter presets (vintage, film, sepia, B&W, faded) | P0 | Client |
| E09 | Stickers panel (built-in + custom upload) | P1 | Client |
| E10 | Spotify scan code | P1 | Client |
| E11 | Timestamp (auto date, format toggle) | P1 | Client |
| E12 | Drag / zoom / rotate photo inside frame | P0 | Client |
| E13 | Frame texture overlays (grain, wood, matte) | P2 | Client |
| E14 | Guest auto-save to localStorage | P0 | Client |
| E15 | Free PNG export (2x, no login needed) | P0 | Client |
| E16 | Touch events for mobile (pinch zoom, drag) | P0 | Client — MISSING |

## MODULE 2 — Booth Mode (NEW)

| ID | Feature | Priority | Type |
|----|---------|----------|------|
| B01 | Open phone camera via getUserMedia() | P0 | Client |
| B02 | Front / back camera toggle | P0 | Client |
| B03 | Auto 4-shot sequence with countdown (3-2-1) | P0 | Client |
| B04 | Instant film strip arrangement after 4 shots | P0 | Client |
| B05 | Manual single shot mode | P1 | Client |
| B06 | Location + date auto-stamp | P1 | Client |
| B07 | Friend mode: 2 people take shots alternately | P2 | Both |
| B08 | Download film strip (watermarked for free users) | P0 | Client |
| B09 | Share directly to Instagram Stories / WhatsApp | P0 | Client |
| B10 | Order physical film strip print | P1 | Server |

## MODULE 3 — Shared Canvas (NEW — core emotional feature)

| ID | Feature | Priority | Type |
|----|---------|----------|------|
| S01 | Create a shared session (generate session link) | P0 | Server |
| S02 | Share link via WhatsApp / Instagram DM | P0 | Client |
| S03 | Person B opens link on their phone, no login needed | P0 | Client |
| S04 | Both people see the same canvas, live sync | P0 | Both |
| S05 | Person A adds their photo, Person B adds theirs | P0 | Client |
| S06 | Both can add captions, stickers | P1 | Client |
| S07 | Final design shows both contributions | P0 | Client |
| S08 | Either person can download or order print | P0 | Both |
| S09 | Session expires in 48 hours (cleans up DB) | P1 | Server |
| S10 | Named slots: "From: [name]" visible on canvas | P1 | Client |

## MODULE 4 — Send a Memory / Gift Mode (NEW)

| ID | Feature | Priority | Type |
|----|---------|----------|------|
| G01 | "Send to someone" flow (separate from personal order) | P0 | Both |
| G02 | Enter recipient's shipping address | P0 | Server |
| G03 | Write a private gift note (printed on card inside) | P0 | Server |
| G04 | Choose delivery date (standard / express) | P1 | Server |
| G05 | Sender pays, recipient receives surprise | P0 | Server |
| G06 | Email notification to recipient: "Someone sent you a memory" | P0 | Server |
| G07 | Recipient tracking page (no login needed, just order token) | P1 | Server |
| G08 | Anonymous send option (don't reveal sender until delivery) | P2 | Server |

## MODULE 5 — Monetization Layer (NEW)

### 5A — Watermark Flip

| ID | Feature | Priority | Type |
|----|---------|----------|------|
| W01 | Watermark on all free PNG exports ("polamuse.com" bottom-right) | P0 | Client |
| W02 | "Remove watermark" modal at download moment | P0 | Client |
| W03 | ₹9 one-time Razorpay payment (no login required) | P0 | Both |
| W04 | design_unlocks table — persist payment per design | P0 | Server |
| W05 | Clean export (no watermark) delivered instantly after payment | P0 | Both |
| W06 | Watermark acts as organic marketing on Instagram posts | P0 | — |

### 5B — Pola Coins

| ID | Feature | Priority | Type |
|----|---------|----------|------|
| C01 | Coin packs: 50→₹29, 120→₹59 (popular), 300→₹99 | P0 | Both |
| C02 | coin_ledger table (append-only, balance = SUM of delta) | P0 | Server |
| C03 | Free coins on: signup (+20), first design (+10), first order (+15) | P0 | Server |
| C04 | Spend coins: watermark remove (10), booth session (8), shared canvas (12) | P0 | Both |
| C05 | Spend coins: cloud save (3/design), premium template (15) | P1 | Both |
| C06 | Coin balance visible in header (updates real-time) | P0 | Client |
| C07 | Refer a friend → +25 coins when they sign up | P1 | Server |
| C08 | Coin history page (what you earned, what you spent) | P2 | Both |

### 5C — Occasion Add-ons (at print checkout)

| ID | Feature | Priority | Type |
|----|---------|----------|------|
| AO1 | Gift wrap + ribbon add-on (+₹25) | P0 | Both |
| AO2 | Handwritten note card add-on (+₹20) | P0 | Both |
| AO3 | Wooden polaroid magnet add-on (+₹49) | P1 | Both |
| AO4 | Extra copy add-on (+₹59 — one for you, one for them) | P1 | Both |
| AO5 | Add-ons shown in order summary after user confirms base order | P0 | Client |
| AO6 | Add-on selection saved to order_addons table | P0 | Server |

### 5D — Occasion Targeting

| ID | Feature | Priority | Type |
|----|---------|----------|------|
| OT1 | Ask user for partner / best friend birthday at signup (optional) | P0 | Both |
| OT2 | Store occasion dates in user_occasions table | P0 | Server |
| OT3 | Push notification 3 days before occasion | P1 | Server |
| OT4 | Email 3 days before: "X's birthday is Friday — send a memory?" | P0 | Server |
| OT5 | Deep link in notification → opens editor with their last shared design | P1 | Both |
| OT6 | Vercel cron job runs daily to check upcoming occasions | P0 | Server |

## MODULE 6 — Batch Layouts (existing)

| ID | Feature | Priority | Type |
|----|---------|----------|------|
| L01 | Film strip (3-4 frames horizontal) | P0 | Client |
| L02 | Grid layout (2x2, 3x3) | P0 | Client |
| L03 | Scrapbook freeform (drag overlap rotate) | P1 | Client |

## MODULE 7 — Design Cloud (existing)

| ID | Feature | Priority | Type |
|----|---------|----------|------|
| D01 | Save design to cloud (POST /api/designs) | P0 | Server |
| D02 | View saved designs gallery | P0 | Server |
| D03 | Edit saved design | P0 | Both |
| D04 | Delete design | P1 | Server |

## MODULE 8 — Orders & Payments (existing)

| ID | Feature | Priority | Type |
|----|---------|----------|------|
| O01 | Order page (single / pack) | P0 | Both |
| O02 | Apply coupon code | P1 | Server |
| O03 | Save + select shipping address | P0 | Server |
| O04 | Razorpay checkout | P0 | Both |
| O05 | Order history | P0 | Server |
| O06 | Order tracking | P0 | Server |

## MODULE 9 — Admin (existing, backend needed)

| ID | Feature | Priority | Type |
|----|---------|----------|------|
| A01 | Orders dashboard + management | P0 | Server |
| A02 | Update order status + add tracking | P0 | Server |
| A03 | Print queue view | P0 | Server |
| A04 | Generate print sheet (A4 bin-pack) | P0 | Server |
| A05 | Download + mark printed | P0 | Server |
| A06 | Users list + detail + ban/unban | P1 | Server |
| A07 | Analytics (revenue, funnel, templates) | P1 | Server |
| A08 | Coupons CRUD | P1 | Server |
| A09 | Site settings + announcements | P2 | Server |

## MODULE 10 — Auth (existing)

| ID | Feature | Priority | Type |
|----|---------|----------|------|
| AU1 | Email + password signup / login | P0 | Server |
| AU2 | Google OAuth | P0 | Server |
| AU3 | Forgot / reset password | P0 | Server |
| AU4 | JWT access + refresh token (httpOnly cookies) | P0 | Server |

---

---

# 4. User Flows

## Flow 1 — First Time User (No Account)

```
Opens polamuse.com on phone
        ↓
Landing page loads (< 2 seconds)
        ↓
Taps "Try it free" 
        ↓
Editor opens — no login gate
        ↓
Uploads photo from camera roll OR taps camera icon → Booth Mode
        ↓
Picks template → customises frame → adds caption
        ↓
"Download free" → downloads watermarked PNG → user leaves happy
        ↓
  OR
"Order prints" → login gate appears
        ↓
Signs up (Google one-tap, 10 seconds)
        ↓
Design auto-restored from localStorage → no work lost
        ↓
Picks size + finish → enters address → pays
        ↓
Confirmation email → order confirmed
```

## Flow 2 — Shared Canvas (Long Distance Couple)

```
Rhea opens Polamuse on her phone in Nagpur
        ↓
Taps "Make together" (new CTA on home/editor)
        ↓
Session created → unique link generated
        ↓
Rhea adds her photo from her camera roll
        ↓
Shares link via WhatsApp to her boyfriend in Bangalore
        ↓
Boyfriend opens link on his phone (no app download, opens in Chrome)
        ↓
He sees Rhea's photo on the canvas + his empty slot
        ↓
Taps his slot → adds his photo from his camera roll
        ↓
Both are now looking at the same polaroid with both their photos
        ↓
He adds a caption from his side
        ↓
Rhea sees it update on her screen (near real-time, 3 second polling)
        ↓
"Looks good" → Rhea taps "Order print" → ships to her address
        ↓
Or: downloads and posts to Instagram Stories together
```

## Flow 3 — Booth Mode at a Farewell Party

```
Friend group at their college farewell
        ↓
Someone opens polamuse.com on their phone
        ↓
Taps "Booth Mode"
        ↓
Camera opens in full screen with front camera
        ↓
Holds phone up → taps capture
        ↓
3... 2... 1... flash → snap
2 seconds → 3... 2... 1... snap
2 seconds → 3... 2... 1... snap
2 seconds → 3... 2... 1... snap
        ↓
4 shots done → instantly arranges into film strip
        ↓
"Save + Share" → Instagram Stories
        ↓
Others see it → "omg where did you make this?"
        ↓
Link shared → 6 more people use it in the next 10 minutes
        ↓
2 of them sign up → 1 orders a print
        ↓
This is your distribution mechanism
```

## Flow 4 — Send a Memory Gift

```
Arjun in Pune wants to do something special for his friend's birthday in Delhi
        ↓
Opens Polamuse → Editor
        ↓
Uploads a photo of them together → designs it with a caption
        ↓
Taps "Send as a gift" (instead of "Order for myself")
        ↓
Enters friend's address (not his own)
        ↓
Writes a private message: "Happy birthday yaar, miss you"
        ↓
Message will be printed on a small card inside the packaging
        ↓
Picks delivery date (friend's birthday)
        ↓
Pays ₹149 (print + gift note + packaging)
        ↓
Arjun gets "Sent!" confirmation
        ↓
Friend receives package on birthday → sees polaroid + handwritten note
        ↓
Posts it on Instagram story → tags Arjun → "he sent this from Pune 🥹"
        ↓
Arjun gets tagged → reposts → their mutual friends see it
        ↓
3 of those friends open Polamuse
```

## Flow 5 — Coin Purchase + Watermark Removal

```
Meera finishes her farewell polaroid design
        ↓
Taps "Download"
        ↓
Modal appears:
  "Download free → has watermark"
  "Remove watermark → ₹9"
        ↓
She sees the watermark on preview — spent 20 mins on this
        ↓
Taps "Remove watermark → ₹9"
        ↓
Razorpay UPI sheet opens
        ↓
8 seconds → payment confirmed
        ↓
Clean PNG downloaded instantly — no watermark
        ↓
She posts it on Instagram → 400 followers see it
        ↓
---

Next visit: wants to use Booth Mode for another farewell
        ↓
"You have 0 coins — Booth session costs 8 coins"
        ↓
Sees coin packs:  50 → ₹29 / 120 → ₹59 / 300 → ₹99
        ↓
Buys ₹29 Starter pack (impulse — less than lunch)
        ↓
Spends 8 coins → Booth Mode opens
        ↓
Has 42 coins left → uses them over next 2 weeks
        ↓
Runs out → buys Popular pack (₹59) this time — "better value"
        ↓
This is your retention loop. No subscription needed.
```

## Flow 6 — Occasion Targeting (automated revenue)

```
Rhea signs up → editor asks:
"When is your partner's birthday? (optional)"
        ↓
She enters: 14th March
        ↓
Stored in user_occasions table
        ↓
11th March, 9am — Vercel cron runs daily check
        ↓
Finds: Rhea has occasion in 3 days
        ↓
Email sent:
"Karan's birthday is on Friday 🎂
 You made a polaroid together last month.
 Send it to him? Delivered by Thursday. ₹149 →"
        ↓
Rhea taps the link — editor opens with last shared design pre-loaded
        ↓
She orders gift send → ₹149 → paid in 2 minutes
        ↓
You earned ₹62 net. She spent nothing she wasn't already going to spend.
You just showed up at the exact right moment.
```

---

---

# 5. Tech Stack — Full Decision

## Core Stack (keep what you have)

```
Framework:     Next.js 14 App Router         ← full stack, one repo
Database:      Neon PostgreSQL               ← free tier, branching
Auth:          Custom JWT (bcryptjs)         ← full control
DB queries:    Raw SQL (@neondatabase/serverless)
Images:        Cloudinary                   ← signed uploads
Payments:      Razorpay                     ← India-first, subscriptions API
Email:         Resend + React Email         ← transactional
Canvas:        fabric.js                    ← editor
State:         Zustand                      ← global state
Hosting:       Vercel                       ← zero config
```

## New additions for new features

```
Real-time sync:    Server-Sent Events (SSE) or polling every 3s
                   (for shared canvas — no need for WebSocket complexity)
                   Built into Next.js Route Handlers natively

Camera API:        navigator.mediaDevices.getUserMedia()
                   Native browser API — no package needed
                   Works on Chrome Android perfectly

PWA:               next-pwa package (wraps service worker)
                   manifest.json
                   One day of work

Subscriptions:     Razorpay Subscriptions API
                   Already in your Razorpay account — just enable it

Push Notifs:       web-push package
                   For monthly prompt reminders
                   Works on Android Chrome without app store

Animation:         Framer Motion
                   For countdown flash, photo strip reveal animation
                   npm install framer-motion
```

## What NOT to add

```
❌ WebSocket / Socket.io    → overkill for shared canvas, SSE is enough
❌ Redis                    → overkill, Neon handles it
❌ Separate Express server  → Next.js API routes are enough
❌ React Native / Expo      → you're a web dev, stay web
❌ GraphQL                  → raw SQL is already perfect for your scale
❌ Docker                   → Vercel handles deployment
```

## Mobile camera — exact implementation

```typescript
// No package needed — pure browser API
// src/hooks/useCamera.ts

export function useCamera() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [facing, setFacing] = useState<'user' | 'environment'>('user')

  const startCamera = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: facing,
        width:  { ideal: 1920 },
        height: { ideal: 1080 },
      },
      audio: false,
    })
    if (videoRef.current) videoRef.current.srcObject = stream
    return stream
  }

  const takeShot = (video: HTMLVideoElement): string => {
    const canvas = document.createElement('canvas')
    canvas.width  = video.videoWidth
    canvas.height = video.videoHeight
    canvas.getContext('2d')!.drawImage(video, 0, 0)
    return canvas.toDataURL('image/jpeg', 0.92)
  }

  const switchCamera = () => {
    setFacing(f => f === 'user' ? 'environment' : 'user')
  }

  return { videoRef, startCamera, takeShot, switchCamera }
}
```

## Shared canvas sync — SSE approach

```typescript
// Server: src/app/api/sessions/[id]/stream/route.ts
// Streams canvas state changes to all connected clients

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const sessionId = params.id
  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    async start(controller) {
      // Poll DB every 3 seconds for canvas state changes
      const interval = setInterval(async () => {
        const [session] = await sql`
          SELECT canvas_state, updated_at
          FROM shared_sessions WHERE id = ${sessionId}`
        if (session) {
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify(session)}\n\n`)
          )
        }
      }, 3000)

      req.signal.addEventListener('abort', () => {
        clearInterval(interval)
        controller.close()
      })
    }
  })

  return new Response(stream, {
    headers: {
      'Content-Type':  'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection':    'keep-alive',
    }
  })
}

// Client: useSharedSession.ts
export function useSharedSession(sessionId: string) {
  const [remoteState, setRemoteState] = useState(null)

  useEffect(() => {
    const es = new EventSource(`/api/sessions/${sessionId}/stream`)
    es.onmessage = (e) => setRemoteState(JSON.parse(e.data).canvas_state)
    return () => es.close()
  }, [sessionId])

  return remoteState
}
```

---

---

# 6. Current Code — What to Fix

## Problem 1 — fabric.js has no touch support by default (CRITICAL)

Your editor will not work on mobile right now. fabric.js needs touch events explicitly enabled.

```typescript
// src/components/canvas/PolaroidCanvas.tsx
// ADD THIS when initialising canvas

const canvas = new fabric.Canvas('polaroid-canvas', {
  width:  canvasWidth,
  height: canvasHeight,

  // ← ADD THESE THREE
  allowTouchScrolling: false,
  enableRetinaScaling: true,
  stopContextMenu:     true,
})

// Enable multi-touch gestures (pinch to zoom, two-finger rotate)
canvas.on('touch:gesture', (e) => {
  if (e.self.fingers === 2) {
    const zoom = canvas.getZoom() * e.self.scale
    canvas.zoomToPoint(new fabric.Point(e.self.x, e.self.y), zoom)
  }
})
```

## Problem 2 — Canvas size on mobile is wrong

On a 390px wide phone, your editor canvas is probably overflowing or tiny.

```typescript
// src/hooks/useCanvasSize.ts
export function useCanvasSize() {
  const [size, setSize] = useState({ width: 380, height: 480 })

  useEffect(() => {
    const calc = () => {
      // On mobile: canvas takes full width minus 32px padding
      // On desktop: fixed 420px width
      const isMobile = window.innerWidth < 768
      const width    = isMobile
        ? window.innerWidth - 32
        : 420
      const height   = width * 1.25  // classic polaroid ratio
      setSize({ width, height })
    }
    calc()
    window.addEventListener('resize', calc)
    return () => window.removeEventListener('resize', calc)
  }, [])

  return size
}
```

## Problem 3 — Image upload on mobile needs camera option

```typescript
// src/components/canvas/ImageUploader.tsx
// Current: only file picker
// Fix: add capture option for mobile

<input
  type="file"
  accept="image/*"
  capture="environment"   // ← this triggers native camera on mobile
  onChange={handleUpload}
  className="hidden"
  ref={fileRef}
/>

// Better: show two buttons on mobile
const isMobile = /iPhone|Android/i.test(navigator.userAgent)

{isMobile && (
  <button onClick={() => openBoothMode()}>
    📷 Take Photo
  </button>
)}
<button onClick={() => fileRef.current?.click()}>
  🖼️ Choose from Gallery
</button>
```

## Problem 4 — Cloudinary upload timeout on mobile

Mobile connections are slower. Your current upload might timeout.

```typescript
// src/lib/cloudinary.ts
// Add retry logic + progress indicator

export async function uploadWithRetry(
  file: File,
  onProgress?: (pct: number) => void,
  retries = 3
): Promise<string> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const { signature, timestamp, cloudName, apiKey } =
        await fetch('/api/uploads/sign', { method: 'POST' }).then(r => r.json())

      const formData = new FormData()
      formData.append('file', file)
      formData.append('signature', signature)
      formData.append('timestamp', String(timestamp))
      formData.append('api_key', apiKey)
      formData.append('folder', 'polamuse/uploads')

      // Use XMLHttpRequest for progress events
      return await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable && onProgress) {
            onProgress(Math.round((e.loaded / e.total) * 100))
          }
        }
        xhr.onload = () => {
          const res = JSON.parse(xhr.responseText)
          resolve(res.secure_url)
        }
        xhr.onerror = reject
        xhr.open('POST', `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`)
        xhr.send(formData)
      })
    } catch (err) {
      if (attempt === retries) throw err
      await new Promise(r => setTimeout(r, 1000 * attempt))  // backoff
    }
  }
  throw new Error('Upload failed after retries')
}
```

## Problem 5 — No loading states on mobile (feels broken)

Mobile users on slow connections see a blank screen. Add skeleton loaders.

```typescript
// src/components/ui/DesignCardSkeleton.tsx
export function DesignCardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="bg-stone-200 rounded-xl aspect-[3/4] w-full mb-2" />
      <div className="bg-stone-200 h-3 rounded w-3/4 mb-1" />
      <div className="bg-stone-200 h-3 rounded w-1/2" />
    </div>
  )
}
```

## Problem 6 — Font loading flicker

Your Cormorant Garamond loads async and causes layout shift.

```typescript
// src/app/layout.tsx
import { Cormorant_Garamond, DM_Sans, DM_Mono } from 'next/font/google'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  style: ['normal', 'italic'],
  display: 'swap',           // ← was missing
  preload: true,             // ← was missing
})
```

## Problem 7 — Missing error boundaries in editor

If fabric.js throws (bad image, browser quirk), the whole editor crashes.

```typescript
// src/components/canvas/EditorErrorBoundary.tsx
'use client'
import { Component, ReactNode } from 'react'

export class EditorErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false }
  static getDerivedStateFromError() { return { hasError: true } }

  render() {
    if (this.state.hasError) return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <p className="text-stone-500 text-sm">Something went wrong in the editor.</p>
        <button
          onClick={() => this.setState({ hasError: false })}
          className="px-4 py-2 bg-stone-800 text-white rounded-lg text-sm"
        >
          Try again
        </button>
      </div>
    )
    return this.props.children
  }
}
```

## Problem 8 — Performance: debounce filter sliders

Every slider move re-applies fabric.js filters. On mobile this drops to 5fps.

```typescript
// src/components/controls/EditingControls.tsx

// BAD — runs on every pixel of drag
onChange={(val) => applyFilters(val)}

// GOOD — waits 100ms after user stops dragging
import { useDebouncedCallback } from 'use-debounce'

const applyFiltersDebounced = useDebouncedCallback(applyFilters, 100)
onChange={(val) => applyFiltersDebounced(val)}
```

---

---

# 7. PWA Setup

## Install

```bash
npm install next-pwa
```

## next.config.js

```javascript
const withPWA = require('next-pwa')({
  dest:            'public',
  register:        true,
  skipWaiting:     true,
  disable:         process.env.NODE_ENV === 'development',  // off in dev
  runtimeCaching: [
    {
      // Cache Cloudinary images
      urlPattern: /^https:\/\/res\.cloudinary\.com\/.*/i,
      handler:    'CacheFirst',
      options:    {
        cacheName:        'cloudinary-images',
        expiration:       { maxEntries: 100, maxAgeSeconds: 7 * 24 * 60 * 60 },
      },
    },
    {
      // Cache API responses (templates, product types)
      urlPattern: /^\/api\/templates.*/i,
      handler:    'StaleWhileRevalidate',
      options:    { cacheName: 'api-cache' },
    },
  ],
})

module.exports = withPWA({
  // your existing next config
})
```

## public/manifest.json

```json
{
  "name": "Polamuse",
  "short_name": "Polamuse",
  "description": "Turn your photos into polaroids. Design, share, send.",
  "start_url": "/editor",
  "display": "standalone",
  "orientation": "portrait",
  "theme_color": "#1A1714",
  "background_color": "#F2EDE4",
  "categories": ["photo", "lifestyle", "social"],
  "icons": [
    { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
  ],
  "screenshots": [
    { "src": "/screenshots/editor.png", "sizes": "390x844", "type": "image/png" },
    { "src": "/screenshots/booth.png",  "sizes": "390x844", "type": "image/png" }
  ]
}
```

## src/app/layout.tsx — add PWA meta

```typescript
export const metadata = {
  manifest: '/manifest.json',
  themeColor: '#1A1714',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Polamuse',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,          // prevent user zoom in editor
    viewportFit: 'cover',    // for notch/island devices
  },
}
```

---

---

# 8. New Backend — APIs & DB

## New DB Tables

```sql
-- Shared canvas sessions
CREATE TABLE shared_sessions (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  creator_user_id   UUID REFERENCES users(id) ON DELETE SET NULL,
  canvas_state      JSONB NOT NULL DEFAULT '{}',
  slot_a_filled     BOOLEAN NOT NULL DEFAULT FALSE,
  slot_b_filled     BOOLEAN NOT NULL DEFAULT FALSE,
  slot_a_label      VARCHAR(50),
  slot_b_label      VARCHAR(50),
  participant_count INTEGER DEFAULT 1,
  status            VARCHAR(20) DEFAULT 'active'
                      CHECK (status IN ('active','completed','expired')),
  expires_at        TIMESTAMPTZ NOT NULL DEFAULT NOW() + INTERVAL '48 hours',
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_sessions_expires ON shared_sessions(expires_at);

-- Booth mode sessions (film strips)
CREATE TABLE booth_sessions (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID REFERENCES users(id) ON DELETE SET NULL,
  shots         JSONB NOT NULL,  -- array of {url, takenAt}
  strip_url     TEXT,            -- rendered film strip Cloudinary URL
  layout        VARCHAR(20) DEFAULT 'filmstrip',
  location_tag  VARCHAR(100),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Watermark unlocks (₹9 per design)
CREATE TABLE design_unlocks (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  design_id     UUID NOT NULL REFERENCES designs(id),
  user_id       UUID REFERENCES users(id),
  amount_paise  INTEGER NOT NULL DEFAULT 900,
  paid_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (design_id)
);

-- Pola Coins ledger (append-only — balance = SUM of delta)
CREATE TABLE coin_ledger (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID NOT NULL REFERENCES users(id),
  delta         INTEGER NOT NULL,    -- positive = earned, negative = spent
  reason        VARCHAR(100) NOT NULL,
  -- reason values: signup_bonus | first_design | first_order |
  --   purchase_starter | purchase_popular | purchase_best | referral |
  --   spend_watermark | spend_booth | spend_canvas | spend_template | spend_save
  reference_id  UUID,                -- design_id or order_id
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE VIEW v_coin_balance AS
SELECT user_id, COALESCE(SUM(delta), 0) AS balance
FROM coin_ledger GROUP BY user_id;

-- Order add-ons (gift wrap, note card, magnet, extra copy)
CREATE TABLE order_addons (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id      UUID NOT NULL REFERENCES orders(id),
  addon_type    VARCHAR(50) NOT NULL
                  CHECK (addon_type IN ('gift_wrap','note_card','magnet','extra_copy')),
  price_paise   INTEGER NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Occasion dates for targeted send prompts
CREATE TABLE user_occasions (
  id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id              UUID NOT NULL REFERENCES users(id),
  label                VARCHAR(100) NOT NULL,  -- "Partner birthday", "Anniversary"
  occasion_date        DATE NOT NULL,           -- year ignored, month+day used
  notify_days_before   INTEGER DEFAULT 3,
  last_notified_year   INTEGER,                 -- prevent double-notify same year
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Gift orders (send to someone else's address)
ALTER TABLE orders ADD COLUMN IF NOT EXISTS gift_recipient_email VARCHAR(255);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS gift_reveal_at TIMESTAMPTZ;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS is_anonymous_gift BOOLEAN DEFAULT FALSE;
```

## New API Routes

```
SHARED CANVAS
POST   /api/sessions                      Create new shared session
GET    /api/sessions/:id                  Get session state
PUT    /api/sessions/:id/canvas           Update canvas state (either participant)
GET    /api/sessions/:id/stream           SSE stream for live sync
DELETE /api/sessions/:id                  Close session

BOOTH MODE
POST   /api/booth/render                  Render 4 shots into film strip PNG

WATERMARK UNLOCK
POST   /api/designs/:id/unlock            ₹9 Razorpay → unlock clean download
GET    /api/designs/:id/download          Returns clean or watermarked PNG

POLA COINS
GET    /api/coins/balance                 Current balance
GET    /api/coins/history                 Ledger entries
POST   /api/coins/purchase                Buy a coin pack (Razorpay one-time)
POST   /api/coins/spend                   Spend coins on a feature (server validates)

ORDER ADD-ONS
POST   /api/orders/:id/addons             Add items after base order confirmed
GET    /api/orders/:id/addons             List add-ons for an order

GIFT ORDERS
POST   /api/orders (existing)             is_gift: true → gift send flow
GET    /api/orders/track/:token           Public tracking (no login, uses order_number)

OCCASIONS
GET    /api/occasions                     List user's saved occasions
POST   /api/occasions                     Add occasion date
PUT    /api/occasions/:id                 Edit
DELETE /api/occasions/:id                 Remove

ADMIN
GET    /api/admin/monetization/summary    Layer-by-layer revenue breakdown
GET    /api/admin/coins/ledger            All coin transactions
GET    /api/admin/unlocks                 All watermark unlock payments
```

## Shared Session — Core Logic

```typescript
// POST /api/sessions
export async function POST(req: Request) {
  const userId = req.headers.get('x-user-id')  // null if guest

  const [session] = await sql`
    INSERT INTO shared_sessions (creator_user_id, canvas_state)
    VALUES (${userId}, ${JSON.stringify({})})
    RETURNING id, expires_at`

  const shareUrl = `${process.env.NEXT_PUBLIC_APP_URL}/editor/shared/${session.id}`

  return NextResponse.json({ sessionId: session.id, shareUrl })
}

// PUT /api/sessions/:id/canvas
// Called every time canvas state changes (debounced 500ms on client)
export async function PUT(req: Request, { params }: any) {
  const { canvasState, slot } = await req.json()  // slot: 'a' | 'b'

  await sql`
    UPDATE shared_sessions
    SET
      canvas_state = ${JSON.stringify(canvasState)},
      slot_a_filled = CASE WHEN ${slot} = 'a' THEN TRUE ELSE slot_a_filled END,
      slot_b_filled = CASE WHEN ${slot} = 'b' THEN TRUE ELSE slot_b_filled END,
      updated_at = NOW()
    WHERE id = ${params.id}
      AND expires_at > NOW()`

  return NextResponse.json({ ok: true })
}
```

## Booth Mode — Film Strip Render

```typescript
// POST /api/booth/render
// Body: { shots: string[] }  — array of 4 base64 JPEGs or Cloudinary URLs
// Returns: { stripUrl }

import { createCanvas, loadImage } from 'canvas'

export async function POST(req: Request) {
  const { shots } = await req.json()  // 4 shot URLs

  // Film strip: 4 frames stacked vertically with sprocket holes effect
  const FRAME_W  = 600
  const FRAME_H  = 480
  const MARGIN   = 20
  const GAP      = 12
  const STRIP_W  = FRAME_W + MARGIN * 2
  const STRIP_H  = FRAME_H * 4 + GAP * 3 + MARGIN * 2

  const canvas = createCanvas(STRIP_W, STRIP_H)
  const ctx    = canvas.getContext('2d')

  // Black background (film look)
  ctx.fillStyle = '#0A0A0A'
  ctx.fillRect(0, 0, STRIP_W, STRIP_H)

  // Draw each shot
  for (let i = 0; i < shots.length; i++) {
    const img = await loadImage(shots[i])
    const y   = MARGIN + i * (FRAME_H + GAP)

    // White polaroid frame for each shot
    ctx.fillStyle = '#FFFFFF'
    ctx.fillRect(MARGIN - 4, y - 4, FRAME_W + 8, FRAME_H + 8)

    ctx.drawImage(img, MARGIN, y, FRAME_W, FRAME_H)
  }

  // Date stamp bottom
  const date = new Date().toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric'
  })
  ctx.fillStyle  = 'rgba(255,255,255,0.4)'
  ctx.font       = '18px monospace'
  ctx.textAlign  = 'center'
  ctx.fillText(date, STRIP_W / 2, STRIP_H - 8)

  const buffer = canvas.toBuffer('image/jpeg', { quality: 0.92 })

  // Upload to Cloudinary
  const url = await uploadToCloudinary(buffer, `booth-${Date.now()}`, 'polamuse/booth')

  return NextResponse.json({ stripUrl: url })
}
```

---

---

# 9. Monetization Model

## Core Rule

```
❌ Wrong: "Pay ₹99/month to unlock features"
✅ Right: "Pay ₹9 right now to remove this watermark"

Charge at the peak of the emotion. Never before it.
```

No subscriptions. No tiers. No commitment anxiety.
Every payment happens when the user *wants* to pay.

---

## What is always free

```
✓ Full editor (all templates, all controls)
✓ Booth mode (3 sessions/day)
✓ Shared canvas (create + join sessions)
✓ Free PNG download (watermarked)
✓ 3 free cloud saves/month
✓ 20 coins on signup (try features immediately)
```

---

## Layer 1 — Watermark Flip (₹9)

Smallest ask. Highest volume. Zero commitment.

```
Free download  → "polamuse.com" watermark bottom-right
₹9 payment     → same design, no watermark, instant delivery

Why ₹9: less than a Dairy Milk. Brain registers no decision.
Conversion: 30-45% at emotional peak (just finished designing).
```

**Dual benefit:** Non-payers distribute watermarked images
on Instagram = free organic marketing. Non-paying users
are your distribution channel.

```
Revenue at 1,000 downloads/month:
300 conversions × ₹9 = ₹2,700/month
Revenue at 10,000 downloads/month:
3,000 × ₹9 = ₹27,000/month
```

---

## Layer 2 — Pola Coins

One purchase. Spend without friction. No repeat payment pain.

```
COIN PACKS
Starter       50 coins  →  ₹29
Popular      120 coins  →  ₹59   ← highlight as "Most Popular"
Best Value   300 coins  →  ₹99

WHAT COINS BUY
Remove watermark (1 design):    10 coins
Premium template unlock:        15 coins
Custom sticker upload:           8 coins
Booth session (unlimited shots): 8 coins
Film strip without watermark:   10 coins
Shared canvas session:          12 coins
Cloud save (beyond free tier):   3 coins

FREE COINS (to trigger first spend)
Signup bonus:                  +20 coins
First design created:          +10 coins
First print ordered:           +15 coins
Refer a friend (they sign up): +25 coins
```

**Why coins work:** Decouples payment pain from spending.
₹59 paid once feels better than 6 separate ₹9 payments
even though math is worse for the user.

```
Revenue at 500 MAU:
80 coin buyers (16%) × ₹44 avg pack = ₹3,520/month
Revenue at 2,000 MAU:
320 × ₹44 = ₹14,080/month
```

---

## Layer 3 — Print Orders (₹79–₹349)

Highest revenue per transaction. User is already fully committed.

```
PRINT PRICING
Single print:          ₹79    (entry point — thin margin)
Pack of 5:            ₹349   (saves ₹46 vs singles)
Pack of 10:           ₹590   (saves ₹200 vs singles)
Pack of 20:           ₹999   (events / farewell bulk)
Gift send:            ₹149   (print + gift note + kraft packaging)
Film strip (4-shot):  ₹99    (booth mode output)

REAL MARGINS
Single print:   revenue ₹79  − cost ₹88  = −₹9   (loss leader)
Pack of 5:      revenue ₹349 − cost ₹195 = +₹154  (44% margin)
Gift send:      revenue ₹149 − cost ₹87  = +₹62   (41% margin)
```

**Key insight:** Single prints lose money on delivery.
That's fine — they are the entry point that converts users.
Upsell every single order to gift send or pack at checkout.

**Gift send upsell copy:**
```
You're ordering 1 print for ₹79.
Sending to someone else?
Add gift note + kraft packaging → ₹149 total.
We ship it as a surprise. →  [Upgrade to Gift Send]
```
Target: 40-50% of orders involving another person's address
upgrade to gift send when shown this copy.

---

## Layer 4 — Occasion Add-ons (at checkout)

Pure margin. Wallet is already open. Zero extra shipping cost.

```
ADD-ON MENU (shown after base order confirmed)
Gift wrap + ribbon:        +₹25  (cost ₹8, margin 68%)
Handwritten note card:     +₹20  (cost ₹5, margin 75%)
Wooden polaroid magnet:    +₹49  (cost ₹26, margin 47%)
Extra copy (one for you):  +₹59  (cost ₹35, margin 41%)

Target: 60% of print orders add at least one item.
Average add-on value: ₹30
```

---

## Combined Revenue at 500 MAU

```
Layer 1 — Watermark (400 downloads, 30% conv)
  120 × ₹9                              ₹1,080

Layer 2 — Coins (16% of MAU buy coins)
  80 × ₹44 avg                          ₹3,520

Layer 3 — Print orders (120 orders)
  120 × ₹149 avg                       ₹17,880

Layer 4 — Add-ons (60% of orders)
  72 × ₹30                              ₹2,160
──────────────────────────────────────────────
GROSS REVENUE                          ₹24,640

COSTS
  Printing + packaging (120 × ₹60)     -₹7,200
  Razorpay fees (~2%)                    -₹493
  Cloudinary + Neon + Vercel             -₹800
──────────────────────────────────────────────
NET PROFIT                             ₹16,147/month
```

## Growth curve

```
MAU      Gross        Net
──────────────────────────────
100      ₹4,928       ₹2,500
250      ₹12,320      ₹7,800
500      ₹24,640      ₹16,147
1,000    ₹49,280      ₹33,000
2,000    ₹98,560      ₹67,000
5,000    ₹2,46,400    ₹1,72,000
```

## The number to remember

```
You need 120 print orders/month to hit ₹16,000 net.
120 orders / 30 days = 4 orders per day.
4 orders per day is a WhatsApp group of college friends.
Start there.
```

## New DB tables for monetization

```sql
-- Design watermark unlocks
CREATE TABLE design_unlocks (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  design_id     UUID NOT NULL REFERENCES designs(id),
  user_id       UUID REFERENCES users(id),
  amount_paise  INTEGER NOT NULL DEFAULT 900,
  paid_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (design_id)
);

-- Pola Coins ledger (append-only, balance = SUM of delta)
CREATE TABLE coin_ledger (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID NOT NULL REFERENCES users(id),
  delta         INTEGER NOT NULL,   -- positive = earned, negative = spent
  reason        VARCHAR(100) NOT NULL,
  reference_id  UUID,               -- design_id, order_id etc.
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE VIEW v_coin_balance AS
SELECT user_id, COALESCE(SUM(delta), 0) AS balance
FROM coin_ledger GROUP BY user_id;

-- Order add-ons
CREATE TABLE order_addons (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id      UUID NOT NULL REFERENCES orders(id),
  addon_type    VARCHAR(50) NOT NULL,
  -- 'gift_wrap' | 'note_card' | 'magnet' | 'extra_copy'
  price_paise   INTEGER NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Occasion targeting
CREATE TABLE user_occasions (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID NOT NULL REFERENCES users(id),
  label         VARCHAR(100) NOT NULL,  -- "Partner's birthday", "Anniversary"
  occasion_date DATE NOT NULL,           -- month + day (year ignored)
  notify_days_before INTEGER DEFAULT 3,
  last_notified_at TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

## New API routes for monetization

```
WATERMARK
POST /api/designs/:id/unlock          ← ₹9 payment → unlock clean download
GET  /api/designs/:id/download        ← returns clean or watermarked based on unlock status

COINS
GET  /api/coins/balance               ← current balance
GET  /api/coins/history               ← ledger entries
POST /api/coins/purchase              ← buy a coin pack (Razorpay)
POST /api/coins/spend                 ← spend coins on a feature (server validates)

ADD-ONS
POST /api/orders/:id/addons           ← add items to existing order
GET  /api/orders/:id/addons           ← list add-ons for an order

OCCASIONS
GET  /api/occasions                   ← list user's occasions
POST /api/occasions                   ← add an occasion date
PUT  /api/occasions/:id               ← edit
DELETE /api/occasions/:id             ← remove

ADMIN
GET  /api/admin/monetization/summary  ← layer-by-layer revenue breakdown
GET  /api/admin/coins/ledger          ← all coin transactions
```

---

---

# 10. Build Phases

## Phase 1 — Fix + Stabilise (Week 1-2)

What: Fix all 8 code problems listed in Section 6.
Goal: Editor works perfectly on mobile browser.

```
- Touch events in fabric.js
- Canvas sizing on mobile
- Image upload with camera capture option
- Retry logic on Cloudinary upload
- Debounce filter sliders
- Error boundary
- Font preload
- Loading skeletons
```

## Phase 2 — PWA (Week 2)

What: Section 7 — manifest + next-pwa + meta tags.
Goal: "Add to Home Screen" works. Feels like a native app.

```
- manifest.json
- next-pwa setup
- App icons (192px + 512px)
- Offline editor (cache canvas state in SW)
```

## Phase 3 — Booth Mode (Week 3-4)

What: B01-B10.
Goal: Camera opens, 4 shots, film strip output, share to Instagram.

```
- useCamera hook (getUserMedia)
- Countdown animation (Framer Motion)
- Film strip canvas render (/api/booth/render)
- Download + Web Share API
- 3 free sessions/day gate
```

## Phase 4 — Shared Canvas (Week 5-6)

What: S01-S10.
Goal: Two people design one polaroid from different phones.

```
- shared_sessions table in DB
- POST /api/sessions (create)
- PUT /api/sessions/:id/canvas (sync)
- GET /api/sessions/:id/stream (SSE)
- /editor/shared/[id] page
- 48-hour expiry cron (Vercel cron job)
```

## Phase 5 — Send a Memory / Gift Mode (Week 7-8)

What: G01-G08.
Goal: Arjun can send a surprise to his friend in Delhi.

```
- Gift flow UI in order page
- Recipient address form
- Gift note input (printed on card)
- Delivery date picker
- Email to recipient: "Someone sent you a memory"
- Public tracking page /track/[orderNumber]
```

## Phase 6 — Watermark Flip + Coins (Week 9-10)

What: W01-W06, C01-C08.
Goal: First monetization live. Someone pays ₹9 within the first week.

```
- Watermark on free exports (fabric.js text object, removed before save)
- ₹9 remove-watermark modal (Razorpay, no login needed)
- design_unlocks table
- Clean vs watermarked export logic
- Coin packs (3 tiers, Razorpay one-time)
- coin_ledger table + v_coin_balance view
- Free coin grants on signup / first design / first order
- Spend coins on: booth session, shared canvas, cloud save
- Coin balance in header
```

## Phase 7 — Add-ons + Occasion Targeting (Week 11-12)

What: AO1-AO6, OT1-OT6.
Goal: Increase revenue per order from ₹79 to ₹109 average.

```
- Add-on menu at checkout (gift wrap, note card, magnet, extra copy)
- order_addons table
- Source packaging materials from IndiaMart (kraft paper, ribbons)
- Occasion date collection at signup (optional, skip-able)
- user_occasions table
- Vercel cron job: daily check for upcoming occasions
- Email 3 days before: occasion-triggered send prompt
- Push notification via web-push (Android Chrome)
```

## Phase 8 — Polish + Distribution (Week 13+)

What: Get first 100 paying users.

```
- Capacitor wrap (optional — only if users request Play Store app)
- Instagram creator outreach (5 couple/LDR creators, 50K-200K followers)
- Referral: "Share your polaroid" → watermark becomes Polamuse link
- SEO: "long distance relationship gift India", "polaroid print online India"
```

---

## Quick Reference: File Ownership (Team Split)

```
Aditya owns:
  src/components/canvas/      ← fabric.js editor + booth camera + watermark
  src/components/controls/    ← editor controls
  src/components/layouts/     ← film strip, grid, scrapbook
  src/app/api/payments/       ← Razorpay (prints + coin packs + watermark unlock)
  src/app/api/designs/[id]/unlock/  ← ₹9 watermark unlock route
  src/app/api/designs/[id]/download/ ← clean vs watermarked export
  src/app/api/booth/          ← film strip render
  src/app/api/sessions/       ← shared canvas + SSE
  src/app/api/admin/print-*/  ← print sheet engine
  src/lib/db.ts  jwt.ts  cloudinary.ts  razorpay.ts
  middleware.ts

Neel owns:
  src/app/api/designs/        ← save/edit/delete designs
  src/app/api/orders/         ← create order, coupon, address, add-ons
  src/app/api/coins/          ← balance, purchase, spend, history
  src/app/api/occasions/      ← occasion dates CRUD
  src/app/api/admin/orders/   ← admin order management
  src/app/api/admin/users/    ← user management
  src/app/api/admin/analytics/
  src/app/api/admin/coupons/
  src/app/api/admin/settings/
  src/app/api/admin/monetization/  ← revenue summary
  src/components/emails/      ← Resend templates
  src/lib/resend.ts
  src/lib/coins.ts            ← getBalance, spendCoins, earnCoins

Shared (coordinate before editing):
  src/types/index.ts          ← all TypeScript interfaces
  src/app/(protected)/        ← page components
```

---

*Polamuse SRS v2.1 — Emotion-first photo memory platform*
*Total features: 98 · Phases: 8 · Timeline: 13 weeks*
*Monetization: 4-layer combination · No subscriptions · Charge at emotional peak*
*Revenue target: ₹16,147/month net at 500 MAU*
