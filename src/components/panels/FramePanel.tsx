'use client';

import { useCallback, useRef } from 'react';
import { useStore, POLAROID_TEMPLATES } from '@/store';
import type { TemplateId } from '@/store';
import { useImageUpload } from '@/hooks/useImageUpload';
import { useImageColors } from '@/hooks/useImageColors';
import { UploadButton, ColorPicker, Slider, SectionLabel } from '@/components/ui';

export function FramePanel() {
  const activeFrameId = useStore((s) => s.activeFrameId);
  const frame = useStore((s) => s.frames.find((f) => f.id === s.activeFrameId));
  const updateFrame = useStore((s) => s.updateFrame);
  const applyTemplate = useStore((s) => s.applyTemplate);
  const { uploadFile } = useImageUpload();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const photoColors = useImageColors(frame?.imageDataUrl ?? null);

  const handleFile = useCallback((file: File) => {
    uploadFile(file);
  }, [uploadFile]);

  if (!frame) return null;

  return (
    <div className="space-y-5">
      {/* Upload */}
      <UploadButton
        label="Photo"
        onUpload={handleFile}
        hasFile={!!frame.imageDataUrl}
        buttonText="Upload Photo"
        replaceText="Change Photo"
      />

      {/* Template Picker */}
      <section>
        <SectionLabel>Template</SectionLabel>
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
      <ColorPicker
        label="Color"
        value={frame.frameColor}
        onChange={(color) => updateFrame(activeFrameId, { frameColor: color })}
        presets={['#FFFFFF', '#F5EDD6', '#1A1A1A', '#F0E4D7', '#F2EDE8', '#E4E8F0']}
        customColors={photoColors}
        customColorsLabel="From photo"
      />

      {/* Caption Area */}
      <Slider
        label="Caption Area"
        value={frame.borderBottom}
        min={0}
        max={450}
        onChange={(e) => updateFrame(activeFrameId, { borderBottom: Number(e.target.value), templateId: 'custom' })}
      />

      {/* Side Borders */}
      <Slider
        label="Borders"
        value={frame.borderLeft}
        min={0}
        max={150}
        onChange={(e) => {
          const v = Number(e.target.value);
          updateFrame(activeFrameId, { borderLeft: v, borderRight: v, borderTop: v, templateId: 'custom' });
        }}
      />

      {/* Border Radius */}
      <Slider
        label="Rounded Corners"
        value={frame.borderRadius}
        min={0}
        max={30}
        onChange={(e) => updateFrame(activeFrameId, { borderRadius: Number(e.target.value) })}
      />
    </div>
  );
}
