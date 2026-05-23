'use client';

import { useState } from 'react';
import { useStore } from '@/store';
import { useImageColors } from '@/hooks/useImageColors';
import { useTransparentSpotifyCode } from '@/hooks/useTransparentSpotifyCode';
import { Button, Slider, SectionLabel } from '@/components/ui';

const CODE_BG_COLORS = [
  { id: 'transparent', label: 'Clear'  },
  { id: '#FFFFFF',     label: 'White'  },
  { id: '#000000',     label: 'Black'  },
  { id: '#1DB954',     label: 'Green'  },
  { id: '#F5EDD6',     label: 'Cream'  },
  { id: '#191414',     label: 'Dark'   },
  { id: '#282828',     label: 'Gray'   },
];

const sep = (
  <div style={{ height: '0.5px', background: 'rgba(26,23,20,0.07)', margin: '2px 0' }} />
);

function SpotifyLogo() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
    </svg>
  );
}

export function MusicPanel() {
  const activeFrameId = useStore((s) => s.activeFrameId);
  const frame         = useStore((s) => s.frames.find((f) => f.id === s.activeFrameId));
  const updateFrame   = useStore((s) => s.updateFrame);
  const [input, setInput]  = useState(frame?.musicUrl || '');
  const photoColors        = useImageColors(frame?.imageDataUrl ?? null);

  if (!frame) return null;

  const handleApply = () => updateFrame(activeFrameId, { musicUrl: input });

  const spotifyMatch   = input.match(/spotify\.com\/(track|album|playlist|artist)\/([a-zA-Z0-9]+)/);
  const fgColor        = frame.musicCodeFg === '#FFFFFF' ? 'white' : 'black';
  const isTransparentBg = frame.musicCodeBg === 'transparent';
  const effectiveBg    = isTransparentBg ? '#FFFFFF' : frame.musicCodeBg;

  const transparentCodeUrl = useTransparentSpotifyCode(
    isTransparentBg && spotifyMatch ? input : null,
    '#FFFFFF',
    fgColor as 'white' | 'black',
  );

  const previewUrl = isTransparentBg
    ? transparentCodeUrl
    : (spotifyMatch
        ? `https://scannables.scdn.co/uri/plain/png/${effectiveBg.replace('#', '')}/${fgColor}/640/spotify:${spotifyMatch[1]}:${spotifyMatch[2]}`
        : null);

  const isCodeBlack = frame.musicCodeFg !== '#FFFFFF';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* ── Spotify URL input ── */}
      <section>
        <SectionLabel>Spotify Link</SectionLabel>
        <div style={{ position: 'relative' }}>
          {/* Spotify icon inside input */}
          <div style={{
            position: 'absolute',
            left: 12,
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#1DB954',
            display: 'flex',
            alignItems: 'center',
            pointerEvents: 'none',
          }}>
            <SpotifyLogo />
          </div>
          <input
            type="url"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste Spotify track / album / playlist URL"
            style={{
              width: '100%',
              paddingLeft: 36,
              paddingRight: 12,
              paddingTop: 11,
              paddingBottom: 11,
              borderRadius: 12,
              border: '0.5px solid rgba(26,23,20,0.14)',
              background: 'rgba(26,23,20,0.03)',
              fontFamily: '"DM Sans", sans-serif',
              fontSize: 13,
              color: '#5C4A3A',
              outline: 'none',
              boxSizing: 'border-box',
              transition: 'border-color .15s ease',
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = '#8B6F5C')}
            onBlur={(e)  => (e.currentTarget.style.borderColor = 'rgba(26,23,20,0.14)')}
          />
        </div>
      </section>

      {/* ── Preview ── */}
      {previewUrl && (
        <section>
          <SectionLabel>Preview</SectionLabel>
          <div style={{
            borderRadius: 12,
            border: '0.5px solid rgba(26,23,20,0.1)',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px 20px',
            background: isTransparentBg
              ? `repeating-conic-gradient(#E0DDD8 0% 25%, #F0EDE8 0% 50%) 0 0 / 16px 16px`
              : effectiveBg,
          }}>
            <img
              src={previewUrl}
              alt="Spotify scan code"
              style={{ height: 40, objectFit: 'contain' }}
              crossOrigin="anonymous"
            />
          </div>
        </section>
      )}

      {/* ── Apply button ── */}
      <Button onClick={handleApply} disabled={!input.trim()} fullWidth>
        {frame.musicUrl ? 'Update Code' : 'Add to Polaroid'}
      </Button>

      {/* ── Customisation (only when code added) ── */}
      {frame.musicUrl && (
        <>
          {sep}

          {/* Code background swatches */}
          <section>
            <SectionLabel>Code Background</SectionLabel>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
              {CODE_BG_COLORS.map((c) => {
                const active = frame.musicCodeBg === c.id;
                const isClear = c.id === 'transparent';
                return (
                  <button
                    key={c.id}
                    onClick={() => updateFrame(activeFrameId, { musicCodeBg: c.id })}
                    title={c.label}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 5,
                      padding: '8px 4px 6px',
                      borderRadius: 10,
                      border: active ? '1.5px solid #8B6F5C' : '0.5px solid rgba(26,23,20,0.1)',
                      background: active ? 'rgba(139,111,92,0.07)' : 'rgba(26,23,20,0.02)',
                      cursor: 'pointer',
                      transition: 'all .14s ease',
                    }}
                  >
                    <div style={{
                      width: 28,
                      height: 28,
                      borderRadius: 7,
                      flexShrink: 0,
                      border: '0.5px solid rgba(26,23,20,0.12)',
                      backgroundColor: isClear ? frame.frameColor : c.id,
                      backgroundImage: isClear
                        ? 'repeating-conic-gradient(#CCC 0% 25%, #FFF 0% 50%) 0 0 / 8px 8px'
                        : undefined,
                    }} />
                    <span style={{
                      fontFamily: '"DM Sans", sans-serif',
                      fontSize: 9,
                      fontWeight: active ? 600 : 400,
                      color: active ? '#6B4F3A' : '#A39080',
                      letterSpacing: '.03em',
                    }}>
                      {c.label}
                    </span>
                  </button>
                );
              })}

              {/* Custom color swatch */}
              <label
                title="Custom color"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 5,
                  padding: '8px 4px 6px',
                  borderRadius: 10,
                  border: '0.5px solid rgba(26,23,20,0.1)',
                  background: 'rgba(26,23,20,0.02)',
                  cursor: 'pointer',
                  transition: 'all .14s ease',
                  position: 'relative',
                }}
              >
                <div style={{
                  width: 28,
                  height: 28,
                  borderRadius: 7,
                  border: '0.5px solid rgba(26,23,20,0.12)',
                  background: 'linear-gradient(135deg, #F55 0%, #FF0 33%, #0F0 66%, #08F 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  position: 'relative',
                }}>
                  <input
                    type="color"
                    value={isTransparentBg ? effectiveBg : frame.musicCodeBg}
                    onChange={(e) => updateFrame(activeFrameId, { musicCodeBg: e.target.value })}
                    style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', width: '100%', height: '100%' }}
                  />
                  <svg style={{ position: 'relative', zIndex: 1 }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M12 5v14m-7-7h14" />
                  </svg>
                </div>
                <span style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 9, color: '#A39080', letterSpacing: '.03em' }}>
                  Custom
                </span>
              </label>
            </div>

            {/* Photo-sampled palette */}
            {photoColors.length > 0 && (
              <div style={{ marginTop: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 8 }}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#A39080" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 22l4-4m0 0L14.5 9.5M6 18l8.5-8.5m0 0l2-2a2.828 2.828 0 1 1 4 4l-2 2L6 18z"/>
                    <path d="M19.5 6.5l-2-2"/>
                  </svg>
                  <span style={{ fontFamily: '"DM Sans",sans-serif', fontSize: 9, fontWeight: 600, color: '#A39080', letterSpacing: '.08em', textTransform: 'uppercase' }}>
                    From photo
                  </span>
                </div>
                <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
                  {photoColors.map((color) => {
                    const active = frame.musicCodeBg === color;
                    return (
                      <button
                        key={color}
                        title={color}
                        onClick={() => updateFrame(activeFrameId, { musicCodeBg: color })}
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: 7,
                          border: active ? '2px solid #8B6F5C' : '0.5px solid rgba(26,23,20,0.12)',
                          backgroundColor: color,
                          cursor: 'pointer',
                          transition: 'all .14s ease',
                          transform: active ? 'scale(1.1)' : 'scale(1)',
                          boxShadow: active ? '0 0 0 2px rgba(139,111,92,0.2)' : 'none',
                        }}
                      />
                    );
                  })}
                </div>
              </div>
            )}
          </section>

          {sep}

          {/* Code colour — segmented control */}
          <section>
            <SectionLabel>Code Colour</SectionLabel>
            <div style={{
              display: 'flex',
              gap: 2,
              background: 'rgba(26,23,20,0.04)',
              border: '0.5px solid rgba(26,23,20,0.07)',
              borderRadius: 100,
              padding: 3,
            }}>
              {[
                { label: 'Black', fg: 'black',   bg: '#1A1714', text: '#F5F0EB' },
                { label: 'White', fg: '#FFFFFF',  bg: '#F5F0EB', text: '#1A1714' },
              ].map(({ label, fg, bg, text }) => {
                const active = isCodeBlack ? label === 'Black' : label === 'White';
                return (
                  <button
                    key={label}
                    onClick={() => updateFrame(activeFrameId, { musicCodeFg: label === 'White' ? '#FFFFFF' : 'black' })}
                    style={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6,
                      padding: '7px 0',
                      borderRadius: 100,
                      border: 'none',
                      background: active ? bg : 'transparent',
                      color: active ? text : '#A39080',
                      fontFamily: '"DM Sans", sans-serif',
                      fontSize: 12,
                      fontWeight: active ? 500 : 400,
                      cursor: 'pointer',
                      transition: 'all .14s ease',
                      boxShadow: active ? '0 1px 3px rgba(26,23,20,0.12)' : 'none',
                    }}
                  >
                    <div style={{
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      background: label === 'Black' ? '#1A1714' : '#F5F0EB',
                      border: label === 'White' ? '1.5px solid rgba(26,23,20,0.2)' : 'none',
                      flexShrink: 0,
                    }} />
                    {label}
                  </button>
                );
              })}
            </div>
          </section>

          {sep}

          {/* Size */}
          <Slider
            label="Size"
            value={Math.round(frame.musicPos.scale * 100)}
            min={50}
            max={250}
            onChange={(e) => updateFrame(activeFrameId, { musicPos: { ...frame.musicPos, scale: Number(e.target.value) / 100 } })}
            valueFormatter={(v) => `${v}%`}
          />

          {sep}

          {/* Remove */}
          <Button
            variant="danger"
            fullWidth
            onClick={() => { updateFrame(activeFrameId, { musicUrl: '' }); setInput(''); }}
            icon={
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6l-1 14H6L5 6"/>
                <path d="M10 11v6"/><path d="M14 11v6"/>
                <path d="M9 6V4h6v2"/>
              </svg>
            }
          >
            Remove Spotify Code
          </Button>
        </>
      )}
    </div>
  );
}
