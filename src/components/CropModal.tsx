'use client';

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
  // Keep a ref so gesture event handlers (stale closures) always see the latest values
  const natRef = useRef(imgNatural);
  useEffect(() => { natRef.current = imgNatural; }, [imgNatural]);

  // Current position state (% of crop window)
  const [panX, setPanX] = useState(initialPanX);
  const [panY, setPanY] = useState(initialPanY);
  // Clamp to minimum 1 so image always covers the frame on open
  const [imgScale, setImgScale] = useState(Math.max(1, initialScale));

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
      const vh = window.innerHeight - 160; // leave room for header + hint + safe area
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
      const p = panRef.current;

      // Max pan so the image edge never exposes the void behind it
      const { w: cw, h: ch } = cropSize;
      const nat = natRef.current;
      const baseScaleNow = Math.max(cw / nat.w, ch / nat.h);
      const dispW = nat.w * baseScaleNow * p.imgScale;
      const dispH = nat.h * baseScaleNow * p.imgScale;
      const maxPX = Math.max(0, (dispW - cw) / cw * 50);
      const maxPY = Math.max(0, (dispH - ch) / ch * 50);

      if (g.dragging && e.pointerId === g.dragId) {
        const dx = e.clientX - g.startCX;
        const dy = e.clientY - g.startCY;
        setPanX(Math.max(-maxPX, Math.min(maxPX, g.origPX + (dx / cw) * 100)));
        setPanY(Math.max(-maxPY, Math.min(maxPY, g.origPY + (dy / ch) * 100)));
      }

      if (g.pinching) {
        const p0 = ptrs.current.get(g.pid0);
        const p1 = ptrs.current.get(g.pid1);
        if (!p0 || !p1) return;
        const nowDist = Math.hypot(p1.x - p0.x, p1.y - p0.y);
        if (g.initDist > 2) {
          const scaleFactor = nowDist / g.initDist;
          // Minimum 1 = image always covers the frame (no white border behind image)
          const next = Math.max(1, Math.min(4, g.origScale * scaleFactor));
          setImgScale(next);

          // Keep the finger midpoint fixed (zoom-to-cursor)
          const initMidX = (g.initP0.x + g.initP1.x) / 2;
          const initMidY = (g.initP0.y + g.initP1.y) / 2;
          const el = containerRef.current;
          if (el) {
            const rect = el.getBoundingClientRect();
            const relMidX = initMidX - rect.left - cw / 2;
            const relMidY = initMidY - rect.top  - ch / 2;
            const curPanOffX = (g.origPX / 100) * cw;
            const curPanOffY = (g.origPY / 100) * ch;
            const newPanOffX = relMidX - (relMidX - curPanOffX) * scaleFactor;
            const newPanOffY = relMidY - (relMidY - curPanOffY) * scaleFactor;
            // Recompute max pan with new scale
            const dispWNext = nat.w * baseScaleNow * next;
            const dispHNext = nat.h * baseScaleNow * next;
            const mxNext = Math.max(0, (dispWNext - cw) / cw * 50);
            const myNext = Math.max(0, (dispHNext - ch) / ch * 50);
            setPanX(Math.max(-mxNext, Math.min(mxNext, (newPanOffX / cw) * 100)));
            setPanY(Math.max(-myNext, Math.min(myNext, (newPanOffY / ch) * 100)));
          }
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
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      background: 'rgba(0,0,0,0.92)',
      paddingTop: 'env(safe-area-inset-top, 0px)',
      paddingBottom: 'env(safe-area-inset-bottom, 0px)',
    }}>
      {/* Header */}
      <div style={{
        width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 20px', flexShrink: 0,
      }}>
        <button
          onClick={onClose}
          style={{
            background: 'rgba(255,255,255,0.15)', color: '#fff',
            border: 'none', borderRadius: 100, padding: '8px 18px',
            fontSize: 14, fontWeight: 500, cursor: 'pointer',
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          Cancel
        </button>
        <span style={{ color: '#fff', fontSize: 13, fontWeight: 600, letterSpacing: '0.08em', fontFamily: "'DM Sans', sans-serif" }}>
          CROP
        </span>
        <button
          onClick={handleConfirm}
          style={{
            background: '#8B6F5C', color: '#fff',
            border: 'none', borderRadius: 100, padding: '8px 18px',
            fontSize: 14, fontWeight: 600, cursor: 'pointer',
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          Done
        </button>
      </div>

      {/* Crop window — vertically centered in remaining space */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, width: '100%' }}>
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
      <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 12, fontFamily: "'DM Sans', sans-serif", margin: 0 }}>
        Drag to reposition · Pinch to zoom
      </p>
      </div>
    </div>
  );
}
