import { useCallback } from 'react';
import { useStore } from '../store';

const MAX_SIZE_BYTES = 10 * 1024 * 1024;
const COMPRESS_THRESHOLD = 3 * 1024 * 1024;
const VALID_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export function useImageUpload() {
  const activeFrameId = useStore((s) => s.activeFrameId);
  const updateFrame = useStore((s) => s.updateFrame);

  const processFile = useCallback(async (file: File): Promise<string | null> => {
    if (!VALID_TYPES.includes(file.type)) {
      alert('Please upload a JPG, PNG, or WEBP image');
      return null;
    }
    if (file.size > MAX_SIZE_BYTES) {
      alert('Image too large. Max size is 10MB');
      return null;
    }

    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        if (file.size <= COMPRESS_THRESHOLD) {
          resolve(dataUrl);
          return;
        }
        // Compress large images
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let { width, height } = img;
          const maxDim = 2048;
          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = (height / width) * maxDim;
              width = maxDim;
            } else {
              width = (width / height) * maxDim;
              height = maxDim;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d')!;
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.85));
        };
        img.src = dataUrl;
      };
      reader.readAsDataURL(file);
    });
  }, []);

  const uploadFile = useCallback(async (file: File) => {
    const dataUrl = await processFile(file);
    if (dataUrl) {
      // Reset pan/scale so new image always starts centered and covering the frame
      updateFrame(activeFrameId, {
        imageDataUrl: dataUrl,
        imagePanX: 0,
        imagePanY: 0,
        imageScale: 1,
      });
    }
  }, [processFile, activeFrameId, updateFrame]);

  return { uploadFile };
}
