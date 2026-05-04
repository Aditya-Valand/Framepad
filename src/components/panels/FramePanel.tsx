import { useCallback, useRef } from 'react';
import { useStore, POLAROID_TEMPLATES } from '../../store';
import type { TemplateId } from '../../store';
import { useImageUpload } from '../../hooks/useImageUpload';

export function FramePanel() {
  const activeFrameId = useStore((s) => s.activeFrameId);
  const frame = useStore((s) => s.frames.find((f) => f.id === s.activeFrameId));
  const updateFrame = useStore((s) => s.updateFrame);
  const applyTemplate = useStore((s) => s.applyTemplate);
  const { uploadFile } = useImageUpload();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
    e.target.value = '';
  }, [uploadFile]);

  if (!frame) return null;

  return (
    <div className="space-y-5">
      {/* Upload */}
      <section>
        <h3 className="text-[10px] font-semibold text-[#A39080] uppercase tracking-widest mb-2">Photo</h3>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-full py-3 rounded-xl border-2 border-dashed border-[#E0D5C9] text-sm text-[#8B7B6B] font-medium hover:border-[#C4B5A6] active:bg-[#F8F3EE] transition-colors"
        >
          {frame.imageDataUrl ? 'Change Photo' : 'Upload Photo'}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={handleFile}
        />
      </section>

      {/* Template Picker */}
      <section>
        <h3 className="text-[10px] font-semibold text-[#A39080] uppercase tracking-widest mb-3">Template</h3>
        <div className="grid grid-cols-4 gap-2">
          {POLAROID_TEMPLATES.map((tmpl) => {
            const isActive = frame.templateId === tmpl.id;
            // Mini preview proportions
            const maxH = 56;
            const scale = maxH / tmpl.frameHeight;
            const w = tmpl.frameWidth * scale;
            const h = tmpl.frameHeight * scale;
            const bt = tmpl.borderTop * scale;
            const bl = tmpl.borderLeft * scale;
            const br = tmpl.borderRight * scale;
            const bb = tmpl.borderBottom * scale;

            return (
              <button
                key={tmpl.id}
                onClick={() => applyTemplate(activeFrameId, tmpl.id as TemplateId)}
                className={`flex flex-col items-center gap-1.5 p-2 rounded-xl transition-all ${
                  isActive
                    ? 'bg-[#8B6F5C]/10 ring-2 ring-[#8B6F5C] shadow-sm'
                    : 'bg-[#F8F3EE] hover:bg-[#F3EBE3] active:scale-95'
                }`}
              >
                {/* Mini polaroid preview */}
                <div
                  className="relative rounded-[2px] shadow-sm"
                  style={{
                    width: w,
                    height: h,
                    backgroundColor: tmpl.frameColor,
                    border: '1px solid #E8DFD6',
                  }}
                >
                  <div
                    className="absolute"
                    style={{
                      top: bt,
                      left: bl,
                      right: br,
                      bottom: bb,
                      width: w - bl - br,
                      height: h - bt - bb,
                      backgroundColor: '#D4C5B5',
                    }}
                  />
                </div>
                <span className={`text-[9px] font-medium leading-tight text-center ${
                  isActive ? 'text-[#5C4A3A]' : 'text-[#A39080]'
                }`}>
                  {tmpl.name}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Frame Color */}
      <section>
        <h3 className="text-[10px] font-semibold text-[#A39080] uppercase tracking-widest mb-2">Color</h3>
        <div className="flex gap-2 items-center">
          {['#FFFFFF', '#F5EDD6', '#1A1A1A', '#F0E4D7', '#F2EDE8', '#E4E8F0'].map((color) => (
            <button
              key={color}
              onClick={() => updateFrame(activeFrameId, { frameColor: color })}
              className={`w-8 h-8 rounded-full border-2 transition-all ${
                frame.frameColor === color ? 'border-[#8B6F5C] scale-110 ring-2 ring-[#8B6F5C]/20' : 'border-[#E8DFD6]'
              }`}
              style={{ backgroundColor: color }}
            />
          ))}
          <input
            type="color"
            value={frame.frameColor}
            onChange={(e) => updateFrame(activeFrameId, { frameColor: e.target.value })}
            className="w-8 h-8 rounded-full cursor-pointer border-0"
          />
        </div>
      </section>

      {/* Caption Area */}
      <section>
        <div className="flex justify-between items-center mb-1">
          <h3 className="text-[10px] font-semibold text-[#A39080] uppercase tracking-widest">Caption Area</h3>
          <span className="text-[10px] text-[#C4B5A6]">{frame.borderBottom}px</span>
        </div>
        <input
          type="range"
          min="0"
          max="450"
          value={frame.borderBottom}
          onChange={(e) => updateFrame(activeFrameId, { borderBottom: Number(e.target.value), templateId: 'custom' })}
          className="w-full"
        />
      </section>

      {/* Side Borders */}
      <section>
        <div className="flex justify-between items-center mb-1">
          <h3 className="text-[10px] font-semibold text-[#A39080] uppercase tracking-widest">Borders</h3>
          <span className="text-[10px] text-[#C4B5A6]">{frame.borderLeft}px</span>
        </div>
        <input
          type="range"
          min="0"
          max="150"
          value={frame.borderLeft}
          onChange={(e) => {
            const v = Number(e.target.value);
            updateFrame(activeFrameId, { borderLeft: v, borderRight: v, borderTop: v, templateId: 'custom' });
          }}
          className="w-full"
        />
      </section>

      {/* Border Radius */}
      <section>
        <div className="flex justify-between items-center mb-1">
          <h3 className="text-[10px] font-semibold text-[#A39080] uppercase tracking-widest">Rounded Corners</h3>
          <span className="text-[10px] text-[#C4B5A6]">{frame.borderRadius}px</span>
        </div>
        <input
          type="range"
          min="0"
          max="30"
          value={frame.borderRadius}
          onChange={(e) => updateFrame(activeFrameId, { borderRadius: Number(e.target.value) })}
          className="w-full"
        />
      </section>
    </div>
  );
}
