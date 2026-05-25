'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useStore } from '@/store';
import type { FrameData } from '@/store';
import { renderFrameToCanvasAsync } from '@/hooks/usePolaroidCanvas';

const GUEST_STORAGE_KEY = 'polamuse_guest_design';
const AUTOSAVE_INTERVAL = 30_000; // 30s

// ─── useAutoSave ────────────────────────────────────────────
// Periodically saves to the server when logged in and a designId exists.
export function useAutoSave(isLoggedIn: boolean) {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!isLoggedIn) return;

    intervalRef.current = setInterval(async () => {
      const { frames, activeFrameId, currentDesignId, setSaving, setLastSavedAt } = useStore.getState();
      if (!currentDesignId) return;

      const frame = frames.find(f => f.id === activeFrameId);
      if (!frame) return;

      setSaving(true);
      try {
        const res = await fetch(`/api/designs/${currentDesignId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ canvasState: { frameData: frame } }),
        });
        if (res.ok) setLastSavedAt(new Date());
      } catch {
        // silent — next interval will retry
      } finally {
        setSaving(false);
      }
    }, AUTOSAVE_INTERVAL);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isLoggedIn]);
}

// ─── useGuestAutoSave ───────────────────────────────────────
// Saves to localStorage for non-logged-in users so their work isn't lost.
export function useGuestAutoSave(isLoggedIn: boolean) {
  useEffect(() => {
    if (isLoggedIn) return;

    const interval = setInterval(() => {
      const { frames, activeFrameId } = useStore.getState();
      const frame = frames.find(f => f.id === activeFrameId);
      if (!frame || !frame.imageDataUrl) return;
      try {
        localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(frame));
      } catch { /* quota exceeded — ignore */ }
    }, 5_000);

    return () => clearInterval(interval);
  }, [isLoggedIn]);
}

// ─── restoreGuestDesign ─────────────────────────────────────
// Returns saved guest frame data from localStorage (or null).
export function restoreGuestDesign(): Partial<FrameData> | null {
  try {
    const raw = localStorage.getItem(GUEST_STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    // Clear after restoring so it doesn't re-apply on next visit
    localStorage.removeItem(GUEST_STORAGE_KEY);
    return data as Partial<FrameData>;
  } catch {
    return null;
  }
}

// ─── loadDesignById ─────────────────────────────────────────
// Fetches a design from the API and loads it into the store.
export async function loadDesignById(designId: string) {
  const store = useStore.getState();

  try {
    const res = await fetch(`/api/designs/${designId}`);
    if (!res.ok) return;

    const { design } = await res.json();
    if (!design?.canvas_state?.frameData) return;

    store.setDesignId(designId);
    store.updateFrame(store.activeFrameId, design.canvas_state.frameData);
  } catch {
    // Failed to load — user stays on blank canvas
  }
}

// ─── useSaveDesign ──────────────────────────────────────────
// Returns a `saveDesign` function that creates or updates the design,
// then renders the canvas and uploads the snapshot to Cloudinary.
export function useSaveDesign() {
  const saveDesign = useCallback(async () => {
    const { frames, activeFrameId, currentDesignId, setSaving, setLastSavedAt, setDesignId } = useStore.getState();
    const frame = frames.find(f => f.id === activeFrameId);
    if (!frame) return;

    setSaving(true);
    try {
      const canvasState = { frameData: frame };
      let designId = currentDesignId;

      if (currentDesignId) {
        // Update existing
        const res = await fetch(`/api/designs/${currentDesignId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ canvasState }),
        });
        if (res.ok) setLastSavedAt(new Date());
      } else {
        // Create new
        const res = await fetch('/api/designs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            canvasState,
            title: 'Untitled',
            templateId: frame.templateId,
          }),
        });
        if (res.ok) {
          const data = await res.json();
          designId = data.id;
          setDesignId(designId);
          setLastSavedAt(new Date());
          try { localStorage.removeItem(GUEST_STORAGE_KEY); } catch {}
        }
      }

      // Upload rendered PNG snapshot to Cloudinary (non-blocking for UX)
      if (designId) {
        uploadDesignExport(frame, designId).catch(() => {});
      }
    } catch {
      // silent
    } finally {
      setSaving(false);
    }
  }, []);

  return { saveDesign };
}

// ─── uploadBatchExports ─────────────────────────────────────
// Renders each batch design and uploads the export PNG to Cloudinary.
export async function uploadBatchExports(
  designs: { canvas_state: unknown; title: string }[],
  ids: string[]
) {
  for (let i = 0; i < ids.length; i++) {
    const designId = ids[i];
    const fd = (designs[i]?.canvas_state as { frameData: unknown })?.frameData;
    if (!fd || !designId) continue;

    try {
      const canvas = document.createElement('canvas');
      await renderFrameToCanvasAsync(fd as FrameData, canvas, { useImageUrl: true });
      const dataUrl = canvas.toDataURL('image/png');

      await fetch(`/api/designs/${designId}/export`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dataUrl }),
      });
    } catch {
      // Non-critical — continue with other designs
    }

    // Small delay to avoid flooding
    await new Promise(r => setTimeout(r, 100));
  }
}

// ─── uploadDesignExport ─────────────────────────────────────
// Renders the design to a high-res canvas and uploads to Cloudinary.
// Uses stable public_id so edits overwrite the previous export.
async function uploadDesignExport(frame: FrameData, designId: string) {
  try {
    // Use renderFrameToCanvasAsync which sets canvas dimensions internally.
    // We use useImageUrl=true to load from Cloudinary URL (highest quality source).
    const canvas = document.createElement('canvas');
    await renderFrameToCanvasAsync(frame, canvas, { useImageUrl: true });

    // Get the PNG as base64
    const dataUrl = canvas.toDataURL('image/png');

    // Upload to our export endpoint (which uploads to Cloudinary with overwrite)
    await fetch(`/api/designs/${designId}/export`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dataUrl }),
    });
  } catch {
    // Non-critical — the design is still saved, just without a fresh export
  }
}
