# Polamuse — PWA + Smoothness Implementation
> CSS live-preview layer · Service worker · Offline editor · Push notifications
> Last updated: 2026-09-30

---

## Overview

Two independent tracks that together make the editor feel native:

| Track | Goal | Effort |
|-------|------|--------|
| **CSS Live-Preview Layer** | Sub-1ms response to pan / zoom / filter during active interaction | 1–2 days |
| **PWA + Service Worker** | Installable, offline-capable, push notifications | 2–3 days |

Neither track breaks existing functionality. They can be shipped independently.

---

---

# TRACK 1 — CSS Live-Preview Layer

> **Why:** Canvas 2D re-renders (even with image caching) still cost 3–8ms per frame on mid-range phones. CSS transforms and filters run on the GPU compositor thread — completely outside React, outside the canvas pipeline, outside the main thread. The result is 0ms perceived latency on pan / zoom / filter, indistinguishable from Canva or Lightroom mobile.

## How it works

```
User drags / moves slider
        ↓
CSS transform / filter on <img> element   ← GPU compositor thread, ~0ms
        ↓
No canvas redraw, no React state update, no store write
        ↓
User lifts finger / releases slider
        ↓
Commit final values to Zustand store      ← one canvas redraw via image cache (~2ms)
```

During interaction the canvas is frozen. A CSS-styled `<img>` sits on top of it showing the live preview. On commit the canvas catches up and the `<img>` is hidden again.

## Architecture

```
PolaroidView
├── <canvas>                         ← committed state, redraws only on commit
├── <img id="live-preview">          ← CSS layer, visible only during interaction
│     style.objectFit = 'cover'
│     style.transform = 'translate/scale'
│     style.filter = 'brightness/contrast/saturate/sepia'
│     style.opacity = 0 (hidden) / 1 (during drag)
└── DraggableOverlay (text, music)   ← unchanged
```

---

## 1.1 — New hook: `useLivePreview.ts`

**File:** `src/hooks/useLivePreview.ts`

```typescript
import { useRef, useCallback } from 'react';

export interface LivePreviewState {
  panX: number;   // percentage, matches imagePanX
  panY: number;
  scale: number;  // matches imageScale
  brightness: number;
  contrast: number;
  saturation: number;
  warmth: number;
}

export function useLivePreview(
  imgRef: React.RefObject<HTMLImageElement>,
  imgW: number,   // display image area width in px
  imgH: number,   // display image area height in px
) {
  const activeRef = useRef(false);

  const show = useCallback((src: string) => {
    const el = imgRef.current;
    if (!el) return;
    el.src = src;
    el.style.opacity = '1';
    activeRef.current = true;
  }, [imgRef]);

  const hide = useCallback(() => {
    const el = imgRef.current;
    if (!el) return;
    el.style.opacity = '0';
    activeRef.current = false;
  }, [imgRef]);

  const update = useCallback((state: Partial<LivePreviewState>) => {
    const el = imgRef.current;
    if (!el || !activeRef.current) return;

    const panX = state.panX ?? 0;
    const panY = state.panY ?? 0;
    const scale = state.scale ?? 1;

    // CSS transform: translate then scale (same math as canvas render)
    const tx = (panX / 100) * imgW;
    const ty = (panY / 100) * imgH;
    el.style.transform = `translate(${tx}px, ${ty}px) scale(${scale})`;

    // CSS filter: same formula as buildCSSFilter in usePolaroidCanvas
    const parts: string[] = [];
    const br = state.brightness ?? 0;
    const co = state.contrast ?? 0;
    const sa = state.saturation ?? 0;
    const wa = state.warmth ?? 0;
    if (br !== 0) parts.push(`brightness(${1 + br / 100})`);
    if (co !== 0) parts.push(`contrast(${1 + co / 100})`);
    if (sa !== 0) parts.push(`saturate(${1 + sa / 100})`);
    if (wa > 0)   parts.push(`sepia(${wa / 200})`);
    else if (wa < 0) parts.push(`hue-rotate(${wa / 3}deg)`);
    el.style.filter = parts.join(' ') || 'none';
  }, [imgRef, imgW, imgH]);

  return { show, hide, update, isActive: () => activeRef.current };
}
```

---

## 1.2 — Modify `PolaroidView.tsx`

### Add the live-preview `<img>` element

Inside the `<div className="relative">` wrapper (alongside the `<canvas>`), add:

```tsx
{/* Live-preview layer — GPU-composited, visible only during active interaction */}
{frame?.imageDataUrl && (
  <img
    ref={livePreviewRef}
    src={frame.imageDataUrl}
    alt=""
    aria-hidden
    draggable={false}
    style={{
      position: 'absolute',
      inset: 0,
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      objectPosition: 'center',
      opacity: 0,
      pointerEvents: 'none',
      willChange: 'transform, filter, opacity',
      transformOrigin: 'center center',
      borderRadius: 'inherit',
      transition: 'opacity 0.05s ease',
    }}
  />
)}
```

### Wire pan/pinch to CSS layer instead of store

Replace the current gesture `onMove` handler pattern with:

```typescript
// During drag — update CSS only, no store write
if (g.dragging && e.pointerId === g.dragId) {
  const dx = e.clientX - g.startX;
  const dy = e.clientY - g.startY;
  const newPanX = Math.max(-300, Math.min(300, g.origPanX + (dx / imgAreaW()) * 100));
  const newPanY = Math.max(-300, Math.min(300, g.origPanY + (dy / imgAreaH()) * 100));

  // Store pending values on a ref (no state update)
  pendingGestureRef.current = { imagePanX: newPanX, imagePanY: newPanY };

  // Update CSS live preview immediately (no RAF needed — compositor handles it)
  livePreview.update({ panX: newPanX, panY: newPanY });
}
```

On `pointerup`, commit to store (one canvas redraw):

```typescript
const onUp = (e: PointerEvent) => {
  g.pointers.delete(e.pointerId);
  if (e.pointerId === g.dragId) {
    g.dragging = false;
    // Commit pending gesture values to store
    if (pendingGestureRef.current) {
      updateFrame(activeFrameId, pendingGestureRef.current);
      pendingGestureRef.current = null;
    }
    livePreview.hide();
  }
  if (g.pointers.size < 2) g.pinching = false;
};
```

Show live preview on `pointerdown`:

```typescript
const onDown = (e: PointerEvent) => {
  const f = frameRef.current;
  if (!f?.imageDataUrl) return;
  // ... existing pointer tracking ...

  if (g.pointers.size === 1) {
    // Show live preview layer
    livePreview.show(f.imageDataUrl);
    livePreview.update({
      panX: f.imagePanX, panY: f.imagePanY, scale: f.imageScale,
      ...f.filters,
    });
    // ... rest of existing drag setup ...
  }
};
```

---

## 1.3 — Modify panels for filter sliders

**File:** `src/components/panels/EditPanel.tsx`

Sliders currently fire `updateFrame` on every `onInput` (every pixel of drag). Change to:

```typescript
// On slider input: update CSS preview only (no store, no canvas redraw)
const handleFilterInput = (key: keyof FilterValues, value: number) => {
  // Update CSS live preview directly via a shared ref
  onLiveFilterChange?.({ ...currentFilters, [key]: value });
};

// On slider change/pointerup: commit to store (one canvas redraw)
const handleFilterCommit = (key: keyof FilterValues, value: number) => {
  updateFrame(activeFrameId, {
    filters: { ...frame.filters, [key]: value }
  });
};
```

Pass `onLiveFilterChange` callback from `EditorPage` → `EditPanel` → `useLivePreview.update()`.

### Refs to add in `PolaroidView.tsx`

```typescript
const livePreviewRef = useRef<HTMLImageElement>(null);
const pendingGestureRef = useRef<Partial<FrameData> | null>(null);
const { show, hide, update } = useLivePreview(livePreviewRef, displayImgW, displayImgH);
```

---

## 1.4 — Files to create / modify

```
NEW:
  src/hooks/useLivePreview.ts

MODIFY:
  src/components/PolaroidView.tsx     — add <img> preview, wire gestures
  src/components/panels/EditPanel.tsx — input vs commit on filter sliders
  src/app/editor/page.tsx             — thread liveFilterChange callback
```

---

## 1.5 — Expected result

| Interaction | Before | After |
|-------------|--------|-------|
| Pan image | 3–8ms canvas redraw per pointer event | ~0ms (CSS compositor) |
| Pinch zoom | 3–8ms canvas redraw per pointer event | ~0ms (CSS compositor) |
| Filter slider | 3–8ms canvas redraw per pixel of drag | ~0ms (CSS filter) |
| Tab switch / text edit | 3–8ms canvas redraw (no image change) | 0 redraws (already fixed by fingerprint) |
| Commit (finger up / slider release) | — | ~2ms (image cache hit) |

---

---

# TRACK 2 — PWA + Service Worker

> **Why:** Users return to editors they can add to their home screen. Push reminders (occasion alerts, "your design is ready") drive 3× re-engagement vs email alone. Offline support means no white screen on flaky mobile connections.

---

## 2.1 — Install dependency

```bash
npm install next-pwa
```

`next-pwa` wraps Workbox and integrates with Next.js App Router with minimal config.

---

## 2.2 — Wrap `next.config.ts`

**File:** `next.config.ts`

```typescript
import withPWA from 'next-pwa';

const pwaConfig = withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development', // no SW in dev (avoids cache confusion)
  runtimeCaching: [
    {
      // Cloudinary images — cache-first, 30 day expiry
      urlPattern: /^https:\/\/res\.cloudinary\.com\/.*/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'cloudinary-images',
        expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 30 },
      },
    },
    {
      // Spotify scan codes — cache-first, 7 day expiry
      urlPattern: /^https:\/\/scannables\.scdn\.co\/.*/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'spotify-codes',
        expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 * 7 },
      },
    },
    {
      // API: templates and pricing — stale-while-revalidate
      urlPattern: /^\/api\/(templates|pricing).*/i,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'api-static',
        expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 },
      },
    },
    {
      // Google Fonts — cache-first
      urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'google-fonts',
        expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 365 },
      },
    },
  ],
});

const nextConfig = {
  // ... your existing next config options
};

export default pwaConfig(nextConfig);
```

---

## 2.3 — PWA meta tags in root layout

**File:** `src/app/layout.tsx`

Add inside `<head>`:

```tsx
{/* PWA */}
<link rel="manifest" href="/site.webmanifest" />
<meta name="theme-color" content="#8B6F5C" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="default" />
<meta name="apple-mobile-web-app-title" content="Polamuse" />
<link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
```

---

## 2.4 — Update `public/site.webmanifest`

The file already exists — verify and update it to this:

```json
{
  "name": "Polamuse",
  "short_name": "Polamuse",
  "description": "Design Polaroid-style photo frames and order prints",
  "start_url": "/editor",
  "display": "standalone",
  "background_color": "#EDE6DC",
  "theme_color": "#8B6F5C",
  "orientation": "portrait-primary",
  "icons": [
    { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png", "purpose": "any maskable" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "any maskable" }
  ],
  "screenshots": [
    { "src": "/screenshots/editor.jpg", "sizes": "1080x1920", "type": "image/jpeg", "form_factor": "narrow" }
  ],
  "categories": ["photo", "lifestyle"]
}
```

**Icons to create** (place in `public/icons/`):
- `icon-192.png` — 192×192 PNG of the Polamuse "P" logo on `#8B6F5C` background
- `icon-512.png` — 512×512 same
- `apple-touch-icon.png` — 180×180

---

## 2.5 — Offline fallback page

**File:** `public/offline.html`

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Polamuse — Offline</title>
  <style>
    body {
      margin: 0; min-height: 100dvh;
      display: flex; align-items: center; justify-content: center;
      background: #EDE6DC;
      font-family: 'DM Sans', system-ui, sans-serif;
      text-align: center; color: #5C4A3A;
    }
    h1 { font-family: 'Cormorant Garamond', serif; font-style: italic;
         font-size: 2rem; font-weight: 300; color: #1A1714; margin-bottom: 8px; }
    p  { font-size: 0.9rem; color: #A39080; margin: 0 0 24px; }
    a  { display: inline-block; padding: 10px 20px; background: #8B6F5C;
         color: #fff; border-radius: 100px; text-decoration: none;
         font-size: 13px; font-weight: 500; }
  </style>
</head>
<body>
  <div>
    <h1>You're offline</h1>
    <p>Your designs are saved. Connect to continue editing or ordering.</p>
    <a href="/editor">Retry</a>
  </div>
</body>
</html>
```

Add to `next-pwa` config:

```typescript
fallbacks: {
  document: '/offline.html',
},
```

---

## 2.6 — Push notifications (optional — occasion reminders)

### Install

```bash
npm install web-push
npm install --save-dev @types/web-push
```

### Generate VAPID keys (one-time, store in env)

```bash
npx web-push generate-vapid-keys
```

Add to `.env.local`:

```
VAPID_PUBLIC_KEY=<your-public-key>
VAPID_PRIVATE_KEY=<your-private-key>
VAPID_EMAIL=mailto:hello@polamuse.com
NEXT_PUBLIC_VAPID_PUBLIC_KEY=<your-public-key>
```

### Save subscription endpoint

**New file:** `src/app/api/notifications/subscribe/route.ts`

```typescript
import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { userId } from '@/lib/api';
import { z } from 'zod';

const schema = z.object({
  endpoint:   z.string().url(),
  keys: z.object({
    p256dh: z.string(),
    auth:   z.string(),
  }),
});

export async function POST(req: Request) {
  const uid = userId(req);
  const body = schema.safeParse(await req.json());
  if (!body.success) return NextResponse.json({ error: 'Invalid' }, { status: 400 });

  const { endpoint, keys } = body.data;
  await sql`
    INSERT INTO push_subscriptions (user_id, endpoint, p256dh, auth)
    VALUES (${uid}, ${endpoint}, ${keys.p256dh}, ${keys.auth})
    ON CONFLICT (endpoint) DO UPDATE
      SET p256dh = EXCLUDED.p256dh, auth = EXCLUDED.auth, user_id = EXCLUDED.user_id`;

  return NextResponse.json({ ok: true });
}
```

**New table** (run against Neon):

```sql
CREATE TABLE push_subscriptions (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  endpoint   TEXT NOT NULL UNIQUE,
  p256dh     TEXT NOT NULL,
  auth       TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_push_subs_user ON push_subscriptions(user_id);
```

### Send push from cron route

**Modify:** `src/app/api/cron/occasions/route.ts`

```typescript
import webpush from 'web-push';

webpush.setVapidDetails(
  process.env.VAPID_EMAIL!,
  process.env.VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!,
);

async function sendPushToUser(userId: string, payload: object) {
  const subs = await sql`SELECT * FROM push_subscriptions WHERE user_id = ${userId}`;
  for (const sub of subs) {
    try {
      await webpush.sendNotification(
        { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
        JSON.stringify(payload)
      );
    } catch {
      // Subscription expired — remove it
      await sql`DELETE FROM push_subscriptions WHERE endpoint = ${sub.endpoint}`;
    }
  }
}

// Inside the cron handler, after sending occasion email:
await sendPushToUser(occasion.user_id, {
  title: `${occasion.person_name}'s ${occasion.label} is in ${daysUntil} days`,
  body: 'Design a Polamuse memory for them →',
  icon: '/icons/icon-192.png',
  badge: '/icons/badge-72.png',
  url: '/editor',
  tag: `occasion-${occasion.id}`,
});
```

### Subscribe from client

**New file:** `src/hooks/usePushNotifications.ts`

```typescript
import { useCallback, useEffect, useState } from 'react';

export function usePushNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    if ('Notification' in window) setPermission(Notification.permission);
  }, []);

  const subscribe = useCallback(async () => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) return false;

    const reg = await navigator.serviceWorker.ready;
    const existing = await reg.pushManager.getSubscription();
    if (existing) { await sendToServer(existing); return true; }

    const sub = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!),
    });

    const granted = await Notification.requestPermission();
    setPermission(granted);
    if (granted !== 'granted') return false;

    await sendToServer(sub);
    return true;
  }, []);

  return { permission, subscribe };
}

async function sendToServer(sub: PushSubscription) {
  const { endpoint, keys } = sub.toJSON() as {
    endpoint: string;
    keys: { p256dh: string; auth: string };
  };
  await fetch('/api/notifications/subscribe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ endpoint, keys }),
  });
}

function urlBase64ToUint8Array(base64: string): Uint8Array {
  const padding = '='.repeat((4 - (base64.length % 4)) % 4);
  const b64 = (base64 + padding).replace(/-/g, '+').replace(/_/g, '/');
  const raw = atob(b64);
  return Uint8Array.from([...raw].map((c) => c.charCodeAt(0)));
}
```

### Service worker push handler

**File:** `public/sw-push.js` (custom worker that `next-pwa` merges with Workbox):

```javascript
self.addEventListener('push', (event) => {
  const data = event.data?.json() ?? {};
  event.waitUntil(
    self.registration.showNotification(data.title ?? 'Polamuse', {
      body:  data.body,
      icon:  data.icon  ?? '/icons/icon-192.png',
      badge: data.badge ?? '/icons/badge-72.png',
      tag:   data.tag,
      data:  { url: data.url ?? '/' },
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((cs) => {
      const existing = cs.find((c) => c.url.includes(self.location.origin));
      if (existing) return existing.focus();
      return clients.openWindow(event.notification.data.url);
    })
  );
});
```

Register in `next-pwa` config:

```typescript
customWorkerSrc: 'public/sw-push.js',
```

---

## 2.7 — Add "Enable notifications" to Account page

**Modify:** `src/app/account/page.tsx`

```tsx
import { usePushNotifications } from '@/hooks/usePushNotifications';

// Inside the component:
const { permission, subscribe } = usePushNotifications();

// In the JSX, under occasions section:
{permission !== 'granted' && (
  <button onClick={subscribe}>
    Enable occasion reminders
  </button>
)}
```

---

## 2.8 — Files to create / modify

```
NEW:
  src/hooks/useLivePreview.ts
  src/hooks/usePushNotifications.ts
  src/app/api/notifications/subscribe/route.ts
  public/offline.html
  public/sw-push.js
  public/icons/icon-192.png
  public/icons/icon-512.png
  public/icons/apple-touch-icon.png

MODIFY:
  next.config.ts                           — withPWA wrapper + runtimeCaching
  src/app/layout.tsx                       — PWA meta tags
  src/app/account/page.tsx                 — push subscribe button
  src/app/api/cron/occasions/route.ts      — push notification send
  src/components/PolaroidView.tsx          — CSS live-preview layer + gesture commit
  src/components/panels/EditPanel.tsx      — input vs commit on filter sliders
  src/app/editor/page.tsx                  — thread liveFilterChange callback
  public/site.webmanifest                  — update icons + screenshots + start_url

SQL:
  push_subscriptions table
```

---

## 2.9 — Environment variables to add

```
VAPID_PUBLIC_KEY=<generated>
VAPID_PRIVATE_KEY=<generated>
VAPID_EMAIL=mailto:hello@polamuse.com
NEXT_PUBLIC_VAPID_PUBLIC_KEY=<same as VAPID_PUBLIC_KEY>
CRON_SECRET=<random string>          # already in implementationv2 plan
```

---

## Timeline

| Day | Task |
|-----|------|
| 1 | `useLivePreview` hook, wire to PolaroidView gestures |
| 2 | Wire EditPanel sliders to CSS layer, commit on release |
| 3 | `next-pwa` install, `next.config.ts` wrapper, manifest update, icons |
| 4 | Push subscription API + table, `usePushNotifications` hook |
| 5 | Cron push send, account page button, offline fallback page, test on real device |

---

## Testing checklist

- [ ] Pan image on mobile — no jank, no dropped frames
- [ ] Pinch zoom — smooth interpolation
- [ ] Brightness / contrast sliders — instant CSS response, canvas updates on release
- [ ] Chrome DevTools → Application → Service Workers → "Offline" → editor loads with offline.html fallback
- [ ] Add to home screen on Android/iOS → opens in standalone mode
- [ ] Push notification fires from cron (test with `curl /api/cron/occasions` + `Authorization: Bearer $CRON_SECRET`)
- [ ] Notification tap opens `/editor` and focuses existing window if open

---

*Polamuse — PWA + Smoothness Implementation*
*2 tracks · 5 days · ~12 files*
