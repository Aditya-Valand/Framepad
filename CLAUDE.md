# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server at localhost:3000
npm run build    # Production build
npm run lint     # ESLint checks
npm run start    # Start production server
```

No test suite is configured.

## Architecture

**Framepad** (branded "Polamuse") is a Polaroid/instant photo frame editor with a full e-commerce backend for ordering printed photos.

**Stack:** Next.js 16 canary (App Router) · React 19 · TypeScript · Tailwind CSS 4 · Zustand 5 · Neon Postgres (`@neondatabase/serverless`) · Cloudinary (image hosting) · Razorpay (payments) · Resend (transactional email)

### Routes

| Route | Purpose |
|-------|---------|
| `/` | Landing page (hero, templates, pricing sections) |
| `/editor` | Main photo editor — client-side canvas rendering |
| `/designs` | Saved designs gallery (authenticated) |
| `/order` | Cart → checkout → payment flow (authenticated) |
| `/order/[id]` | Order detail/tracking |
| `/account` | User profile & addresses |
| `/auth` | Login/signup/forgot-password/reset-password |
| `/admin` | Admin dashboard (orders, print queue, pricing, coupons, users, analytics, settings, announcements) |

There is a legacy `src/editor/App.tsx` — this is unused dead code, the active route is `src/app/editor/page.tsx`.

### Backend (API Routes)

All API routes live under `src/app/api/`. Patterns:

- **Auth:** JWT access+refresh tokens in httpOnly cookies. `src/middleware.ts` verifies tokens and injects `x-user-id`, `x-user-role`, `x-user-email` headers. API route handlers read identity from these headers via helpers in `src/lib/api.ts` (`userId()`, `userRole()`, `userEmail()`).
- **Database:** Neon serverless Postgres via `sql` tagged template from `src/lib/db.ts`. No ORM — raw SQL throughout.
- **Validation:** Zod schemas in `src/lib/validations.ts`.
- **Uploads:** Cloudinary signed uploads via `src/lib/cloudinary.ts` and `/api/uploads/sign`.
- **Payments:** Razorpay integration via `src/lib/razorpay.ts`, webhook at `/api/payments/webhook`.
- **Email:** Resend via `src/lib/resend.ts`, React Email templates in `src/components/emails/`.
- **Print fulfillment:** `src/lib/printSheetGenerator.ts` bin-packs ordered designs onto A4 sheets at 300 DPI using the `canvas` (node-canvas) package.

Admin routes (`/api/admin/*`) require `role === 'admin'` enforced in middleware.

### State Management

Two Zustand stores:
- `src/store/index.ts` — editor state. Key exports: `POLAROID_TEMPLATES` (template presets), `FILTER_PRESETS` (filter presets: none, vintage, film, sepia, bw, faded). Key types: `FrameData`, `TemplateId`, `FilterValues`.
- `src/store/cart.ts` — shopping cart with `persist` middleware (localStorage).

### Editor Layout

- **Desktop (≥ lg / 1024px):** Left icon sidebar (72px) → center canvas → right control panel (320px)
- **Mobile (< lg):** Glass header → center canvas → bottom sheet overlay → bottom tab bar

The layout is two sibling `div`s in `src/app/editor/page.tsx` — one with `className="lg:hidden flex flex-col"` and one with `className="hidden lg:flex"`. **Critical:** never put `display` in an inline `style` prop on these elements — inline styles override Tailwind responsive classes, causing both layouts to render simultaneously.

Control panels: `src/components/panels/` — `FramePanel`, `EditPanel`, `TextPanel`, `MusicPanel`. On desktop these render in the right aside; on mobile they render inside `BottomSheet`.

### Canvas Rendering

`src/hooks/usePolaroidCanvas.ts` is the most complex file. It draws directly to a `<canvas>` element using the 2D Context API: composites frame color, image (with pan/zoom/rotate and CSS filter effects), text overlays, and Spotify scan code. It also owns PNG export.

Supporting hooks:
- `useImageUpload` — File → dataURL
- `useImageColors` — extracts a palette from the uploaded photo (populates "From photo" colour swatches)
- `useTransparentSpotifyCode` — fetches from `scannables.scdn.co`, strips white background via OffscreenCanvas
- `useDesignSave` — persists designs to backend (Cloudinary + DB)
- `useBatchExport` — multi-design export
- `useAuth` — auth state, login/signup/logout
- `useRazorpay` — payment flow

### Export Mechanism

PNG export uses a hidden-element handshake. `PolaroidView.tsx` wires its `exportPNG` callback to `document.getElementById('export-btn-inner').onclick`. The UI export buttons find that element and call `.click()` on it. The `<span id="export-btn-inner">` lives inside the mobile `ExportButton` component. Never rename or remove this element.

### Hydration

`EditorPage` gates rendering behind a `mounted` state (set in `useEffect`). Before mount it returns a spinner. This prevents SSR/CSR mismatches because the canvas and pointer-event logic is client-only.

### Editor CSS Scope

`src/app/editor/editor.css` is imported via `src/app/editor/layout.tsx`, scoping it to the `/editor` route segment. It overrides landing-page body styles, defines the custom range slider track (fill colour driven by `--fill` CSS variable), and adds `.scrollbar-hide`.

The admin panel similarly has `src/app/admin/admin.css` imported via its own layout.

### Styling Approach

The editor uses **Tailwind for layout/responsive classes** and **inline styles for all visual properties** (colour, shadow, border, transition). This split exists because the design uses sub-pixel borders (`0.5px`), rgba values, and backdrop-filter that are easier to express inline.

Core design tokens used across inline styles:

| Role | Value |
|------|-------|
| Canvas background | `#EDE6DC` → `#DDD4C8` gradient |
| Panel background | `#FFFCF8` |
| Glass surface | `rgba(251,248,244,0.97)` + `backdrop-filter: blur(20px)` |
| Brand brown | `#8B6F5C` / hover `#7A6050` / active `#6B4F3A` |
| Dark text | `#1A1714` |
| Medium text | `#5C4A3A` |
| Muted text | `#A39080` |
| System border | `0.5px solid rgba(26,23,20,0.08)` |

### UI Components

Shared UI primitives live in `src/components/ui/` (Button, Card, Input, Select, Slider, Toggle, etc.) with a barrel export at `src/components/ui/index.ts`.

Admin-specific shell/navigation components are in `src/components/admin/`.

### Environment Variables

Required (see `.env.local`): `DATABASE_URL`, `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RESEND_API_KEY`.

### Path Aliases

`@/*` resolves to `src/*` (configured in `tsconfig.json`).

### Design Guidance

When modifying UI: add to the existing design, do not ruin it. Modifications are allowed but the current aesthetic must be preserved. Refer to `D:\downloads\framepad\docs\implementation.md` for implementation details.
