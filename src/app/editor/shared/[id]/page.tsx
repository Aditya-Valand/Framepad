'use client';
import { use, useState, useEffect, useCallback, useRef } from 'react';
import { useSharedSession } from '@/hooks/useSharedSession';
import { useAuth } from '@/hooks/useAuth';
import { uploadToCloudinary } from '@/hooks/useImageUpload';

// ── Copy-to-clipboard helper ───────────────────────────────────
function copyLink(id: string) {
  const url = `${window.location.origin}/editor/shared/${id}`;
  navigator.clipboard?.writeText(url).catch(() => {});
}

// ── Slot card component ────────────────────────────────────────
function SlotCard({
  slot,
  label,
  imageUrl,
  isMySlot,
  onUpload,
  onCaptionChange,
  caption,
}: {
  slot: 'a' | 'b';
  label: string | null;
  imageUrl: string | null;
  isMySlot: boolean;
  onUpload: (file: File) => void;
  onCaptionChange: (v: string) => void;
  caption: string;
}) {
  const fileRef = useRef<HTMLInputElement>(null);

  return (
    <div style={{
      flex: 1, minWidth: 0,
      background: '#FFFCF8',
      border: isMySlot ? '1.5px solid rgba(139,111,92,0.3)' : '0.5px solid rgba(26,23,20,0.08)',
      borderRadius: 16,
      overflow: 'hidden',
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Header */}
      <div style={{
        padding: '10px 14px',
        borderBottom: '0.5px solid rgba(26,23,20,0.06)',
        background: isMySlot ? 'rgba(139,111,92,0.04)' : 'transparent',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <span style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 12, fontWeight: 600, color: isMySlot ? '#8B6F5C' : '#A39080', textTransform: 'uppercase', letterSpacing: '.07em' }}>
          {label || (slot === 'a' ? 'Creator' : 'Guest')} {isMySlot && '· You'}
        </span>
        <span style={{ fontFamily: '"DM Mono", monospace', fontSize: 10, color: '#C4B5A6' }}>
          Slot {slot.toUpperCase()}
        </span>
      </div>

      {/* Image area */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, minHeight: 220 }}>
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={`Slot ${slot}`}
            style={{ maxWidth: '100%', maxHeight: 260, objectFit: 'contain', borderRadius: 8, boxShadow: '0 2px 12px rgba(26,23,20,0.10)' }}
          />
        ) : isMySlot ? (
          <button
            onClick={() => fileRef.current?.click()}
            style={{
              width: '100%', padding: '32px 20px',
              border: '1.5px dashed rgba(139,111,92,0.3)',
              borderRadius: 12,
              background: 'rgba(139,111,92,0.03)',
              cursor: 'pointer',
              fontFamily: '"DM Sans", sans-serif',
              fontSize: 13, color: '#A39080',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
            }}
          >
            <span style={{ fontSize: 24 }}>📷</span>
            Add your photo
          </button>
        ) : (
          <div style={{ padding: 32, textAlign: 'center', color: '#C4B5A6', fontFamily: '"DM Sans", sans-serif', fontSize: 13 }}>
            Waiting for {label || 'guest'}…
          </div>
        )}
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => { if (e.target.files?.[0]) onUpload(e.target.files[0]); }} />
      </div>

      {/* Caption (editable only for my slot) */}
      {isMySlot && (
        <div style={{ padding: '8px 14px 14px' }}>
          <input
            type="text"
            placeholder="Add a caption…"
            value={caption}
            onChange={(e) => onCaptionChange(e.target.value)}
            maxLength={80}
            style={{
              width: '100%',
              padding: '8px 12px',
              borderRadius: 100,
              border: '0.5px solid rgba(26,23,20,0.1)',
              background: 'rgba(26,23,20,0.02)',
              fontFamily: '"DM Sans", sans-serif',
              fontSize: 13,
              color: '#1A1714',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>
      )}
      {!isMySlot && imageUrl && (
        <div style={{ padding: '4px 14px 14px', fontFamily: '"DM Sans", sans-serif', fontSize: 12, color: '#A39080', fontStyle: 'italic' }}>
          {caption}
        </div>
      )}
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────────
export default function SharedEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { session, mySlot, loading, error, updateCanvas, timeLeft } = useSharedSession(id);
  const { user } = useAuth();

  // Local state per slot
  const [myCaptionA, setMyCaptionA] = useState('');
  const [myCaptionB, setMyCaptionB] = useState('');
  const [myImageUrl, setMyImageUrl] = useState<string | null>(null);
  const [uploading, setUploading]   = useState(false);
  const [copied, setCopied]         = useState(false);
  const [myLabel, setMyLabel]       = useState('');
  const labelSentRef                = useRef(false);

  // Init label from auth user on mount
  useEffect(() => {
    if (user?.email && !myLabel) setMyLabel(user.email.split('@')[0]);
  }, [user, myLabel]);

  // Send label once when slot is known
  useEffect(() => {
    if (!mySlot || !myLabel || labelSentRef.current) return;
    labelSentRef.current = true;
    updateCanvas({}, { label: myLabel });
  }, [mySlot, myLabel, updateCanvas]);

  // Sync captions from session state when remote updates
  useEffect(() => {
    if (!session) return;
    const state = session.canvas_state as Record<string, { caption?: string; imageUrl?: string }> | null;
    if (!state) return;
    if (mySlot !== 'a' && state.a?.caption !== undefined) setMyCaptionA(state.a.caption);
    if (mySlot !== 'b' && state.b?.caption !== undefined) setMyCaptionB(state.b.caption);
    if (mySlot === 'a' && !myImageUrl && state.a?.imageUrl) setMyImageUrl(state.a.imageUrl);
    if (mySlot === 'b' && !myImageUrl && state.b?.imageUrl) setMyImageUrl(state.b.imageUrl);
  }, [session, mySlot, myImageUrl]);

  const handleCaptionChange = useCallback((caption: string) => {
    if (mySlot === 'a') setMyCaptionA(caption);
    else setMyCaptionB(caption);
    const slotKey = mySlot ?? 'a';
    const existing = (session?.canvas_state as Record<string, unknown> | null)?.[slotKey] ?? {};
    updateCanvas({ ...((session?.canvas_state as Record<string, unknown>) ?? {}), [slotKey]: { ...(existing as object), caption } });
  }, [mySlot, session, updateCanvas]);

  const handleUpload = useCallback(async (file: File) => {
    if (!mySlot) return;
    setUploading(true);
    try {
      // Read as base64 first for fast local preview
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      // Optimistic local preview
      setMyImageUrl(dataUrl);
      // Upload to Cloudinary
      const result = await uploadToCloudinary(dataUrl);
      const imageUrl = result?.secureUrl ?? dataUrl;
      setMyImageUrl(imageUrl);
      const slotKey = mySlot;
      const existing = (session?.canvas_state as Record<string, unknown> | null)?.[slotKey] ?? {};
      const caption = mySlot === 'a' ? myCaptionA : myCaptionB;
      updateCanvas(
        { ...((session?.canvas_state as Record<string, unknown>) ?? {}), [slotKey]: { ...(existing as object), imageUrl, caption } },
        { imageUrl }
      );
    } finally {
      setUploading(false);
    }
  }, [mySlot, session, myCaptionA, myCaptionB, updateCanvas]);

  const handleCopy = useCallback(() => {
    copyLink(id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [id]);

  // ── Error / loading states ─────────────────────────────────
  if (loading) {
    return (
      <div style={{ height: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#EDE6DC' }}>
        <div className="animate-pulse" style={{ color: '#8B6F5C', fontFamily: '"DM Sans", sans-serif', fontSize: 14 }}>
          Connecting…
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ height: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#EDE6DC', flexDirection: 'column', gap: 16, padding: 24, textAlign: 'center' }}>
        <div style={{ fontSize: 40 }}>⏳</div>
        <div style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: 22, color: '#1A1714' }}>{error === 'Session has expired' ? 'Session Expired' : 'Session Not Found'}</div>
        <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 13, color: '#A39080', maxWidth: 320 }}>
          {error === 'Session has expired' ? 'This shared canvas has expired. Shared sessions last 48 hours.' : 'This link is invalid or the session no longer exists.'}
        </p>
        <a href="/editor" style={{ padding: '10px 20px', borderRadius: 100, background: '#8B6F5C', color: '#fff', fontFamily: '"DM Sans", sans-serif', fontSize: 13, textDecoration: 'none' }}>
          Open Editor
        </a>
      </div>
    );
  }

  if (!session) return null;

  const stateMap = session.canvas_state as Record<string, { caption?: string; imageUrl?: string }> | null ?? {};
  const captionA = mySlot === 'a' ? myCaptionA : (stateMap.a?.caption ?? '');
  const captionB = mySlot === 'b' ? myCaptionB : (stateMap.b?.caption ?? '');
  const imageA   = mySlot === 'a' ? myImageUrl : (session.slot_a_image_url ?? stateMap.a?.imageUrl ?? null);
  const imageB   = mySlot === 'b' ? myImageUrl : (session.slot_b_image_url ?? stateMap.b?.imageUrl ?? null);

  return (
    <div style={{ minHeight: '100dvh', background: '#EDE6DC', display: 'flex', flexDirection: 'column' }}>

      {/* Header */}
      <header style={{
        flexShrink: 0, height: 56,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 18px',
        background: 'rgba(251,248,244,0.95)', backdropFilter: 'blur(16px)',
        borderBottom: '0.5px solid rgba(26,23,20,0.08)',
        boxShadow: '0 1px 0 rgba(255,255,255,0.45) inset',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <a href="/editor" style={{ color: '#A39080', fontFamily: '"DM Sans", sans-serif', fontSize: 12, textDecoration: 'none' }}>← Editor</a>
          <span style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: 18, fontStyle: 'italic', color: '#1A1714' }}>
            Shared Canvas
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {timeLeft && (
            <span style={{ fontFamily: '"DM Mono", monospace', fontSize: 11, color: '#A39080' }}>
              ⏱ {timeLeft}
            </span>
          )}
          <button
            onClick={handleCopy}
            style={{
              padding: '7px 14px', borderRadius: 100, border: '0.5px solid rgba(139,111,92,0.3)',
              background: 'transparent', color: '#8B6F5C',
              fontFamily: '"DM Sans", sans-serif', fontSize: 12, cursor: 'pointer',
              transition: 'all .15s',
            }}
          >
            {copied ? '✓ Copied' : 'Share link'}
          </button>
        </div>
      </header>

      {/* Slot indicator */}
      <div style={{ padding: '10px 18px 0', display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 12, color: '#A39080' }}>
          You're editing
        </span>
        <span style={{ fontFamily: '"DM Mono", monospace', fontSize: 12, fontWeight: 600, color: '#8B6F5C', background: 'rgba(139,111,92,0.08)', padding: '2px 8px', borderRadius: 100 }}>
          Slot {(mySlot ?? '?').toUpperCase()}
        </span>
        {uploading && <span style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 11, color: '#A39080' }} className="animate-pulse">Uploading…</span>}
      </div>

      {/* Canvas area — two slots side by side */}
      <main style={{ flex: 1, padding: 18, display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'flex-start' }}>
        <SlotCard
          slot="a"
          label={session.slot_a_label}
          imageUrl={imageA}
          isMySlot={mySlot === 'a'}
          onUpload={handleUpload}
          onCaptionChange={handleCaptionChange}
          caption={captionA}
        />
        <SlotCard
          slot="b"
          label={session.slot_b_label}
          imageUrl={imageB}
          isMySlot={mySlot === 'b'}
          onUpload={handleUpload}
          onCaptionChange={handleCaptionChange}
          caption={captionB}
        />
      </main>

      {/* Footer note */}
      <div style={{ padding: '10px 18px 20px', textAlign: 'center', fontFamily: '"DM Sans", sans-serif', fontSize: 11, color: '#C4B5A6' }}>
        Changes sync live · Session expires in {timeLeft || '…'} · Anyone with this link can view and join
      </div>
    </div>
  );
}
