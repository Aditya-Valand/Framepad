import { useState, useEffect } from 'react';

/**
 * Fetches a Spotify code and removes its background color to create true transparency.
 * Uses canvas pixel manipulation to replace the bg color with transparent pixels.
 */
export function useTransparentSpotifyCode(
  spotifyUrl: string | null,
  bgColor: string, // The background color we want to remove (hex)
  fgColor: 'white' | 'black'
): string | null {
  const [transparentUrl, setTransparentUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!spotifyUrl) {
      setTransparentUrl(null);
      return;
    }

    const spotifyMatch = spotifyUrl.match(/spotify\.com\/(track|album|playlist|artist)\/([a-zA-Z0-9]+)/);
    if (!spotifyMatch) {
      setTransparentUrl(null);
      return;
    }

    // Fetch with a neutral background that we'll remove
    // Use the bgColor so we know exactly what to make transparent
    const cleanBg = bgColor.replace('#', '');
    const codeUrl = `https://scannables.scdn.co/uri/plain/png/${cleanBg}/${fgColor}/640/spotify:${spotifyMatch[1]}:${spotifyMatch[2]}`;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) return;

      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // Parse the background color to RGB
      const bgRgb = hexToRgb(bgColor);
      if (!bgRgb) return;

      // Tolerance for color matching (some anti-aliasing may cause slight variations)
      const tolerance = 30;

      // Process each pixel
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        // Check if this pixel matches the background color (within tolerance)
        if (
          Math.abs(r - bgRgb.r) <= tolerance &&
          Math.abs(g - bgRgb.g) <= tolerance &&
          Math.abs(b - bgRgb.b) <= tolerance
        ) {
          // Make it transparent
          data[i + 3] = 0;
        }
      }

      ctx.putImageData(imageData, 0, 0);
      setTransparentUrl(canvas.toDataURL('image/png'));
    };

    img.onerror = () => {
      setTransparentUrl(null);
    };

    img.src = codeUrl;

    return () => {
      // Cleanup: revoke any object URLs if we used them
    };
  }, [spotifyUrl, bgColor, fgColor]);

  return transparentUrl;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

/**
 * Synchronous version for canvas export - returns a promise
 */
export async function getTransparentSpotifyCode(
  spotifyUrl: string,
  bgColor: string,
  fgColor: 'white' | 'black'
): Promise<HTMLImageElement | null> {
  const spotifyMatch = spotifyUrl.match(/spotify\.com\/(track|album|playlist|artist)\/([a-zA-Z0-9]+)/);
  if (!spotifyMatch) return null;

  const cleanBg = bgColor.replace('#', '');
  const codeUrl = `https://scannables.scdn.co/uri/plain/png/${cleanBg}/${fgColor}/640/spotify:${spotifyMatch[1]}:${spotifyMatch[2]}`;

  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) {
        resolve(null);
        return;
      }

      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      const bgRgb = hexToRgb(bgColor);
      if (!bgRgb) {
        resolve(null);
        return;
      }

      const tolerance = 30;

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        if (
          Math.abs(r - bgRgb.r) <= tolerance &&
          Math.abs(g - bgRgb.g) <= tolerance &&
          Math.abs(b - bgRgb.b) <= tolerance
        ) {
          data[i + 3] = 0;
        }
      }

      ctx.putImageData(imageData, 0, 0);

      // Create a new image from the processed canvas
      const resultImg = new Image();
      resultImg.onload = () => resolve(resultImg);
      resultImg.onerror = () => resolve(null);
      resultImg.src = canvas.toDataURL('image/png');
    };

    img.onerror = () => resolve(null);
    img.src = codeUrl;
  });
}
