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

export function TextPanel() {
  const activeFrameId = useStore((s) => s.activeFrameId);
  const frame = useStore((s) => s.frames.find((f) => f.id === s.activeFrameId));
  const updateFrame = useStore((s) => s.updateFrame);

  if (!frame) return null;

  return (
    <div className="space-y-5">
      {/* Top Label */}
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

      {/* Bottom Caption */}
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

      {/* Tip */}
      <p className="text-[10px] text-[#C4B5A6] text-center pt-1">
        Drag text on the polaroid to reposition. Pinch with two fingers to rotate & resize.
      </p>
    </div>
  );
}
