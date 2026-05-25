'use client';

interface ColorPickerProps {
  label?: string;
  value: string;
  onChange: (color: string) => void;
  presets?: string[];
  customColors?: string[];
  customColorsLabel?: string;
}

const DEFAULT_PRESETS = ['#FFFFFF', '#F5EDD6', '#1A1A1A', '#F0E4D7', '#F2EDE8', '#E4E8F0'];

export function ColorPicker({
  label,
  value,
  onChange,
  presets = DEFAULT_PRESETS,
  customColors,
  customColorsLabel = 'Custom',
}: ColorPickerProps) {
  return (
    <section>
      {label && (
        <h3 style={{
          fontFamily: '"DM Sans", sans-serif',
          fontSize: 10,
          fontWeight: 600,
          color: '#B5A49A',
          textTransform: 'uppercase',
          letterSpacing: '.1em',
          marginBottom: 8,
        }}>
          {label}
        </h3>
      )}

      {/* Preset swatches */}
      <div className="flex gap-2 items-center flex-wrap">
        {presets.map((color) => (
          <button
            key={color}
            type="button"
            onClick={() => onChange(color)}
            className="transition-all hover:scale-110 active:scale-95"
            style={{
              width: 30,
              height: 30,
              borderRadius: '50%',
              backgroundColor: color,
              border: value === color
                ? '2px solid #8B6F5C'
                : '1.5px solid rgba(26,23,20,0.12)',
              boxShadow: value === color ? '0 0 0 2px rgba(139,111,92,0.2)' : undefined,
              transform: value === color ? 'scale(1.1)' : undefined,
              cursor: 'pointer',
            }}
            title={color}
          />
        ))}
        {/* Custom color input */}
        <label
          className="relative cursor-pointer transition-all hover:scale-110 active:scale-95"
          style={{
            width: 30,
            height: 30,
            borderRadius: '50%',
            backgroundColor: value,
            border: '1.5px dashed rgba(139,111,92,0.35)',
            overflow: 'hidden',
            flexShrink: 0,
          }}
          title="Custom color"
        >
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
          />
        </label>
      </div>

      {/* Photo palette */}
      {customColors && customColors.length > 0 && (
        <div className="mt-3">
          <div className="flex items-center gap-1.5 mb-2">
            <svg className="w-3 h-3" style={{ color: '#C4B5A6' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 22l4-4m0 0L14.5 9.5M6 18l8.5-8.5m0 0l2-2a2.828 2.828 0 1 1 4 4l-2 2L6 18z"/>
              <path d="M19.5 6.5l-2-2"/>
            </svg>
            <span style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 9, fontWeight: 600, color: '#C4B5A6', textTransform: 'uppercase', letterSpacing: '.1em' }}>
              {customColorsLabel}
            </span>
          </div>
          <div className="flex gap-2 flex-wrap">
            {customColors.map((color) => (
              <button
                key={color}
                type="button"
                title={color}
                onClick={() => onChange(color)}
                className="transition-all hover:scale-110 active:scale-95"
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: '50%',
                  backgroundColor: color,
                  border: value === color
                    ? '2px solid #8B6F5C'
                    : '1.5px solid rgba(26,23,20,0.12)',
                  boxShadow: value === color ? '0 0 0 2px rgba(139,111,92,0.2)' : undefined,
                  transform: value === color ? 'scale(1.1)' : undefined,
                  cursor: 'pointer',
                }}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
