import { useState } from 'react';
import { useStore } from '../../store';

const CODE_BG_COLORS = [
  { id: '#FFFFFF', label: 'White' },
  { id: '#000000', label: 'Black' },
  { id: '#1DB954', label: 'Green' },
  { id: '#F5EDD6', label: 'Cream' },
  { id: '#191414', label: 'Dark' },
  { id: '#282828', label: 'Gray' },
];

export function MusicPanel() {
  const activeFrameId = useStore((s) => s.activeFrameId);
  const frame = useStore((s) => s.frames.find((f) => f.id === s.activeFrameId));
  const updateFrame = useStore((s) => s.updateFrame);
  const [input, setInput] = useState(frame?.musicUrl || '');

  if (!frame) return null;

  const handleApply = () => {
    updateFrame(activeFrameId, { musicUrl: input });
  };

  const spotifyMatch = input.match(/spotify\.com\/(track|album|playlist|artist)\/([a-zA-Z0-9]+)/);
  const fgColor = frame.musicCodeFg === '#FFFFFF' ? 'white' : 'black';
  const previewUrl = spotifyMatch
    ? `https://scannables.scdn.co/uri/plain/png/${frame.musicCodeBg.replace('#', '')}/${fgColor}/640/spotify:${spotifyMatch[1]}:${spotifyMatch[2]}`
    : null;

  return (
    <div className="space-y-5">
      <section>
        <h3 className="text-[10px] font-semibold text-[#A39080] uppercase tracking-widest mb-2">Spotify Link</h3>
        <input
          type="url"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste Spotify track/album/playlist URL"
          className="w-full px-3 py-2.5 rounded-xl border border-[#E8DFD6] text-sm text-[#5C4A3A] focus:outline-none focus:border-[#C4B5A6] transition-colors bg-[#F8F3EE] placeholder:text-[#C4B5A6]"
        />
      </section>

      {previewUrl && (
        <section>
          <h3 className="text-[10px] font-semibold text-[#A39080] uppercase tracking-widest mb-2">Preview</h3>
          <div className="rounded-xl p-4 flex justify-center border border-[#E8DFD6]" style={{ backgroundColor: frame.musicCodeBg }}>
            <img
              src={previewUrl}
              alt="Spotify scan code"
              className="h-10 object-contain"
              crossOrigin="anonymous"
            />
          </div>
        </section>
      )}

      <button
        onClick={handleApply}
        disabled={!input.trim()}
        className="w-full py-3 rounded-xl bg-[#8B6F5C] text-white text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98] transition-all shadow-sm"
      >
        {frame.musicUrl ? 'Update Code' : 'Add to Polaroid'}
      </button>

      {/* Customization */}
      {frame.musicUrl && (
        <>
          <section>
            <h3 className="text-[10px] font-semibold text-[#A39080] uppercase tracking-widest mb-2">Code Background</h3>
            <div className="flex gap-2 flex-wrap">
              {CODE_BG_COLORS.map((c) => (
                <button
                  key={c.id}
                  onClick={() => updateFrame(activeFrameId, { musicCodeBg: c.id })}
                  className={`w-8 h-8 rounded-full border-2 transition-all ${
                    frame.musicCodeBg === c.id ? 'border-[#8B6F5C] scale-110 ring-2 ring-[#8B6F5C]/20' : 'border-[#E8DFD6]'
                  }`}
                  style={{ backgroundColor: c.id }}
                  title={c.label}
                />
              ))}
              <input
                type="color"
                value={frame.musicCodeBg}
                onChange={(e) => updateFrame(activeFrameId, { musicCodeBg: e.target.value })}
                className="w-8 h-8 rounded-full cursor-pointer border-0"
              />
            </div>
          </section>

          <section>
            <h3 className="text-[10px] font-semibold text-[#A39080] uppercase tracking-widest mb-2">Code Color</h3>
            <div className="flex gap-2">
              <button
                onClick={() => updateFrame(activeFrameId, { musicCodeFg: 'black' })}
                className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
                  frame.musicCodeFg !== '#FFFFFF' ? 'bg-[#8B6F5C] text-white' : 'bg-[#F5EDE5] text-[#8B7B6B]'
                }`}
              >
                Black
              </button>
              <button
                onClick={() => updateFrame(activeFrameId, { musicCodeFg: '#FFFFFF' })}
                className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
                  frame.musicCodeFg === '#FFFFFF' ? 'bg-[#8B6F5C] text-white' : 'bg-[#F5EDE5] text-[#8B7B6B]'
                }`}
              >
                White
              </button>
            </div>
          </section>

          <section>
            <div className="flex justify-between items-center mb-1">
              <h3 className="text-[10px] font-semibold text-[#A39080] uppercase tracking-widest">Size</h3>
              <span className="text-[10px] text-[#C4B5A6]">{Math.round(frame.musicPos.scale * 100)}%</span>
            </div>
            <input
              type="range"
              min="50"
              max="250"
              value={Math.round(frame.musicPos.scale * 100)}
              onChange={(e) => updateFrame(activeFrameId, { musicPos: { ...frame.musicPos, scale: Number(e.target.value) / 100 } })}
              className="w-full"
            />
          </section>

          <button
            onClick={() => { updateFrame(activeFrameId, { musicUrl: '' }); setInput(''); }}
            className="w-full py-2 text-sm text-[#C07A5A] font-medium"
          >
            Remove Music Code
          </button>
        </>
      )}
    </div>
  );
}
