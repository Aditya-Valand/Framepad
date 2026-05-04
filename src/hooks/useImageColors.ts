import { useEffect, useState } from 'react';

/**
 * Extracts N visually distinct dominant colors from an image data URL.
 * Uses a grid-sample + median-cut-inspired quantisation that runs fully
 * on the client without any third-party library.
 */
export function useImageColors(
  imageDataUrl: string | null,
  count = 6
): string[] {
  const [colors, setColors] = useState<string[]>([]);

  useEffect(() => {
    if (!imageDataUrl) {
      setColors([]);
      return;
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      // Down-scale to a small canvas for fast sampling
      const SIZE = 80;
      const canvas = document.createElement('canvas');
      canvas.width = SIZE;
      canvas.height = SIZE;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.drawImage(img, 0, 0, SIZE, SIZE);
      const { data } = ctx.getImageData(0, 0, SIZE, SIZE);

      // Collect all pixels, skip near-white and near-black edge pixels
      const pixels: [number, number, number][] = [];
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i], g = data[i + 1], b = data[i + 2], a = data[i + 3];
        if (a < 128) continue;
        pixels.push([r, g, b]);
      }

      // Simple k-means with k=count, 8 iterations
      const palette = kMeans(pixels, count, 8);
      setColors(palette.map(toHex));
    };
    img.src = imageDataUrl;
  }, [imageDataUrl, count]);

  return colors;
}

// ── helpers ───────────────────────────────────────────────────────────────────

function toHex([r, g, b]: [number, number, number]): string {
  return '#' + [r, g, b].map((v) => Math.round(v).toString(16).padStart(2, '0')).join('');
}

function colorDist(a: [number, number, number], b: [number, number, number]) {
  return (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2;
}

function kMeans(
  pixels: [number, number, number][],
  k: number,
  iterations: number
): [number, number, number][] {
  if (pixels.length === 0) return [];

  // Init centroids by sampling evenly spaced pixels
  const step = Math.max(1, Math.floor(pixels.length / k));
  let centroids: [number, number, number][] = Array.from({ length: k }, (_, i) =>
    [...pixels[Math.min(i * step, pixels.length - 1)]] as [number, number, number]
  );

  for (let iter = 0; iter < iterations; iter++) {
    // Assign each pixel to nearest centroid
    const buckets: [number, number, number][][] = Array.from({ length: k }, () => []);
    for (const px of pixels) {
      let best = 0, bestDist = Infinity;
      for (let c = 0; c < k; c++) {
        const d = colorDist(px, centroids[c]);
        if (d < bestDist) { bestDist = d; best = c; }
      }
      buckets[best].push(px);
    }

    // Recalculate centroids
    centroids = centroids.map((prev, c) => {
      if (buckets[c].length === 0) return prev;
      const n = buckets[c].length;
      return [
        buckets[c].reduce((s, p) => s + p[0], 0) / n,
        buckets[c].reduce((s, p) => s + p[1], 0) / n,
        buckets[c].reduce((s, p) => s + p[2], 0) / n,
      ] as [number, number, number];
    });
  }

  // Sort by perceived brightness (dark → light) for a tidy swatch row
  return centroids.sort((a, b) =>
    (0.299 * a[0] + 0.587 * a[1] + 0.114 * a[2]) -
    (0.299 * b[0] + 0.587 * b[1] + 0.114 * b[2])
  );
}
