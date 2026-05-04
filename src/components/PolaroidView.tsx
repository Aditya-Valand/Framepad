import { useRef, useCallback, useState, useEffect } from 'react';
import { usePolaroidCanvas } from '../hooks/usePolaroidCanvas';
import { useImageUpload } from '../hooks/useImageUpload';
import { useStore } from '../store';
import { DraggableOverlay } from './DraggableOverlay';

export function PolaroidView() {
  const { canvasRef, exportPNG } = usePolaroidCanvas();
  const { uploadFile } = useImageUpload();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const frame = useStore((s) => s.frames.find((f) => f.id === s.activeFrameId));
  const activeFrameId = useStore((s) => s.activeFrameId);
  const updateFrame = useStore((s) => s.updateFrame);
  const [displaySize, setDisplaySize] = useState({ w: 300, h: 400 });

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
    if (!frame?.imageDataUrl) fileInputRef.current?.click();
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

  useEffect(() => {
    const exportBtn = document.getElementById('export-btn-inner');
    if (exportBtn) exportBtn.onclick = exportPNG;
  }, [exportPNG]);

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
        const newPanX = g.origPanX + (dx / imgAreaW()) * 100;
        const newPanY = g.origPanY + (dy / imgAreaH()) * 100;
        updateFrame(activeFrameId, {
          imagePanX: Math.max(-100, Math.min(100, newPanX)),
          imagePanY: Math.max(-100, Math.min(100, newPanY)),
        });
      }

      if (g.pinching && g.pointers.size >= 2) {
        const pts = [...g.pointers.values()];
        const now0 = pts[0], now1 = pts[1];
        const initDist = dist(g.p0, g.p1);
        const nowDist = dist(now0, now1);
        if (initDist > 1) {
          const scaleFactor = nowDist / initDist;
          updateFrame(activeFrameId, {
            imageScale: Math.max(0.5, Math.min(4, g.origScale * scaleFactor)),
          });
        }
      }
    };

    const onUp = (e: PointerEvent) => {
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

  // Spotify barcode URL
  const spotifyMatch = frame?.musicUrl?.match(/spotify\.com\/(track|album|playlist|artist)\/([a-zA-Z0-9]+)/);
  const spotifyCodeUrl = spotifyMatch && frame
    ? `https://scannables.scdn.co/uri/plain/png/${frame.musicCodeBg.replace('#', '')}/${frame.musicCodeFg === '#FFFFFF' ? 'white' : 'black'}/640/spotify:${spotifyMatch[1]}:${spotifyMatch[2]}`
    : null;

  return (
    <div
      ref={containerRef}
      className="w-full h-full flex items-center justify-center p-4 overflow-hidden"
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
    >
      <div
        className="relative"
        style={{
          width: displaySize.w,
          height: displaySize.h,
          boxShadow: '0 10px 40px rgba(0,0,0,0.12), 0 2px 10px rgba(0,0,0,0.08)',
          borderRadius: frame?.borderRadius ? `${(frame.borderRadius / frame.frameWidth) * displaySize.w}px` : 0,
        }}
      >
        {/* Canvas — image + frame background */}
        <canvas
          ref={canvasRef}
          onClick={handleTap}
          className="block touch-none"
          style={{
            width: '100%',
            height: '100%',
            borderRadius: 'inherit',
            cursor: frame?.imageDataUrl ? 'move' : 'pointer',
            willChange: 'transform',
          }}
        />

        {/* Draggable Top Label */}
        {frame?.topLabelText && (
          <DraggableOverlay
            x={frame.topLabelPos.x}
            y={frame.topLabelPos.y}
            rotation={frame.topLabelPos.rotation}
            scale={frame.topLabelPos.scale}
            containerW={displaySize.w}
            containerH={displaySize.h}
            onMove={(nx, ny) => updateFrame(activeFrameId, { topLabelPos: { ...frame.topLabelPos, x: nx, y: ny } })}
            onRotate={(deg) => updateFrame(activeFrameId, { topLabelPos: { ...frame.topLabelPos, rotation: deg } })}
            onScale={(s) => updateFrame(activeFrameId, { topLabelPos: { ...frame.topLabelPos, scale: s } })}
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
              onMove={(nx, ny) => updateFrame(activeFrameId, { bottomCaptionPos: { ...frame.bottomCaptionPos, x: nx, y: ny } })}
              onRotate={(deg) => updateFrame(activeFrameId, { bottomCaptionPos: { ...frame.bottomCaptionPos, rotation: deg } })}
              onScale={(s) => updateFrame(activeFrameId, { bottomCaptionPos: { ...frame.bottomCaptionPos, scale: s } })}
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
            onMove={(nx, ny) => updateFrame(activeFrameId, { musicPos: { ...frame.musicPos, x: nx, y: ny } })}
            onRotate={(deg) => updateFrame(activeFrameId, { musicPos: { ...frame.musicPos, rotation: deg } })}
            onScale={(s) => updateFrame(activeFrameId, { musicPos: { ...frame.musicPos, scale: s } })}
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

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleFile}
      />
    </div>
  );
}

