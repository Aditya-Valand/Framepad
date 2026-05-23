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

**Framepad** (branded "Polamuse") is a client-side Polaroid/instant photo frame editor. All processing happens in the browser — there is no backend.

**Stack:** Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · Zustand 5

### Routes

| Route | Purpose |
|-------|---------|
| `/` | Landing page (hero, templates, pricing sections) |
| `/editor` | Main photo editor |
| `/auth` | Auth page (scaffolded, no real auth) |
| `/order` | Order/checkout page (scaffolded) |

There is also a legacy `src/editor/App.tsx` — this is unused dead code, the active route is `src/app/editor/page.tsx`.

### State Management

A single Zustand store at `src/store/index.ts` manages all editor state. Key exported constants: `POLAROID_TEMPLATES` (13 template presets) and `FILTER_PRESETS` (6 filter presets: none, vintage, film, sepia, bw, faded). Key types: `FrameData`, `TemplateId`, `FilterValues`.

### Editor Layout

- **Desktop (≥ lg / 1024px):** Left icon sidebar (72px) → center canvas → right control panel (320px)
- **Mobile (< lg):** Glass header → center canvas → bottom sheet overlay → bottom tab bar

The layout is two sibling `div`s in `src/app/editor/page.tsx` — one with `className="lg:hidden flex flex-col"` and one with `className="hidden lg:flex"`. **Critical:** never put `display` in an inline `style` prop on these elements — inline styles override Tailwind responsive classes, causing both layouts to render simultaneously.

Control panels: `src/components/panels/` — `FramePanel`, `EditPanel`, `TextPanel`, `MusicPanel`. On desktop these render in the right aside; on mobile they render inside `BottomSheet`.

### Canvas Rendering

`src/hooks/usePolaroidCanvas.ts` is the most complex file. It draws directly to a `<canvas>` element using the 2D Context API (not a third-party canvas library): composites the frame color, image (with pan/zoom/rotate and CSS filter effects), text overlays, and Spotify scan code. It also owns PNG export.

Supporting hooks:
- `useImageUpload` — File → dataURL
- `useImageColors` — extracts a palette from the uploaded photo (used to populate "From photo" colour swatches)
- `useTransparentSpotifyCode` — fetches from `scannables.scdn.co`, then uses an OffscreenCanvas to remove the white background for the "transparent" background variant

### Export Mechanism

PNG export uses a hidden-element handshake. `PolaroidView.tsx` wires its `exportPNG` callback to `document.getElementById('export-btn-inner').onclick`. The UI export buttons (mobile header, desktop sidebar) find that element and call `.click()` on it. The `<span id="export-btn-inner">` lives inside the mobile `ExportButton` component. Never rename or remove this element.

### Hydration

`EditorPage` gates rendering behind a `mounted` state (set in `useEffect`). Before mount it returns a spinner. This prevents SSR/CSR mismatches because the canvas and pointer-event logic is client-only.

### Editor CSS Scope

`src/app/editor/editor.css` is imported via `src/app/editor/layout.tsx`, scoping it to the `/editor` route segment. It:
- Overrides landing-page body styles (font, background, grain overlay)
- Defines the custom range slider track (fill colour driven by a `--fill` CSS variable set inline)
- Adds the `.scrollbar-hide` utility and a thin brand-coloured scrollbar for `<aside>` elements

### Styling Approach

The editor uses **Tailwind for layout/responsive classes** and **inline styles for all visual properties** (colour, shadow, border, transition). This split exists because the design uses sub-pixel borders (`0.5px`), rgba values, and backdrop-filter that are easier to express inline than through Tailwind's JIT.

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

Fonts loaded in `src/app/layout.tsx`: Cormorant Garamond, DM Sans, Dancing Script, Courier Prime, Montserrat, Bebas Neue, and several script fonts used as text overlay options in TextPanel.

### Path Aliases

`@/*` resolves to `src/*` (configured in `tsconfig.json`).

use the D:\downloads\framepad\docs\implementation.md for implementation also but keep in mind that design and ui is also perfect like if uh want to make something uh just need to add on and not ruin the current design uh are allow to modift but not ruin