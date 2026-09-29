/**
 * Polamuse Service Worker
 * Strategy: Cache-first for static assets, network-first for pages/API.
 * Offline: serve cached shell for navigation requests.
 */

const CACHE_NAME   = 'polamuse-v1';
const SHELL_ROUTES = ['/', '/editor', '/designs', '/order', '/account', '/booth'];

const STATIC_EXTS  = ['.js', '.css', '.woff2', '.woff', '.ttf', '.svg', '.png', '.ico', '.webmanifest'];

// ── Install: pre-cache the app shell ─────────────────────────
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      cache.addAll([
        '/offline.html',
        '/favicon.svg',
        '/apple-touch-icon.png',
      ]).catch(() => { /* non-fatal */ })
    ).then(() => self.skipWaiting())
  );
});

// ── Activate: clean up old caches ────────────────────────────
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => k !== CACHE_NAME)
          .map((k) => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

// ── Fetch: routing strategy ───────────────────────────────────
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET, cross-origin, and API requests (network only)
  if (
    request.method !== 'GET' ||
    url.origin !== location.origin ||
    url.pathname.startsWith('/api/')
  ) return;

  // Static assets → cache-first
  const isStatic = STATIC_EXTS.some((ext) => url.pathname.endsWith(ext)) ||
                   url.pathname.startsWith('/_next/static/');

  if (isStatic) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((res) => {
          if (res.ok) {
            const clone = res.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return res;
        });
      })
    );
    return;
  }

  // Navigation (HTML pages) → network-first, offline fallback
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((res) => {
          if (res.ok) {
            const clone = res.clone();
            caches.open(CACHE_NAME).then((c) => c.put(request, clone));
          }
          return res;
        })
        .catch(async () => {
          // Serve cached page or offline shell
          const cached = await caches.match(request);
          if (cached) return cached;
          return caches.match('/offline.html') || new Response('Offline', { status: 503 });
        })
    );
  }
});
