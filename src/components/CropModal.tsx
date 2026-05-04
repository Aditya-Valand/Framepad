import { useRef, useEffect, useState, useCallback } from 'react';

interface CropModalProps {
  imageDataUrl: string;
  aspectW: number;
  aspectH: number;
  initialPanX?: number;
  initialPanY?: number;
  initialScale?: number;
  onConfirm: (panX: number, panY: number, scale: number) => void;
  onClose: () => void;
}

/**
 * Full-screen crop UI.
 * Shows the image with a fixed aspect-ratio crop window.
 * User can drag and pinch to position what part of the image shows.
 * Outputs panX/panY (-100…100 %) and scale (0.5…4) relative to the
 * same coordinate system PolaroidView uses.
 */
export function CropModal({ imageDataUrl, aspectW, aspectH, initialPanX = 0, initialPanY = 0, initialScale = 1, onConfirm, onClose }: CropModalProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [imgNatural, setImgNatural] = useState({ w: 1, h: 1 });

  // Current position state (% of crop window)
  const [panX, setPanX] = useState(initialPanX);
  const [panY, setPanY] = useState(initialPanY);
  const [imgScale, setImgScale] = useState(initialScale);

  // Gesture baseline refs
  const gesture = useRef({
    dragging: false, dragId: -1,
    startCX: 0, startCY: 0,
    origPX: 0, origPY: 0,
    pinching: false,
    pid0: -1, pid1: -1,
    initP0: { x: 0, y: 0 }, initP1: { x: 0, y: 0 },
    initDist: 0, origScale: 1,
  });
  const ptrs = useRef(new Map<number, { x: number; y: number }>());

  // fresh-value refs so event handlers don't go stale
  const panRef = useRef({ panX, panY, imgScale });
  useEffect(() => { panRef.current = { panX, panY, imgScale }; }, [panX, panY, imgScale]);

  // Compute the crop window size that fits in the screen
  const [cropSize, setCropSize] = useState({ w: 300, h: 400 });
  useEffect(() => {
    const update = () => {
      const vw = window.innerWidth - 32;
      const vh = window.innerHeight - 180; // leave room for header/buttons
      const scaleX = vw / aspectW;
      const scaleY = vh / aspectH;
      const s = Math.min(scaleX, scaleY);
      setCropSize({ w: aspectW * s, h: aspectH * s });
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [aspectW, aspectH]);

  const setupGesture = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;

    const onDown = (e: PointerEvent) => {
      e.preventDefault();
      el.setPointerCapture(e.pointerId);
      ptrs.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
      const g = gesture.current;
      const p = panRef.current;

      if (ptrs.current.size === 1) {
        g.dragging = true; g.pinching = false;
        g.dragId = e.pointerId;
        g.startCX = e.clientX; g.startCY = e.clientY;
        g.origPX = p.panX; g.origPY = p.panY;
      } else if (ptrs.current.size === 2) {
        g.dragging = false; g.pinching = true;
        const ids = [...ptrs.current.keys()];
        g.pid0 = ids[0]; g.pid1 = ids[1];
        g.initP0 = { ...ptrs.current.get(ids[0])! };
        g.initP1 = { ...ptrs.current.get(ids[1])! };
        g.initDist = Math.hypot(g.initP1.x - g.initP0.x, g.initP1.y - g.initP0.y);
        g.origScale = p.imgScale;
        g.origPX = p.panX; g.origPY = p.panY;
      }
    };

    const onMove = (e: PointerEvent) => {
      if (!ptrs.current.has(e.pointerId)) return;
      e.preventDefault();
      ptrs.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
      const g = gesture.current;

      if (g.dragging && e.pointerId === g.dragId) {
        const dx = e.clientX - g.startCX;
        const dy = e.clientY - g.startCY;
        // convert px offset to % of crop window size
        setPanX(Math.max(-150, Math.min(150, g.origPX + (dx / cropSize.w) * 100)));
        setPanY(Math.max(-150, Math.min(150, g.origPY + (dy / cropSize.h) * 100)));
      }

      if (g.pinching) {
        const p0 = ptrs.current.get(g.pid0);
        const p1 = ptrs.current.get(g.pid1);
        if (!p0 || !p1) return;
        const nowDist = Math.hypot(p1.x - p0.x, p1.y - p0.y);
        if (g.initDist > 2) {
          const next = Math.max(0.5, Math.min(5, g.origScale * (nowDist / g.initDist)));
          setImgScale(next);
        }
      }
    };

    const onUp = (e: PointerEvent) => {
      ptrs.current.delete(e.pointerId);
      const g = gesture.current;
      if (e.pointerId === g.dragId) g.dragging = false;
      if (ptrs.current.size < 2) {
        g.pinching = false;
        if (ptrs.current.size === 1) {
          const [id, pos] = [...ptrs.current.entries()][0];
          const p = panRef.current;
          g.dragging = true; g.dragId = id;
          g.startCX = pos.x; g.startCY = pos.y;
          g.origPX = p.panX; g.origPY = p.panY;
        }
      }
    };

    el.addEventListener('pointerdown', onDown, { passive: false });
    el.addEventListener('pointermove', onMove, { passive: false });
    el.addEventListener('pointerup', onUp);
    el.addEventListener('pointercancel', onUp);
    return () => {
      el.removeEventListener('pointerdown', onDown);
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerup', onUp);
      el.removeEventListener('pointercancel', onUp);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cropSize.w, cropSize.h]);

  useEffect(setupGesture, [setupGesture]);

  const handleConfirm = () => {
    onConfirm(panX, panY, imgScale);
  };

  // Image display dimensions to fill crop window at scale 1
  const { w: cw, h: ch } = cropSize;
  const nat = imgNatural;
  // Fit natural image into cropSize maintaining aspect, then allow user to scale/pan
  const baseScale = Math.max(cw / nat.w, ch / nat.h);
  const displayW = nat.w * baseScale * imgScale;
  const displayH = nat.h * baseScale * imgScale;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90">
      {/* Header */}
      <div className="w-full flex items-center justify-between px-4 py-3" style={{ color: '#fff' }}>
        <button
          onClick={onClose}
          className="text-sm font-medium px-3 py-1.5 rounded-full"
          style={{ background: 'rgba(255,255,255,0.15)' }}
        >
          Cancel
        </button>
        <span className="text-sm font-medium" style={{ fontFamily: 'Inter, sans-serif', letterSpacing: '0.05em' }}>
          CROP
        </span>
        <button
          onClick={handleConfirm}
          className="text-sm font-semibold px-3 py-1.5 rounded-full"
          style={{ background: '#8B6F5C', color: '#fff' }}
        >
          Done
        </button>
      </div>

      {/* Crop window */}
      <div
        style={{
          width: cw,
          height: ch,
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 4,
          touchAction: 'none',
          userSelect: 'none',
          cursor: 'move',
        }}
        ref={containerRef}
      >
        {/* Grid overlay */}
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 2 }}>
          {/* 3×3 grid lines */}
          {[1, 2].map(i => (
            <div key={`v${i}`} style={{
              position: 'absolute', top: 0, bottom: 0,
              left: `${(i / 3) * 100}%`,
              width: 1, background: 'rgba(255,255,255,0.35)',
            }} />
          ))}
          {[1, 2].map(i => (
            <div key={`h${i}`} style={{
              position: 'absolute', left: 0, right: 0,
              top: `${(i / 3) * 100}%`,
              height: 1, background: 'rgba(255,255,255,0.35)',
            }} />
          ))}
          {/* Border */}
          <div style={{
            position: 'absolute', inset: 0,
            border: '2px solid rgba(255,255,255,0.8)',
            borderRadius: 4, boxSizing: 'border-box',
          }} />
        </div>

        {/* Image */}
        <img
          ref={imgRef}
          src={imageDataUrl}
          alt="crop"
          draggable={false}
          onLoad={(e) => {
            const img = e.currentTarget;
            setImgNatural({ w: img.naturalWidth, h: img.naturalHeight });
          }}
          style={{
            position: 'absolute',
            width: displayW,
            height: displayH,
            left: cw / 2 + (panX / 100) * cw - displayW / 2,
            top: ch / 2 + (panY / 100) * ch - displayH / 2,
            pointerEvents: 'none',
            userSelect: 'none',
            draggable: false,
          } as React.CSSProperties}
        />
      </div>

      {/* Hint */}
      <p className="mt-3 text-xs" style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'Inter, sans-serif' }}>
        Drag to reposition · Pinch to zoom
      </p>
    </div>
  );
}
