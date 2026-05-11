import { useStore, FILTER_PRESETS } from '../../store';
import { Slider, Chip, ChipGroup, SectionLabel, Button } from '../ui';

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
      <ChipGroup label="Presets">
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {Object.keys(FILTER_PRESETS).map((name) => (
            <Chip
              key={name}
              selected={JSON.stringify(frame.filters) === JSON.stringify(FILTER_PRESETS[name])}
              onClick={() => updateFrame(activeFrameId, { filters: FILTER_PRESETS[name] })}
            >
              {name}
            </Chip>
          ))}
        </div>
      </ChipGroup>

      {/* Sliders */}
      <Slider 
        label="Brightness" 
        value={frame.filters.brightness} 
        min={-100}
        max={100}
        onChange={(e) => setFilter('brightness', Number(e.target.value))}
        valueFormatter={(v) => `${v > 0 ? '+' : ''}${v}`}
      />
      <Slider 
        label="Contrast" 
        value={frame.filters.contrast} 
        min={-100}
        max={100}
        onChange={(e) => setFilter('contrast', Number(e.target.value))}
        valueFormatter={(v) => `${v > 0 ? '+' : ''}${v}`}
      />
      <Slider 
        label="Saturation" 
        value={frame.filters.saturation} 
        min={-100}
        max={100}
        onChange={(e) => setFilter('saturation', Number(e.target.value))}
        valueFormatter={(v) => `${v > 0 ? '+' : ''}${v}`}
      />
      <Slider 
        label="Warmth" 
        value={frame.filters.warmth} 
        min={-100}
        max={100}
        onChange={(e) => setFilter('warmth', Number(e.target.value))}
        valueFormatter={(v) => `${v > 0 ? '+' : ''}${v}`}
      />

      {/* Rotation */}
      <Slider
        label="Rotation"
        value={frame.imageRotation}
        min={-180}
        max={180}
        onChange={(e) => updateFrame(activeFrameId, { imageRotation: Number(e.target.value) })}
        valueFormatter={(v) => `${v}°`}
      />

      {/* Image Zoom */}
      <Slider
        label="Zoom"
        value={Math.round(frame.imageScale * 100)}
        min={100}
        max={300}
        onChange={(e) => updateFrame(activeFrameId, { imageScale: Number(e.target.value) / 100 })}
        valueFormatter={(v) => `${v}%`}
      />

      {/* Remove photo */}
      {frame.imageDataUrl && (
        <Button
          variant="danger"
          fullWidth
          onClick={() => updateFrame(activeFrameId, { imageDataUrl: null, imagePanX: 0, imagePanY: 0, imageScale: 1, imageRotation: 0 })}
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
          Remove Photo
        </Button>
      )}
    </div>
  );
}
