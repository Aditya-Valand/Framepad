# Polamuse — Frontend Implementation Guide
> All new UI components, hooks, pages, and client-side logic.
> Follow existing patterns: Tailwind for layout, inline styles for visual properties.

---

## Existing Patterns (follow these)

- **Design tokens:** See CLAUDE.md for the full color/border/surface table. Never invent new colors — use the existing tokens.
- **Layout:** Tailwind responsive classes. Never put `display` in inline `style` on the editor layout divs.
- **Panels:** Desktop renders in right aside, mobile renders inside `BottomSheet`. All panels are in `src/components/panels/`.
- **State:** Zustand store at `src/store/index.ts` (editor) and `src/store/cart.ts` (cart with persist).
- **Export:** Hidden-element handshake via `#export-btn-inner` — never rename or remove.
- **Hydration:** `EditorPage` gates behind `mounted` state to prevent SSR mismatch.

---

## 1. Watermark on Free Exports

### Where: `src/hooks/usePolaroidCanvas.ts` — export function

The watermark is drawn onto the canvas at export time, then removed. It is never part of the saved design state.

**Implementation in the canvas 2D context (not fabric.js — the editor uses raw canvas):**

```typescript
function exportWithWatermark(canvas: HTMLCanvasElement): string {
  const ctx = canvas.getContext('2d')!;
  const scale = 2; // export at 2x
  
  // Draw watermark
  ctx.save();
  ctx.font = `${11 * scale}px "DM Sans", sans-serif`;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
  ctx.textAlign = 'right';
  ctx.textBaseline = 'bottom';
  ctx.fillText('polamuse.com', canvas.width - 10 * scale, canvas.height - 10 * scale);
  ctx.restore();

  const dataUrl = canvas.toDataURL('image/png');
  
  // Redraw without watermark (re-render the canvas)
  // ... trigger a re-render of the canvas to remove watermark
  
  return dataUrl;
}
```

**Better approach:** Export to an offscreen canvas so the visible canvas is never touched:

```typescript
function exportPNG(sourceCanvas: HTMLCanvasElement, withWatermark: boolean): string {
  const offscreen = document.createElement('canvas');
  offscreen.width = sourceCanvas.width;
  offscreen.height = sourceCanvas.height;
  const ctx = offscreen.getContext('2d')!;
  
  // Copy source
  ctx.drawImage(sourceCanvas, 0, 0);
  
  if (withWatermark) {
    ctx.font = '22px "DM Sans", sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'bottom';
    ctx.fillText('polamuse.com', offscreen.width - 20, offscreen.height - 20);
  }
  
  return offscreen.toDataURL('image/png');
}
```

### Watermark Removal Modal

New component: `src/components/WatermarkModal.tsx`

Shown when user taps "Download" and the design is not unlocked.

```
┌─────────────────────────────────────────┐
│                                         │
│  [Preview of design with watermark]     │
│                                         │
│  ─────────────────────────────────────  │
│                                         │
│  Download free                          │
│  Has a small watermark                  │
│                                         │
│  Remove watermark — ₹9        [Pay]     │
│  OR use 10 Pola Coins         [Use]     │
│  One-time. This design only.            │
│                                         │
└─────────────────────────────────────────┘
```

Two payment paths:
1. **₹9 direct** — opens Razorpay, calls `/api/designs/:id/unlock`
2. **10 coins** — calls `/api/coins/spend` with `feature: "watermark"`

Both paths → on success → download clean PNG immediately.

---

## 2. Coin Balance Header

### Where: Editor header (mobile glass header + desktop sidebar top)

Show coin balance as a small pill/badge when user is logged in.

```
[ 🪙 42 ]     ← tappable, opens coin purchase sheet
```

**Hook:** `src/hooks/useCoins.ts`

```typescript
export function useCoins() {
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchBalance = useCallback(async () => {
    try {
      const res = await fetch('/api/coins/balance');
      if (res.ok) {
        const data = await res.json();
        setBalance(data.balance);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchBalance(); }, [fetchBalance]);

  const refresh = fetchBalance;

  return { balance, loading, refresh };
}
```

Call `refresh()` after any coin spend or purchase to update the header.

---

## 3. Coin Purchase Sheet

New component: `src/components/CoinPurchaseSheet.tsx`

Mobile: renders inside `BottomSheet`. Desktop: renders as a modal.

```
┌─────────────────────────────────────────┐
│  Get Pola Coins                         │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │  Starter    50 coins     ₹29   │    │
│  └─────────────────────────────────┘    │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │  ★ Most Popular                 │    │
│  │  Popular   120 coins     ₹59   │    │
│  └─────────────────────────────────┘    │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │  Best Value  300 coins   ₹99   │    │
│  └─────────────────────────────────┘    │
│                                         │
│  Your balance: 42 coins                 │
│                                         │
└─────────────────────────────────────────┘
```

Styling: use existing card patterns with `#FFFCF8` background, brand brown border on the highlighted "Popular" pack. "Most Popular" badge uses brand brown fill with white text.

---

## 4. Coin History Page

New page: `src/app/account/coins/page.tsx`

Shows ledger entries grouped by day. Each entry:

```
+ 20 coins   Signup bonus              Sep 28
- 10 coins   Watermark removed         Sep 29
+ 120 coins  Purchased Popular pack    Sep 29
```

Green text for positive delta, muted text for negative.

---

## 5. Booth Mode

### New page: `src/app/booth/page.tsx`

Full-screen camera view, no editor chrome.

**Hook:** `src/hooks/useCamera.ts`

```typescript
export function useCamera() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [facing, setFacing] = useState<'user' | 'environment'>('user');
  const [stream, setStream] = useState<MediaStream | null>(null);

  const startCamera = async () => {
    // Stop any existing stream first
    if (stream) stream.getTracks().forEach(t => t.stop());
    
    const newStream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: facing, width: { ideal: 1920 }, height: { ideal: 1080 } },
      audio: false,
    });
    if (videoRef.current) videoRef.current.srcObject = newStream;
    setStream(newStream);
    return newStream;
  };

  const takeShot = (): string | null => {
    const video = videoRef.current;
    if (!video) return null;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d')!.drawImage(video, 0, 0);
    return canvas.toDataURL('image/jpeg', 0.92);
  };

  const switchCamera = () => setFacing(f => f === 'user' ? 'environment' : 'user');

  const stopCamera = () => {
    if (stream) { stream.getTracks().forEach(t => t.stop()); setStream(null); }
  };

  return { videoRef, startCamera, takeShot, switchCamera, stopCamera, facing };
}
```

### Booth UI Flow

1. **Camera view** — full screen, front camera default
2. User taps capture button
3. **Countdown:** 3 → 2 → 1 → flash (white overlay 200ms) → snap
4. Repeat 3 more times automatically (2 second gap between shots)
5. After 4 shots → animate film strip assembly
6. **Result view:** Film strip with 4 shots, download + share buttons

### Coin gate for booth

Free: 3 sessions per day (tracked in localStorage with date key).
Beyond 3: requires 8 coins. Check before opening camera.

```typescript
function canUseBooth(): boolean {
  const today = new Date().toISOString().slice(0, 10);
  const key = `booth_sessions_${today}`;
  const count = parseInt(localStorage.getItem(key) || '0');
  return count < 3;
}

function recordBoothUse() {
  const today = new Date().toISOString().slice(0, 10);
  const key = `booth_sessions_${today}`;
  const count = parseInt(localStorage.getItem(key) || '0');
  localStorage.setItem(key, String(count + 1));
}
```

---

## 6. Shared Canvas

### New page: `src/app/editor/shared/[id]/page.tsx`

Same editor layout but with shared session logic layered on top.

**Hook:** `src/hooks/useSharedSession.ts`

```typescript
export function useSharedSession(sessionId: string) {
  const [session, setSession] = useState<SharedSession | null>(null);
  const [mySlot, setMySlot] = useState<'a' | 'b' | null>(null);

  // SSE connection for live sync
  useEffect(() => {
    const es = new EventSource(`/api/sessions/${sessionId}/stream`);
    es.onmessage = (e) => {
      const data = JSON.parse(e.data);
      setSession(data);
    };
    return () => es.close();
  }, [sessionId]);

  // Determine which slot this user is (creator = a, joiner = b)
  useEffect(() => {
    if (!session) return;
    const creatorId = localStorage.getItem(`session_${sessionId}_slot`);
    if (creatorId === 'a' || creatorId === 'b') {
      setMySlot(creatorId as 'a' | 'b');
    } else {
      // First time joining — assign slot b (a was taken by creator)
      const slot = session.slot_a_filled ? 'b' : 'a';
      localStorage.setItem(`session_${sessionId}_slot`, slot);
      setMySlot(slot);
    }
  }, [session, sessionId]);

  const updateCanvas = useDebouncedCallback(async (canvasState: unknown) => {
    if (!mySlot) return;
    await fetch(`/api/sessions/${sessionId}/canvas`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ canvasState, slot: mySlot }),
    });
  }, 500);

  return { session, mySlot, updateCanvas };
}
```

### Shared Canvas UI

The editor shows two photo slots labeled with names:
- Slot A: Creator's photo + "From: {name}"
- Slot B: Joiner's photo + "From: {name}"

Each person can only drag/edit their own slot. Captions and stickers are shared (either person can add).

A "Share link" button generates a WhatsApp/copy link: `https://polamuse.com/editor/shared/{sessionId}`

Expiry countdown shown at top: "Session expires in 23h 45m"

---

## 7. Gift Order Flow

### Where: Extend `src/app/order/page.tsx`

Add a toggle at the top of the order form:

```
[ For myself ]  [ Send as a gift ]
```

When "Send as a gift" is selected, show additional fields:

```
Recipient's name:     [____________]
Recipient's email:    [____________]
Gift message:         [________________________]
                      [________________________]
                      [________________________]
                      We'll print this on a card.

☐ Keep it anonymous (don't show your name)
```

### Gift Upsell

If the user is ordering a single print and entering a different address:

```
┌─────────────────────────────────────────┐
│  Make it a surprise gift?               │
│                                         │
│  Add a gift note + kraft packaging      │
│  We'll ship it directly to them.        │
│                                         │
│  ₹79 → ₹149                            │
│                                         │
│  [Upgrade to Gift Send]   [No thanks]   │
└─────────────────────────────────────────┘
```

---

## 8. Add-ons at Checkout

### Where: `src/app/order/page.tsx` — after order summary, before payment

```
┌─────────────────────────────────────────┐
│  Make it more special?                  │
│                                         │
│  ☐ Gift wrap + ribbon          + ₹25   │
│    Kraft paper, brown ribbon, wax seal  │
│                                         │
│  ☐ Handwritten note card       + ₹20   │
│    We write your message by hand        │
│    [Message: ___________________]       │
│                                         │
│  ☐ Wooden polaroid magnet      + ₹49   │
│    Same design on a fridge magnet       │
│                                         │
│  ☐ Extra copy                  + ₹59   │
│    One for them, one for you            │
│                                         │
└─────────────────────────────────────────┘
```

Checkboxes use the brand brown active state. Note card shows a text input when selected. Order total updates live as add-ons are toggled.

---

## 9. Occasion Date Collection

### Where: `src/app/auth/page.tsx` — after successful signup (or as a post-signup prompt)

A soft prompt, not blocking:

```
┌─────────────────────────────────────────┐
│  One more thing (optional)              │
│                                         │
│  We'll remind you before special dates  │
│  so you can send a surprise memory.     │
│                                         │
│  Partner's birthday:  [____ / ____]     │
│  Best friend:         [____ / ____]     │
│                                         │
│  [Save]          [Skip for now]         │
└─────────────────────────────────────────┘
```

Also accessible from Account page: "My occasions" section.

---

## 10. New Pages Summary

| Page | Path | Auth |
|------|------|------|
| Booth Mode | `/booth` | No (free sessions), Yes (coin-gated) |
| Shared Canvas | `/editor/shared/[id]` | No (anyone with link) |
| Coin History | `/account/coins` | Yes |
| Gift Tracking (public) | `/order/track/[token]` | No |

---

## 11. New Components Summary

| Component | Location | Purpose |
|-----------|----------|---------|
| `WatermarkModal` | `src/components/WatermarkModal.tsx` | Download choice: free (watermarked) or pay |
| `CoinPurchaseSheet` | `src/components/CoinPurchaseSheet.tsx` | Buy coin packs |
| `CoinBadge` | `src/components/CoinBadge.tsx` | Header coin balance pill |
| `AddonsPanel` | `src/components/order/AddonsPanel.tsx` | Checkout add-on selection |
| `GiftFields` | `src/components/order/GiftFields.tsx` | Gift recipient form fields |
| `GiftUpsell` | `src/components/order/GiftUpsell.tsx` | Single → gift send upgrade prompt |
| `OccasionForm` | `src/components/OccasionForm.tsx` | Add/edit occasion dates |
| `BoothCamera` | `src/components/booth/BoothCamera.tsx` | Full-screen camera view |
| `BoothCountdown` | `src/components/booth/BoothCountdown.tsx` | 3-2-1 countdown overlay |
| `FilmStripResult` | `src/components/booth/FilmStripResult.tsx` | 4-shot result with share |
| `SharedCanvasEditor` | `src/components/shared/SharedCanvasEditor.tsx` | Dual-slot canvas view |
| `ShareLinkButton` | `src/components/shared/ShareLinkButton.tsx` | Copy/WhatsApp share |

---

## 12. New Hooks Summary

| Hook | Location | Purpose |
|------|----------|---------|
| `useCoins` | `src/hooks/useCoins.ts` | Coin balance + refresh |
| `useCamera` | `src/hooks/useCamera.ts` | getUserMedia + capture |
| `useSharedSession` | `src/hooks/useSharedSession.ts` | SSE sync + slot assignment |
| `useBoothSession` | `src/hooks/useBoothSession.ts` | 4-shot sequence + countdown |

---

## 13. New Zustand Store Additions

Add to `src/store/index.ts` or create `src/store/coins.ts`:

```typescript
// Coin balance in global state (for header display)
interface CoinState {
  balance: number | null;
  setBalance: (b: number) => void;
}
```

Booth state can be local (useState in the booth page) — doesn't need global store.

---

*Polamuse Frontend Implementation v2.1*
*New pages: 4 · New components: 12 · New hooks: 4*
