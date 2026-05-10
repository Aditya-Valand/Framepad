import { useState } from 'react';
import { useStore } from '../../store';
import { useImageColors } from '../../hooks/useImageColors';
import { useTransparentSpotifyCode } from '../../hooks/useTransparentSpotifyCode';

const CODE_BG_COLORS = [
  { id: 'transparent', label: 'Transparent' },
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
  const photoColors = useImageColors(frame?.imageDataUrl ?? null);

  if (!frame) return null;

  const handleApply = () => {
    updateFrame(activeFrameId, { musicUrl: input });
  };

  const spotifyMatch = input.match(/spotify\.com\/(track|album|playlist|artist)\/([a-zA-Z0-9]+)/);
  const fgColor = frame.musicCodeFg === '#FFFFFF' ? 'white' : 'black';
  const isTransparentBg = frame.musicCodeBg === 'transparent';
  // Use white as base for transparent (we'll remove it)
  const effectiveBg = isTransparentBg ? '#FFFFFF' : frame.musicCodeBg;
  
  // Get transparent version when needed
  const transparentCodeUrl = useTransparentSpotifyCode(
    isTransparentBg && spotifyMatch ? input : null,
    '#FFFFFF',
    fgColor as 'white' | 'black'
  );
  
  const previewUrl = isTransparentBg
    ? transparentCodeUrl
    : (spotifyMatch
        ? `https://scannables.scdn.co/uri/plain/png/${effectiveBg.replace('#', '')}/${fgColor}/640/spotify:${spotifyMatch[1]}:${spotifyMatch[2]}`
        : null);

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
          <div 
            className="rounded-xl p-4 flex justify-center border border-[#E8DFD6]"
            style={{
              backgroundColor: isTransparentBg ? frame.frameColor : effectiveBg,
              backgroundImage: isTransparentBg ? 'linear-gradient(45deg, #e0e0e0 25%, transparent 25%), linear-gradient(-45deg, #e0e0e0 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e0e0e0 75%), linear-gradient(-45deg, transparent 75%, #e0e0e0 75%)' : undefined,
              backgroundSize: isTransparentBg ? '16px 16px' : undefined,
              backgroundPosition: isTransparentBg ? '0 0, 0 8px, 8px -8px, -8px 0px' : undefined,
            }}
          >
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
                  style={{
                    backgroundColor: c.id === 'transparent' ? frame.frameColor : c.id,
                    backgroundImage: c.id === 'transparent' ? 'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)' : undefined,
                    backgroundSize: c.id === 'transparent' ? '8px 8px' : undefined,
                    backgroundPosition: c.id === 'transparent' ? '0 0, 0 4px, 4px -4px, -4px 0px' : undefined,
                  }}
                  title={c.label}
                />
              ))}
              <input
                type="color"
                value={frame.musicCodeBg === 'transparent' ? effectiveBg : frame.musicCodeBg}
                onChange={(e) => updateFrame(activeFrameId, { musicCodeBg: e.target.value })}
                className="w-8 h-8 rounded-full cursor-pointer border-0"
              />
            </div>

            {/* Photo-sampled palette */}
            {photoColors.length > 0 && (
              <div className="mt-3">
                <div className="flex items-center gap-1.5 mb-2">
                  <svg className="w-3 h-3 text-[#A39080]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 22l4-4m0 0L14.5 9.5M6 18l8.5-8.5m0 0l2-2a2.828 2.828 0 1 1 4 4l-2 2L6 18z"/>
                    <path d="M19.5 6.5l-2-2"/>
                  </svg>
                  <span className="text-[9px] font-medium text-[#A39080] uppercase tracking-widest">From photo</span>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {photoColors.map((color) => (
                    <button
                      key={color}
                      title={color}
                      onClick={() => updateFrame(activeFrameId, { musicCodeBg: color })}
                      className={`w-8 h-8 rounded-full border-2 transition-all hover:scale-110 active:scale-95 ${
                        frame.musicCodeBg === color
                          ? 'border-[#8B6F5C] scale-110 ring-2 ring-[#8B6F5C]/20'
                          : 'border-[#E8DFD6]'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            )}
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
            className="w-full py-2.5 rounded-xl border border-red-200 text-red-500 text-sm font-medium flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
            Remove Spotify Code
          </button>
        </>
      )}
    </div>
  );
}
