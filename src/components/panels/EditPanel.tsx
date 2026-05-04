import { useStore, FILTER_PRESETS } from '../../store';

export function EditPanel() {
  const activeFrameId = useStore((s) => s.activeFrameId);
  const frame = useStore((s) => s.frames.find((f) => f.id === s.activeFrameId));
  const updateFrame = useStore((s) => s.updateFrame);

  if (!frame) return null;

  const setFilter = (key: keyof typeof frame.filters, value: number) => {
    updateFrame(activeFrameId, { filters: { ...frame.filters, [key]: value } });
  };

  return (
    <div className="space-y-5">
      {/* Filter Presets */}
      <section>
        <h3 className="text-[10px] font-semibold text-[#A39080] uppercase tracking-widest mb-2">Presets</h3>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {Object.keys(FILTER_PRESETS).map((name) => (
            <button
              key={name}
              onClick={() => updateFrame(activeFrameId, { filters: FILTER_PRESETS[name] })}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-medium capitalize transition-all ${
                JSON.stringify(frame.filters) === JSON.stringify(FILTER_PRESETS[name])
                  ? 'bg-[#8B6F5C] text-white shadow-sm'
                  : 'bg-[#F5EDE5] text-[#8B7B6B] active:bg-[#EDE3D9]'
              }`}
            >
              {name}
            </button>
          ))}
        </div>
      </section>

      {/* Sliders */}
      <Slider label="Brightness" value={frame.filters.brightness} onChange={(v) => setFilter('brightness', v)} />
      <Slider label="Contrast" value={frame.filters.contrast} onChange={(v) => setFilter('contrast', v)} />
      <Slider label="Saturation" value={frame.filters.saturation} onChange={(v) => setFilter('saturation', v)} />
      <Slider label="Warmth" value={frame.filters.warmth} onChange={(v) => setFilter('warmth', v)} />

      {/* Rotation */}
      <section>
        <div className="flex justify-between items-center mb-1">
          <h3 className="text-[10px] font-semibold text-[#A39080] uppercase tracking-widest">Rotation</h3>
          <span className="text-[10px] text-[#C4B5A6]">{frame.imageRotation}°</span>
        </div>
        <input
          type="range"
          min="-180"
          max="180"
          value={frame.imageRotation}
          onChange={(e) => updateFrame(activeFrameId, { imageRotation: Number(e.target.value) })}
          className="w-full"
        />
      </section>

      {/* Image Zoom */}
      <section>
        <div className="flex justify-between items-center mb-1">
          <h3 className="text-[10px] font-semibold text-[#A39080] uppercase tracking-widest">Zoom</h3>
          <span className="text-[10px] text-[#C4B5A6]">{Math.round(frame.imageScale * 100)}%</span>
        </div>
        <input
          type="range"
          min="100"
          max="300"
          value={Math.round(frame.imageScale * 100)}
          onChange={(e) => updateFrame(activeFrameId, { imageScale: Number(e.target.value) / 100 })}
          className="w-full"
        />
      </section>
    </div>
  );
}

function Slider({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <section>
      <div className="flex justify-between items-center mb-1">
        <h3 className="text-[10px] font-semibold text-[#A39080] uppercase tracking-widest">{label}</h3>
        <span className="text-[10px] text-[#C4B5A6]">{value}</span>
      </div>
      <input
        type="range"
        min="-100"
        max="100"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full"
      />
    </section>
  );
}
