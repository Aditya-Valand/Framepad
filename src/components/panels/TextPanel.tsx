import { useStore } from '../../store';

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

function FieldInput({
  label,
  value,
  onChange,
  placeholder,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  hint?: string;
}) {
  return (
    <div>
      <div className="flex justify-between items-baseline mb-1">
        <span className="text-[10px] font-semibold text-[#A39080] uppercase tracking-widest">{label}</span>
        {hint && <span className="text-[9px] text-[#C4B5A6]">{hint}</span>}
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 rounded-xl border border-[#E8DFD6] text-sm text-[#5C4A3A] focus:outline-none focus:border-[#C4B5A6] transition-colors bg-[#F8F3EE] placeholder:text-[#C4B5A6]"
      />
    </div>
  );
}

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
        <section className="space-y-3">
          <h3 className="text-[10px] font-semibold text-[#A39080] uppercase tracking-widest border-b border-[#EDE5DC] pb-1.5">
            Movie Poster
          </h3>
          <div className="space-y-2.5">
            <FieldInput label="Title" value={frame.movieTitle} onChange={(v) => updateFrame(activeFrameId, { movieTitle: v })} placeholder="MOVIE TITLE" hint="Bebas Neue" />
            <FieldInput label="Year" value={frame.movieYear} onChange={(v) => updateFrame(activeFrameId, { movieYear: v })} placeholder="2026" />
            <FieldInput label="Directed by" value={frame.movieDirector} onChange={(v) => updateFrame(activeFrameId, { movieDirector: v })} placeholder="Your Name" hint="Courier Prime" />
            <FieldInput label="Starring" value={frame.movieCast} onChange={(v) => updateFrame(activeFrameId, { movieCast: v })} placeholder="Actor One · Actor Two" hint="red accent" />
            <FieldInput label="Produced by" value={frame.captionSubtext} onChange={(v) => updateFrame(activeFrameId, { captionSubtext: v })} placeholder="Producer Name" />
          </div>
          <p className="text-[9px] text-[#C4B5A6] pt-1">Layout is fixed. Fonts: Bebas Neue + Courier Prime.</p>
        </section>
      )}

      {/* ── CONCERT TICKET fields ── */}
      {isConcertTicket && (
        <section className="space-y-3">
          <h3 className="text-[10px] font-semibold text-[#A39080] uppercase tracking-widest border-b border-[#EDE5DC] pb-1.5">
            Concert Ticket
          </h3>
          <div className="space-y-2.5">
            <FieldInput label="Artist" value={frame.movieTitle} onChange={(v) => updateFrame(activeFrameId, { movieTitle: v })} placeholder="ARTIST NAME" hint="Bebas Neue" />
            <FieldInput label="Venue" value={frame.movieDirector} onChange={(v) => updateFrame(activeFrameId, { movieDirector: v })} placeholder="VENUE · CITY" hint="Courier Prime" />
            <FieldInput label="Date / Show" value={frame.movieCast} onChange={(v) => updateFrame(activeFrameId, { movieCast: v })} placeholder="MAY 04 · 2026" />
            <FieldInput label="Section / Row" value={frame.captionSubtext} onChange={(v) => updateFrame(activeFrameId, { captionSubtext: v })} placeholder="GA · FLOOR" hint="Bebas Neue" />
          </div>
          <p className="text-[9px] text-[#C4B5A6] pt-1">Ticket stub layout — fixed positions.</p>
        </section>
      )}

      {/* ── VINTAGE caption fields ── */}
      {isVintage && (
        <section className="space-y-3">
          <h3 className="text-[10px] font-semibold text-[#A39080] uppercase tracking-widest border-b border-[#EDE5DC] pb-1.5">
            Vintage Caption
          </h3>
          <div className="space-y-2.5">
            <FieldInput label="Caption" value={frame.bottomCaptionText} onChange={(v) => updateFrame(activeFrameId, { bottomCaptionText: v })} placeholder="summer '24" hint="Courier Prime" />
            <FieldInput label="Date line" value={frame.captionSubtext} onChange={(v) => updateFrame(activeFrameId, { captionSubtext: v })} placeholder="JUNE · 2026" hint="smaller" />
          </div>
        </section>
      )}

      {/* ── TOP LABEL (all templates) ── */}
      <section>
        <h3 className="text-[10px] font-semibold text-[#A39080] uppercase tracking-widest mb-2">Top Label</h3>
        <input
          type="text"
          value={frame.topLabelText}
          onChange={(e) => updateFrame(activeFrameId, { topLabelText: e.target.value })}
          placeholder="e.g. Your name, location, date"
          className="w-full px-3 py-2.5 rounded-xl border border-[#E8DFD6] text-sm text-[#5C4A3A] focus:outline-none focus:border-[#C4B5A6] transition-colors bg-[#F8F3EE] placeholder:text-[#C4B5A6]"
        />
        <div className="flex gap-1.5 mt-3 overflow-x-auto pb-1 scrollbar-hide">
          {FONTS.map((font) => (
            <button
              key={font.id}
              onClick={() => updateFrame(activeFrameId, { topLabelFont: font.id })}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-[11px] font-medium transition-all ${
                frame.topLabelFont === font.id
                  ? 'bg-[#8B6F5C] text-white shadow-sm'
                  : 'bg-[#F5EDE5] text-[#8B7B6B] active:bg-[#EDE3D9]'
              }`}
              style={{ fontFamily: `"${font.id}", ${font.category}` }}
            >
              {font.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3 mt-3">
          <div className="flex-1">
            <div className="flex justify-between mb-0.5">
              <span className="text-[10px] text-[#C4B5A6]">Size</span>
              <span className="text-[10px] text-[#C4B5A6]">{frame.topLabelSize}px</span>
            </div>
            <input
              type="range"
              min="24"
              max="96"
              value={frame.topLabelSize}
              onChange={(e) => updateFrame(activeFrameId, { topLabelSize: Number(e.target.value) })}
              className="w-full"
            />
          </div>
          <input
            type="color"
            value={frame.topLabelColor}
            onChange={(e) => updateFrame(activeFrameId, { topLabelColor: e.target.value })}
            className="w-8 h-8 rounded-full border-2 border-[#E8DFD6] cursor-pointer"
          />
        </div>
      </section>

      {/* ── BOTTOM CAPTION (non-rich templates only) ── */}
      {!isRich && (
        <section>
          <h3 className="text-[10px] font-semibold text-[#A39080] uppercase tracking-widest mb-2">Bottom Caption</h3>
          <input
            type="text"
            value={frame.bottomCaptionText}
            onChange={(e) => updateFrame(activeFrameId, { bottomCaptionText: e.target.value })}
            placeholder="e.g. Song title, quote, memory"
            className="w-full px-3 py-2.5 rounded-xl border border-[#E8DFD6] text-sm text-[#5C4A3A] focus:outline-none focus:border-[#C4B5A6] transition-colors bg-[#F8F3EE] placeholder:text-[#C4B5A6]"
          />
          <div className="flex gap-1.5 mt-3 overflow-x-auto pb-1 scrollbar-hide">
            {FONTS.map((font) => (
              <button
                key={font.id}
                onClick={() => updateFrame(activeFrameId, { bottomCaptionFont: font.id })}
                className={`flex-shrink-0 px-3 py-1.5 rounded-full text-[11px] font-medium transition-all ${
                  frame.bottomCaptionFont === font.id
                    ? 'bg-[#8B6F5C] text-white shadow-sm'
                    : 'bg-[#F5EDE5] text-[#8B7B6B] active:bg-[#EDE3D9]'
                }`}
                style={{ fontFamily: `"${font.id}", ${font.category}` }}
              >
                {font.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3 mt-3">
            <div className="flex-1">
              <div className="flex justify-between mb-0.5">
                <span className="text-[10px] text-[#C4B5A6]">Size</span>
                <span className="text-[10px] text-[#C4B5A6]">{frame.bottomCaptionSize}px</span>
              </div>
              <input
                type="range"
                min="20"
                max="72"
                value={frame.bottomCaptionSize}
                onChange={(e) => updateFrame(activeFrameId, { bottomCaptionSize: Number(e.target.value) })}
                className="w-full"
              />
            </div>
            <input
              type="color"
              value={frame.bottomCaptionColor}
              onChange={(e) => updateFrame(activeFrameId, { bottomCaptionColor: e.target.value })}
              className="w-8 h-8 rounded-full border-2 border-[#E8DFD6] cursor-pointer"
            />
          </div>
        </section>
      )}

      {/* Tip */}
      <p className="text-[10px] text-[#C4B5A6] text-center pt-1">
        {isRich
          ? 'Tap the text fields above to edit. Top label is draggable on the canvas.'
          : 'Drag text on the polaroid to reposition. Pinch with two fingers to rotate & resize.'}
      </p>
    </div>
  );
}
