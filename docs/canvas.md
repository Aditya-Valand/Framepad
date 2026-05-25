# Polamuse — Canvas & Editor Backend Integration Plan
> **Bridging the browser-side editor to production cloud save, ordering, and print-ready export**

---

## Current State Summary

The editor is **100% client-side** today. All canvas rendering, image manipulation, filter application, text overlays, and Spotify code compositing happens in the browser via the native Canvas 2D API. There is no backend involvement.

### What Works (Keep Intact)

| Feature | File | Status |
|---------|------|--------|
| Template system (13 presets) | `src/store/index.ts` | ✅ Perfect |
| Canvas render loop | `src/hooks/usePolaroidCanvas.ts` | ✅ Smooth |
| Image upload + compression | `src/hooks/useImageUpload.ts` | ✅ Fast |
| Pan/Zoom/Rotate gestures | `src/components/PolaroidView.tsx` | ✅ Fluid |
| Draggable text/music overlays | `src/components/DraggableOverlay.tsx` | ✅ Natural |
| Filter presets + sliders | `src/store/index.ts` + `EditPanel.tsx` | ✅ Instant |
| Image color extraction | `src/hooks/useImageColors.ts` | ✅ Fast |
| Transparent Spotify codes | `src/hooks/useTransparentSpotifyCode.ts` | ✅ Works |
| Rich templates (movie-poster, concert-ticket, vintage-color) | `usePolaroidCanvas.ts` | ✅ Beautiful |
| Crop modal | `src/components/CropModal.tsx` | ✅ Intuitive |
| 3× PNG export | `usePolaroidCanvas.ts` → `exportPNG()` | ✅ Crisp |

### What's Missing (Backend Needed)

| Feature | Dependency |
|---------|-----------|
| Save design to cloud | Auth + Cloudinary + DB |
| Load saved design | DB fetch + state hydration |
| Auto-save (debounced) | Auth + API |
| Guest → login intent preservation | localStorage bridge |
| Generate print-ready file (300 DPI) | Canvas export + Cloudinary |
| Design thumbnails | Canvas export + Cloudinary |
| Order integration | Design freeze + payment flow |
| Design versioning | DB design_versions table |
| Template sync from DB | API route + cache |

---

## Architecture Principle

```
┌─────────────────────────────────────────────────────────┐
│  BROWSER (unchanged smooth experience)                  │
│                                                         │
│  Zustand Store ──→ Canvas 2D Render ──→ HTML Preview    │
│       ↑                                      │          │
│       │  hydrate from                 exportPNG()       │
│       │  saved state                         │          │
│       │                                      ▼          │
│  ┌────┴────┐                        ┌──────────────┐   │
│  │ loadJSON │                        │ PNG Blob     │   │
│  └─────────┘                        └──────┬───────┘   │
│                                             │           │
└─────────────────────────────────────────────┼───────────┘
                                              │
                     ╔════════════════════════╪═══════════╗
                     ║  BACKEND (new)         │           ║
                     ║                        ▼           ║
                     ║  ┌─────────────────────────────┐  ║
                     ║  │  POST /api/designs          │  ║
                     ║  │  canvas_state (JSON)        │  ║
                     ║  │  thumbnail (Cloudinary)     │  ║
                     ║  │  export PNG (Cloudinary)    │  ║
                     ║  └─────────────────────────────┘  ║
                     ║              │                     ║
                     ║              ▼                     ║
                     ║  ┌─────────────────────────────┐  ║
                     ║  │  Neon PostgreSQL             │  ║
                     ║  │  designs.canvas_state (JSONB)│  ║
                     ║  │  design_versions             │  ║
                     ║  └─────────────────────────────┘  ║
                     ╚═══════════════════════════════════╝
```

---

## Key Design Decisions

### 1. Canvas State = Single Source of Truth

The `FrameData` interface from `src/store/index.ts` IS the canvas state. We serialize it as JSON and store it in `designs.canvas_state` (JSONB column).

```typescript
// What gets saved to DB
interface CanvasState {
  version: 1;                    // schema version for future migrations
  frameData: FrameData;          // exact Zustand frame state
  imageCloudinaryId?: string;    // Cloudinary public_id (replaces dataURL for cloud)
  imageOriginalUrl?: string;     // original uploaded image URL
}
```

### 2. Image Storage Strategy

**Problem:** `FrameData.imageDataUrl` is a base64 data URL (can be 2-5MB). We can't store that in the DB.

**Solution:** Upload image to Cloudinary on save, store only the `public_id` in canvas_state. On load, reconstruct the data URL from Cloudinary URL or use the URL directly.

```
Save flow:  dataURL → upload to Cloudinary → store public_id in canvas_state
Load flow:  public_id → Cloudinary URL → load into Image → set as imageDataUrl in store
```

### 3. No Fabric.js Migration

The current Canvas 2D implementation is smooth and lightweight. We keep it. No fabric.js dependency needed — the implementation.md's fabric.js references are aspirational; the current custom canvas code is superior for this use case because:
- Zero dependency weight
- Perfect control over render order
- Native CSS filters (GPU-accelerated)
- Sub-frame latency on gestures

---

## Implementation Phases

---

## Phase 1: Cloudinary Image Upload (replaces local-only dataURL)

**Files to create/modify:**

```
src/lib/cloudinary.ts            ← NEW: sign helper
src/app/api/uploads/sign/route.ts ← NEW: signed upload endpoint
src/hooks/useImageUpload.ts      ← MODIFY: add Cloudinary upload after compression
src/store/index.ts               ← MODIFY: add cloudinaryId to FrameData
```

### 1.1 — Server: Cloudinary Signature

```typescript
// src/lib/cloudinary.ts
import crypto from 'crypto';

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME!;
const API_KEY = process.env.CLOUDINARY_API_KEY!;
const API_SECRET = process.env.CLOUDINARY_API_SECRET!;

export function signUploadParams(params: Record<string, string>) {
  const sortedParams = Object.keys(params)
    .sort()
    .map((k) => `${k}=${params[k]}`)
    .join('&');
  const signature = crypto
    .createHash('sha256')
    .update(sortedParams + API_SECRET)
    .digest('hex');
  return { signature, timestamp: params.timestamp, apiKey: API_KEY, cloudName: CLOUD_NAME };
}
```

```typescript
// src/app/api/uploads/sign/route.ts
import { signUploadParams } from '@/lib/cloudinary';
import { userId } from '@/lib/api';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const uid = userId(req);
  if (!uid) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { folder = 'polamuse/uploads' } = await req.json();
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const params = { folder, timestamp };
  const signed = signUploadParams(params);

  return NextResponse.json({
    ...signed,
    uploadUrl: `https://api.cloudinary.com/v1_1/${signed.cloudName}/image/upload`,
  });
}
```

### 1.2 — Client: Upload to Cloudinary After File Selection

```typescript
// Addition to useImageUpload.ts
async function uploadToCloudinary(dataUrl: string): Promise<{ publicId: string; secureUrl: string } | null> {
  try {
    // Get signature from our API
    const signRes = await fetch('/api/uploads/sign', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ folder: 'polamuse/uploads' }),
    });
    const { signature, timestamp, apiKey, cloudName, uploadUrl } = await signRes.json();

    // Upload directly to Cloudinary (bypasses Vercel 4.5MB limit)
    const formData = new FormData();
    formData.append('file', dataUrl); // Cloudinary accepts base64 data URLs
    formData.append('signature', signature);
    formData.append('timestamp', timestamp);
    formData.append('api_key', apiKey);
    formData.append('folder', 'polamuse/uploads');

    const uploadRes = await fetch(uploadUrl, { method: 'POST', body: formData });
    const result = await uploadRes.json();
    return { publicId: result.public_id, secureUrl: result.secure_url };
  } catch {
    return null; // Fall back to local-only mode
  }
}
```

### 1.3 — Store Extension

```typescript
// Add to FrameData interface
export interface FrameData {
  // ... existing fields ...
  cloudinaryId: string | null;   // Cloudinary public_id for the uploaded image
  imageUrl: string | null;       // Cloudinary secure_url (used for cloud save/load)
}
```

**Critical:** `imageDataUrl` remains for instant rendering. `cloudinaryId` is populated async after upload completes. Both coexist — the canvas always renders from `imageDataUrl` for zero-latency preview.

---

## Phase 2: Design Save & Load

**Files to create/modify:**

```
src/app/api/designs/route.ts         ← NEW: GET (list) + POST (create)
src/app/api/designs/[id]/route.ts    ← NEW: GET + PUT + DELETE
src/hooks/useDesignSave.ts           ← NEW: save/load/autosave logic
src/store/index.ts                   ← MODIFY: add design metadata to state
```

### 2.1 — Canvas State Serialization

```typescript
// src/hooks/useDesignSave.ts
import { useStore, FrameData } from '@/store';

interface SerializedCanvasState {
  version: 1;
  frameData: Omit<FrameData, 'imageDataUrl'> & { imageDataUrl: null };
  // imageDataUrl is NEVER stored — too large
  // Instead, imageUrl (Cloudinary) is used to restore
}

export function serializeForSave(frame: FrameData): SerializedCanvasState {
  return {
    version: 1,
    frameData: {
      ...frame,
      imageDataUrl: null, // strip the base64 — use cloudinaryId/imageUrl to restore
    },
  };
}

export function deserializeFromLoad(state: SerializedCanvasState): Partial<FrameData> {
  // Return everything except imageDataUrl — that's loaded separately from Cloudinary URL
  return {
    ...state.frameData,
    imageDataUrl: null, // will be hydrated after image loads from URL
  };
}
```

### 2.2 — Save API

```typescript
// POST /api/designs
// Body: { canvasState, title?, templateId? }
// Returns: { id, created_at }

export async function POST(req: Request) {
  const uid = userId(req);
  const body = await req.json();
  const { canvasState, title, templateId } = body;

  // Extract searchable fields from canvas state for fast queries
  const frameData = canvasState.frameData;

  const [design] = await sql`
    INSERT INTO designs (
      user_id, template_id, title, canvas_state,
      frame_style, frame_color, has_caption, caption_text,
      has_top_label, top_label_text, has_spotify_code, spotify_uri,
      filter_preset, status
    ) VALUES (
      ${uid}, ${templateId || null}, ${title || 'Untitled'},
      ${JSON.stringify(canvasState)},
      ${frameData.frameStyle}, ${frameData.frameColor},
      ${!!frameData.bottomCaptionText}, ${frameData.bottomCaptionText || null},
      ${!!frameData.topLabelText}, ${frameData.topLabelText || null},
      ${!!frameData.musicUrl}, ${frameData.musicUrl || null},
      ${detectFilterPreset(frameData.filters)}, 'draft'
    ) RETURNING id, created_at`;

  // Save version
  await sql`
    INSERT INTO design_versions (design_id, version_number, canvas_state)
    VALUES (${design.id}, 1, ${JSON.stringify(canvasState)})`;

  return Response.json({ id: design.id, created_at: design.created_at }, { status: 201 });
}
```

### 2.3 — Load Design (Hydrate Editor)

```typescript
// src/hooks/useDesignSave.ts

export async function loadDesign(designId: string): Promise<void> {
  const res = await fetch(`/api/designs/${designId}`);
  const { canvas_state } = await res.json();

  const state = canvas_state as SerializedCanvasState;
  const frameData = deserializeFromLoad(state);

  // Hydrate the store with saved state
  const store = useStore.getState();
  store.updateFrame(store.activeFrameId, frameData);

  // Load image from Cloudinary URL (async, non-blocking)
  if (frameData.imageUrl) {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      // Convert to dataURL for the canvas (same as local upload flow)
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
      store.updateFrame(store.activeFrameId, { imageDataUrl: dataUrl });
    };
    img.src = frameData.imageUrl;
  }
}
```

### 2.4 — Auto-Save (Debounced)

```typescript
// src/hooks/useDesignSave.ts

export function useAutoSave(designId: string | null) {
  const frame = useStore((s) => s.frames.find((f) => f.id === s.activeFrameId));
  const saveTimerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (!designId || !frame) return;

    // Clear previous timer
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);

    // Debounce: save 3 seconds after last change
    saveTimerRef.current = setTimeout(async () => {
      const serialized = serializeForSave(frame);
      await fetch(`/api/designs/${designId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ canvasState: serialized }),
      });
    }, 3000);

    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, [frame, designId]);
}
```

---

## Phase 3: Thumbnail Generation

**Purpose:** The `/designs` page shows a grid of saved designs with preview thumbnails.

### 3.1 — Client-Side Thumbnail (at save time)

```typescript
// Generate a small thumbnail (240px wide) from the canvas
export function generateThumbnail(canvas: HTMLCanvasElement): Promise<Blob | null> {
  return new Promise((resolve) => {
    const THUMB_WIDTH = 480; // 2x for retina
    const scale = THUMB_WIDTH / canvas.width;
    const thumbCanvas = document.createElement('canvas');
    thumbCanvas.width = THUMB_WIDTH;
    thumbCanvas.height = canvas.height * scale;
    const ctx = thumbCanvas.getContext('2d')!;
    ctx.drawImage(canvas, 0, 0, thumbCanvas.width, thumbCanvas.height);
    thumbCanvas.toBlob((blob) => resolve(blob), 'image/webp', 0.8);
  });
}
```

### 3.2 — Upload Thumbnail to Cloudinary

```typescript
// During save flow:
const thumbBlob = await generateThumbnail(canvasRef.current);
if (thumbBlob) {
  const thumbUrl = await uploadBlobToCloudinary(thumbBlob, 'polamuse/thumbnails');
  // Include in save payload
  await fetch(`/api/designs/${designId}`, {
    method: 'PUT',
    body: JSON.stringify({ canvasState, thumbnailUrl: thumbUrl }),
  });
}
```

---

## Phase 4: Print-Ready Export (High-DPI)

**Purpose:** When a user places an order, we need a 300 DPI print-ready PNG frozen at that moment.

### 4.1 — Export Resolution Calculation

```typescript
// Current export: 3× canvas pixels (good for screen, not for print)
// Print-ready: calculate based on physical print size

interface PrintConfig {
  widthMm: number;   // from print_sizes table
  heightMm: number;
  dpi: number;       // 300 for production
}

function calculatePrintPixels(config: PrintConfig) {
  const MM_TO_INCH = 25.4;
  return {
    width: Math.round((config.widthMm / MM_TO_INCH) * config.dpi),
    height: Math.round((config.heightMm / MM_TO_INCH) * config.dpi),
  };
}

// Example: Classic Polaroid (100mm × 125mm @ 300 DPI)
// → 1181 × 1476 pixels
// Example: Instax Mini (54mm × 86mm @ 300 DPI)
// → 638 × 1016 pixels
```

### 4.2 — Print-Ready Export Function

```typescript
// Modified exportPNG that renders at print DPI instead of fixed 3×
export function exportForPrint(
  frame: FrameData,
  printSize: { widthMm: number; heightMm: number },
  dpi = 300
): Promise<Blob | null> {
  const { width: targetW, height: targetH } = calculatePrintPixels({
    widthMm: printSize.widthMm,
    heightMm: printSize.heightMm,
    dpi,
  });

  // Scale factor to go from canvas units to print pixels
  const scaleX = targetW / frame.frameWidth;
  const scaleY = targetH / frame.frameHeight;
  const scale = Math.max(scaleX, scaleY); // use max to ensure full coverage

  return new Promise((resolve) => {
    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = targetW;
    exportCanvas.height = targetH;
    const ctx = exportCanvas.getContext('2d', { colorSpace: 'srgb' })!;
    ctx.scale(scale, scale);

    // ... same render logic as current exportPNG ...
    // (frame background → image with filters → overlays → text → music code)

    // After render complete:
    exportCanvas.toBlob((blob) => resolve(blob), 'image/png');
  });
}
```

### 4.3 — Print File Upload (on order confirmation)

```typescript
// Triggered after payment is confirmed
async function generateAndUploadPrintFile(designId: string, orderItemId: string) {
  // This runs client-side before redirecting to success page
  const frame = useStore.getState().frames.find(f => f.id === activeFrameId);
  if (!frame) return;

  const printBlob = await exportForPrint(frame, { widthMm: 100, heightMm: 125 });
  if (!printBlob) return;

  // Upload to Cloudinary in a protected folder
  const printUrl = await uploadBlobToCloudinary(printBlob, 'polamuse/print-ready');

  // Notify backend
  await fetch(`/api/orders/items/${orderItemId}/print-file`, {
    method: 'PUT',
    body: JSON.stringify({ printReadyUrl: printUrl }),
  });
}
```

---

## Phase 5: Guest Intent Preservation

**Purpose:** Guest users can freely use the editor. When they save/order, we prompt login, then restore their work.

### 5.1 — localStorage Auto-Save (Already Outlined)

```typescript
// Save entire frame state to localStorage on every change (debounced 2s)
const STORAGE_KEY = 'polamuse_pending_design';

export function useGuestAutoSave() {
  const frame = useStore((s) => s.frames.find((f) => f.id === s.activeFrameId));
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (!frame) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(frame));
    }, 2000);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [frame]);
}
```

### 5.2 — Restore After Login

```typescript
// On editor mount, check if there's a pending design
export function useRestorePendingDesign(isLoggedIn: boolean) {
  const updateFrame = useStore((s) => s.updateFrame);
  const activeFrameId = useStore((s) => s.activeFrameId);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return;

    const frameData = JSON.parse(saved) as FrameData;
    updateFrame(activeFrameId, frameData);

    // If logged in, auto-save to cloud and clear localStorage
    if (isLoggedIn) {
      saveToDB(frameData).then(() => {
        localStorage.removeItem(STORAGE_KEY);
      });
    }
  }, [isLoggedIn]);
}
```

---

## Phase 6: Design Freeze for Orders

**Purpose:** When an order is placed, the design must be "frozen" — subsequent edits don't affect what gets printed.

### 6.1 — Snapshot on Order

```typescript
// POST /api/orders — during order creation
// 1. Read current canvas_state from designs table
// 2. Render a snapshot PNG (the exact visual at order time)
// 3. Store snapshot URL in order_items.design_snapshot_url
// 4. This snapshot is what the print sheet system uses

// The design remains editable by the user, but the order
// references the frozen snapshot, NOT the live design.
```

### 6.2 — DB Design

The `order_items` table already has:
- `design_snapshot_url` — PNG frozen at payment time
- `print_ready_url` — high-res file for print

These are populated during the payment confirmation flow and are immutable after that.

---

## Phase 7: Template Sync from Database

**Purpose:** Templates currently live as constants in `src/store/index.ts`. For the production platform, templates should be manageable from the admin panel.

### 7.1 — API Route

```typescript
// GET /api/templates
// Returns all active templates with their canvas config
// Cached with ISR (revalidate every 24h — templates rarely change)

export async function GET() {
  const templates = await sql`
    SELECT id, slug, name, description, vibe, thumbnail_url,
           default_canvas_state, print_width_mm, print_height_mm,
           frame_ratio, orientation, frame_color,
           has_top_label, has_bottom_caption, is_premium
    FROM templates
    WHERE is_active = true
    ORDER BY sort_order`;

  return Response.json(templates, {
    headers: { 'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=3600' },
  });
}
```

### 7.2 — Hybrid Approach (Recommended)

Keep the 13 built-in templates as constants (zero-latency, works offline). Fetch DB templates on mount and merge:

```typescript
// In editor page initialization
const [dbTemplates, setDbTemplates] = useState<PolaroidTemplate[]>([]);

useEffect(() => {
  fetch('/api/templates')
    .then(r => r.json())
    .then(data => setDbTemplates(mapDbToTemplateFormat(data)))
    .catch(() => {}); // silently fail — built-in templates always available
}, []);

const allTemplates = [...POLAROID_TEMPLATES, ...dbTemplates];
```

---

## Phase 8: Multi-Frame / Batch Layouts (Future)

The current store already supports multiple frames (`frames: FrameData[]`). For batch layouts:

### Film Strip (3-4 side by side)

```typescript
// Export: composite all frames onto one wide canvas
async function exportFilmStrip(frames: FrameData[], gap = 32) {
  const totalW = frames.reduce((w, f) => w + f.frameWidth, 0) + gap * (frames.length - 1);
  const maxH = Math.max(...frames.map(f => f.frameHeight));

  const out = document.createElement('canvas');
  out.width = totalW * 3; // 3× for export
  out.height = maxH * 3;
  const ctx = out.getContext('2d')!;
  ctx.scale(3, 3);

  let x = 0;
  for (const frame of frames) {
    // Render each frame to a temp canvas, then draw onto composite
    const temp = await renderFrameToCanvas(frame);
    ctx.drawImage(temp, x, (maxH - frame.frameHeight) / 2);
    x += frame.frameWidth + gap;
  }

  return out.toBlob(null, 'image/png');
}
```

### Grid Layout (2×2, 3×3)

Same pattern but 2D positioning. Gap slider controls spacing.

### Scrapbook (free-position)

Each frame rendered as PNG, then placed with free drag/rotation on a master canvas. Already supported by the draggable overlay system.

---

## Database Schema Mapping

### `designs` table ↔ Editor State

| DB Column | Source in FrameData | Notes |
|-----------|-------------------|-------|
| `canvas_state` | Full `FrameData` (minus `imageDataUrl`) | JSONB, the source of truth |
| `template_id` | `templateId` → lookup in `templates` table | FK |
| `frame_style` | `frameStyle` | Indexed for queries |
| `frame_color` | `frameColor` | Indexed |
| `has_caption` | `!!bottomCaptionText` | Fast filter |
| `caption_text` | `bottomCaptionText` | Full-text searchable |
| `has_top_label` | `!!topLabelText` | Fast filter |
| `top_label_text` | `topLabelText` | — |
| `has_spotify_code` | `!!musicUrl` | Fast filter |
| `spotify_uri` | `musicUrl` | — |
| `filter_preset` | Detected from `filters` object | none/vintage/film/sepia/bw/faded |
| `thumbnail_url` | Generated at save time | Cloudinary URL |
| `export_url` | Generated on explicit export | Cloudinary URL |

### `design_versions` table

Every PUT to `/api/designs/:id` increments the version:

```sql
INSERT INTO design_versions (design_id, version_number, canvas_state)
SELECT $1, COALESCE(MAX(version_number), 0) + 1, $2
FROM design_versions WHERE design_id = $1;
```

---

## Performance Considerations

### 1. Image Loading on Design Restore

**Problem:** Loading a 2MB image from Cloudinary on design open adds latency.

**Solution:** Use Cloudinary transformations for progressive loading:
```
// Tiny placeholder (20px wide, blurred) — instant
https://res.cloudinary.com/xxx/image/upload/w_20,e_blur:1000/v1/polamuse/uploads/abc123

// Full quality — loads async
https://res.cloudinary.com/xxx/image/upload/q_auto,f_auto/v1/polamuse/uploads/abc123
```

### 2. Auto-Save Bandwidth

**Problem:** Saving 50KB JSON every 3 seconds on every slider drag.

**Solution:**
- Only save when user pauses (3s debounce is already correct)
- Diff detection: skip save if canvas_state hasn't changed (deep compare hash)
- Throttle to max 1 save per 10 seconds during rapid editing

```typescript
const lastSaveHashRef = useRef<string>('');
const json = JSON.stringify(serializeForSave(frame));
const hash = simpleHash(json);
if (hash === lastSaveHashRef.current) return; // skip
lastSaveHashRef.current = hash;
```

### 3. Export Performance

The 3× export (current) takes ~200ms. The 300 DPI print export may take ~500ms for large templates. This is acceptable since it only happens on order placement.

### 4. Canvas Render Smoothness

**Rule:** Never add async operations (fetch, DB calls) inside the render loop. The `render()` callback in `usePolaroidCanvas.ts` must remain synchronous (except for Image.onload which is already handled with render IDs to prevent stale draws).

---

## API Routes Summary

| Method | Route | Purpose |
|--------|-------|---------|
| POST | `/api/uploads/sign` | Get Cloudinary upload signature |
| GET | `/api/designs` | List user's designs (paginated) |
| POST | `/api/designs` | Create new design |
| GET | `/api/designs/[id]` | Get single design with canvas_state |
| PUT | `/api/designs/[id]` | Update design (auto-save or manual) |
| DELETE | `/api/designs/[id]` | Soft-delete design |
| POST | `/api/designs/[id]/export` | Generate + upload export PNG |
| GET | `/api/templates` | List active templates |

---

## Migration Checklist

### Store Changes (`src/store/index.ts`)

```typescript
// Add to FrameData interface:
cloudinaryId: string | null;
imageUrl: string | null;

// Add to AppState interface:
currentDesignId: string | null;        // null = new unsaved design
isSaving: boolean;
lastSavedAt: Date | null;
setDesignId: (id: string | null) => void;
setSaving: (saving: boolean) => void;

// Add to createFrame():
cloudinaryId: null,
imageUrl: null,
```

### New Hooks

| Hook | Purpose |
|------|---------|
| `useDesignSave` | Save/load/autosave design to/from API |
| `useGuestAutoSave` | localStorage persistence for guests |
| `useCloudinaryUpload` | Upload images + thumbnails to Cloudinary |

### Editor Page Changes (`src/app/editor/page.tsx`)

```typescript
// Add URL param support: /editor?id=xxx
// On mount:
// - If ?id param → load design from API
// - If localStorage has pending → restore
// - Otherwise → blank canvas (current behavior)

// Add save indicator in header:
// "Saved ✓" / "Saving..." / "Unsaved changes"
```

---

## Security Notes

1. **Cloudinary signatures** prevent unauthorized uploads — signed server-side only
2. **Design ownership** enforced via `WHERE user_id = x-user-id` on all design queries
3. **Canvas state validation** — validate JSONB structure on save (prevent XSS via stored content)
4. **Image URL validation** — only accept Cloudinary URLs from our account (no arbitrary image loading)
5. **Rate limiting** — auto-save calls should be rate-limited server-side (max 20/min per user)
6. **Print file access** — print-ready URLs use Cloudinary signed URLs (expire after 1 hour)

---

## What NOT to Change

| Component | Reason |
|-----------|--------|
| `usePolaroidCanvas.ts` render logic | Perfectly smooth, don't add async |
| `PolaroidView.tsx` gesture handling | Touch/mouse interactions are dialed in |
| `DraggableOverlay.tsx` | Natural drag feel, position calculation correct |
| `useImageColors.ts` | Fast palette extraction, no backend needed |
| `useTransparentSpotifyCode.ts` | Client-side OffscreenCanvas trick works perfectly |
| Zustand store structure | Flat, fast, reactive — just extend, don't restructure |
| Export button handshake (`export-btn-inner`) | Works across mobile/desktop layouts |
| CSS filter approach | GPU-accelerated, zero dependencies |
| Template presets as constants | Zero-latency, offline-capable fallback |

---

## Build Order (Recommended)

| Step | Task | Dependencies | Time |
|------|------|-------------|------|
| 1 | Cloudinary upload setup | Auth (done) | 3-4h |
| 2 | Save design API + hook | Step 1 | 4-5h |
| 3 | Load design from URL param | Step 2 | 2h |
| 4 | Auto-save (debounced PUT) | Step 2 | 2h |
| 5 | Thumbnail generation at save | Step 2 | 2h |
| 6 | Guest localStorage + restore | — | 2h |
| 7 | Print-ready DPI export | Step 1 | 3-4h |
| 8 | Design freeze on order | Step 7 | 2h |
| 9 | Template API (optional) | — | 2h |
| 10 | Film strip / grid export | — | 4-5h |

**Total: ~26-30 hours**

---

*This plan preserves the current editor's smoothness while adding the production backend layer needed for Polamuse's print-and-sell business model.*
