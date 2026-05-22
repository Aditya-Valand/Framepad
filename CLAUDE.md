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

**Stack:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · fabric.js 7 · Zustand 5

### Routes

| Route | Purpose |
|-------|---------|
| `/` | Landing page (hero, templates, pricing sections) |
| `/editor` | Main photo editor |
| `/auth` | Auth page (scaffolded) |
| `/order` | Order/checkout page (scaffolded) |

### State Management

A single Zustand store at `src/store/index.ts` manages all editor state. Key types:
- `FrameData` — per-frame state: image, text, filters, overlay position, template
- `TemplateId` — 13 presets (instax-mini, polaroid-600, movie-poster, concert-ticket, etc.)
- `FilterValues` — brightness, contrast, saturation, warmth adjustments
- `SidebarTab` — active panel (frame | edit | text | music)
- `LayoutMode` — single | filmstrip | grid | scrapbook

### Editor Layout

- **Desktop:** Left icon sidebar → center canvas (`PolaroidView.tsx`) → right control panel
- **Mobile:** Center canvas + bottom tab bar → `BottomSheet.tsx` slides up with panel content

Control panels live in `src/components/panels/`: `FramePanel`, `EditPanel`, `TextPanel`, `MusicPanel`.

### Canvas Rendering

`src/hooks/usePolaroidCanvas.ts` owns all fabric.js canvas logic: rendering frames, applying filters, compositing text/music overlays, and exporting PNG. This is the most complex file in the codebase.

Supporting hooks:
- `useImageUpload` — file → dataURL conversion
- `useImageColors` — palette extraction from uploaded images
- `useTransparentSpotifyCode` — Spotify QR code generation with alpha channel

### Path Aliases

`@/*` resolves to `src/*` (configured in `tsconfig.json`).

### Styling

Tailwind with custom tokens in `tailwind.config.js`:
- `app-bg` → `#F5F5F0`, `frame-white` → `#FFFFFF`, `text-primary` → `#1A1A1A`, `text-muted` → `#888880`, `border-gray` → `#E0DED8`, accent `#8B6F5C`

Fonts loaded via Google Fonts in `src/app/layout.tsx`: Cormorant Garamond, DM Sans, Dancing Script, Courier Prime, Montserrat.
