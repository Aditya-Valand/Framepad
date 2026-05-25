'use client';

import { useRef, useEffect } from 'react';
import { renderFrameToCanvas } from '@/hooks/usePolaroidCanvas';
import type { FrameData } from '@/store';

/**
 * Renders an exact replica of the editor polaroid from saved canvas_state.
 * Uses the same renderFrameToCanvas function as the editor, loading image from Cloudinary URL.
 */
export function DesignPreview({ frameData }: { frameData: Partial<FrameData> }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !frameData) return;

    // Cast to FrameData — the saved state has all required fields
    renderFrameToCanvas(frameData as FrameData, canvas, { useImageUrl: true });
  }, [frameData]);

  const fw = (frameData.frameWidth as number) || 600;
  const fh = (frameData.frameHeight as number) || 740;

  return (
    <canvas
      ref={canvasRef}
      width={fw}
      height={fh}
      style={{ width: '100%', height: 'auto', display: 'block', borderRadius: 4, maxWidth: '100%' }}
    />
  );
}
