'use client';
import { useEffect, useState, useCallback, useRef } from 'react';
import { useCamera } from '@/hooks/useCamera';
import { useCoins } from '@/hooks/useCoins';
import { useAuth } from '@/hooks/useAuth';
import { COIN_COSTS } from '@/lib/coins';

// ── Local booth session tracking (free tier) ──────────────────
const DAILY_FREE_SESSIONS = 3;

function getTodayKey() {
  return `booth_sessions_${new Date().toISOString().slice(0, 10)}`;
}
function getFreeSessions(): number {
  try { return parseInt(localStorage.getItem(getTodayKey()) || '0'); } catch { return 0; }
}
function recordFreeSession() {
  try {
    const n = getFreeSessions();
    localStorage.setItem(getTodayKey(), String(n + 1));
  } catch {}
}
function canUseFree(): boolean {
  return getFreeSessions() < DAILY_FREE_SESSIONS;
}

// ── Film strip composer (client-side) ─────────────────────────
async function buildFilmStrip(shots: string[]): Promise<string> {
  const FRAME_W = 600;
  const FRAME_H = 500;
  const BORDER  = 16;
  const LABEL_H = 40;
  const STRIP_W = FRAME_W + BORDER * 2;
  const STRIP_H = (FRAME_H + BORDER) * shots.length + LABEL_H + BORDER;

  const canvas = document.createElement('canvas');
  canvas.width  = STRIP_W;
  canvas.height = STRIP_H;
  const ctx = canvas.getContext('2d')!;

  // Background
  ctx.fillStyle = '#111';
  ctx.fillRect(0, 0, STRIP_W, STRIP_H);

  // Sprocket holes (filmstrip aesthetic)
  ctx.fillStyle = '#2a2a2a';
  for (let i = 0; i < STRIP_H; i += 30) {
    ctx.beginPath(); ctx.arc(8, i + 10, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath(); ctx.arc(STRIP_W - 8, i + 10, 5, 0, Math.PI * 2);
    ctx.fill();
  }

  // Load and draw shots
  await Promise.all(shots.map((src, idx) => new Promise<void>((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const y  = BORDER + idx * (FRAME_H + BORDER);
      const sx = BORDER;
      // White frame border
      ctx.fillStyle = '#FFFCF8';
      ctx.fillRect(sx - 3, y - 3, FRAME_W + 6, FRAME_H + 6);
      // Cover-fit the image into the frame
      const imgAspect   = img.width / img.height;
      const frameAspect = FRAME_W / FRAME_H;
      let sw = img.width, sh = img.height, sx2 = 0, sy2 = 0;
      if (imgAspect > frameAspect) { sw = img.height * frameAspect; sx2 = (img.width - sw) / 2; }
      else                          { sh = img.width / frameAspect;  sy2 = (img.height - sh) / 2; }
      ctx.drawImage(img, sx2, sy2, sw, sh, sx, y, FRAME_W, FRAME_H);
      resolve();
    };
    img.onerror = () => resolve();
    img.src = src;
  })));

  // Date stamp
  const date = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  ctx.fillStyle = 'rgba(255,255,255,0.35)';
  ctx.font = '600 13px "DM Mono", monospace';
  ctx.textAlign = 'center';
  ctx.fillText(`polamuse · ${date}`, STRIP_W / 2, STRIP_H - LABEL_H / 2 + 4);

  return canvas.toDataURL('image/jpeg', 0.93);
}

// ─────────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────────

type BoothState = 'idle' | 'countdown' | 'shooting' | 'assembling' | 'result';

export default function BoothPage() {
  const { videoRef, startCamera, stopCamera, takeShot, switchCamera, facing, hasCamera, cameraError } = useCamera();
  const { user } = useAuth();
  const { balance, refresh: refreshCoins } = useCoins();

  const [state, setState]         = useState<BoothState>('idle');
  const [countdown, setCountdown] = useState(3);
  const [shots, setShots]         = useState<string[]>([]);
  const [stripUrl, setStripUrl]   = useState('');
  const [flash, setFlash]         = useState(false);
  const [error, setError]         = useState('');
  const [gatePrompt, setGatePrompt] = useState(false); // "buy coins" prompt
  const [spending, setSpending]   = useState(false);

  // Mirror front-cam video in CSS (like a selfie mirror)
  const videoStyle = facing === 'user' ? { transform: 'scaleX(-1)' } : {};

  // ── Start camera on mount ─────────────────────────────────
  useEffect(() => {
    startCamera();
    return () => stopCamera();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Shoot sequence ────────────────────────────────────────
  const shotsRef = useRef<string[]>([]);

  const doShootSequence = useCallback(async () => {
    const captured: string[] = [];
    for (let i = 0; i < 4; i++) {
      // Countdown 3-2-1
      for (let c = 3; c >= 1; c--) {
        setCountdown(c);
        setState('countdown');
        await new Promise(r => setTimeout(r, 900));
      }
      // Flash + snap
      setFlash(true);
      await new Promise(r => setTimeout(r, 80));
      const shot = takeShot();
      setFlash(false);

      if (!shot) { setError('Camera read failed'); return; }
      captured.push(shot);
      shotsRef.current = [...captured];
      setShots([...captured]);
      setState('shooting');

      if (i < 3) await new Promise(r => setTimeout(r, 1800)); // gap between shots
    }

    // Build strip
    setState('assembling');
    try {
      const strip = await buildFilmStrip(captured);
      setStripUrl(strip);
      setState('result');
    } catch {
      setError('Failed to build film strip');
      setState('idle');
    }
  }, [takeShot]);

  // ── Handle start button ───────────────────────────────────
  const handleStart = useCallback(async () => {
    setError('');
    // Gate check
    const free = canUseFree();
    if (!free) {
      if (!user) { setError('Sign in to continue — booth sessions are free for 3 tries/day.'); return; }
      const cost = COIN_COSTS.booth;
      if (balance === null || balance < cost) {
        setGatePrompt(true);
        return;
      }
      // Spend coins
      setSpending(true);
      try {
        const res = await fetch('/api/coins/spend', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ feature: 'booth' }),
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          setError(data.error ?? 'Insufficient coins');
          setSpending(false);
          return;
        }
        refreshCoins();
      } catch {
        setError('Network error — please retry');
        setSpending(false);
        return;
      }
      setSpending(false);
    } else {
      recordFreeSession();
    }

    setState('shooting');
    await doShootSequence();
  }, [user, balance, doShootSequence, refreshCoins]);

  // ── Reset ─────────────────────────────────────────────────
  const handleReset = useCallback(() => {
    setShots([]);
    shotsRef.current = [];
    setStripUrl('');
    setError('');
    setGatePrompt(false);
    setState('idle');
    startCamera();
  }, [startCamera]);

  // ── Download strip ────────────────────────────────────────
  const downloadStrip = useCallback(() => {
    const a = document.createElement('a');
    a.href = stripUrl;
    a.download = `polamuse-booth-${Date.now()}.jpg`;
    a.click();
  }, [stripUrl]);

  const freeLeft = DAILY_FREE_SESSIONS - getFreeSessions();
  const isActive = state === 'countdown' || state === 'shooting' || state === 'assembling';

  // ─── Result screen ────────────────────────────────────────
  if (state === 'result' && stripUrl) {
    return (
      <div style={{ minHeight: '100dvh', background: '#111', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ maxWidth: 340, width: '100%' }}>
          <img src={stripUrl} alt="Film strip" style={{ width: '100%', borderRadius: 8, boxShadow: '0 8px 40px rgba(0,0,0,0.7)', display: 'block' }} />
          <div style={{ display: 'flex', gap: 10, marginTop: 20, justifyContent: 'center' }}>
            <button onClick={downloadStrip} style={btnStyle('#8B6F5C')}>
              ↓ Download
            </button>
            <button onClick={handleReset} style={btnStyle('rgba(255,255,255,0.1)')}>
              New session
            </button>
          </div>
          <p style={{ textAlign: 'center', marginTop: 14, fontFamily: '"DM Sans", sans-serif', fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>
            To order a print, save this to your device then upload in the editor.
          </p>
          <a href="/editor" style={{ display: 'block', textAlign: 'center', marginTop: 8, color: 'rgba(139,111,92,0.8)', fontFamily: '"DM Sans", sans-serif', fontSize: 12, textDecoration: 'none' }}>
            ← Back to editor
          </a>
        </div>
      </div>
    );
  }

  // ─── Camera / countdown / assembling screen ───────────────
  return (
    <div style={{ minHeight: '100dvh', background: '#000', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>

      {/* Camera feed */}
      {hasCamera && (
        <video
          ref={videoRef}
          playsInline
          muted
          autoPlay
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            objectFit: 'cover',
            ...videoStyle,
          }}
        />
      )}

      {/* Vignette */}
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.6) 100%)', pointerEvents: 'none' }} />

      {/* Flash overlay */}
      {flash && <div style={{ position: 'absolute', inset: 0, background: '#fff', zIndex: 50 }} />}

      {/* Camera error */}
      {!hasCamera && (
        <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', padding: 24 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>📷</div>
          <p style={{ color: '#fff', fontFamily: '"DM Sans", sans-serif', fontSize: 15, marginBottom: 8 }}>{cameraError || 'No camera'}</p>
          <button onClick={() => startCamera()} style={btnStyle('#8B6F5C')}>Retry</button>
        </div>
      )}

      {hasCamera && (
        <>
          {/* Header */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px' }}>
            <a href="/editor" style={{ color: 'rgba(255,255,255,0.7)', fontFamily: '"DM Sans", sans-serif', fontSize: 13, textDecoration: 'none' }}>
              ← Editor
            </a>
            <span style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: 18, fontStyle: 'italic', color: '#fff' }}>
              Pola<em style={{ color: '#C4A882' }}>booth</em>
            </span>
            <button onClick={switchCamera} style={{ background: 'rgba(255,255,255,0.12)', border: 'none', borderRadius: 100, padding: '6px 10px', color: '#fff', cursor: 'pointer', fontSize: 14 }}>
              🔄
            </button>
          </div>

          {/* Shot progress dots */}
          {shots.length > 0 && shots.length < 4 && (
            <div style={{ position: 'absolute', top: 60, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 6, zIndex: 10 }}>
              {[0,1,2,3].map(i => (
                <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: i < shots.length ? '#C4A882' : 'rgba(255,255,255,0.3)' }} />
              ))}
            </div>
          )}

          {/* Countdown number */}
          {state === 'countdown' && (
            <div style={{
              position: 'absolute', zIndex: 20,
              fontFamily: '"Cormorant Garamond", serif',
              fontSize: 160, fontWeight: 300,
              color: 'rgba(255,255,255,0.9)',
              lineHeight: 1,
              textShadow: '0 0 60px rgba(0,0,0,0.8)',
              userSelect: 'none',
              animation: 'boothPop .3s ease-out',
            }}>
              {countdown}
            </div>
          )}

          {/* Assembling overlay */}
          {state === 'assembling' && (
            <div style={{ position: 'absolute', zIndex: 20, textAlign: 'center' }}>
              <div className="animate-pulse" style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: 22, color: '#C4A882', marginBottom: 8 }}>
                Developing film…
              </div>
              <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
                {shots.map((s, i) => (
                  <img key={i} src={s} style={{ width: 48, height: 38, objectFit: 'cover', borderRadius: 3, opacity: 0.8 }} />
                ))}
              </div>
            </div>
          )}

          {/* Gate prompt */}
          {gatePrompt && (
            <div style={{ position: 'absolute', inset: 0, zIndex: 30, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
              <div style={{ width: '100%', maxWidth: 420, background: '#FFFCF8', borderRadius: '20px 20px 0 0', padding: '28px 24px 40px' }}>
                <div style={{ width: 36, height: 4, borderRadius: 2, background: 'rgba(26,23,20,0.15)', margin: '0 auto 20px' }} />
                <div style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: 20, color: '#1A1714', marginBottom: 6 }}>Free sessions used up</div>
                <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 13, color: '#A39080', marginBottom: 20, lineHeight: 1.5 }}>
                  You've had {DAILY_FREE_SESSIONS} free booth sessions today. Use {COIN_COSTS.booth} Pola Coins to continue (you have {balance ?? '…'}).
                </p>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button onClick={() => setGatePrompt(false)} style={btnStyle('rgba(26,23,20,0.07)', '#1A1714')}>Cancel</button>
                  <a href="/account/coins" style={{ ...btnStyle('#8B6F5C'), display: 'inline-flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', flex: 1 }}>
                    Get coins
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div style={{ position: 'absolute', bottom: 140, left: 20, right: 20, zIndex: 20, background: 'rgba(180,40,40,0.85)', borderRadius: 10, padding: '10px 14px', color: '#fff', fontFamily: '"DM Sans", sans-serif', fontSize: 13, textAlign: 'center' }}>
              {error}
            </div>
          )}

          {/* Capture button */}
          {!isActive && (
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 10, padding: '24px 24px max(24px, env(safe-area-inset-bottom))', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
              {freeLeft > 0 ? (
                <div style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 4 }}>
                  {freeLeft} free {freeLeft === 1 ? 'session' : 'sessions'} left today
                </div>
              ) : (
                <div style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 12, color: 'rgba(196,168,130,0.8)', marginBottom: 4 }}>
                  🪙 {COIN_COSTS.booth} coins per session
                </div>
              )}
              <button
                onClick={handleStart}
                disabled={spending}
                style={{
                  width: 72, height: 72,
                  borderRadius: '50%',
                  background: spending ? 'rgba(139,111,92,0.5)' : '#fff',
                  border: '4px solid rgba(255,255,255,0.3)',
                  cursor: spending ? 'wait' : 'pointer',
                  boxShadow: '0 0 0 8px rgba(255,255,255,0.08)',
                  transition: 'transform .1s',
                }}
                onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.93)'; }}
                onMouseUp={(e)   => { e.currentTarget.style.transform = 'scale(1)'; }}
              />
              <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 4 }}>
                4 shots · auto sequence
              </p>
            </div>
          )}
        </>
      )}

      {/* Keyframe animation */}
      <style>{`@keyframes boothPop { from { transform: scale(1.4); opacity: 0; } to { transform: scale(1); opacity: 1; } }`}</style>
    </div>
  );
}

function btnStyle(bg: string, color = '#fff'): React.CSSProperties {
  return {
    flex: 1,
    padding: '12px 18px',
    borderRadius: 100,
    border: 'none',
    background: bg,
    color,
    fontFamily: '"DM Sans", sans-serif',
    fontSize: 13,
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'opacity .15s',
  };
}
