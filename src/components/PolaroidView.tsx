'use client';

import React, { useRef, useCallback, useState, useEffect } from 'react';
import { usePolaroidCanvas } from '@/hooks/usePolaroidCanvas';
import { useImageUpload } from '@/hooks/useImageUpload';
import { useStore } from '@/store';
import { DraggableOverlay } from '@/components/DraggableOverlay';
import { CropModal } from '@/components/CropModal';
import { useTransparentSpotifyCode } from '@/hooks/useTransparentSpotifyCode';
import { TrashZone } from '@/components/TrashZone';
import { useLivePreview } from '@/contexts/LivePreviewContext';
import type { FilterValues } from '@/store';

interface PolaroidViewProps {
  addWatermarkRef?: React.RefObject<boolean>;
}

export function PolaroidView({ addWatermarkRef }: PolaroidViewProps = {}) {
  const { canvasRef, exportPNG } = usePolaroidCanvas(addWatermarkRef);
  const { uploadFile } = useImageUpload();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const frame = useStore((s) => s.frames.find((f) => f.id === s.activeFrameId));
  const activeFrameId = useStore((s) => s.activeFrameId);
  const updateFrame = useStore((s) => s.updateFrame);
  const [displaySize, setDisplaySize] = useState({ w: 300, h: 400 });
  const [showCrop, setShowCrop] = useState(false);

  // ── Drag-to-trash state ──
  const [dragActive, setDragActive] = useState(false);
  const [overTrash, setOverTrash] = useState(false);
  const trashZoneRef = useRef<HTMLDivElement>(null);
  // RAF handle for gesture updateFrame batching — caps store writes to 60fps
  const gestureRafRef = useRef(0);

  // ── CSS Live-Preview overlay ──
  const liveHandle = useLivePreview();
  const overlayWrapRef = useRef<HTMLDivElement>(null);
  const overlayImgRef = useRef<HTMLImageElement>(null);

  // Calculate scale to fit canvas in container
  useEffect(() => {
    if (!containerRef.current || !frame) return;
    const updateScale = () => {
      const container = containerRef.current;
      if (!container) return;
      const availW = container.clientWidth - 32;
      const availH = container.clientHeight - 32;
      const scaleX = availW / frame.frameWidth;
      const scaleY = availH / frame.frameHeight;
      const scale = Math.min(scaleX, scaleY, 1);
      setDisplaySize({ w: frame.frameWidth * scale, h: frame.frameHeight * scale });
    };
    updateScale();
    const obs = new ResizeObserver(updateScale);
    obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, [frame?.frameWidth, frame?.frameHeight]);

  const handleTap = useCallback(() => {
    if (frame?.imageDataUrl) {
      setShowCrop(true);
    } else {
      fileInputRef.current?.click();
    }
  }, [frame?.imageDataUrl]);

  const handleFile = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
    e.target.value = '';
  }, [uploadFile]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) uploadFile(file);
  }, [uploadFile]);

  const triggerEject = useCallback(() => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transition = 'transform 0.18s cubic-bezier(0.34, 1.56, 0.64, 1)';
    card.style.transform = 'translateY(-12px) rotate(-0.5deg)';
    setTimeout(() => {
      card.style.transition = 'transform 0.28s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      card.style.transform = '';
      setTimeout(() => { card.style.transition = ''; }, 280);
    }, 180);
  }, []);

  useEffect(() => {
    const exportBtn = document.getElementById('export-btn-inner');
    if (exportBtn) exportBtn.onclick = () => { triggerEject(); exportPNG(); };
  }, [exportPNG, triggerEject]);

  // ── Image multi-touch: drag + pinch-zoom (frame stays fixed, only image moves) ──
  const imgGesture = useRef({
    pointers: new Map<number, { x: number; y: number }>(),
    // single drag
    dragging: false,
    dragId: -1,
    startX: 0, startY: 0,
    origPanX: 0, origPanY: 0,
    // pinch
    pinching: false,
    p0: { x: 0, y: 0 }, p1: { x: 0, y: 0 },
    origScale: 1,
    origPanXp: 0, origPanYp: 0,
  });

  // keep latest frame values accessible inside event handlers
  const frameRef = useRef(frame);
  useEffect(() => { frameRef.current = frame; });
  const displayRef = useRef(displaySize);
  useEffect(() => { displayRef.current = displaySize; });

  // Register live-preview handle — reads from refs so no deps needed
  useEffect(() => {
    liveHandle.current = {
      show(filters: FilterValues) {
        const wrap = overlayWrapRef.current;
        const img = overlayImgRef.current;
        const f = frameRef.current;
        const d = displayRef.current;
        if (!wrap || !img || !f?.imageDataUrl) return;

        // CSS filter — exact same formula as buildCSSFilter in usePolaroidCanvas
        const parts: string[] = [];
        if (filters.brightness !== 0) parts.push(`brightness(${1 + filters.brightness / 100})`);
        if (filters.contrast !== 0) parts.push(`contrast(${1 + filters.contrast / 100})`);
        if (filters.saturation !== 0) parts.push(`saturate(${1 + filters.saturation / 100})`);
        if (filters.warmth > 0) parts.push(`sepia(${filters.warmth / 200})`);
        else if (filters.warmth < 0) parts.push(`hue-rotate(${filters.warmth / 3}deg)`);
        img.style.filter = parts.join(' ') || 'none';

        // Position wrapper over the frame's image area
        const areaW = d.w * (f.frameWidth - f.borderLeft - f.borderRight) / f.frameWidth;
        const areaH = d.h * (f.frameHeight - f.borderTop - f.borderBottom) / f.frameHeight;
        wrap.style.left = `${d.w * f.borderLeft / f.frameWidth}px`;
        wrap.style.top = `${d.h * f.borderTop / f.frameHeight}px`;
        wrap.style.width = `${areaW}px`;
        wrap.style.height = `${areaH}px`;

        // CSS transform approximating canvas: cover + extra scale + rotate + pan
        const panX = f.imagePanX;
        const panY = f.imagePanY;
        img.style.transform = `scale(${f.imageScale}) rotate(${f.imageRotation}deg) translate(${panX}%, ${panY}%)`;

        wrap.style.opacity = '1';
      },
      hide() {
        const wrap = overlayWrapRef.current;
        if (wrap) wrap.style.opacity = '0';
      },
    };
  }, []); // stable — always reads from refs

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const imgAreaW = () => {
      const f = frameRef.current;
      const d = displayRef.current;
      if (!f) return 1;
      return d.w * (f.frameWidth - f.borderLeft - f.borderRight) / f.frameWidth;
    };
    const imgAreaH = () => {
      const f = frameRef.current;
      const d = displayRef.current;
      if (!f) return 1;
      return d.h * (f.frameHeight - f.borderTop - f.borderBottom) / f.frameHeight;
    };
    const dist = (a: { x: number; y: number }, b: { x: number; y: number }) =>
      Math.hypot(b.x - a.x, b.y - a.y);

    const g = imgGesture.current;

    const onDown = (e: PointerEvent) => {
      const f = frameRef.current;
      if (!f?.imageDataUrl) return;
      e.preventDefault();
      e.stopPropagation();
      canvas.setPointerCapture(e.pointerId);
      g.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

      if (g.pointers.size === 1) {
        g.dragging = true;
        g.pinching = false;
        g.dragId = e.pointerId;
        g.startX = e.clientX;
        g.startY = e.clientY;
        g.origPanX = f.imagePanX;
        g.origPanY = f.imagePanY;
      } else if (g.pointers.size === 2) {
        g.dragging = false;
        g.pinching = true;
        const pts = [...g.pointers.values()];
        g.p0 = { ...pts[0] };
        g.p1 = { ...pts[1] };
        g.origScale = f.imageScale;
        g.origPanXp = f.imagePanX;
        g.origPanYp = f.imagePanY;
      }
    };

    const onMove = (e: PointerEvent) => {
      if (!g.pointers.has(e.pointerId)) return;
      e.preventDefault();
      g.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

      if (g.dragging && e.pointerId === g.dragId) {
        const dx = e.clientX - g.startX;
        const dy = e.clientY - g.startY;
        const newPanX = Math.max(-300, Math.min(300, g.origPanX + (dx / imgAreaW()) * 100));
        const newPanY = Math.max(-300, Math.min(300, g.origPanY + (dy / imgAreaH()) * 100));
        cancelAnimationFrame(gestureRafRef.current);
        gestureRafRef.current = requestAnimationFrame(() => {
          updateFrame(activeFrameId, { imagePanX: newPanX, imagePanY: newPanY }, true);
        });
      }

      if (g.pinching && g.pointers.size >= 2) {
        const pts = [...g.pointers.values()];
        const now0 = pts[0], now1 = pts[1];
        const initDist = dist(g.p0, g.p1);
        const nowDist = dist(now0, now1);
        if (initDist > 1) {
          const scaleFactor = nowDist / initDist;
          const newScale = Math.max(1, Math.min(4, g.origScale * scaleFactor));

          // Keep the finger midpoint fixed on the image (zoom-to-cursor like Canva)
          const areaW = imgAreaW();
          const areaH = imgAreaH();
          const f = frameRef.current;
          const d = displayRef.current;
          if (f && areaW > 0 && areaH > 0) {
            const canvasRect = canvas.getBoundingClientRect();
            // Initial pinch midpoint relative to canvas element
            const initMidX = (g.p0.x + g.p1.x) / 2 - canvasRect.left;
            const initMidY = (g.p0.y + g.p1.y) / 2 - canvasRect.top;
            // Image area top-left in display coords
            const areaLeft = d.w * f.borderLeft / f.frameWidth;
            const areaTop  = d.h * f.borderTop  / f.frameHeight;
            // Midpoint relative to image area center
            const relMidX = initMidX - (areaLeft + areaW / 2);
            const relMidY = initMidY - (areaTop  + areaH / 2);
            // Adjust pan so the same image point stays under the midpoint
            const curPanOffX = (g.origPanXp / 100) * areaW;
            const curPanOffY = (g.origPanYp / 100) * areaH;
            const newPanOffX = relMidX - (relMidX - curPanOffX) * scaleFactor;
            const newPanOffY = relMidY - (relMidY - curPanOffY) * scaleFactor;
            const clampedPanX = Math.max(-300, Math.min(300, (newPanOffX / areaW) * 100));
            const clampedPanY = Math.max(-300, Math.min(300, (newPanOffY / areaH) * 100));
            cancelAnimationFrame(gestureRafRef.current);
            gestureRafRef.current = requestAnimationFrame(() => {
              updateFrame(activeFrameId, {
                imageScale: newScale,
                imagePanX: clampedPanX,
                imagePanY: clampedPanY,
              }, true);
            });
          } else {
            cancelAnimationFrame(gestureRafRef.current);
            gestureRafRef.current = requestAnimationFrame(() => {
              updateFrame(activeFrameId, { imageScale: newScale });
            });
          }
        }
      }
    };

    const onUp = (e: PointerEvent) => {
      cancelAnimationFrame(gestureRafRef.current);
      g.pointers.delete(e.pointerId);
      if (e.pointerId === g.dragId) g.dragging = false;
      if (g.pointers.size < 2) g.pinching = false;
    };

    canvas.addEventListener('pointerdown', onDown, { passive: false });
    canvas.addEventListener('pointermove', onMove, { passive: false });
    canvas.addEventListener('pointerup', onUp);
    canvas.addEventListener('pointercancel', onUp);

    return () => {
      canvas.removeEventListener('pointerdown', onDown);
      canvas.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerup', onUp);
      canvas.removeEventListener('pointercancel', onUp);
    };
  }, [activeFrameId, updateFrame, canvasRef]);

  // ── Drag-to-trash helpers ──
  const handleDragStart = useCallback(() => {
    setDragActive(true);
    setOverTrash(false);
  }, []);

  const handleDragEnd = useCallback(() => {
    setDragActive(false);
    setOverTrash(false);
  }, []);

  const handleDragMove = useCallback((cx: number, cy: number) => {
    const el = trashZoneRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const hit = cx >= rect.left && cx <= rect.right && cy >= rect.top && cy <= rect.bottom;
    setOverTrash(hit);
  }, []);

  // Spotify barcode URL
  const spotifyMatch = frame?.musicUrl?.match(/spotify\.com\/(track|album|playlist|artist)\/([a-zA-Z0-9]+)/);
  const isTransparentBg = frame?.musicCodeBg === 'transparent';
  const effectiveSpotifyBg = isTransparentBg ? '#FFFFFF' : frame?.musicCodeBg; // Use white as base for removal
  const fgColorStr = frame?.musicCodeFg === '#FFFFFF' ? 'white' : 'black';
  
  // Get transparent version when needed
  const transparentCodeUrl = useTransparentSpotifyCode(
    isTransparentBg ? frame?.musicUrl ?? null : null,
    '#FFFFFF', // Remove white background
    fgColorStr as 'white' | 'black'
  );
  
  // Use transparent URL if available, otherwise regular URL
  const spotifyCodeUrl = isTransparentBg
    ? transparentCodeUrl
    : (spotifyMatch && frame && effectiveSpotifyBg
        ? `https://scannables.scdn.co/uri/plain/png/${effectiveSpotifyBg.replace('#', '')}/${fgColorStr}/640/spotify:${spotifyMatch[1]}:${spotifyMatch[2]}`
        : null);

  return (
    <div
      ref={containerRef}
      className="w-full h-full flex items-center justify-center p-4 overflow-hidden"
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
    >
      <div
        ref={cardRef}
        className="relative polaroid-develop"
        style={{
          width: displaySize.w,
          height: displaySize.h,
          boxShadow: '0 10px 40px rgba(0,0,0,0.12), 0 2px 10px rgba(0,0,0,0.08)',
          borderRadius: frame?.borderRadius ? `${(frame.borderRadius / frame.frameWidth) * displaySize.w}px` : 0,
        }}
      >
        {/* Canvas — image + frame background */}
        <canvas
          key={frame?.imageDataUrl ? 'has-image' : 'no-image'}
          ref={canvasRef}
          onClick={handleTap}
          className={`block touch-none${frame?.imageDataUrl ? ' photo-enter' : ''}`}
          style={{
            width: '100%',
            height: '100%',
            borderRadius: 'inherit',
            cursor: frame?.imageDataUrl ? 'crosshair' : 'pointer',
            willChange: 'transform',
          }}
        />

        {/* CSS Live-Preview overlay — compositor-thread filter during slider drag */}
        <div
          ref={overlayWrapRef}
          style={{
            position: 'absolute',
            overflow: 'hidden',
            pointerEvents: 'none',
            opacity: 0,
            transition: 'opacity 0.06s ease',
            willChange: 'opacity',
            zIndex: 1,
          }}
        >
          <img
            ref={overlayImgRef}
            src={frame?.imageDataUrl ?? undefined}
            draggable={false}
            alt=""
            style={{
              display: 'block',
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
              pointerEvents: 'none',
              willChange: 'filter, transform',
            }}
          />
        </div>

        {/* Draggable Top Label */}
        {frame?.topLabelText && (
          <DraggableOverlay
            x={frame.topLabelPos.x}
            y={frame.topLabelPos.y}
            rotation={frame.topLabelPos.rotation}
            scale={frame.topLabelPos.scale}
            containerW={displaySize.w}
            containerH={displaySize.h}
            onMove={(nx, ny) => updateFrame(activeFrameId, { topLabelPos: { ...frame.topLabelPos, x: nx, y: ny } }, true)}
            onRotate={(deg) => updateFrame(activeFrameId, { topLabelPos: { ...frame.topLabelPos, rotation: deg } }, true)}
            onScale={(s) => updateFrame(activeFrameId, { topLabelPos: { ...frame.topLabelPos, scale: s } }, true)}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragMove={handleDragMove}
            overTrash={overTrash}
            onDelete={() => updateFrame(activeFrameId, { topLabelText: '' })}
          >
            <span
              className="whitespace-nowrap pointer-events-none"
              style={{
                fontFamily: `"${frame.topLabelFont}", cursive`,
                fontSize: `${(frame.topLabelSize / frame.frameHeight) * displaySize.h}px`,
                color: frame.topLabelColor,
                lineHeight: 1.2,
                textShadow: frame.frameColor === '#FFFFFF' ? 'none' : '0 1px 3px rgba(0,0,0,0.2)',
              }}
            >
              {frame.topLabelText}
            </span>
          </DraggableOverlay>
        )}

        {/* Draggable Bottom Caption */}
        {frame?.bottomCaptionText &&
          frame.templateId !== 'movie-poster' &&
          frame.templateId !== 'concert-ticket' &&
          frame.templateId !== 'vintage-color' && (
            <DraggableOverlay
              x={frame.bottomCaptionPos.x}
              y={frame.bottomCaptionPos.y}
              rotation={frame.bottomCaptionPos.rotation}
              scale={frame.bottomCaptionPos.scale}
              containerW={displaySize.w}
              containerH={displaySize.h}
              onMove={(nx, ny) => updateFrame(activeFrameId, { bottomCaptionPos: { ...frame.bottomCaptionPos, x: nx, y: ny } }, true)}
              onRotate={(deg) => updateFrame(activeFrameId, { bottomCaptionPos: { ...frame.bottomCaptionPos, rotation: deg } }, true)}
              onScale={(s) => updateFrame(activeFrameId, { bottomCaptionPos: { ...frame.bottomCaptionPos, scale: s } }, true)}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onDragMove={handleDragMove}
              overTrash={overTrash}
              onDelete={() => updateFrame(activeFrameId, { bottomCaptionText: '' })}
            >
              <span
                className="whitespace-nowrap pointer-events-none"
                style={{
                  fontFamily: `"${frame.bottomCaptionFont}", sans-serif`,
                  fontSize: `${(frame.bottomCaptionSize / frame.frameHeight) * displaySize.h}px`,
                  color: frame.bottomCaptionColor,
                  lineHeight: 1.2,
                }}
              >
                {frame.bottomCaptionText}
              </span>
            </DraggableOverlay>
          )}

        {/* Draggable Spotify Code */}
        {spotifyCodeUrl && frame && (
          <DraggableOverlay
            x={frame.musicPos.x}
            y={frame.musicPos.y}
            rotation={frame.musicPos.rotation}
            scale={frame.musicPos.scale}
            containerW={displaySize.w}
            containerH={displaySize.h}
            onMove={(nx, ny) => updateFrame(activeFrameId, { musicPos: { ...frame.musicPos, x: nx, y: ny } }, true)}
            onRotate={(deg) => updateFrame(activeFrameId, { musicPos: { ...frame.musicPos, rotation: deg } }, true)}
            onScale={(s) => updateFrame(activeFrameId, { musicPos: { ...frame.musicPos, scale: s } }, true)}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragMove={handleDragMove}
            overTrash={overTrash}
            onDelete={() => updateFrame(activeFrameId, { musicUrl: '' })}
          >
            <img
              src={spotifyCodeUrl}
              alt="Spotify code"
              crossOrigin="anonymous"
              draggable={false}
              className="pointer-events-none block"
              style={{ height: `${displaySize.h * 0.065}px`, maxWidth: 'none' }}
            />
          </DraggableOverlay>
        )}
      </div>

      {/* Instagram-style drag-to-trash zone */}
      <TrashZone
        visible={dragActive}
        targeted={overTrash}
        trashRef={trashZoneRef}
      />

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleFile}
      />

      {/* Crop modal */}
      {showCrop && frame?.imageDataUrl && (
        <CropModal
          imageDataUrl={frame.imageDataUrl}
          aspectW={frame.frameWidth - frame.borderLeft - frame.borderRight}
          aspectH={frame.frameHeight - frame.borderTop - frame.borderBottom}
          initialPanX={frame.imagePanX}
          initialPanY={frame.imagePanY}
          initialScale={frame.imageScale}
          onClose={() => setShowCrop(false)}
          onConfirm={(px, py, sc) => {
            updateFrame(activeFrameId, { imagePanX: px, imagePanY: py, imageScale: sc });
            setShowCrop(false);
          }}
        />
      )}
    </div>
  );
}

