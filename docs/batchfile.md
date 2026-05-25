# Batch Mode — "Apply Template to Multiple Photos"

> **Goal:** User creates one design (template + frame + text + filters + music), then applies it to multiple photos in one go — producing N polaroids with the same style but different images.

---

## UX Flow

```
1. User creates a design in /editor (picks template, adjusts frame, adds text/filters/music)
2. User clicks "Batch Apply" button (new, beside Export)
3. Opens BatchModal — drag/drop or pick multiple photos (max 20)
4. Thumbnails preview in grid, each showing the template applied to that photo
5. User can reorder / remove individual photos
6. Click "Export All" → downloads ZIP of PNGs (or individual downloads)
7. If logged in → option to "Save All to My Designs" (creates N designs in DB)
```

---

## Architecture Decision

**100% client-side rendering** — no server involvement for the actual batch processing.

Why:
- The canvas renderer (`renderFrameToCanvas`) already works standalone
- No Cloudinary cost per batch item (images stay as local dataURLs)
- No server load — user's browser does all the work
- Only hits server if user chooses "Save All" (optional, creates N design records)

---

## Files to Create / Modify

| File | Action | Purpose |
|------|--------|---------|
| `src/components/BatchModal.tsx` | **CREATE** | Full-screen modal: upload, preview grid, export |
| `src/components/BatchPreviewCard.tsx` | **CREATE** | Single card in batch grid — renders canvas preview |
| `src/hooks/useBatchExport.ts` | **CREATE** | Orchestrates rendering N canvases + ZIP download |
| `src/app/editor/page.tsx` | MODIFY | Add "Batch" button + modal trigger |
| `src/store/index.ts` | MODIFY | Add `batchImages` state (temporary, not persisted) |
| `src/app/api/designs/batch/route.ts` | **CREATE** | POST — bulk-create designs (optional save-all) |

---

## Detailed Implementation

### 1. Store Changes (`src/store/index.ts`)

Add to `AppState`:

```typescript
// Batch mode state (transient — never saved to DB or localStorage)
batchImages: BatchImage[];
setBatchImages: (images: BatchImage[]) => void;
addBatchImages: (images: BatchImage[]) => void;
removeBatchImage: (id: string) => void;
reorderBatchImages: (fromIndex: number, toIndex: number) => void;
clearBatch: () => void;

// Type
interface BatchImage {
  id: string;           // crypto.randomUUID()
  file: File;           // original File reference
  dataUrl: string;      // base64 for canvas rendering
  fileName: string;     // original filename (used in export)
  status: 'pending' | 'rendering' | 'done' | 'error';
  exportDataUrl?: string; // final rendered PNG dataUrl
}
```

Initial state:
```typescript
batchImages: [],
```

### 2. BatchModal Component (`src/components/BatchModal.tsx`)

**Layout:**
```
┌────────────────────────────────────────────────┐
│  [×]                 Batch Apply                │
├────────────────────────────────────────────────┤
│                                                │
│  ┌──────────────────────────────────────────┐  │
│  │  Drop photos here or click to browse     │  │
│  │  (max 20 photos, JPG/PNG/WEBP, 10MB ea) │  │
│  └──────────────────────────────────────────┘  │
│                                                │
│  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐    │
│  │ img │ │ img │ │ img │ │ img │ │ img │    │
│  │  1  │ │  2  │ │  3  │ │  4  │ │  5  │    │
│  └─────┘ └─────┘ └─────┘ └─────┘ └─────┘    │
│  ┌─────┐ ┌─────┐ ┌─────┐                     │
│  │ img │ │ img │ │ img │                     │
│  │  6  │ │  7  │ │  8  │                     │
│  └─────┘ └─────┘ └─────┘                     │
│                                                │
│  Using: Polaroid 600 · Vintage filter         │
│  Text: "summer '24" · Spotify: ✓              │
│                                                │
│  ┌──────────────┐  ┌────────────────────────┐  │
│  │  Export All  │  │  Save All to Designs   │  │
│  └──────────────┘  └────────────────────────┘  │
└────────────────────────────────────────────────┘
```

**Key behaviors:**
- Upload area: `<input type="file" multiple accept="image/*" />`
- Drag & drop zone with visual feedback
- Each photo processed through the same compression logic from `useImageUpload` (reuse `processFile`)
- Preview cards render using `renderFrameToCanvas` with the current frame settings + each photo's dataUrl
- Remove button (×) on each card
- Progress bar during export

**Current template info** displayed below grid:
- Read from `useStore` — show template name, active filter, text, music status
- This confirms to user what settings will be applied

### 3. BatchPreviewCard (`src/components/BatchPreviewCard.tsx`)

```typescript
interface BatchPreviewCardProps {
  image: BatchImage;
  frameData: FrameData;  // current template/settings from store
  onRemove: () => void;
  index: number;
}
```

- Renders a small canvas (200×250 or proportional)
- Calls `renderFrameToCanvas(mergedFrameData, canvas)` where `mergedFrameData` = current frame settings + this photo's `dataUrl` as `imageDataUrl`
- Shows filename below
- × button top-right to remove
- Subtle index number

### 4. useBatchExport Hook (`src/hooks/useBatchExport.ts`)

```typescript
export function useBatchExport() {
  const [progress, setProgress] = useState({ current: 0, total: 0, phase: 'idle' });

  const exportAll = useCallback(async (
    batchImages: BatchImage[],
    frameData: FrameData,
    options: { format: 'zip' | 'individual'; saveToCloud?: boolean }
  ) => {
    setProgress({ current: 0, total: batchImages.length, phase: 'rendering' });

    const results: { fileName: string; dataUrl: string }[] = [];

    for (let i = 0; i < batchImages.length; i++) {
      const img = batchImages[i];

      // Create offscreen canvas at full resolution
      const canvas = document.createElement('canvas');
      const mergedFrame: FrameData = {
        ...frameData,
        imageDataUrl: img.dataUrl,
        // Keep all other settings (template, filters, text, music, etc.)
      };

      // renderFrameToCanvas is async (loads image), wait for it
      await renderFrameToCanvasAsync(mergedFrame, canvas);

      const exportDataUrl = canvas.toDataURL('image/png', 1.0);
      const baseName = img.fileName.replace(/\.[^.]+$/, '');
      results.push({ fileName: `${baseName}_polamuse.png`, dataUrl: exportDataUrl });

      setProgress({ current: i + 1, total: batchImages.length, phase: 'rendering' });
    }

    if (options.format === 'zip') {
      setProgress({ current: 0, total: 1, phase: 'zipping' });
      await downloadAsZip(results);
    } else {
      // Download individually with small delay between
      for (const r of results) {
        triggerDownload(r.dataUrl, r.fileName);
        await sleep(200); // prevent browser blocking multiple downloads
      }
    }

    setProgress({ current: 0, total: 0, phase: 'idle' });
    return results;
  }, []);

  return { exportAll, progress };
}
```

**ZIP generation** — use `JSZip` library (lightweight, browser-only):
```bash
npm install jszip
# ~44KB gzipped, no server needed
```

```typescript
import JSZip from 'jszip';

async function downloadAsZip(files: { fileName: string; dataUrl: string }[]) {
  const zip = new JSZip();
  for (const f of files) {
    const base64 = f.dataUrl.split(',')[1];
    zip.file(f.fileName, base64, { base64: true });
  }
  const blob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `polamuse_batch_${Date.now()}.zip`;
  a.click();
  URL.revokeObjectURL(url);
}
```

**renderFrameToCanvasAsync** — promisified version of `renderFrameToCanvas`:

```typescript
function renderFrameToCanvasAsync(frameData: FrameData, canvas: HTMLCanvasElement): Promise<void> {
  return new Promise((resolve) => {
    // If no image, renderFrameToCanvas is synchronous
    if (!frameData.imageDataUrl && !frameData.imageUrl) {
      renderFrameToCanvas(frameData, canvas);
      resolve();
      return;
    }

    // Patch renderFrameToCanvas to call back on image load
    // OR: re-implement the render inline with onload → resolve()
    const img = new Image();
    img.onload = () => {
      renderFrameToCanvas(frameData, canvas);
      // Wait a tick for the internal onload to fire
      setTimeout(resolve, 50);
    };
    img.src = frameData.imageDataUrl || frameData.imageUrl || '';
  });
}
```

> **NOTE:** The current `renderFrameToCanvas` has an internal `img.onload` callback. For batch, we need a proper async version. Options:
> 1. Add a `callback` param to `renderFrameToCanvas` → `renderFrameToCanvas(frameData, canvas, opts, onComplete)`
> 2. Create `renderFrameToCanvasAsync` wrapper that uses a MutationObserver or timeout
> 3. Refactor `renderFrameToCanvas` to return a Promise
>
> **Recommended:** Option 3 — refactor to return `Promise<void>`. Non-breaking since callers can ignore the promise.

### 5. Editor Page Changes (`src/app/editor/page.tsx`)

Add a "Batch" button:
- **Mobile:** In the glass header, between Save and Export
- **Desktop:** In the left icon sidebar, new icon below Export

On click → open `<BatchModal />` (full-screen overlay like the existing ExportSuccessModal pattern)

```typescript
const [showBatch, setShowBatch] = useState(false);

// In JSX:
{showBatch && <BatchModal onClose={() => setShowBatch(false)} />}
```

**Button should only show when an image is loaded** — batch makes no sense without a template + settings configured first.

### 6. Bulk Save API (Optional) — `src/app/api/designs/batch/route.ts`

```typescript
// POST /api/designs/batch
// Auth: required
// Body: { designs: Array<{ canvas_state, title? }> }
// Returns: { created: number, ids: string[] }
//
// Max 20 designs per request (match client limit)
// Each design gets the same template_id, filter_preset, etc.
// Only imageDataUrl differs (or cloudinaryId if uploaded)

export async function POST(req: Request) {
  const uid = userId(req);
  if (!uid) return err('Unauthorized', 401);

  const { designs } = await req.json();
  if (!Array.isArray(designs) || designs.length === 0 || designs.length > 20) {
    return err('1-20 designs required', 400);
  }

  const ids: string[] = [];
  for (const d of designs) {
    const canvasState = d.canvas_state;
    const frameData = canvasState?.frameData;
    if (!frameData) continue;

    const [design] = await sql`
      INSERT INTO designs (user_id, canvas_state, title, frame_style, filter_preset, status, source)
      VALUES (
        ${uid},
        ${JSON.stringify(canvasState)},
        ${d.title || null},
        ${frameData.frameStyle || 'classic'},
        ${detectFilterPreset(frameData.filters)},
        'draft',
        'batch'
      )
      RETURNING id`;
    ids.push(design.id);
  }

  return ok({ created: ids.length, ids }, 201);
}
```

---

## Middleware Update

Add `/api/designs/batch` to protected API routes (already covered by `/api/designs` prefix in current middleware).

---

## Performance Considerations

| Concern | Solution |
|---------|----------|
| Memory with 20 large images | Process sequentially, not all at once. Release each canvas after export. |
| Browser tab freezing | Use `requestIdleCallback` or chunk processing with `await new Promise(r => setTimeout(r, 0))` between renders |
| Large ZIP files | Stream-generate ZIP. For 20 images × 2MB each = ~40MB — browsers handle this fine |
| Cloudinary uploads | **Don't upload batch images to Cloudinary during batch** — only on explicit "Save All". Prevents waste. |
| Guest users | Batch export works without login. "Save All" requires login (show login prompt). |

---

## Dependency: JSZip

```bash
npm install jszip
npm install -D @types/jszip  # if needed (JSZip ships its own types)
```

No other new dependencies needed. Everything else uses existing:
- `renderFrameToCanvas` from `usePolaroidCanvas.ts`
- File processing from `useImageUpload.ts`
- Store from Zustand
- Canvas 2D API (native)

---

## What This Is NOT

This is **not** the Film Strip / Grid / Scrapbook layout feature from Phase 3. Those are about arranging multiple polaroids into a single composite image.

This batch feature is about: **"I love this template, now apply it to my 15 vacation photos and give me 15 individual polaroid PNGs."**

The layout modes (film strip, grid, scrapbook) can be built separately later as they involve a different UX (arranging positions, shared canvas).

---

## Implementation Order

| Step | Task | Time |
|------|------|------|
| 1 | Refactor `renderFrameToCanvas` → return Promise | 30 min |
| 2 | Add `BatchImage` type + store slice | 20 min |
| 3 | Create `BatchPreviewCard` component | 1 hr |
| 4 | Create `BatchModal` (upload + grid + controls) | 2–3 hrs |
| 5 | Create `useBatchExport` hook + ZIP logic | 1.5 hrs |
| 6 | Wire into editor page (button + modal) | 30 min |
| 7 | Create `/api/designs/batch` route (save-all) | 1 hr |
| 8 | Polish: progress bar, error states, mobile | 1 hr |

**Total: ~7–8 hours**

---

## Mobile UX

On mobile the BatchModal should be a full-screen sheet (same pattern as BottomSheet but taking 100% height):
- Upload area at top
- Scrollable grid of previews
- Sticky footer with Export/Save buttons
- Progress overlay during export

---

## Edge Cases

1. **User changes template after adding batch photos** → Re-render all previews (debounced, 500ms)
2. **User removes the main image from editor** → Batch still works (template settings apply, each batch photo IS the image)
3. **Duplicate filenames** → Append index: `photo_polamuse_1.png`, `photo_polamuse_2.png`
4. **Browser crash during export** → Show "Export in progress, don't close this tab" warning via `beforeunload`
5. **Mixed orientations** → Each photo uses cover-fit (same as single editor), crop to frame aspect ratio

---

## Database Impact

- **New `source` value:** `'batch'` in the designs table `source` column ← already supports arbitrary varchar(20)
- No new tables needed
- No schema migration required
- Batch designs appear in "My Designs" page like any other design
