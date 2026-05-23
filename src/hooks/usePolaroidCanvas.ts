import { useRef, useEffect, useCallback } from 'react';
import { useStore } from '@/store';
import type { FrameData } from '@/store';
import { getTransparentSpotifyCode } from './useTransparentSpotifyCode';

/**
 * Renders a FrameData to a canvas. Standalone function usable for previews.
 * Set opts.useImageUrl=true to load from Cloudinary URL instead of base64.
 */
export function renderFrameToCanvas(
  frameData: FrameData,
  canvas: HTMLCanvasElement,
  opts?: { useImageUrl?: boolean }
) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const W = frameData.frameWidth;
  const H = frameData.frameHeight;
  canvas.width = W;
  canvas.height = H;

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

  const imageSrc = opts?.useImageUrl ? (frameData.imageUrl || null) : (frameData.imageDataUrl || null);

  if (!imageSrc) {
    ctx.fillStyle = '#F3F4F6';
    ctx.fillRect(imgX, imgY, imgW, imgH);
    if (frameData.templateId === 'tape-border') drawTapeOnCanvas(ctx, W, H);
    drawRichTemplateMeta(ctx, frameData);
    drawOverlaysSync(ctx, frameData, imgX, imgY, imgW, imgH, () => {});
  } else {
    const renderImg = new Image();
    renderImg.crossOrigin = 'anonymous';
    renderImg.onload = () => {
      ctx.save();
      ctx.beginPath();
      ctx.rect(imgX, imgY, imgW, imgH);
      ctx.clip();

      const filterStr = buildCSSFilter(frameData.filters);
      if (filterStr) ctx.filter = filterStr;

      const natW = renderImg.naturalWidth;
      const natH = renderImg.naturalHeight;
      const cx = imgX + imgW / 2;
      const cy = imgY + imgH / 2;
      const baseScale = Math.max(imgW / natW, imgH / natH);
      const finalScale = baseScale * frameData.imageScale;
      const panOffsetX = (frameData.imagePanX / 100) * imgW;
      const panOffsetY = (frameData.imagePanY / 100) * imgH;

      ctx.translate(cx + panOffsetX, cy + panOffsetY);
      if (frameData.imageRotation !== 0) {
        ctx.rotate((frameData.imageRotation * Math.PI) / 180);
      }
      ctx.scale(finalScale, finalScale);
      ctx.drawImage(renderImg, -natW / 2, -natH / 2, natW, natH);

      ctx.filter = 'none';
      ctx.restore();

      if (frameData.templateId === 'tape-border') drawTapeOnCanvas(ctx, W, H);
      drawRichTemplateMeta(ctx, frameData);
      drawOverlaysSync(ctx, frameData, imgX, imgY, imgW, imgH, () => {});
    };
    renderImg.src = imageSrc;
  }
}

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

      if (frameData.templateId === 'tape-border') drawTapeOnCanvas(ctx, W, H);
      drawRichTemplateMeta(ctx, frameData);
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

        const natW = renderImg.naturalWidth;
        const natH = renderImg.naturalHeight;
        const cx = imgX + imgW / 2;
        const cy = imgY + imgH / 2;
        // Base scale so image covers the frame area exactly (CSS object-fit: cover)
        const baseScale = Math.max(imgW / natW, imgH / natH);
        const finalScale = baseScale * frameData.imageScale;
        const panOffsetX = (frameData.imagePanX / 100) * imgW;
        const panOffsetY = (frameData.imagePanY / 100) * imgH;

        ctx.translate(cx + panOffsetX, cy + panOffsetY);
        if (frameData.imageRotation !== 0) {
          ctx.rotate((frameData.imageRotation * Math.PI) / 180);
        }
        ctx.scale(finalScale, finalScale);
        ctx.drawImage(renderImg, -natW / 2, -natH / 2, natW, natH);

        ctx.filter = 'none';
        ctx.restore();

        if (frameData.templateId === 'tape-border') drawTapeOnCanvas(ctx, W, H);
        drawRichTemplateMeta(ctx, frameData);
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

    // 3× resolution for crisp output on retina / print
    const EXPORT_SCALE = 3;
    const exportCanvas = document.createElement('canvas');
    exportCanvas.width  = frame.frameWidth  * EXPORT_SCALE;
    exportCanvas.height = frame.frameHeight * EXPORT_SCALE;

    const currentFrame = frame;
    const ctx = exportCanvas.getContext('2d', { colorSpace: 'srgb' });
    if (!ctx) return;

    // Scale everything up uniformly
    ctx.scale(EXPORT_SCALE, EXPORT_SCALE);

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
    const imgW = currentFrame.frameWidth  - currentFrame.borderLeft - currentFrame.borderRight;
    const imgH = currentFrame.frameHeight - currentFrame.borderTop  - currentFrame.borderBottom;

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

        const natW = img.naturalWidth;
        const natH = img.naturalHeight;
        const cx = imgX + imgW / 2;
        const cy = imgY + imgH / 2;
        const baseScale = Math.max(imgW / natW, imgH / natH);
        const finalScale = baseScale * currentFrame.imageScale;
        const panOffsetX = (currentFrame.imagePanX / 100) * imgW;
        const panOffsetY = (currentFrame.imagePanY / 100) * imgH;

        ctx.translate(cx + panOffsetX, cy + panOffsetY);
        if (currentFrame.imageRotation !== 0) {
          ctx.rotate((currentFrame.imageRotation * Math.PI) / 180);
        }
        ctx.scale(finalScale, finalScale);
        ctx.drawImage(img, -natW / 2, -natH / 2, natW, natH);

        ctx.filter = 'none';
        ctx.restore();

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

  // Tape border decoration
  if (frameData.templateId === 'tape-border') {
    drawTapeOnCanvas(ctx, W, H);
  }

  // Rich template metadata (movie-poster, vintage-color, concert-ticket)
  drawRichTemplateMeta(ctx, frameData);

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

  // Bottom caption — skip for rich templates (their canvas draw functions handle it)
  const RICH_TEMPLATES = ['movie-poster', 'concert-ticket', 'vintage-color'];
  if (frameData.bottomCaptionText && !RICH_TEMPLATES.includes(frameData.templateId)) {
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
      const isTransparent = frameData.musicCodeBg === 'transparent';
      
      const drawCodeImage = (codeImg: HTMLImageElement) => {
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
      
      if (isTransparent) {
        // Use transparent code with background removed
        getTransparentSpotifyCode(frameData.musicUrl, '#FFFFFF', fgColor as 'white' | 'black')
          .then((img) => {
            if (img) {
              drawCodeImage(img);
            } else {
              onDone();
            }
          })
          .catch(() => onDone());
      } else {
        // Use regular code with solid background
        const effectiveBg = frameData.musicCodeBg;
        const codeUrl = `https://scannables.scdn.co/uri/plain/png/${effectiveBg.replace('#', '')}/${fgColor}/640/spotify:${spotifyMatch[1]}:${spotifyMatch[2]}`;
        const codeImg = new Image();
        codeImg.crossOrigin = 'anonymous';
        codeImg.onload = () => drawCodeImage(codeImg);
        codeImg.onerror = () => onDone();
        codeImg.src = codeUrl;
      }
    } else {
      onDone();
    }
  } else {
    onDone();
  }
}

/** Dispatcher — calls the right draw function for each rich template */
function drawRichTemplateMeta(ctx: CanvasRenderingContext2D, frame: FrameData) {
  if (frame.templateId === 'movie-poster') drawMoviePosterMeta(ctx, frame);
  else if (frame.templateId === 'vintage-color') drawVintageCaption(ctx, frame);
  else if (frame.templateId === 'concert-ticket') drawConcertTicketMeta(ctx, frame);
}

/** Movie Poster: Bebas Neue title + Courier Prime metadata grid in caption area */
function drawMoviePosterMeta(ctx: CanvasRenderingContext2D, frame: FrameData) {
  const W = frame.frameWidth;
  const H = frame.frameHeight;
  const capY = H - frame.borderBottom;      // y where caption area starts
  const L = frame.borderLeft + 10;          // left margin
  const valueX = L + 210;                   // x for values column

  ctx.save();
  ctx.textBaseline = 'alphabetic';

  // Title (Bebas Neue, large)
  const title = frame.movieTitle || 'MOVIE TITLE';
  ctx.font = `70px "Bebas Neue", sans-serif`;
  ctx.fillStyle = '#1a1814';
  ctx.textAlign = 'left';
  ctx.fillText(title, L, capY + 70);

  // Year next to title
  const titleW = ctx.measureText(title).width;
  ctx.font = `26px Inter, sans-serif`;
  ctx.fillStyle = '#888888';
  ctx.fillText(frame.movieYear || '2026', L + titleW + 14, capY + 64);

  // Separator line
  ctx.beginPath();
  ctx.strokeStyle = '#CCCCCC';
  ctx.lineWidth = 1;
  ctx.moveTo(L, capY + 102);
  ctx.lineTo(W - frame.borderRight - 10, capY + 102);
  ctx.stroke();

  // Metadata rows
  const rows: { label: string; value: string; color: string }[] = [
    { label: 'directed by', value: frame.movieDirector || 'YOUR NAME',             color: '#333333' },
    { label: 'starring',    value: frame.movieCast     || 'ACTOR ONE · ACTOR TWO', color: '#C0392B' },
    { label: 'produced by', value: frame.captionSubtext || 'PRODUCER NAME',        color: '#333333' },
  ];

  rows.forEach((row, i) => {
    const ry = capY + 152 + i * 52;
    ctx.font = `22px "Courier Prime", monospace`;
    ctx.fillStyle = '#AAAAAA';
    ctx.textAlign = 'left';
    ctx.fillText(row.label, L, ry);
    ctx.fillStyle = row.color;
    ctx.fillText(row.value, valueX, ry);
  });

  ctx.restore();
}

/** Vintage Color 600: Courier Prime caption + smaller date subtext */
function drawVintageCaption(ctx: CanvasRenderingContext2D, frame: FrameData) {
  const W = frame.frameWidth;
  const H = frame.frameHeight;
  const capY = H - frame.borderBottom;
  const caption = frame.bottomCaptionText;
  const subtext = frame.captionSubtext;

  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';

  if (caption) {
    ctx.font = `50px "Courier Prime", monospace`;
    ctx.fillStyle = '#5a4a2a';
    ctx.fillText(caption, W / 2, capY + 100);
  }

  if (subtext) {
    ctx.font = `26px "Courier Prime", monospace`;
    ctx.fillStyle = '#9a8a6a';
    (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = '4px';
    ctx.fillText(subtext, W / 2, capY + 158);
    (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = '0px';
  }

  ctx.restore();
}

/** Concert Ticket: dashed perforation + Bebas Neue artist + Courier Prime venue/date */
function drawConcertTicketMeta(ctx: CanvasRenderingContext2D, frame: FrameData) {
  const W = frame.frameWidth;
  const H = frame.frameHeight;
  const capY = H - frame.borderBottom;   // = 1080
  const CX = W / 2;

  ctx.save();
  ctx.textBaseline = 'alphabetic';
  ctx.textAlign = 'center';

  // Dashed perforation line
  ctx.setLineDash([10, 10]);
  ctx.strokeStyle = 'rgba(0,0,0,0.18)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(frame.borderLeft, capY + 16);
  ctx.lineTo(W - frame.borderRight, capY + 16);
  ctx.stroke();
  ctx.setLineDash([]);

  // Artist name
  ctx.font = `86px "Bebas Neue", sans-serif`;
  ctx.fillStyle = '#1a1814';
  ctx.fillText(frame.movieTitle || 'ARTIST NAME', CX, capY + 138);

  // Venue
  ctx.font = `28px "Courier Prime", monospace`;
  ctx.fillStyle = '#666666';
  ctx.fillText(frame.movieDirector || 'VENUE · CITY', CX, capY + 198);

  // Date / Show info
  ctx.fillText(frame.movieCast || 'MAY 04 · 2026', CX, capY + 248);

  // Separator
  ctx.beginPath();
  ctx.strokeStyle = '#E0DDD5';
  ctx.lineWidth = 1;
  ctx.moveTo(frame.borderLeft + 60, capY + 292);
  ctx.lineTo(W - frame.borderRight - 60, capY + 292);
  ctx.stroke();

  // Section / Row
  ctx.font = `38px "Bebas Neue", sans-serif`;
  ctx.fillStyle = '#AAAAAA';
  (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = '5px';
  ctx.fillText(frame.captionSubtext || 'GA · FLOOR', CX, capY + 372);
  (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = '0px';

  // Admit one
  ctx.font = `20px "Courier Prime", monospace`;
  ctx.fillStyle = '#C8C8C8';
  ctx.fillText('ADMIT ONE', CX, capY + 420);

  ctx.restore();
}

/** Draws a semi-transparent tape strip at the top of the canvas */
function drawTapeOnCanvas(ctx: CanvasRenderingContext2D, W: number, H: number) {
  const tapeW = W * 0.44;
  const tapeH = H * 0.025;
  const tapeX = W / 2;
  const tapeY = tapeH / 2 + 4;
  ctx.save();
  ctx.translate(tapeX, tapeY);
  ctx.rotate((-2 * Math.PI) / 180);
  ctx.fillStyle = 'rgba(255,220,120,0.60)';
  const rx = 4;
  const x = -tapeW / 2;
  const y = -tapeH / 2;
  ctx.beginPath();
  ctx.moveTo(x + rx, y);
  ctx.lineTo(x + tapeW - rx, y);
  ctx.quadraticCurveTo(x + tapeW, y, x + tapeW, y + rx);
  ctx.lineTo(x + tapeW, y + tapeH - rx);
  ctx.quadraticCurveTo(x + tapeW, y + tapeH, x + tapeW - rx, y + tapeH);
  ctx.lineTo(x + rx, y + tapeH);
  ctx.quadraticCurveTo(x, y + tapeH, x, y + tapeH - rx);
  ctx.lineTo(x, y + rx);
  ctx.quadraticCurveTo(x, y, x + rx, y);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
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
