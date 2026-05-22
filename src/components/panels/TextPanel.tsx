'use client';

import { useStore } from '@/store';
import { Input, Slider, SectionLabel, Button } from '@/components/ui';
import type { ReactNode } from 'react';

/* Refined card for template-specific fields */
function TemplateCard({ label, note, children }: { label: string; note?: string; children: ReactNode }) {
  return (
    <div style={{
      borderRadius: 14,
      border: '0.5px solid rgba(26,23,20,0.1)',
      background: 'rgba(26,23,20,0.025)',
      overflow: 'hidden',
    }}>
      {/* Card header */}
      <div style={{
        padding: '9px 14px',
        borderBottom: '0.5px solid rgba(26,23,20,0.08)',
        background: 'rgba(26,23,20,0.03)',
        display: 'flex',
        alignItems: 'center',
        gap: 6,
      }}>
        <span style={{
          fontFamily: '"DM Sans", sans-serif',
          fontSize: 10,
          fontWeight: 600,
          color: '#8B6F5C',
          letterSpacing: '.08em',
          textTransform: 'uppercase',
        }}>
          {label}
        </span>
      </div>
      {/* Fields */}
      <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {children}
        {note && (
          <p style={{ fontFamily: '"DM Sans",sans-serif', fontSize: 9, color: '#C4B5A6', margin: 0, marginTop: 2 }}>
            {note}
          </p>
        )}
      </div>
    </div>
  );
}

const FONTS = [
  { id: 'Dancing Script',     label: 'Script',    category: 'cursive'    },
  { id: 'Great Vibes',        label: 'Elegant',   category: 'cursive'    },
  { id: 'Satisfy',            label: 'Flow',      category: 'cursive'    },
  { id: 'Sacramento',         label: 'Sign.',     category: 'cursive'    },
  { id: 'Parisienne',         label: 'Paris',     category: 'cursive'    },
  { id: 'Playfair Display',   label: 'Editorial', category: 'serif'      },
  { id: 'Cormorant Garamond', label: 'Classic',   category: 'serif'      },
  { id: 'Lora',               label: 'Book',      category: 'serif'      },
  { id: 'Inter',              label: 'Clean',     category: 'sans-serif' },
  { id: 'Montserrat',         label: 'Modern',    category: 'sans-serif' },
  { id: 'Bebas Neue',         label: 'Bold',      category: 'sans-serif' },
  { id: 'Courier Prime',      label: 'Type',      category: 'monospace'  },
  { id: 'Special Elite',      label: 'Vintage',   category: 'monospace'  },
];

const sep = (
  <div style={{ height: '0.5px', background: 'rgba(26,23,20,0.07)', margin: '2px 0' }} />
);

/* Horizontal scrollable font preview row */
function FontPicker({
  selectedFont,
  onSelect,
}: {
  selectedFont: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div style={{ display: 'flex', gap: 7, overflowX: 'auto', paddingBottom: 4, marginTop: 10 }} className="scrollbar-hide">
      {FONTS.map((font) => {
        const active = selectedFont === font.id;
        return (
          <button
            key={font.id}
            onClick={() => onSelect(font.id)}
            style={{
              flexShrink: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 4,
              padding: '8px 10px',
              borderRadius: 11,
              border: active ? '1.5px solid #8B6F5C' : '0.5px solid rgba(26,23,20,0.1)',
              background: active ? 'rgba(139,111,92,0.08)' : 'rgba(26,23,20,0.02)',
              cursor: 'pointer',
              transition: 'all .14s ease',
              minWidth: 52,
            }}
          >
            <span style={{
              fontFamily: `"${font.id}", ${font.category}`,
              fontSize: 20,
              lineHeight: 1,
              color: active ? '#6B4F3A' : '#5C4A3A',
            }}>
              Aa
            </span>
            <span style={{
              fontFamily: '"DM Sans", sans-serif',
              fontSize: 9,
              fontWeight: active ? 600 : 400,
              color: active ? '#6B4F3A' : '#A39080',
              letterSpacing: '.04em',
              whiteSpace: 'nowrap',
            }}>
              {font.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/* Inline size-slider + color-dot row */
function SizeColorRow({
  size,
  minSize,
  maxSize,
  onSize,
  color,
  onColor,
}: {
  size: number;
  minSize: number;
  maxSize: number;
  onSize: (v: number) => void;
  color: string;
  onColor: (c: string) => void;
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 14 }}>
      <div style={{ flex: 1 }}>
        <Slider
          label="Size"
          value={size}
          min={minSize}
          max={maxSize}
          onChange={(e) => onSize(Number(e.target.value))}
        />
      </div>
      {/* Color dot — compact, refined */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, flexShrink: 0 }}>
        <label
          title="Text color"
          style={{
            width: 24,
            height: 24,
            borderRadius: '50%',
            cursor: 'pointer',
            display: 'block',
            position: 'relative',
            backgroundColor: color,
            boxShadow: `0 0 0 2px rgba(255,255,255,0.9), 0 0 0 3px rgba(26,23,20,0.15), 0 1px 4px rgba(26,23,20,0.12)`,
          }}
        >
          <input
            type="color"
            value={color}
            onChange={(e) => onColor(e.target.value)}
            style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', width: '100%', height: '100%' }}
          />
        </label>
        <span style={{ fontFamily: '"DM Sans",sans-serif', fontSize: 8, color: '#B8A89E', letterSpacing: '.04em', textTransform: 'uppercase' }}>
          Color
        </span>
      </div>
    </div>
  );
}

/* Clear icon */
const TrashIcon = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6l-1 14H6L5 6"/>
    <path d="M10 11v6"/><path d="M14 11v6"/>
    <path d="M9 6V4h6v2"/>
  </svg>
);

export function TextPanel() {
  const activeFrameId = useStore((s) => s.activeFrameId);
  const frame         = useStore((s) => s.frames.find((f) => f.id === s.activeFrameId));
  const updateFrame   = useStore((s) => s.updateFrame);

  if (!frame) return null;

  const isMoviePoster   = frame.templateId === 'movie-poster';
  const isVintage       = frame.templateId === 'vintage-color';
  const isConcertTicket = frame.templateId === 'concert-ticket';
  const isRich          = isMoviePoster || isVintage || isConcertTicket;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* ── MOVIE POSTER ── */}
      {isMoviePoster && (
        <TemplateCard label="Movie Poster" note="Layout is fixed — Bebas Neue + Courier Prime.">
          <Input label="Title"       value={frame.movieTitle}     onChange={(e) => updateFrame(activeFrameId, { movieTitle: e.target.value })}     placeholder="MOVIE TITLE"           hint="Bebas Neue"    />
          <Input label="Year"        value={frame.movieYear}      onChange={(e) => updateFrame(activeFrameId, { movieYear: e.target.value })}      placeholder="2026"                                       />
          <Input label="Directed by" value={frame.movieDirector}  onChange={(e) => updateFrame(activeFrameId, { movieDirector: e.target.value })}  placeholder="Your Name"             hint="Courier Prime" />
          <Input label="Starring"    value={frame.movieCast}      onChange={(e) => updateFrame(activeFrameId, { movieCast: e.target.value })}      placeholder="Actor One · Actor Two" hint="red accent"    />
          <Input label="Produced by" value={frame.captionSubtext} onChange={(e) => updateFrame(activeFrameId, { captionSubtext: e.target.value })} placeholder="Producer Name"                              />
        </TemplateCard>
      )}

      {/* ── CONCERT TICKET ── */}
      {isConcertTicket && (
        <TemplateCard label="Concert Ticket" note="Ticket stub layout — fixed positions.">
          <Input label="Artist"        value={frame.movieTitle}     onChange={(e) => updateFrame(activeFrameId, { movieTitle: e.target.value })}     placeholder="ARTIST NAME"    hint="Bebas Neue"    />
          <Input label="Venue"         value={frame.movieDirector}  onChange={(e) => updateFrame(activeFrameId, { movieDirector: e.target.value })}  placeholder="VENUE · CITY"   hint="Courier Prime" />
          <Input label="Date / Show"   value={frame.movieCast}      onChange={(e) => updateFrame(activeFrameId, { movieCast: e.target.value })}      placeholder="MAY 04 · 2026"                       />
          <Input label="Section / Row" value={frame.captionSubtext} onChange={(e) => updateFrame(activeFrameId, { captionSubtext: e.target.value })} placeholder="GA · FLOOR"     hint="Bebas Neue"    />
        </TemplateCard>
      )}

      {/* ── VINTAGE ── */}
      {isVintage && (
        <TemplateCard label="Vintage Caption">
          <Input label="Caption"   value={frame.bottomCaptionText} onChange={(e) => updateFrame(activeFrameId, { bottomCaptionText: e.target.value })} placeholder="summer '24"  hint="Courier Prime" />
          <Input label="Date line" value={frame.captionSubtext}    onChange={(e) => updateFrame(activeFrameId, { captionSubtext: e.target.value })}    placeholder="JUNE · 2026" hint="smaller"       />
        </TemplateCard>
      )}

      {/* ── TOP LABEL ── */}
      <section>
        <SectionLabel
          action={
            frame.topLabelText ? (
              <Button variant="danger" size="sm" onClick={() => updateFrame(activeFrameId, { topLabelText: '' })} icon={<TrashIcon />}>
                Clear
              </Button>
            ) : null
          }
        >
          Top Label
        </SectionLabel>

        <Input
          value={frame.topLabelText}
          onChange={(e) => updateFrame(activeFrameId, { topLabelText: e.target.value })}
          placeholder="e.g. Your name, location, date"
        />

        <FontPicker
          selectedFont={frame.topLabelFont}
          onSelect={(id) => updateFrame(activeFrameId, { topLabelFont: id })}
        />

        <SizeColorRow
          size={frame.topLabelSize}
          minSize={24}
          maxSize={96}
          onSize={(v) => updateFrame(activeFrameId, { topLabelSize: v })}
          color={frame.topLabelColor}
          onColor={(c) => updateFrame(activeFrameId, { topLabelColor: c })}
        />
      </section>

      {/* ── BOTTOM CAPTION (non-rich) ── */}
      {!isRich && (
        <>
          {sep}
          <section>
            <SectionLabel
              action={
                frame.bottomCaptionText ? (
                  <Button variant="danger" size="sm" onClick={() => updateFrame(activeFrameId, { bottomCaptionText: '' })} icon={<TrashIcon />}>
                    Clear
                  </Button>
                ) : null
              }
            >
              Bottom Caption
            </SectionLabel>

            <Input
              value={frame.bottomCaptionText}
              onChange={(e) => updateFrame(activeFrameId, { bottomCaptionText: e.target.value })}
              placeholder="e.g. Song title, quote, memory"
            />

            <FontPicker
              selectedFont={frame.bottomCaptionFont}
              onSelect={(id) => updateFrame(activeFrameId, { bottomCaptionFont: id })}
            />

            <SizeColorRow
              size={frame.bottomCaptionSize}
              minSize={20}
              maxSize={72}
              onSize={(v) => updateFrame(activeFrameId, { bottomCaptionSize: v })}
              color={frame.bottomCaptionColor}
              onColor={(c) => updateFrame(activeFrameId, { bottomCaptionColor: c })}
            />
          </section>
        </>
      )}

      {/* ── Tip ── */}
      <div style={{
        padding: '10px 12px',
        borderRadius: 10,
        background: 'rgba(26,23,20,0.03)',
        border: '0.5px solid rgba(26,23,20,0.07)',
      }}>
        <p style={{
          fontFamily: '"DM Sans", sans-serif',
          fontSize: 10,
          color: '#A39080',
          textAlign: 'center',
          margin: 0,
          lineHeight: 1.5,
        }}>
          {isRich
            ? 'Edit fields above. Top label is draggable on the canvas.'
            : 'Drag text on the polaroid to reposition. Pinch to rotate & resize.'}
        </p>
      </div>
    </div>
  );
}
