'use client';
import { useRef, useState, useCallback } from 'react';

export type FacingMode = 'user' | 'environment';

export function useCamera() {
  const videoRef    = useRef<HTMLVideoElement>(null);
  const streamRef   = useRef<MediaStream | null>(null);
  const [facing, setFacing]       = useState<FacingMode>('user');
  const [hasCamera, setHasCamera] = useState(true);
  const [cameraError, setCameraError] = useState('');

  const startCamera = useCallback(async (facingOverride?: FacingMode): Promise<boolean> => {
    const mode = facingOverride ?? facing;
    // Stop any existing stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: mode, width: { ideal: 1920 }, height: { ideal: 1080 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setHasCamera(true);
      setCameraError('');
      return true;
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      setHasCamera(false);
      setCameraError(msg.includes('Permission') ? 'Camera permission denied' : 'Could not access camera');
      return false;
    }
  }, [facing]);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) videoRef.current.srcObject = null;
  }, []);

  const takeShot = useCallback((): string | null => {
    const video = videoRef.current;
    if (!video || video.videoWidth === 0) return null;
    const canvas = document.createElement('canvas');
    canvas.width  = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d')!;
    // Mirror front camera shot to match what user sees
    if (facing === 'user') {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(video, 0, 0);
    return canvas.toDataURL('image/jpeg', 0.92);
  }, [facing]);

  const switchCamera = useCallback(() => {
    const next: FacingMode = facing === 'user' ? 'environment' : 'user';
    setFacing(next);
    startCamera(next);
  }, [facing, startCamera]);

  return { videoRef, startCamera, stopCamera, takeShot, switchCamera, facing, hasCamera, cameraError };
}
