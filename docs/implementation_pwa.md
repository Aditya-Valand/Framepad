# Polamuse — PWA Implementation Guide (Production)
> Progressive Web App setup for a production-grade mobile-first experience.
> Goal: installable, offline-capable, push-notification-ready, app-store-quality feel.

---

## Current State

| Item | Status | Issue |
|------|--------|-------|
| `public/site.webmanifest` | Exists | References icon PNGs that don't exist (`favicon-16.png`, `icon-192.png`, etc.) |
| Icon files | Missing | Only `favicon.svg` and `icons.svg` exist — no PNG icons at all |
| Service Worker | Missing | No `sw.js`, no `next-pwa`, no offline support |
| PWA meta tags | Missing | `src/app/layout.tsx` has no `<link rel="manifest">`, no apple-web-app tags, no theme-color |
| `next.config.ts` | No PWA config | Plain config with only `reactStrictMode` |
| Splash screens | Missing | No Apple splash screen images |
| Offline fallback | Missing | No cached pages, no offline indicator |
| Push notifications | Missing | No `web-push`, no subscription endpoint |

---

## Step-by-Step Implementation

---

### Step 1 — Generate App Icons

You need PNG icons at these sizes. Generate from your SVG favicon or design a dedicated app icon.

**Required files in `public/`:**

```
public/
  favicon.ico                  ← 48x48 ICO (browsers)
  favicon-16.png               ← 16x16 (browser tab)
  favicon-32.png               ← 32x32 (browser tab)
  apple-touch-icon.png         ← 180x180 (iOS home screen)
  icon-192.png                 ← 192x192 (Android home screen, manifest)
  icon-512.png                 ← 512x512 (Android splash, manifest)
  icon-maskable-192.png        ← 192x192 with safe zone padding (maskable)
  icon-maskable-512.png        ← 512x512 with safe zone padding (maskable)
```

**Maskable icon rules:**
- The important content (logo) must fit inside the inner 80% circle (safe zone)
- The outer 20% is padding that Android can crop into circles, squircles, etc.
- Background should be your brand color (`#F5F0EB` or `#8B6347`)
- Use https://maskable.app/editor to test

**Tool to generate all sizes from one source:**

```bash
# Using sharp-cli (install globally)
npm install -g sharp-cli

# From a 1024x1024 source icon
sharp -i source-icon.png -o public/favicon-16.png resize 16 16
sharp -i source-icon.png -o public/favicon-32.png resize 32 32
sharp -i source-icon.png -o public/apple-touch-icon.png resize 180 180
sharp -i source-icon.png -o public/icon-192.png resize 192 192
sharp -i source-icon.png -o public/icon-512.png resize 512 512

# Maskable versions (from a padded source)
sharp -i source-icon-maskable.png -o public/icon-maskable-192.png resize 192 192
sharp -i source-icon-maskable.png -o public/icon-maskable-512.png resize 512 512
```

Or use https://realfavicongenerator.net — upload your logo, it generates every size.

---

### Step 2 — Fix the Web Manifest

**Replace** `public/site.webmanifest`:

```json
{
  "name": "Polamuse — Polaroid Photo Maker",
  "short_name": "Polamuse",
  "description": "Turn your photos into polaroids. Design it. Share it. Send it.",
  "start_url": "/editor",
  "id": "/editor",
  "display": "standalone",
  "display_override": ["standalone", "minimal-ui"],
  "orientation": "portrait",
  "background_color": "#F5F0EB",
  "theme_color": "#F5F0EB",
  "categories": ["photo", "utilities", "lifestyle"],
  "dir": "ltr",
  "lang": "en",
  "scope": "/",
  "prefer_related_applications": false,
  "icons": [
    {
      "src": "/favicon-16.png",
      "sizes": "16x16",
      "type": "image/png"
    },
    {
      "src": "/favicon-32.png",
      "sizes": "32x32",
      "type": "image/png"
    },
    {
      "src": "/apple-touch-icon.png",
      "sizes": "180x180",
      "type": "image/png"
    },
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/icon-maskable-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "maskable"
    },
    {
      "src": "/icon-maskable-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "maskable"
    }
  ],
  "screenshots": [
    {
      "src": "/screenshots/editor-mobile.png",
      "sizes": "390x844",
      "type": "image/png",
      "form_factor": "narrow",
      "label": "Polamuse editor on mobile"
    },
    {
      "src": "/screenshots/editor-desktop.png",
      "sizes": "1280x720",
      "type": "image/png",
      "form_factor": "wide",
      "label": "Polamuse editor on desktop"
    }
  ],
  "shortcuts": [
    {
      "name": "New Design",
      "short_name": "Design",
      "url": "/editor",
      "description": "Open the polaroid editor",
      "icons": [{ "src": "/icon-192.png", "sizes": "192x192" }]
    },
    {
      "name": "My Designs",
      "short_name": "Designs",
      "url": "/designs",
      "description": "View your saved designs"
    }
  ]
}
```

**Key changes from current:**
- `start_url` changed from `/` to `/editor` — users install the app FOR the editor, not the landing page
- `id` set to `/editor` — stable identity across manifest updates
- `display_override` added — graceful degradation
- Separated `any` and `maskable` icon purposes (combining them in one entry causes issues on some Android devices)
- Added `screenshots` (required for "richer install UI" on Chrome Android)
- Added `shortcuts` (long-press menu on Android home screen icon)

**Screenshots to capture:**
```
public/
  screenshots/
    editor-mobile.png      ← 390x844 (iPhone 14 viewport)
    editor-desktop.png     ← 1280x720 (desktop)
```

Take real screenshots of your editor with a design loaded. Chrome DevTools → Device Mode → capture.

---

### Step 3 — Install and Configure `@ducanh2912/next-pwa`

> `next-pwa` (the original by shadowwalker) is unmaintained. Use `@ducanh2912/next-pwa` which is actively maintained and supports Next.js 14+.

```bash
npm install @ducanh2912/next-pwa
```

**Replace** `next.config.ts`:

```typescript
import type { NextConfig } from 'next';
import withPWAInit from '@ducanh2912/next-pwa';

const withPWA = withPWAInit({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  workboxOptions: {
    // Don't precache everything — only the shell
    disableDevLogs: true,
    runtimeCaching: [
      // 1. Cache the editor page shell (offline-first)
      {
        urlPattern: /^\/editor$/,
        handler: 'NetworkFirst',
        options: {
          cacheName: 'editor-page',
          expiration: {
            maxEntries: 1,
            maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
          },
          networkTimeoutSeconds: 5,
        },
      },

      // 2. Cache static assets (JS/CSS bundles)
      {
        urlPattern: /\/_next\/static\/.*/i,
        handler: 'CacheFirst',
        options: {
          cacheName: 'next-static',
          expiration: {
            maxEntries: 200,
            maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
          },
        },
      },

      // 3. Cache Google Fonts
      {
        urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/i,
        handler: 'CacheFirst',
        options: {
          cacheName: 'google-fonts',
          expiration: {
            maxEntries: 30,
            maxAgeSeconds: 365 * 24 * 60 * 60, // 1 year
          },
        },
      },

      // 4. Cache Cloudinary images (user photos + design thumbnails)
      {
        urlPattern: /^https:\/\/res\.cloudinary\.com\/.*/i,
        handler: 'CacheFirst',
        options: {
          cacheName: 'cloudinary-images',
          expiration: {
            maxEntries: 150,
            maxAgeSeconds: 14 * 24 * 60 * 60, // 14 days
          },
          cacheableResponse: {
            statuses: [0, 200],
          },
        },
      },

      // 5. Cache Spotify scannable codes
      {
        urlPattern: /^https:\/\/scannables\.scdn\.co\/.*/i,
        handler: 'CacheFirst',
        options: {
          cacheName: 'spotify-codes',
          expiration: {
            maxEntries: 50,
            maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
          },
          cacheableResponse: {
            statuses: [0, 200],
          },
        },
      },

      // 6. Cache API responses for pricing + templates (changes rarely)
      {
        urlPattern: /^\/api\/pricing$/i,
        handler: 'StaleWhileRevalidate',
        options: {
          cacheName: 'api-pricing',
          expiration: {
            maxEntries: 5,
            maxAgeSeconds: 24 * 60 * 60, // 1 day
          },
        },
      },

      // 7. Cache announcements (for offline banner display)
      {
        urlPattern: /^\/api\/announcements$/i,
        handler: 'StaleWhileRevalidate',
        options: {
          cacheName: 'api-announcements',
          expiration: {
            maxEntries: 5,
            maxAgeSeconds: 60 * 60, // 1 hour
          },
        },
      },

      // 8. Don't cache auth or mutation APIs — always network
      // (This is the default — unlisted routes go to network)
    ],
  },
});

const nextConfig: NextConfig = {
  reactStrictMode: true,
};

export default withPWA(nextConfig);
```

**What each cache strategy does:**
| Strategy | When to use |
|----------|-------------|
| `CacheFirst` | Static assets, images, fonts — serve from cache, never refetch unless expired |
| `NetworkFirst` | HTML pages — try network, fall back to cache if offline |
| `StaleWhileRevalidate` | API data that changes slowly — serve cached, update in background |

**What NOT to cache:**
- Auth routes (`/api/auth/*`) — tokens must always be fresh
- Order/payment routes — mutations must hit the server
- Design save routes — must persist to DB
- Coin balance/spend routes — must be real-time accurate

---

### Step 4 — Add PWA Meta Tags to Layout

**Modify** `src/app/layout.tsx`:

```typescript
import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Polamuse — Made by you. Felt by them.',
  description:
    'Create stunning polaroid frames, instant film photos, and aesthetic photo cards online for free. Add Spotify codes, custom text, vintage filters, and download in high quality.',
  manifest: '/site.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Polamuse',
  },
  formatDetection: {
    telephone: false,
  },
  other: {
    'mobile-web-app-capable': 'yes',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,          // prevent unwanted zoom in editor
  userScalable: false,       // editor handles its own pinch-zoom
  viewportFit: 'cover',     // extend behind notch/Dynamic Island
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F5F0EB' },
    { media: '(prefers-color-scheme: dark)', color: '#1A1714' },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Favicon fallbacks for browsers that don't read manifest */}
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon-32.png" sizes="32x32" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

**Notes:**
- `viewport` is exported separately (Next.js 14+ requires this — `viewport` in `metadata` is deprecated)
- `maximumScale: 1` + `userScalable: false` prevents accidental page zoom in the editor (the canvas handles its own gestures)
- `viewportFit: 'cover'` extends the app behind the iPhone notch / Dynamic Island — pair with `env(safe-area-inset-*)` in CSS
- Apple splash screens require `<link rel="apple-touch-startup-image">` — covered in Step 8

---

### Step 5 — Safe Area CSS

The editor needs to respect the notch/Dynamic Island/home indicator on modern phones.

**Add to** `src/app/globals.css`:

```css
/* ── Safe Area Insets for PWA standalone mode ── */
@supports (padding: env(safe-area-inset-top)) {
  :root {
    --sat: env(safe-area-inset-top);
    --sab: env(safe-area-inset-bottom);
    --sal: env(safe-area-inset-left);
    --sar: env(safe-area-inset-right);
  }
}
```

**Add to** `src/app/editor/editor.css`:

```css
/* ── Editor safe area adjustments in standalone PWA ── */
@media all and (display-mode: standalone) {
  /* Mobile header: add top safe area padding */
  .editor-mobile-header {
    padding-top: calc(var(--sat, 0px) + 8px);
  }

  /* Mobile bottom tab bar: add bottom safe area padding */
  .editor-bottom-bar {
    padding-bottom: calc(var(--sab, 0px) + 4px);
  }
}
```

You'll need to add these classes to the corresponding elements in `src/app/editor/page.tsx`:
- Mobile glass header → add `editor-mobile-header`
- Mobile bottom tab bar → add `editor-bottom-bar`

---

### Step 6 — Offline Fallback Page

When the user opens the app offline and the page isn't cached, they should see a meaningful offline page instead of Chrome's dinosaur game.

**Create** `public/offline.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Polamuse — Offline</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif;
      background: #F5F0EB;
      color: #1A1714;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100dvh;
      padding: 24px;
      text-align: center;
    }
    .container { max-width: 320px; }
    .icon {
      width: 64px; height: 64px; margin: 0 auto 24px;
      border-radius: 16px;
      background: #EDE7DC;
      display: flex; align-items: center; justify-content: center;
      font-size: 28px;
    }
    h1 {
      font-family: 'Cormorant Garamond', Georgia, serif;
      font-size: 24px; font-weight: 400;
      margin-bottom: 12px;
    }
    p {
      font-size: 14px; color: #7A6E65;
      line-height: 1.6; margin-bottom: 24px;
    }
    button {
      background: #8B6347; color: white;
      border: none; border-radius: 10px;
      padding: 12px 28px; font-size: 14px;
      font-family: inherit; cursor: pointer;
      transition: background 0.2s;
    }
    button:hover { background: #7a5540; }
    button:active { background: #6B4F3A; }
  </style>
</head>
<body>
  <div class="container">
    <div class="icon">📷</div>
    <h1>You're offline</h1>
    <p>
      Polamuse needs an internet connection to load your designs and save your work.
      Check your connection and try again.
    </p>
    <button onclick="window.location.reload()">Try again</button>
  </div>
</body>
</html>
```

**Add to** `next.config.ts` PWA config (inside `withPWAInit`):

```typescript
fallbacks: {
  document: '/offline.html',
},
```

---

### Step 7 — Online/Offline Status Indicator

When the user goes offline mid-session, show a toast instead of silently failing API calls.

**Create** `src/hooks/useOnlineStatus.ts`:

```typescript
'use client';
import { useState, useEffect } from 'react';

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    setIsOnline(navigator.onLine);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}
```

**Create** `src/components/OfflineBanner.tsx`:

```typescript
'use client';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';

export function OfflineBanner() {
  const isOnline = useOnlineStatus();
  if (isOnline) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        background: '#C0604A',
        color: '#fff',
        textAlign: 'center',
        padding: '8px 16px',
        fontSize: '13px',
        fontFamily: 'DM Sans, sans-serif',
      }}
    >
      You're offline — changes won't be saved until you reconnect
    </div>
  );
}
```

**Add** `<OfflineBanner />` to `src/app/layout.tsx` inside `<body>`.

---

### Step 8 — Apple Splash Screens (iOS)

When an iOS user opens the PWA from the home screen, they see a splash screen during load. Without these, they see a white screen.

**Generate splash screen images** for all device sizes. Use https://progressier.com/pwa-icons-and-ios-splash-screen-generator or create them manually.

**Required sizes** (most common devices):

```
public/splash/
  apple-splash-1170-2532.png    ← iPhone 12/13/14 (390×844 @3x)
  apple-splash-1179-2556.png    ← iPhone 14 Pro (393×852 @3x)
  apple-splash-1290-2796.png    ← iPhone 14 Pro Max (430×932 @3x)
  apple-splash-1125-2436.png    ← iPhone X/XS/11 Pro (375×812 @3x)
  apple-splash-1242-2688.png    ← iPhone XS Max/11 Pro Max
  apple-splash-828-1792.png     ← iPhone XR/11 (414×896 @2x)
  apple-splash-1284-2778.png    ← iPhone 12/13 Pro Max
  apple-splash-750-1334.png     ← iPhone 8 (375×667 @2x)
  apple-splash-1536-2048.png    ← iPad (768×1024 @2x)
  apple-splash-2048-2732.png    ← iPad Pro 12.9"
```

Design: brand background (`#F5F0EB`) with centered Polamuse logo. Keep it simple.

**Add to** `src/app/layout.tsx` `<head>`:

```html
<link rel="apple-touch-startup-image"
  href="/splash/apple-splash-1170-2532.png"
  media="(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3)" />
<link rel="apple-touch-startup-image"
  href="/splash/apple-splash-1179-2556.png"
  media="(device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3)" />
<!-- ... add all sizes ... -->
```

> **Shortcut:** Use https://appsco.pe/developer/splash-screens to auto-generate the full set of `<link>` tags.

---

### Step 9 — Install Prompt (Custom A2HS Banner)

Chrome shows its own "Add to Home Screen" banner, but you can capture the event and show a custom prompt that matches your design.

**Create** `src/hooks/useInstallPrompt.ts`:

```typescript
'use client';
import { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function useInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Detect successful install
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    });

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const promptInstall = async () => {
    if (!deferredPrompt) return false;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    return outcome === 'accepted';
  };

  return {
    canInstall: !!deferredPrompt && !isInstalled,
    isInstalled,
    promptInstall,
  };
}
```

**Where to show the prompt:**
- After the user finishes their first design (emotional peak — they just made something)
- As a subtle banner at the bottom of the editor, not a blocking modal
- Dismiss after "No thanks" — don't show again for 7 days (localStorage)

**Create** `src/components/InstallBanner.tsx`:

```typescript
'use client';
import { useInstallPrompt } from '@/hooks/useInstallPrompt';
import { useState, useEffect } from 'react';

export function InstallBanner() {
  const { canInstall, promptInstall } = useInstallPrompt();
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    try {
      const dismissedAt = localStorage.getItem('pwa_install_dismissed');
      if (dismissedAt) {
        const daysAgo = (Date.now() - Number(dismissedAt)) / (1000 * 60 * 60 * 24);
        if (daysAgo < 7) return;
      }
      setDismissed(false);
    } catch {
      setDismissed(false);
    }
  }, []);

  if (!canInstall || dismissed) return null;

  const handleDismiss = () => {
    setDismissed(true);
    try { localStorage.setItem('pwa_install_dismissed', String(Date.now())); } catch {}
  };

  return (
    <div style={{
      position: 'fixed', bottom: 16, left: 16, right: 16,
      zIndex: 9998, maxWidth: 400, margin: '0 auto',
      background: '#FFFCF8', borderRadius: 14,
      boxShadow: '0 4px 24px rgba(26,23,20,0.12)',
      border: '0.5px solid rgba(26,23,20,0.08)',
      padding: '16px 20px',
      display: 'flex', alignItems: 'center', gap: 14,
    }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, fontWeight: 500, color: '#1A1714', marginBottom: 2 }}>
          Add Polamuse to Home Screen
        </div>
        <div style={{ fontSize: 12, color: '#7A6E65' }}>
          Faster access, works offline
        </div>
      </div>
      <button
        onClick={promptInstall}
        style={{
          background: '#8B6347', color: '#fff', border: 'none',
          borderRadius: 8, padding: '8px 16px', fontSize: 13,
          fontFamily: 'inherit', cursor: 'pointer', whiteSpace: 'nowrap',
        }}
      >
        Install
      </button>
      <button
        onClick={handleDismiss}
        style={{
          background: 'none', border: 'none', color: '#B5A99E',
          fontSize: 18, cursor: 'pointer', padding: 4,
        }}
        aria-label="Dismiss"
      >
        ×
      </button>
    </div>
  );
}
```

---

### Step 10 — Editor Offline Design Save (localStorage fallback)

When offline, design state should persist in localStorage so the user doesn't lose work.

The editor already auto-saves to localStorage via `useDesignSave.ts` (it uses `setInterval`). Enhance it:

**Modify** `src/hooks/useDesignSave.ts`:

1. Before calling the save API, check `navigator.onLine`
2. If offline, save to localStorage with a `pending_sync` flag
3. When back online, detect the `online` event and push pending saves to the server
4. Show a subtle "Saved locally — will sync when online" indicator

```typescript
// Offline queue concept:
const OFFLINE_QUEUE_KEY = 'polamuse_offline_saves';

function queueOfflineSave(designState: unknown) {
  try {
    const queue = JSON.parse(localStorage.getItem(OFFLINE_QUEUE_KEY) || '[]');
    queue.push({ state: designState, timestamp: Date.now() });
    localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(queue));
  } catch { /* localStorage full or unavailable */ }
}

function getOfflineQueue(): Array<{ state: unknown; timestamp: number }> {
  try {
    return JSON.parse(localStorage.getItem(OFFLINE_QUEUE_KEY) || '[]');
  } catch { return []; }
}

function clearOfflineQueue() {
  try { localStorage.removeItem(OFFLINE_QUEUE_KEY); } catch {}
}

// On 'online' event: flush queue
window.addEventListener('online', async () => {
  const queue = getOfflineQueue();
  for (const item of queue) {
    await saveToServer(item.state); // existing save API call
  }
  clearOfflineQueue();
});
```

---

### Step 11 — Push Notifications (Optional — Phase 7 dependency)

Push notifications require a server-side push subscription and the `web-push` package. This only becomes useful after Occasion Targeting (Phase 7) is built.

**Install:**

```bash
npm install web-push
```

**Generate VAPID keys** (run once):

```bash
npx web-push generate-vapid-keys
```

Store as environment variables:

```
NEXT_PUBLIC_VAPID_PUBLIC_KEY=BL...
VAPID_PRIVATE_KEY=...
VAPID_CONTACT_EMAIL=mailto:hello@polamuse.com
```

**New DB table:**

```sql
CREATE TABLE push_subscriptions (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  endpoint        TEXT NOT NULL,
  p256dh          TEXT NOT NULL,
  auth            TEXT NOT NULL,
  device_label    VARCHAR(100),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, endpoint)
);
```

**New API routes:**

| Route | Purpose |
|-------|---------|
| `POST /api/notifications/subscribe` | Save push subscription |
| `DELETE /api/notifications/subscribe` | Remove subscription |

**Client-side subscription** (add to a settings page or post-install):

```typescript
async function subscribeToPush() {
  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
  });
  await fetch('/api/notifications/subscribe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(subscription.toJSON()),
  });
}
```

**Sending a push** (in the occasion cron job):

```typescript
import webpush from 'web-push';

webpush.setVapidDetails(
  process.env.VAPID_CONTACT_EMAIL!,
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!,
);

async function sendPush(subscription: PushSubscription, payload: object) {
  await webpush.sendNotification(
    subscription,
    JSON.stringify(payload),
  );
}
```

---

## File Inventory

### New files (14)

```
public/
  offline.html
  favicon-16.png               ← generate
  favicon-32.png               ← generate
  apple-touch-icon.png         ← generate
  icon-192.png                 ← generate
  icon-512.png                 ← generate
  icon-maskable-192.png        ← generate
  icon-maskable-512.png        ← generate
  screenshots/
    editor-mobile.png          ← capture
    editor-desktop.png         ← capture
  splash/
    apple-splash-*.png         ← generate (8-10 sizes)

src/
  hooks/useOnlineStatus.ts
  hooks/useInstallPrompt.ts
  components/OfflineBanner.tsx
  components/InstallBanner.tsx
```

### Modified files (5)

```
public/site.webmanifest          ← rewrite (Step 2)
next.config.ts                   ← PWA wrapper (Step 3)
src/app/layout.tsx               ← meta tags + head links (Step 4)
src/app/globals.css              ← safe area CSS vars (Step 5)
src/app/editor/editor.css        ← standalone mode adjustments (Step 5)
```

### New dependency (1)

```
@ducanh2912/next-pwa
```

### Optional (push notifications, Phase 7+)

```
web-push                         ← npm package
push_subscriptions               ← DB table
src/app/api/notifications/subscribe/route.ts
NEXT_PUBLIC_VAPID_PUBLIC_KEY     ← env var
VAPID_PRIVATE_KEY                ← env var
VAPID_CONTACT_EMAIL              ← env var
```

---

## PWA Quality Checklist

Run these checks before shipping:

### Chrome DevTools → Application tab

- [ ] Manifest detected with no warnings
- [ ] All icons load (no 404s)
- [ ] Service worker registered and active
- [ ] "Add to Home Screen" criteria met (all green checkmarks)

### Lighthouse PWA Audit

- [ ] Score ≥ 90 on PWA category
- [ ] "Installable" section all green
- [ ] "PWA Optimized" section all green

### Manual testing

- [ ] **Android Chrome:** "Install app" banner appears → install → opens standalone → home screen icon correct → splash screen shows
- [ ] **iOS Safari:** Share → Add to Home Screen → opens standalone → icon correct → splash screen shows
- [ ] **Offline test:** Turn on airplane mode → open app → offline page shows OR cached editor loads
- [ ] **Back online:** Reconnect → offline banner disappears → pending saves sync
- [ ] **Notch/Island:** On iPhone 14 Pro, content doesn't overlap the Dynamic Island or home indicator
- [ ] **Shortcuts:** Long-press home screen icon → "New Design" and "My Designs" shortcuts appear (Android only)
- [ ] **Screenshots:** Rich install UI shows editor screenshots (Chrome Android 120+)

### Performance

- [ ] First load: < 3 seconds on 4G
- [ ] Repeat visit (cached): < 1 second
- [ ] Editor page available offline within 5 seconds of first visit
- [ ] Cloudinary images cached and served instantly on revisit

---

## Build Order

```
Step 1:   Generate icon PNGs (design task, not code)
Step 2:   Update site.webmanifest
Step 3:   Install @ducanh2912/next-pwa, update next.config.ts
Step 4:   Update src/app/layout.tsx with meta tags
Step 5:   Add safe area CSS
Step 6:   Create offline.html
Step 7:   Create useOnlineStatus + OfflineBanner
Step 8:   Generate + add Apple splash screens
Step 9:   Create useInstallPrompt + InstallBanner
Step 10:  Enhance useDesignSave with offline queue
Step 11:  Push notifications (defer to Phase 7)

Run Lighthouse audit after Step 7. Fix any issues. Then proceed to 8-10.
```

---

*Polamuse PWA Implementation — Production Grade*
*11 steps · 14 new files · 5 modified files · 1 new dependency*
*Covers: installability, offline, caching, safe areas, splash screens, install UX, push notifications*
