import { useState, useCallback } from 'react';
import { renderFrameToCanvasAsync } from './usePolaroidCanvas';
import type { FrameData, BatchImage } from '@/store';

export interface BatchProgress {
  current: number;
  total: number;
  phase: 'idle' | 'rendering' | 'zipping' | 'done';
}

export function useBatchExport() {
  const [progress, setProgress] = useState<BatchProgress>({ current: 0, total: 0, phase: 'idle' });

  const exportAll = useCallback(async (
    batchImages: BatchImage[],
    frameData: FrameData,
    options: { format: 'zip' | 'individual' }
  ) => {
    if (batchImages.length === 0) return;

    setProgress({ current: 0, total: batchImages.length, phase: 'rendering' });

    const results: { fileName: string; blob: Blob }[] = [];

    for (let i = 0; i < batchImages.length; i++) {
      const img = batchImages[i];

      const canvas = document.createElement('canvas');
      const mergedFrame: FrameData = {
        ...frameData,
        imageDataUrl: img.dataUrl,
        imageUrl: null,
        cloudinaryId: null,
        // Reset pan/scale for each new photo
        imagePanX: 0,
        imagePanY: 0,
        imageScale: 1,
        imageRotation: 0,
      };

      await renderFrameToCanvasAsync(mergedFrame, canvas);

      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((b) => resolve(b || new Blob()), 'image/png');
      });

      const baseName = img.fileName.replace(/\.[^.]+$/, '');
      results.push({ fileName: `${baseName}_polamuse.png`, blob });

      setProgress({ current: i + 1, total: batchImages.length, phase: 'rendering' });

      // Yield to prevent UI freeze
      await new Promise((r) => setTimeout(r, 0));
    }

    if (options.format === 'zip') {
      setProgress({ current: 0, total: 1, phase: 'zipping' });
      const JSZip = (await import('jszip')).default;
      const zip = new JSZip();
      for (const r of results) {
        zip.file(r.fileName, r.blob);
      }
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `polamuse_batch_${Date.now()}.zip`;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      for (const r of results) {
        const url = URL.createObjectURL(r.blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = r.fileName;
        a.click();
        URL.revokeObjectURL(url);
        await new Promise((res) => setTimeout(res, 300));
      }
    }

    setProgress({ current: 0, total: 0, phase: 'done' });
    setTimeout(() => setProgress({ current: 0, total: 0, phase: 'idle' }), 2000);
  }, []);

  return { exportAll, progress };
}
