'use client';

import { useCallback, useRef, useState } from 'react';
import { useStore } from '@/store';
import type { BatchImage } from '@/store';
import { BatchPreviewCard } from './BatchPreviewCard';
import { useBatchExport } from '@/hooks/useBatchExport';
import { useAuth } from '@/hooks/useAuth';
import { uploadToCloudinary } from '@/hooks/useImageUpload';
import { POLAROID_TEMPLATES, FILTER_PRESETS } from '@/store';

const MAX_BATCH = 20;
const MAX_SIZE_BYTES = 10 * 1024 * 1024;
const VALID_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

interface BatchModalProps {
  onClose: () => void;
}

export function BatchModal({ onClose }: BatchModalProps) {
  const batchImages = useStore((s) => s.batchImages);
  const addBatchImages = useStore((s) => s.addBatchImages);
  const removeBatchImage = useStore((s) => s.removeBatchImage);
  const clearBatch = useStore((s) => s.clearBatch);
  const frames = useStore((s) => s.frames);
  const activeFrameId = useStore((s) => s.activeFrameId);
  const frame = frames.find((f) => f.id === activeFrameId)!;

  const { exportAll, progress } = useBatchExport();
  const { user } = useAuth();
  const isLoggedIn = !!user;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [exportFormat, setExportFormat] = useState<'zip' | 'individual'>('zip');
  const [saving, setSaving] = useState(false);
  const [saveProgress, setSaveProgress] = useState({ current: 0, total: 0 });
  const [saveSuccess, setSaveSuccess] = useState(false);

  const processFiles = useCallback(async (files: FileList | File[]) => {
    const remaining = MAX_BATCH - batchImages.length;
    const toProcess = Array.from(files).slice(0, remaining);

    const newImages: BatchImage[] = [];
    for (const file of toProcess) {
      if (!VALID_TYPES.includes(file.type)) continue;
      if (file.size > MAX_SIZE_BYTES) continue;

      const dataUrl = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          // Compress if large
          if (file.size > 3 * 1024 * 1024) {
            const img = new Image();
            img.onload = () => {
              const canvas = document.createElement('canvas');
              let { width, height } = img;
              const maxDim = 2048;
              if (width > maxDim || height > maxDim) {
                if (width > height) { height = (height / width) * maxDim; width = maxDim; }
                else { width = (width / height) * maxDim; height = maxDim; }
              }
              canvas.width = width;
              canvas.height = height;
              canvas.getContext('2d')!.drawImage(img, 0, 0, width, height);
              resolve(canvas.toDataURL('image/jpeg', 0.85));
            };
            img.src = result;
          } else {
            resolve(result);
          }
        };
        reader.readAsDataURL(file);
      });

      newImages.push({
        id: crypto.randomUUID(),
        dataUrl,
        fileName: file.name,
        status: 'pending',
      });
    }

    if (newImages.length > 0) {
      addBatchImages(newImages);
    }
  }, [batchImages.length, addBatchImages]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length) {
      processFiles(e.dataTransfer.files);
    }
  }, [processFiles]);

  const handleExport = () => {
    exportAll(batchImages, frame, { format: exportFormat });
  };

  // Template info for display
  const template = POLAROID_TEMPLATES.find((t) => t.id === frame.templateId);
  const filterName = Object.entries(FILTER_PRESETS).find(
    ([, v]) => v.brightness === frame.filters.brightness && v.contrast === frame.filters.contrast &&
      v.saturation === frame.filters.saturation && v.warmth === frame.filters.warmth
  )?.[0] || 'custom';

  const isExporting = progress.phase === 'rendering' || progress.phase === 'zipping';
  const isBusy = isExporting || saving;

  const handleSaveToDesigns = async () => {
    if (!isLoggedIn || batchImages.length === 0) return;
    setSaving(true);
    setSaveProgress({ current: 0, total: batchImages.length });
    setSaveSuccess(false);

    const designs: { canvas_state: unknown; title: string }[] = [];

    for (let i = 0; i < batchImages.length; i++) {
      const img = batchImages[i];
      setSaveProgress({ current: i + 1, total: batchImages.length });

      // Upload to Cloudinary
      const cloudResult = await uploadToCloudinary(img.dataUrl);

      const baseName = img.fileName.replace(/\.[^.]+$/, '');
      const frameForSave = {
        ...frame,
        imageDataUrl: img.dataUrl,
        imageUrl: cloudResult?.secureUrl || null,
        cloudinaryId: cloudResult?.publicId || null,
        imagePanX: 0,
        imagePanY: 0,
        imageScale: 1,
        imageRotation: 0,
      };

      designs.push({
        canvas_state: { frameData: frameForSave },
        title: baseName,
      });
    }

    // Bulk save to API
    try {
      const res = await fetch('/api/designs/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ designs }),
      });
      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch {
      // silent
    }

    setSaving(false);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(26,23,20,0.6)',
        backdropFilter: 'blur(8px)',
      }}
      onClick={(e) => { if (e.target === e.currentTarget && !isBusy) onClose(); }}
    >
      <div
        style={{
          width: '95%',
          maxWidth: 800,
          maxHeight: '90vh',
          background: '#FFFCF8',
          borderRadius: 16,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 20px 60px rgba(26,23,20,0.3)',
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '18px 24px',
          borderBottom: '0.5px solid rgba(26,23,20,0.08)',
        }}>
          <h2 style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 18, fontWeight: 600, color: '#1A1714', margin: 0 }}>
            Batch Apply
          </h2>
          <button
            onClick={onClose}
            disabled={isBusy}
            style={{
              width: 32, height: 32, borderRadius: '50%', border: 'none',
              background: 'rgba(26,23,20,0.06)', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 18, color: '#5C4A3A',
            }}
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflow: 'auto', padding: '20px 24px' }}>
          {/* Drop zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            style={{
              border: `2px dashed ${dragOver ? '#8B6F5C' : 'rgba(26,23,20,0.15)'}`,
              borderRadius: 12,
              padding: '32px 20px',
              textAlign: 'center',
              cursor: 'pointer',
              background: dragOver ? 'rgba(139,111,92,0.05)' : 'transparent',
              transition: 'all .2s ease',
              marginBottom: 20,
            }}
          >
            <svg width="32" height="32" fill="none" stroke={dragOver ? '#8B6F5C' : '#A39080'} viewBox="0 0 24 24" style={{ margin: '0 auto 10px' }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 16V4m0 0l-4 4m4-4l4 4M4 14v4a2 2 0 002 2h12a2 2 0 002-2v-4" />
            </svg>
            <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 14, color: '#5C4A3A', margin: '0 0 4px' }}>
              Drop photos here or click to browse
            </p>
            <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 12, color: '#A39080', margin: 0 }}>
              Max {MAX_BATCH} photos · JPG, PNG, WEBP · 10MB each
            </p>
            {batchImages.length > 0 && (
              <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 12, color: '#8B6F5C', margin: '8px 0 0', fontWeight: 500 }}>
                {batchImages.length}/{MAX_BATCH} photos added
              </p>
            )}
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp"
              style={{ display: 'none' }}
              onChange={(e) => { if (e.target.files) processFiles(e.target.files); e.target.value = ''; }}
            />
          </div>

          {/* Preview grid */}
          {batchImages.length > 0 && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
              gap: 20,
              marginBottom: 20,
            }}>
              {batchImages.map((img, i) => (
                <BatchPreviewCard
                  key={img.id}
                  image={img}
                  frameData={frame}
                  onRemove={() => removeBatchImage(img.id)}
                  index={i}
                />
              ))}
            </div>
          )}

          {/* Template info */}
          <div style={{
            background: 'rgba(139,111,92,0.05)',
            borderRadius: 10,
            padding: '12px 16px',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px 16px',
            alignItems: 'center',
          }}>
            <span style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 12, color: '#5C4A3A', fontWeight: 500 }}>
              Applying:
            </span>
            <span style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 12, color: '#8B6F5C', background: 'rgba(139,111,92,0.1)', borderRadius: 20, padding: '3px 10px' }}>
              {template?.name || frame.templateId}
            </span>
            {filterName !== 'none' && (
              <span style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 12, color: '#8B6F5C', background: 'rgba(139,111,92,0.1)', borderRadius: 20, padding: '3px 10px' }}>
                {filterName} filter
              </span>
            )}
            {frame.bottomCaptionText && (
              <span style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 12, color: '#8B6F5C', background: 'rgba(139,111,92,0.1)', borderRadius: 20, padding: '3px 10px' }}>
                &quot;{frame.bottomCaptionText}&quot;
              </span>
            )}
            {frame.musicUrl && (
              <span style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 12, color: '#8B6F5C', background: 'rgba(139,111,92,0.1)', borderRadius: 20, padding: '3px 10px' }}>
                Spotify ✓
              </span>
            )}
          </div>
        </div>

        {/* Footer */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 24px',
          borderTop: '0.5px solid rgba(26,23,20,0.08)',
          gap: 12,
          flexWrap: 'wrap',
        }}>
          {/* Left: format toggle + clear */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <select
              value={exportFormat}
              onChange={(e) => setExportFormat(e.target.value as 'zip' | 'individual')}
              disabled={isBusy}
              style={{
                fontFamily: '"DM Sans", sans-serif',
                fontSize: 12,
                padding: '6px 10px',
                borderRadius: 8,
                border: '0.5px solid rgba(26,23,20,0.15)',
                background: '#fff',
                color: '#5C4A3A',
                cursor: 'pointer',
              }}
            >
              <option value="zip">Download as ZIP</option>
              <option value="individual">Download individually</option>
            </select>
            {batchImages.length > 0 && !isBusy && (
              <button
                onClick={clearBatch}
                style={{
                  fontFamily: '"DM Sans", sans-serif',
                  fontSize: 12,
                  color: '#E74C3C',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                }}
              >
                Clear all
              </button>
            )}
          </div>

          {/* Right: Export + Save buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {isLoggedIn && (
              <button
                onClick={handleSaveToDesigns}
                disabled={batchImages.length === 0 || isBusy}
                style={{
                  fontFamily: '"DM Sans", sans-serif',
                  fontSize: 13,
                  fontWeight: 500,
                  background: 'transparent',
                  color: batchImages.length === 0 || isBusy ? '#D4C4B0' : '#8B6F5C',
                  border: `1px solid ${batchImages.length === 0 || isBusy ? '#D4C4B0' : 'rgba(139,111,92,0.4)'}`,
                  borderRadius: 100,
                  padding: '9px 18px',
                  cursor: batchImages.length === 0 || isBusy ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  transition: 'all .2s',
                }}
              >
                {saving ? (
                  <>
                    <span className="animate-spin" style={{ width: 12, height: 12, border: '2px solid rgba(139,111,92,0.3)', borderTopColor: '#8B6F5C', borderRadius: '50%', display: 'inline-block' }} />
                    {saveProgress.current}/{saveProgress.total}
                  </>
                ) : saveSuccess ? (
                  <>
                    <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="#8B9E6B" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8.5l3.5 3.5 6.5-7" /></svg>
                    Saved!
                  </>
                ) : (
                  <>
                    <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
                      <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
                      <polyline points="17 21 17 13 7 13 7 21" />
                      <polyline points="7 3 7 8 15 8" />
                    </svg>
                    Save to My Designs
                  </>
                )}
              </button>
            )}
            <button
              onClick={handleExport}
              disabled={batchImages.length === 0 || isBusy}
              style={{
                fontFamily: '"DM Sans", sans-serif',
                fontSize: 14,
                fontWeight: 500,
                background: batchImages.length === 0 || isBusy ? '#D4C4B0' : '#8B6F5C',
                color: '#fff',
                border: 'none',
                borderRadius: 100,
                padding: '10px 24px',
                cursor: batchImages.length === 0 || isBusy ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                transition: 'background .2s',
              }}
          >
            {isExporting ? (
              <>
                <span className="animate-spin" style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block' }} />
                {progress.phase === 'zipping' ? 'Zipping...' : `${progress.current}/${progress.total}`}
              </>
            ) : (
              <>
                <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3" />
                </svg>
                Export {batchImages.length > 0 ? `${batchImages.length} photos` : 'All'}
              </>
            )}
          </button>
          </div>
        </div>

        {/* Progress bar */}
        {(isExporting || saving) && (
          <div style={{ height: 3, background: 'rgba(139,111,92,0.1)' }}>
            <div
              style={{
                height: '100%',
                background: '#8B6F5C',
                borderRadius: 2,
                transition: 'width .3s ease',
                width: isExporting
                  ? (progress.total > 0 ? `${(progress.current / progress.total) * 100}%` : '0%')
                  : (saveProgress.total > 0 ? `${(saveProgress.current / saveProgress.total) * 100}%` : '0%'),
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
