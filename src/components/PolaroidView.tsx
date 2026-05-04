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
      setDisplaySize({
        w: frame.frameWidth * scale,
        h: frame.frameHeight * scale,
      });
    };

    updateScale();
    const resizeObs = new ResizeObserver(updateScale);
    resizeObs.observe(containerRef.current);
    return () => resizeObs.disconnect();
  }, [frame?.frameWidth, frame?.frameHeight]);

  const handleTap = useCallback(() => {
    if (!frame?.imageDataUrl) {
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

  // Wire export button
  useEffect(() => {
    const exportBtn = document.getElementById('export-btn');
    if (exportBtn) {
      exportBtn.onclick = exportPNG;
    }
  }, [exportPNG]);

  // Image pan handler
  const imgDragRef = useRef<{ active: boolean; startX: number; startY: number; origPanX: number; origPanY: number; pointerId: number | null }>({
    active: false, startX: 0, startY: 0, origPanX: 0, origPanY: 0, pointerId: null,
  });

  const handleImgPointerDown = useCallback((e: React.PointerEvent) => {
    if (!frame?.imageDataUrl) return;
    e.preventDefault();
    e.stopPropagation();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    imgDragRef.current = {
      active: true,
      startX: e.clientX,
      startY: e.clientY,
      origPanX: frame.imagePanX,
      origPanY: frame.imagePanY,
      pointerId: e.pointerId,
    };
  }, [frame?.imageDataUrl, frame?.imagePanX, frame?.imagePanY]);

  const handleImgPointerMove = useCallback((e: React.PointerEvent) => {
    if (!imgDragRef.current.active || e.pointerId !== imgDragRef.current.pointerId) return;
    const dx = e.clientX - imgDragRef.current.startX;
    const dy = e.clientY - imgDragRef.current.startY;
    // Convert to percentage of image area
    const imgAreaW = displaySize.w * ((frame?.frameWidth || 1080) - (frame?.borderLeft || 54) - (frame?.borderRight || 54)) / (frame?.frameWidth || 1080);
    const imgAreaH = displaySize.h * ((frame?.frameHeight || 1350) - (frame?.borderTop || 54) - (frame?.borderBottom || 210)) / (frame?.frameHeight || 1350);
    const newPanX = imgDragRef.current.origPanX + (dx / imgAreaW) * 100;
    const newPanY = imgDragRef.current.origPanY + (dy / imgAreaH) * 100;
    updateFrame(activeFrameId, {
      imagePanX: Math.max(-50, Math.min(50, newPanX)),
      imagePanY: Math.max(-50, Math.min(50, newPanY)),
    });
  }, [displaySize, frame, activeFrameId, updateFrame]);

  const handleImgPointerUp = useCallback((e: React.PointerEvent) => {
    if (e.pointerId === imgDragRef.current.pointerId) {
      imgDragRef.current.active = false;
    }
  }, []);

  // Spotify barcode URL with customizable colors
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
        {/* Canvas (image + frame background only) */}
        <canvas
          ref={canvasRef}
          onClick={handleTap}
          className="block"
          style={{
            width: '100%',
            height: '100%',
            borderRadius: 'inherit',
            cursor: frame?.imageDataUrl ? 'move' : 'pointer',
          }}
          onPointerDown={frame?.imageDataUrl ? handleImgPointerDown : undefined}
          onPointerMove={frame?.imageDataUrl ? handleImgPointerMove : undefined}
          onPointerUp={frame?.imageDataUrl ? handleImgPointerUp : undefined}
          onPointerCancel={frame?.imageDataUrl ? handleImgPointerUp : undefined}
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
            onMove={(nx, ny) =>
              updateFrame(activeFrameId, { topLabelPos: { ...frame.topLabelPos, x: nx, y: ny } })
            }
            onRotate={(deg) =>
              updateFrame(activeFrameId, { topLabelPos: { ...frame.topLabelPos, rotation: deg } })
            }
            onScale={(s) =>
              updateFrame(activeFrameId, { topLabelPos: { ...frame.topLabelPos, scale: s } })
            }
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
        {frame?.bottomCaptionText && (
          <DraggableOverlay
            x={frame.bottomCaptionPos.x}
            y={frame.bottomCaptionPos.y}
            rotation={frame.bottomCaptionPos.rotation}
            scale={frame.bottomCaptionPos.scale}
            containerW={displaySize.w}
            containerH={displaySize.h}
            onMove={(nx, ny) =>
              updateFrame(activeFrameId, { bottomCaptionPos: { ...frame.bottomCaptionPos, x: nx, y: ny } })
            }
            onRotate={(deg) =>
              updateFrame(activeFrameId, { bottomCaptionPos: { ...frame.bottomCaptionPos, rotation: deg } })
            }
            onScale={(s) =>
              updateFrame(activeFrameId, { bottomCaptionPos: { ...frame.bottomCaptionPos, scale: s } })
            }
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
            onMove={(nx, ny) =>
              updateFrame(activeFrameId, { musicPos: { ...frame.musicPos, x: nx, y: ny } })
            }
            onRotate={(deg) =>
              updateFrame(activeFrameId, { musicPos: { ...frame.musicPos, rotation: deg } })
            }
            onScale={(s) =>
              updateFrame(activeFrameId, { musicPos: { ...frame.musicPos, scale: s } })
            }
          >
            <img
              src={spotifyCodeUrl}
              alt="Spotify code"
              crossOrigin="anonymous"
              className="pointer-events-none"
              style={{ height: `${displaySize.h * 0.055}px` }}
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
