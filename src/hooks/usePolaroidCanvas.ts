import { useRef, useEffect, useCallback } from 'react';
import { useStore } from '../store';
import type { FrameData } from '../store';

export function usePolaroidCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const renderIdRef = useRef(0);

  const activeFrameId = useStore((s) => s.activeFrameId);
  const frames = useStore((s) => s.frames);
  const frame = frames.find((f) => f.id === activeFrameId);

  const render = useCallback((frameData: FrameData, canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = frameData.frameWidth;
    const H = frameData.frameHeight;

    canvas.width = W;
    canvas.height = H;

    // Clear with frame color (no transparency)
    ctx.fillStyle = frameData.frameColor;
    if (frameData.borderRadius > 0) {
      roundRect(ctx, 0, 0, W, H, frameData.borderRadius);
      ctx.fill();
    } else {
      ctx.fillRect(0, 0, W, H);
    }

    const imgX = frameData.borderLeft;
    const imgY = frameData.borderTop;
    const imgW = W - frameData.borderLeft - frameData.borderRight;
    const imgH = H - frameData.borderTop - frameData.borderBottom;

    if (!frameData.imageDataUrl) {
      // Placeholder
      ctx.fillStyle = '#F3F4F6';
      ctx.fillRect(imgX, imgY, imgW, imgH);
      ctx.setLineDash([12, 8]);
      ctx.strokeStyle = '#D1D5DB';
      ctx.lineWidth = 2;
      ctx.strokeRect(imgX, imgY, imgW, imgH);
      ctx.setLineDash([]);

      ctx.fillStyle = '#9CA3AF';
      ctx.font = '36px Inter, system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('Tap to upload photo', W / 2, imgY + imgH / 2);
    } else {
      // Load and draw image only (text/music are HTML overlays in preview)
      const renderImg = new Image();
      renderImg.crossOrigin = 'anonymous';
      const currentRenderIdAtStart = renderIdRef.current;
      renderImg.onload = () => {
        if (renderIdRef.current !== currentRenderIdAtStart) return;

        ctx.save();
        ctx.beginPath();
        ctx.rect(imgX, imgY, imgW, imgH);
        ctx.clip();

        const filterStr = buildCSSFilter(frameData.filters);
        if (filterStr) ctx.filter = filterStr;

        const { sx, sy, sw, sh } = coverCrop(renderImg.naturalWidth, renderImg.naturalHeight, imgW, imgH);

        const cx = imgX + imgW / 2;
        const cy = imgY + imgH / 2;
        const drawScale = frameData.imageScale;
        const panOffsetX = (frameData.imagePanX / 100) * imgW;
        const panOffsetY = (frameData.imagePanY / 100) * imgH;

        ctx.translate(cx + panOffsetX, cy + panOffsetY);
        if (frameData.imageRotation !== 0) {
          ctx.rotate((frameData.imageRotation * Math.PI) / 180);
        }
        ctx.scale(drawScale, drawScale);
        ctx.drawImage(renderImg, sx, sy, sw, sh, -imgW / 2, -imgH / 2, imgW, imgH);

        ctx.filter = 'none';
        ctx.restore();
      };
      renderImg.src = frameData.imageDataUrl;
    }
  }, []);

  useEffect(() => {
    if (frame && canvasRef.current) {
      renderIdRef.current++;
      render(frame, canvasRef.current);
    }
  }, [frame, render]);

  const exportPNG = useCallback(() => {
    if (!frame) return;

    // Create a high-res offscreen canvas for export
    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = frame.frameWidth;
    exportCanvas.height = frame.frameHeight;

    // Re-render at full resolution on export canvas
    const currentFrame = frame;
    const ctx = exportCanvas.getContext('2d');
    if (!ctx) return;

    // Draw frame background
    ctx.fillStyle = currentFrame.frameColor;
    if (currentFrame.borderRadius > 0) {
      roundRect(ctx, 0, 0, currentFrame.frameWidth, currentFrame.frameHeight, currentFrame.borderRadius);
      ctx.fill();
    } else {
      ctx.fillRect(0, 0, currentFrame.frameWidth, currentFrame.frameHeight);
    }

    const imgX = currentFrame.borderLeft;
    const imgY = currentFrame.borderTop;
    const imgW = currentFrame.frameWidth - currentFrame.borderLeft - currentFrame.borderRight;
    const imgH = currentFrame.frameHeight - currentFrame.borderTop - currentFrame.borderBottom;

    if (currentFrame.imageDataUrl) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        ctx.save();
        ctx.beginPath();
        ctx.rect(imgX, imgY, imgW, imgH);
        ctx.clip();

        const filterStr = buildCSSFilter(currentFrame.filters);
        if (filterStr) ctx.filter = filterStr;

        const { sx, sy, sw, sh } = coverCrop(img.naturalWidth, img.naturalHeight, imgW, imgH);

        const cx = imgX + imgW / 2;
        const cy = imgY + imgH / 2;
        const drawScale = currentFrame.imageScale;
        const panOffsetX = (currentFrame.imagePanX / 100) * imgW;
        const panOffsetY = (currentFrame.imagePanY / 100) * imgH;

        ctx.translate(cx + panOffsetX, cy + panOffsetY);
        if (currentFrame.imageRotation !== 0) {
          ctx.rotate((currentFrame.imageRotation * Math.PI) / 180);
        }
        ctx.scale(drawScale, drawScale);
        ctx.drawImage(img, sx, sy, sw, sh, -imgW / 2, -imgH / 2, imgW, imgH);

        ctx.filter = 'none';
        ctx.restore();

        // Draw overlays then export
        drawOverlaysSync(ctx, currentFrame, imgX, imgY, imgW, imgH, () => {
          triggerDownload(exportCanvas);
        });
      };
      img.src = currentFrame.imageDataUrl;
    } else {
      ctx.fillStyle = '#F3F4F6';
      ctx.fillRect(imgX, imgY, imgW, imgH);
      drawOverlaysSync(ctx, currentFrame, imgX, imgY, imgW, imgH, () => {
        triggerDownload(exportCanvas);
      });
    }
  }, [frame]);

  return { canvasRef, exportPNG };
}

function drawOverlaysSync(
  ctx: CanvasRenderingContext2D,
  frameData: FrameData,
  _imgX: number, _imgY: number, _imgW: number, _imgH: number,
  onDone: () => void
) {
  const W = frameData.frameWidth;
  const H = frameData.frameHeight;

  // Top label at stored position with scale
  if (frameData.topLabelText) {
    ctx.save();
    const px = (frameData.topLabelPos.x / 100) * W;
    const py = (frameData.topLabelPos.y / 100) * H;
    ctx.translate(px, py);
    if (frameData.topLabelPos.rotation !== 0) {
      ctx.rotate((frameData.topLabelPos.rotation * Math.PI) / 180);
    }
    if (frameData.topLabelPos.scale !== 1) {
      ctx.scale(frameData.topLabelPos.scale, frameData.topLabelPos.scale);
    }
    ctx.font = `${frameData.topLabelSize}px "${frameData.topLabelFont}", cursive`;
    ctx.fillStyle = frameData.topLabelColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(frameData.topLabelText, 0, 0);
    ctx.restore();
  }

  // Bottom caption at stored position with scale
  if (frameData.bottomCaptionText) {
    ctx.save();
    const px = (frameData.bottomCaptionPos.x / 100) * W;
    const py = (frameData.bottomCaptionPos.y / 100) * H;
    ctx.translate(px, py);
    if (frameData.bottomCaptionPos.rotation !== 0) {
      ctx.rotate((frameData.bottomCaptionPos.rotation * Math.PI) / 180);
    }
    if (frameData.bottomCaptionPos.scale !== 1) {
      ctx.scale(frameData.bottomCaptionPos.scale, frameData.bottomCaptionPos.scale);
    }
    ctx.font = `${frameData.bottomCaptionSize}px "${frameData.bottomCaptionFont}", sans-serif`;
    ctx.fillStyle = frameData.bottomCaptionColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(frameData.bottomCaptionText, 0, 0);
    ctx.restore();
  }

  // Spotify code at stored position with scale and custom colors
  if (frameData.musicUrl) {
    const spotifyMatch = frameData.musicUrl.match(/spotify\.com\/(track|album|playlist|artist)\/([a-zA-Z0-9]+)/);
    if (spotifyMatch) {
      const fgColor = frameData.musicCodeFg === '#FFFFFF' ? 'white' : 'black';
      const codeUrl = `https://scannables.scdn.co/uri/plain/png/${frameData.musicCodeBg.replace('#', '')}/${fgColor}/640/spotify:${spotifyMatch[1]}:${spotifyMatch[2]}`;
      const codeImg = new Image();
      codeImg.crossOrigin = 'anonymous';
      codeImg.onload = () => {
        ctx.save();
        const px = (frameData.musicPos.x / 100) * W;
        const py = (frameData.musicPos.y / 100) * H;
        ctx.translate(px, py);
        if (frameData.musicPos.rotation !== 0) {
          ctx.rotate((frameData.musicPos.rotation * Math.PI) / 180);
        }
        const overlayScale = frameData.musicPos.scale;
        ctx.scale(overlayScale, overlayScale);
        const codeH = Math.min(H * 0.055, 80);
        const codeW = (codeImg.naturalWidth / codeImg.naturalHeight) * codeH;
        ctx.drawImage(codeImg, -codeW / 2, -codeH / 2, codeW, codeH);
        ctx.restore();
        onDone();
      };
      codeImg.onerror = () => onDone();
      codeImg.src = codeUrl;
    } else {
      onDone();
    }
  } else {
    onDone();
  }
}

function triggerDownload(canvas: HTMLCanvasElement) {
  canvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `framepad-${Date.now()}.png`;
    link.href = url;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, 'image/png');
}

/** Cover-crop: returns source rect to fill the target exactly */
function coverCrop(srcW: number, srcH: number, tgtW: number, tgtH: number) {
  const srcAspect = srcW / srcH;
  const tgtAspect = tgtW / tgtH;

  let sx: number, sy: number, sw: number, sh: number;

  if (srcAspect > tgtAspect) {
    // Source is wider — crop sides
    sh = srcH;
    sw = srcH * tgtAspect;
    sx = (srcW - sw) / 2;
    sy = 0;
  } else {
    // Source is taller — crop top/bottom
    sw = srcW;
    sh = srcW / tgtAspect;
    sx = 0;
    sy = (srcH - sh) / 2;
  }

  return { sx, sy, sw, sh };
}

function buildCSSFilter(filters: { brightness: number; contrast: number; saturation: number; warmth: number }): string {
  const parts: string[] = [];
  if (filters.brightness !== 0) parts.push(`brightness(${1 + filters.brightness / 100})`);
  if (filters.contrast !== 0) parts.push(`contrast(${1 + filters.contrast / 100})`);
  if (filters.saturation !== 0) parts.push(`saturate(${1 + filters.saturation / 100})`);
  // Warmth approximated via sepia + hue rotation
  if (filters.warmth > 0) {
    parts.push(`sepia(${filters.warmth / 200})`);
  } else if (filters.warmth < 0) {
    parts.push(`hue-rotate(${filters.warmth / 3}deg)`);
  }
  return parts.join(' ');
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}
