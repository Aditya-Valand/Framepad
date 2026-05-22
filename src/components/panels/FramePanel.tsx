'use client';

import { useCallback } from 'react';
import { useStore, POLAROID_TEMPLATES } from '@/store';
import type { TemplateId } from '@/store';
import { useImageUpload } from '@/hooks/useImageUpload';
import { useImageColors } from '@/hooks/useImageColors';
import { UploadButton, ColorPicker, Slider, SectionLabel } from '@/components/ui';

const Sep = () => (
  <div style={{ height: '0.5px', background: 'rgba(26,23,20,0.07)' }} />
);

export function FramePanel() {
  const activeFrameId = useStore((s) => s.activeFrameId);
  const frame         = useStore((s) => s.frames.find((f) => f.id === s.activeFrameId));
  const updateFrame   = useStore((s) => s.updateFrame);
  const applyTemplate = useStore((s) => s.applyTemplate);
  const { uploadFile }  = useImageUpload();
  const photoColors   = useImageColors(frame?.imageDataUrl ?? null);

  const handleFile = useCallback((file: File) => uploadFile(file), [uploadFile]);

  if (!frame) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* ── Upload ── */}
      <UploadButton
        label="Photo"
        onUpload={handleFile}
        hasFile={!!frame.imageDataUrl}
        buttonText="Upload Photo"
        replaceText="Change Photo"
      />

      <Sep />

      {/* ── Template Picker ── */}
      <section>
        <SectionLabel>Template</SectionLabel>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
          {POLAROID_TEMPLATES.map((tmpl) => {
            const isActive = frame.templateId === tmpl.id;
            const maxH  = 54;
            const scale = maxH / tmpl.frameHeight;
            const w     = tmpl.frameWidth * scale;
            const h     = tmpl.frameHeight * scale;
            const bt    = tmpl.borderTop    * scale;
            const bl    = tmpl.borderLeft   * scale;
            const br    = tmpl.borderRight  * scale;
            const bb    = tmpl.borderBottom * scale;

            return (
              <button
                key={tmpl.id}
                onClick={() => applyTemplate(activeFrameId, tmpl.id as TemplateId)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 7,
                  padding: '10px 4px 8px',
                  borderRadius: 11,
                  border: isActive ? '1.5px solid rgba(139,111,92,0.45)' : '0.5px solid rgba(26,23,20,0.08)',
                  background: isActive ? 'rgba(139,111,92,0.07)' : 'rgba(26,23,20,0.02)',
                  cursor: 'pointer',
                  transition: 'all .15s ease',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'rgba(139,111,92,0.05)';
                    e.currentTarget.style.borderColor = 'rgba(139,111,92,0.2)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'rgba(26,23,20,0.02)';
                    e.currentTarget.style.borderColor = 'rgba(26,23,20,0.08)';
                  }
                }}
                onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.96)'; }}
                onMouseUp={(e)   => { e.currentTarget.style.transform = 'scale(1)'; }}
              >
                {/* Mini polaroid preview */}
                <div style={{
                  width: w,
                  height: h,
                  backgroundColor: tmpl.frameColor,
                  borderRadius: 2,
                  border: '0.5px solid rgba(26,23,20,0.12)',
                  boxShadow: '0 1px 4px rgba(26,23,20,0.1)',
                  position: 'relative',
                  flexShrink: 0,
                }}>
                  <div style={{
                    position: 'absolute',
                    top: bt, left: bl, right: br, bottom: bb,
                    width: w - bl - br,
                    height: h - bt - bb,
                    backgroundColor: '#C4B4A4',
                  }} />
                </div>
                <span style={{
                  fontFamily: '"DM Sans", sans-serif',
                  fontSize: 9,
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? '#6B4F3A' : '#A39080',
                  textAlign: 'center',
                  lineHeight: 1.3,
                }}>
                  {tmpl.name}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <Sep />

      {/* ── Frame Color ── */}
      <ColorPicker
        label="Color"
        value={frame.frameColor}
        onChange={(color) => updateFrame(activeFrameId, { frameColor: color })}
        presets={['#FFFFFF', '#F5EDD6', '#1A1A1A', '#F0E4D7', '#F2EDE8', '#E4E8F0']}
        customColors={photoColors}
        customColorsLabel="From photo"
      />

      <Sep />

      {/* ── Frame Adjustments ── */}
      <section>
        <SectionLabel>Frame</SectionLabel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <Slider
            label="Caption Area"
            value={frame.borderBottom}
            min={0}
            max={450}
            onChange={(e) => updateFrame(activeFrameId, { borderBottom: Number(e.target.value), templateId: 'custom' })}
          />
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
          <Slider
            label="Rounded Corners"
            value={frame.borderRadius}
            min={0}
            max={30}
            onChange={(e) => updateFrame(activeFrameId, { borderRadius: Number(e.target.value) })}
          />
        </div>
      </section>

    </div>
  );
}
