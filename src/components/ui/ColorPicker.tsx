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
        <h3 className="text-[10px] font-semibold text-[#A39080] uppercase tracking-widest mb-2">
          {label}
        </h3>
      )}

      {/* Preset swatches + plain color picker */}
      <div className="flex gap-2 items-center flex-wrap">
        {presets.map((color) => (
          <button
            key={color}
            type="button"
            onClick={() => onChange(color)}
            className={`w-8 h-8 rounded-full border-2 transition-all hover:scale-110 active:scale-95 ${
              value === color
                ? 'border-[#8B6F5C] scale-110 ring-2 ring-[#8B6F5C]/20'
                : 'border-[#E8DFD6]'
            }`}
            style={{ backgroundColor: color }}
            title={color}
          />
        ))}
        {/* Custom color — styled circle shows current value */}
        <label
          className="relative w-8 h-8 rounded-full cursor-pointer border-2 border-dashed border-[#D4C8BC] overflow-hidden hover:border-[#C4B5A6] hover:scale-110 active:scale-95 transition-all flex-shrink-0"
          style={{ backgroundColor: value }}
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

      {/* Photo-sampled palette */}
      {customColors && customColors.length > 0 && (
        <div className="mt-3">
          <div className="flex items-center gap-1.5 mb-2">
            <svg className="w-3 h-3 text-[#A39080]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 22l4-4m0 0L14.5 9.5M6 18l8.5-8.5m0 0l2-2a2.828 2.828 0 1 1 4 4l-2 2L6 18z"/>
              <path d="M19.5 6.5l-2-2"/>
            </svg>
            <span className="text-[9px] font-medium text-[#A39080] uppercase tracking-widest">
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
                className={`w-8 h-8 rounded-full border-2 transition-all hover:scale-110 active:scale-95 ${
                  value === color
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
  );
}
