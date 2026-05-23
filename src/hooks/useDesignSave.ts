'use client';

import { useRef, useEffect, useCallback } from 'react';
import { useStore } from '@/store';
import type { FrameData } from '@/store';

// ── Serialization ──

interface SerializedCanvasState {
  version: 1;
  frameData: Omit<FrameData, 'imageDataUrl'> & { imageDataUrl: null };
}

export function serializeForSave(frame: FrameData): SerializedCanvasState {
  return {
    version: 1,
    frameData: {
      ...frame,
      imageDataUrl: null, // never store base64 in DB
    },
  };
}

// ── Simple hash for diff detection ──

function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash + char) | 0;
  }
  return hash.toString(36);
}

// ── localStorage Guest Persistence ──

const STORAGE_KEY = 'polamuse_pending_design';

export function useGuestAutoSave(isLoggedIn: boolean) {
  const frame = useStore((s) => s.frames.find((f) => f.id === s.activeFrameId));
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Only save to localStorage if NOT logged in
    if (isLoggedIn || !frame) return;

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(frame));
    }, 2000);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [frame, isLoggedIn]);
}

export function restoreGuestDesign(): FrameData | null {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return null;
    return JSON.parse(saved) as FrameData;
  } catch {
    return null;
  }
}

export function clearGuestDesign() {
  localStorage.removeItem(STORAGE_KEY);
}

// ── Cloud Auto-Save ──

export function useAutoSave(isLoggedIn: boolean) {
  const frame = useStore((s) => s.frames.find((f) => f.id === s.activeFrameId));
  const currentDesignId = useStore((s) => s.currentDesignId);
  const setSaving = useStore((s) => s.setSaving);
  const setLastSavedAt = useStore((s) => s.setLastSavedAt);

  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastHashRef = useRef<string>('');
  const lastSaveTimeRef = useRef<number>(0);

  useEffect(() => {
    if (!isLoggedIn || !currentDesignId || !frame) return;

    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);

    // Debounce: 3 seconds after last change
    saveTimerRef.current = setTimeout(async () => {
      const serialized = serializeForSave(frame);
      const json = JSON.stringify(serialized);
      const hash = simpleHash(json);

      // Skip if nothing changed
      if (hash === lastHashRef.current) return;

      // Throttle: min 10 seconds between saves
      const now = Date.now();
      if (now - lastSaveTimeRef.current < 10000) return;

      lastHashRef.current = hash;
      lastSaveTimeRef.current = now;

      setSaving(true);
      try {
        const res = await fetch(`/api/designs/${currentDesignId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ canvasState: serialized }),
        });
        if (res.ok) {
          setLastSavedAt(new Date());
        }
      } catch {
        // Silent fail — user can still export locally
      } finally {
        setSaving(false);
      }
    }, 3000);

    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, [frame, currentDesignId, isLoggedIn, setSaving, setLastSavedAt]);
}

// ── Save Design (manual / first save) ──

export function useSaveDesign() {
  const frame = useStore((s) => s.frames.find((f) => f.id === s.activeFrameId));
  const currentDesignId = useStore((s) => s.currentDesignId);
  const setDesignId = useStore((s) => s.setDesignId);
  const setSaving = useStore((s) => s.setSaving);
  const setLastSavedAt = useStore((s) => s.setLastSavedAt);

  const saveDesign = useCallback(async (title?: string) => {
    if (!frame) return null;

    const serialized = serializeForSave(frame);
    setSaving(true);

    try {
      let designId = currentDesignId;

      if (currentDesignId) {
        // Update existing
        const res = await fetch(`/api/designs/${currentDesignId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ canvasState: serialized, title }),
        });
        if (!res.ok) return null;
        setLastSavedAt(new Date());
      } else {
        // Create new
        const res = await fetch('/api/designs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            canvasState: serialized,
            title: title || 'Untitled',
            templateId: frame.templateId,
          }),
        });
        if (!res.ok) return null;
        const { id } = await res.json();
        designId = id;
        setDesignId(id);
        setLastSavedAt(new Date());
        clearGuestDesign();
      }

      // Generate and upload thumbnail (non-blocking) - disabled, using client-side canvas preview
      // if (designId) { saveThumbnail(designId); }

      return designId;
    } catch {
      // Silent fail
    } finally {
      setSaving(false);
    }
    return null;
  }, [frame, currentDesignId, setDesignId, setSaving, setLastSavedAt]);

  return { saveDesign };
}

// ── Save thumbnail (fire-and-forget) ──

async function saveThumbnail(designId: string) {
  try {
    const canvas = document.querySelector('canvas') as HTMLCanvasElement | null;
    if (!canvas) return;

    const blob = await generateThumbnail(canvas);
    if (!blob) return;

    const thumbnailUrl = await uploadThumbnail(blob);
    if (!thumbnailUrl) return;

    // Update design with thumbnail URL
    await fetch(`/api/designs/${designId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ thumbnailUrl }),
    });
  } catch {
    // Non-critical — silently ignore
  }
}

// ── Load Design ──

export async function loadDesignById(designId: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/designs/${designId}`);
    if (!res.ok) return false;

    const design = await res.json();
    const canvasState = design.canvas_state as SerializedCanvasState;
    const frameData = canvasState.frameData;

    const store = useStore.getState();
    store.updateFrame(store.activeFrameId, {
      ...frameData,
      imageDataUrl: null, // will be hydrated below
    });
    store.setDesignId(designId);

    // Load image from Cloudinary URL (async, non-blocking)
    if (frameData.imageUrl) {
      const img = new window.Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(img, 0, 0);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
        store.updateFrame(store.activeFrameId, { imageDataUrl: dataUrl });
      };
      img.src = frameData.imageUrl;
    }

    return true;
  } catch {
    return false;
  }
}

// ── Thumbnail Generation ──

export function generateThumbnail(canvas: HTMLCanvasElement): Promise<Blob | null> {
  return new Promise((resolve) => {
    const THUMB_WIDTH = 480;
    const scale = THUMB_WIDTH / canvas.width;
    const thumbCanvas = document.createElement('canvas');
    thumbCanvas.width = THUMB_WIDTH;
    thumbCanvas.height = Math.round(canvas.height * scale);
    const ctx = thumbCanvas.getContext('2d');
    if (!ctx) { resolve(null); return; }
    ctx.drawImage(canvas, 0, 0, thumbCanvas.width, thumbCanvas.height);
    thumbCanvas.toBlob((blob) => resolve(blob), 'image/webp', 0.8);
  });
}

export async function uploadThumbnail(blob: Blob): Promise<string | null> {
  try {
    // Get signature
    const signRes = await fetch('/api/uploads/sign', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ folder: 'polamuse/thumbnails' }),
    });
    if (!signRes.ok) return null;

    const { signature, timestamp, apiKey, cloudName, uploadUrl } = await signRes.json();

    const formData = new FormData();
    formData.append('file', blob);
    formData.append('signature', signature);
    formData.append('timestamp', timestamp);
    formData.append('api_key', apiKey);
    formData.append('folder', 'polamuse/thumbnails');

    const uploadRes = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      { method: 'POST', body: formData }
    );
    if (!uploadRes.ok) return null;

    const result = await uploadRes.json();
    return result.secure_url;
  } catch {
    return null;
  }
}
