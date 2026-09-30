'use client';

import { useState, useEffect, useRef } from 'react';
import { useStore, FILTER_PRESETS } from '@/store';
import type { FilterValues } from '@/store';
import { Slider, SectionLabel, Button } from '@/components/ui';
import { useLivePreview } from '@/contexts/LivePreviewContext';

/* Visual accent gradients per preset */
const PRESET_STYLE: Record<string, { from: string; to: string; label: string }> = {
  none:    { from: '#D8D0C8', to: '#C0B8B0', label: 'None'    },
  vintage: { from: '#D4A870', to: '#B88040', label: 'Vintage' },
  film:    { from: '#8AAAC0', to: '#607898', label: 'Film'    },
  sepia:   { from: '#C09060', to: '#8C6030', label: 'Sepia'   },
  bw:      { from: '#909090', to: '#484848', label: 'B & W'   },
  faded:   { from: '#D8D4CF', to: '#C4C0BB', label: 'Faded'   },
};

const ADJUSTMENTS = [
  { key: 'brightness', label: 'Brightness' },
  { key: 'contrast',   label: 'Contrast'   },
  { key: 'saturation', label: 'Saturation' },
  { key: 'warmth',     label: 'Warmth'     },
] as const;

const sep = (
  <div style={{ height: '0.5px', background: 'rgba(26,23,20,0.07)', margin: '2px 0' }} />
);

export function EditPanel() {
  const activeFrameId = useStore((s) => s.activeFrameId);
  const frame         = useStore((s) => s.frames.find((f) => f.id === s.activeFrameId));
  const updateFrame   = useStore((s) => s.updateFrame);
  const liveHandle    = useLivePreview();

  // Local filter state — drives slider UI during drag without touching Zustand
  const [liveFilters, setLiveFilters] = useState<FilterValues>(
    frame?.filters ?? { brightness: 0, contrast: 0, saturation: 0, warmth: 0 }
  );
  const liveFiltersRef = useRef(liveFilters);
  liveFiltersRef.current = liveFilters;

  // Sync local state when filters change from outside (preset click, frame switch)
  useEffect(() => {
    if (frame?.filters) setLiveFilters(frame.filters);
  }, [frame?.filters]);

  if (!frame) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* ── Filter Presets ── */}
      <section>
        <SectionLabel>Presets</SectionLabel>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 7 }}>
          {Object.keys(FILTER_PRESETS).map((name) => {
            const active  = JSON.stringify(frame.filters) === JSON.stringify(FILTER_PRESETS[name]);
            const s       = PRESET_STYLE[name] ?? { from: '#D0C8C0', to: '#B8B0A8', label: name };
            return (
              <button
                key={name}
                onClick={() => updateFrame(activeFrameId, { filters: FILTER_PRESETS[name] })}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 6,
                  padding: '10px 6px 8px',
                  borderRadius: 12,
                  border: active ? '1.5px solid #8B6F5C' : '0.5px solid rgba(26,23,20,0.09)',
                  background: active ? 'rgba(139,111,92,0.07)' : 'rgba(26,23,20,0.02)',
                  cursor: 'pointer',
                  transition: 'all .15s ease',
                }}
              >
                {/* Gradient swatch */}
                <div style={{
                  width: 36,
                  height: 28,
                  borderRadius: 7,
                  background: `linear-gradient(135deg, ${s.from}, ${s.to})`,
                  border: '0.5px solid rgba(26,23,20,0.1)',
                  flexShrink: 0,
                }} />
                <span style={{
                  fontFamily: '"DM Sans", sans-serif',
                  fontSize: 10,
                  fontWeight: active ? 600 : 400,
                  color: active ? '#6B4F3A' : '#A39080',
                  letterSpacing: '.02em',
                  whiteSpace: 'nowrap',
                }}>
                  {s.label}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {sep}

      {/* ── Adjustments ── */}
      <section>
        <SectionLabel>Adjustments</SectionLabel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {ADJUSTMENTS.map(({ key, label }) => (
            <Slider
              key={key}
              label={label}
              value={liveFilters[key]}
              min={-100}
              max={100}
              onChange={(e) => {
                // Update local state + show CSS overlay — no Zustand write during drag
                const val = Number(e.target.value);
                setLiveFilters(prev => {
                  const next = { ...prev, [key]: val };
                  liveHandle.current?.show(next);
                  return next;
                });
              }}
              onPointerUp={() => {
                // Commit final value to Zustand on release — single canvas re-render
                liveHandle.current?.hide();
                updateFrame(activeFrameId, { filters: liveFiltersRef.current });
              }}
              valueFormatter={(v) => `${v > 0 ? '+' : ''}${v}`}
            />
          ))}
        </div>
      </section>

      {sep}

      {/* ── Transform ── */}
      <section>
        <SectionLabel>Transform</SectionLabel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Slider
            label="Rotation"
            value={frame.imageRotation}
            min={-180}
            max={180}
            onChange={(e) => updateFrame(activeFrameId, { imageRotation: Number(e.target.value) })}
            valueFormatter={(v) => `${v}°`}
          />
          <Slider
            label="Zoom"
            value={Math.round(frame.imageScale * 100)}
            min={100}
            max={300}
            onChange={(e) => updateFrame(activeFrameId, { imageScale: Number(e.target.value) / 100 })}
            valueFormatter={(v) => `${v}%`}
          />
        </div>
      </section>

      {/* ── Remove Photo ── */}
      {frame.imageDataUrl && (
        <>
          {sep}
          <Button
            variant="danger"
            fullWidth
            onClick={() => updateFrame(activeFrameId, {
              imageDataUrl: null, imagePanX: 0, imagePanY: 0, imageScale: 1, imageRotation: 0,
            })}
            icon={
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6l-1 14H6L5 6"/>
                <path d="M10 11v6"/><path d="M14 11v6"/>
                <path d="M9 6V4h6v2"/>
              </svg>
            }
          >
            Remove Photo
          </Button>
        </>
      )}
    </div>
  );
}
