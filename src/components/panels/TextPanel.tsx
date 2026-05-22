'use client';

import { useStore } from '@/store';
import { Input, Slider, SectionLabel, Chip, Button, Card } from '@/components/ui';

const FONTS = [
  { id: 'Dancing Script', label: 'Script', category: 'cursive' },
  { id: 'Great Vibes', label: 'Elegant', category: 'cursive' },
  { id: 'Satisfy', label: 'Flow', category: 'cursive' },
  { id: 'Sacramento', label: 'Signature', category: 'cursive' },
  { id: 'Parisienne', label: 'Paris', category: 'cursive' },
  { id: 'Playfair Display', label: 'Editorial', category: 'serif' },
  { id: 'Cormorant Garamond', label: 'Classic', category: 'serif' },
  { id: 'Lora', label: 'Book', category: 'serif' },
  { id: 'Inter', label: 'Clean', category: 'sans-serif' },
  { id: 'Montserrat', label: 'Modern', category: 'sans-serif' },
  { id: 'Bebas Neue', label: 'Bold', category: 'sans-serif' },
  { id: 'Courier Prime', label: 'Type', category: 'monospace' },
  { id: 'Special Elite', label: 'Vintage', category: 'monospace' },
];

export function TextPanel() {
  const activeFrameId = useStore((s) => s.activeFrameId);
  const frame = useStore((s) => s.frames.find((f) => f.id === s.activeFrameId));
  const updateFrame = useStore((s) => s.updateFrame);

  if (!frame) return null;

  const isMoviePoster   = frame.templateId === 'movie-poster';
  const isVintage       = frame.templateId === 'vintage-color';
  const isConcertTicket = frame.templateId === 'concert-ticket';
  const isRich          = isMoviePoster || isVintage || isConcertTicket;

  return (
    <div className="space-y-5">

      {/* ── MOVIE POSTER fields ── */}
      {isMoviePoster && (
        <Card variant="filled" padding="md">
          <SectionLabel className="border-b border-[#EDE5DC] pb-1.5 mb-3">Movie Poster</SectionLabel>
          <div className="space-y-2.5">
            <Input label="Title" value={frame.movieTitle} onChange={(e) => updateFrame(activeFrameId, { movieTitle: e.target.value })} placeholder="MOVIE TITLE" hint="Bebas Neue" />
            <Input label="Year" value={frame.movieYear} onChange={(e) => updateFrame(activeFrameId, { movieYear: e.target.value })} placeholder="2026" />
            <Input label="Directed by" value={frame.movieDirector} onChange={(e) => updateFrame(activeFrameId, { movieDirector: e.target.value })} placeholder="Your Name" hint="Courier Prime" />
            <Input label="Starring" value={frame.movieCast} onChange={(e) => updateFrame(activeFrameId, { movieCast: e.target.value })} placeholder="Actor One · Actor Two" hint="red accent" />
            <Input label="Produced by" value={frame.captionSubtext} onChange={(e) => updateFrame(activeFrameId, { captionSubtext: e.target.value })} placeholder="Producer Name" />
          </div>
          <p className="text-[9px] text-[#C4B5A6] pt-2">Layout is fixed. Fonts: Bebas Neue + Courier Prime.</p>
        </Card>
      )}

      {/* ── CONCERT TICKET fields ── */}
      {isConcertTicket && (
        <Card variant="filled" padding="md">
          <SectionLabel className="border-b border-[#EDE5DC] pb-1.5 mb-3">Concert Ticket</SectionLabel>
          <div className="space-y-2.5">
            <Input label="Artist" value={frame.movieTitle} onChange={(e) => updateFrame(activeFrameId, { movieTitle: e.target.value })} placeholder="ARTIST NAME" hint="Bebas Neue" />
            <Input label="Venue" value={frame.movieDirector} onChange={(e) => updateFrame(activeFrameId, { movieDirector: e.target.value })} placeholder="VENUE · CITY" hint="Courier Prime" />
            <Input label="Date / Show" value={frame.movieCast} onChange={(e) => updateFrame(activeFrameId, { movieCast: e.target.value })} placeholder="MAY 04 · 2026" />
            <Input label="Section / Row" value={frame.captionSubtext} onChange={(e) => updateFrame(activeFrameId, { captionSubtext: e.target.value })} placeholder="GA · FLOOR" hint="Bebas Neue" />
          </div>
          <p className="text-[9px] text-[#C4B5A6] pt-2">Ticket stub layout — fixed positions.</p>
        </Card>
      )}

      {/* ── VINTAGE caption fields ── */}
      {isVintage && (
        <Card variant="filled" padding="md">
          <SectionLabel className="border-b border-[#EDE5DC] pb-1.5 mb-3">Vintage Caption</SectionLabel>
          <div className="space-y-2.5">
            <Input label="Caption" value={frame.bottomCaptionText} onChange={(e) => updateFrame(activeFrameId, { bottomCaptionText: e.target.value })} placeholder="summer '24" hint="Courier Prime" />
            <Input label="Date line" value={frame.captionSubtext} onChange={(e) => updateFrame(activeFrameId, { captionSubtext: e.target.value })} placeholder="JUNE · 2026" hint="smaller" />
          </div>
        </Card>
      )}

      {/* ── TOP LABEL (all templates) ── */}
      <section>
        <SectionLabel
          action={
            frame.topLabelText ? (
              <Button
                variant="danger"
                size="sm"
                onClick={() => updateFrame(activeFrameId, { topLabelText: '' })}
                icon={
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6"/>
                    <path d="M19 6l-1 14H6L5 6"/>
                    <path d="M10 11v6"/>
                    <path d="M14 11v6"/>
                    <path d="M9 6V4h6v2"/>
                  </svg>
                }
              >
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
        <div className="flex gap-1.5 mt-3 overflow-x-auto pb-1 scrollbar-hide">
          {FONTS.map((font) => (
            <Chip
              key={font.id}
              selected={frame.topLabelFont === font.id}
              onClick={() => updateFrame(activeFrameId, { topLabelFont: font.id })}
              size="sm"
              style={{ fontFamily: `"${font.id}", ${font.category}` }}
            >
              {font.label}
            </Chip>
          ))}
        </div>
        <div className="flex items-end gap-3 mt-3">
          <div className="flex-1">
            <Slider
              label="Size"
              value={frame.topLabelSize}
              min={24}
              max={96}
              onChange={(e) => updateFrame(activeFrameId, { topLabelSize: Number(e.target.value) })}
            />
          </div>
          <label className="relative w-8 h-8 rounded-full cursor-pointer border-2 border-[#E8DFD6] overflow-hidden transition-all hover:scale-110 flex-shrink-0 mb-0.5" style={{ backgroundColor: frame.topLabelColor }}>
            <input
              type="color"
              value={frame.topLabelColor}
              onChange={(e) => updateFrame(activeFrameId, { topLabelColor: e.target.value })}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
          </label>
        </div>
      </section>

      {/* ── BOTTOM CAPTION (non-rich templates only) ── */}
      {!isRich && (
        <section>
          <SectionLabel
            action={
              frame.bottomCaptionText ? (
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => updateFrame(activeFrameId, { bottomCaptionText: '' })}
                  icon={
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6"/>
                      <path d="M19 6l-1 14H6L5 6"/>
                      <path d="M10 11v6"/>
                      <path d="M14 11v6"/>
                      <path d="M9 6V4h6v2"/>
                    </svg>
                  }
                >
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
          <div className="flex gap-1.5 mt-3 overflow-x-auto pb-1 scrollbar-hide">
            {FONTS.map((font) => (
              <Chip
                key={font.id}
                selected={frame.bottomCaptionFont === font.id}
                onClick={() => updateFrame(activeFrameId, { bottomCaptionFont: font.id })}
                size="sm"
                style={{ fontFamily: `"${font.id}", ${font.category}` }}
              >
                {font.label}
              </Chip>
            ))}
          </div>
          <div className="flex items-end gap-3 mt-3">
            <div className="flex-1">
              <Slider
                label="Size"
                value={frame.bottomCaptionSize}
                min={20}
                max={72}
                onChange={(e) => updateFrame(activeFrameId, { bottomCaptionSize: Number(e.target.value) })}
              />
            </div>
            <label className="relative w-8 h-8 rounded-full cursor-pointer border-2 border-[#E8DFD6] overflow-hidden transition-all hover:scale-110 flex-shrink-0 mb-0.5" style={{ backgroundColor: frame.bottomCaptionColor }}>
              <input
                type="color"
                value={frame.bottomCaptionColor}
                onChange={(e) => updateFrame(activeFrameId, { bottomCaptionColor: e.target.value })}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
            </label>
          </div>
        </section>
      )}

      {/* Tip */}
      <Card variant="default" padding="sm">
        <p className="text-[10px] text-[#A39080] text-center">
          {isRich
            ? 'Tap the text fields above to edit. Top label is draggable on the canvas.'
            : 'Drag text on the polaroid to reposition. Pinch with two fingers to rotate & resize.'}
        </p>
      </Card>
    </div>
  );
}
