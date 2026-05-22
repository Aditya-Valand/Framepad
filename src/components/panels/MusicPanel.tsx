'use client';

import { useState } from 'react';
import { useStore } from '@/store';
import { useImageColors } from '@/hooks/useImageColors';
import { useTransparentSpotifyCode } from '@/hooks/useTransparentSpotifyCode';
import { Input, Button, ColorPicker, Chip, ChipGroup, Slider, SectionLabel, Card } from '@/components/ui';

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
      <Input
        label="Spotify Link"
        type="url"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Paste Spotify track/album/playlist URL"
      />

      {previewUrl && (
        <section>
          <SectionLabel>Preview</SectionLabel>
          <Card 
            variant="outlined"
            padding="md"
            className="flex justify-center"
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
          </Card>
        </section>
      )}

      <Button
        onClick={handleApply}
        disabled={!input.trim()}
        fullWidth
      >
        {frame.musicUrl ? 'Update Code' : 'Add to Polaroid'}
      </Button>

      {/* Customization */}
      {frame.musicUrl && (
        <>
          <section>
            <SectionLabel>Code Background</SectionLabel>
            <div className="flex gap-2 flex-wrap">
              {CODE_BG_COLORS.map((c) => (
                <button
                  key={c.id}
                  onClick={() => updateFrame(activeFrameId, { musicCodeBg: c.id })}
                  className={`w-8 h-8 rounded-full border-2 transition-all hover:scale-110 active:scale-95 ${
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
              <label className="relative w-8 h-8 rounded-full cursor-pointer border-2 border-dashed border-[#D4C8BC] hover:border-[#C4B5A6] hover:scale-110 flex items-center justify-center bg-gradient-to-br from-red-400 via-yellow-300 via-green-400 via-blue-400 to-purple-400 opacity-80 overflow-hidden transition-all" title="Custom color">
                <input
                  type="color"
                  value={frame.musicCodeBg === 'transparent' ? effectiveBg : frame.musicCodeBg}
                  onChange={(e) => updateFrame(activeFrameId, { musicCodeBg: e.target.value })}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <svg className="relative w-4 h-4 text-white drop-shadow-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 5v14m-7-7h14" strokeLinecap="round" />
                </svg>
              </label>
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

          <ChipGroup label="Code Color">
            <Chip
              selected={frame.musicCodeFg !== '#FFFFFF'}
              onClick={() => updateFrame(activeFrameId, { musicCodeFg: 'black' })}
            >
              Black
            </Chip>
            <Chip
              selected={frame.musicCodeFg === '#FFFFFF'}
              onClick={() => updateFrame(activeFrameId, { musicCodeFg: '#FFFFFF' })}
            >
              White
            </Chip>
          </ChipGroup>

          <Slider
            label="Size"
            value={Math.round(frame.musicPos.scale * 100)}
            min={50}
            max={250}
            onChange={(e) => updateFrame(activeFrameId, { musicPos: { ...frame.musicPos, scale: Number(e.target.value) / 100 } })}
            valueFormatter={(v) => `${v}%`}
          />

          <Button
            variant="danger"
            fullWidth
            onClick={() => { updateFrame(activeFrameId, { musicUrl: '' }); setInput(''); }}
            icon={
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6l-1 14H6L5 6"/>
                <path d="M10 11v6"/>
                <path d="M14 11v6"/>
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
