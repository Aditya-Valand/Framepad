'use client';
import { useState, useEffect, useCallback, useRef } from 'react';

export interface SharedSession {
  canvas_state:      Record<string, unknown>;
  slot_a_filled:     boolean;
  slot_b_filled:     boolean;
  slot_a_label:      string | null;
  slot_b_label:      string | null;
  slot_a_image_url:  string | null;
  slot_b_image_url:  string | null;
  status:            'active' | 'completed' | 'expired';
  expires_at:        string;
  updated_at:        string;
}

export type Slot = 'a' | 'b';

function getStoredSlot(sessionId: string): Slot | null {
  try {
    const v = localStorage.getItem(`session_${sessionId}_slot`);
    return v === 'a' || v === 'b' ? v : null;
  } catch { return null; }
}
function setStoredSlot(sessionId: string, slot: Slot) {
  try { localStorage.setItem(`session_${sessionId}_slot`, slot); } catch {}
}

export function useSharedSession(sessionId: string) {
  const [session, setSession]   = useState<SharedSession | null>(null);
  const [mySlot, setMySlot]     = useState<Slot | null>(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');
  const debounceRef             = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── SSE connection ────────────────────────────────────────
  useEffect(() => {
    let es: EventSource | null = null;

    const connect = () => {
      es = new EventSource(`/api/sessions/${sessionId}/stream`);

      es.onmessage = (e) => {
        try {
          const data = JSON.parse(e.data as string) as SharedSession & { error?: string; status?: string };
          if (data.error) { setError(data.error); setLoading(false); return; }
          if (data.status === 'expired') { setError('Session has expired'); setLoading(false); return; }
          setSession(data);
          setLoading(false);
        } catch {}
      };

      es.onerror = () => {
        // EventSource auto-reconnects; just update loading state
        setLoading(false);
      };
    };

    connect();
    return () => { if (es) es.close(); };
  }, [sessionId]);

  // ── Determine which slot this viewer is ───────────────────
  useEffect(() => {
    if (!session) return;
    const stored = getStoredSlot(sessionId);
    if (stored) { setMySlot(stored); return; }
    // New viewer: assign slot A if creator, B if joining
    const slot: Slot = session.slot_b_filled ? 'a' : 'b'; // default new viewer gets B
    setStoredSlot(sessionId, slot);
    setMySlot(slot);
  }, [session, sessionId]);

  // ── Send canvas update (debounced 500ms) ─────────────────
  const updateCanvas = useCallback((
    canvasState: Record<string, unknown>,
    opts?: { label?: string; imageUrl?: string }
  ) => {
    if (!mySlot) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        await fetch(`/api/sessions/${sessionId}/canvas`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ canvasState, slot: mySlot, ...opts }),
        });
      } catch {}
    }, 500);
  }, [mySlot, sessionId]);

  // ── Expiry time remaining ─────────────────────────────────
  const [timeLeft, setTimeLeft] = useState('');
  useEffect(() => {
    if (!session) return;
    const tick = () => {
      const ms = new Date(session.expires_at).getTime() - Date.now();
      if (ms <= 0) { setTimeLeft('Expired'); return; }
      const h  = Math.floor(ms / 3_600_000);
      const m  = Math.floor((ms % 3_600_000) / 60_000);
      setTimeLeft(`${h}h ${m}m`);
    };
    tick();
    const iv = setInterval(tick, 60_000);
    return () => clearInterval(iv);
  }, [session]);

  return { session, mySlot, loading, error, updateCanvas, timeLeft };
}
