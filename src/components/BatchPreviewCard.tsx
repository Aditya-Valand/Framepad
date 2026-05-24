'use client';

import { useRef, useEffect } from 'react';
import { renderFrameToCanvas } from '@/hooks/usePolaroidCanvas';
import type { FrameData, BatchImage } from '@/store';

interface BatchPreviewCardProps {
  image: BatchImage;
  frameData: FrameData;
  onRemove: () => void;
  index: number;
}

export function BatchPreviewCard({ image, frameData, onRemove, index }: BatchPreviewCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const mergedFrame: FrameData = {
      ...frameData,
      imageDataUrl: image.dataUrl,
      imageUrl: null,
      cloudinaryId: null,
      imagePanX: 0,
      imagePanY: 0,
      imageScale: 1,
      imageRotation: 0,
    };
    renderFrameToCanvas(mergedFrame, canvasRef.current);
  }, [image.dataUrl, frameData]);

  return (
    <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
      {/* Remove button */}
      <button
        onClick={onRemove}
        style={{
          position: 'absolute',
          top: -6,
          right: -6,
          width: 22,
          height: 22,
          borderRadius: '50%',
          background: '#E74C3C',
          color: '#fff',
          border: 'none',
          fontSize: 12,
          fontWeight: 700,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2,
          boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
          lineHeight: 1,
        }}
      >
        ×
      </button>

      {/* Index badge */}
      <span
        style={{
          position: 'absolute',
          top: -4,
          left: -4,
          width: 20,
          height: 20,
          borderRadius: '50%',
          background: '#8B6F5C',
          color: '#fff',
          fontSize: 10,
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2,
        }}
      >
        {index + 1}
      </span>

      {/* Canvas preview */}
      <div
        style={{
          width: 140,
          height: 175,
          borderRadius: 6,
          overflow: 'hidden',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          background: '#fff',
        }}
      >
        <canvas
          ref={canvasRef}
          style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
        />
      </div>

      {/* Filename */}
      <span
        style={{
          fontSize: 10,
          color: '#5C4A3A',
          maxWidth: 140,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          fontFamily: '"DM Sans", sans-serif',
        }}
      >
        {image.fileName}
      </span>
    </div>
  );
}
