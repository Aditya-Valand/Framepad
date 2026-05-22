'use client';

import { useRef, type InputHTMLAttributes } from 'react';

interface UploadButtonProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  onUpload: (file: File) => void;
  label?: string;
  buttonText?: string;
  replaceText?: string;
  hasFile?: boolean;
  hint?: string;
}

export function UploadButton({
  onUpload,
  label,
  buttonText = 'Upload Photo',
  replaceText = 'Change Photo',
  hasFile = false,
  hint,
  accept = 'image/jpeg,image/png,image/webp',
  className = '',
  ...props
}: UploadButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onUpload(file);
    e.target.value = '';
  };

  return (
    <section className={className}>
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
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        style={{
          width: '100%',
          padding: '14px 16px',
          borderRadius: 12,
          border: '1px dashed rgba(139,111,92,0.28)',
          background: 'rgba(139,111,92,0.04)',
          color: '#8B7060',
          fontFamily: '"DM Sans", sans-serif',
          fontSize: 13.5,
          fontWeight: 500,
          cursor: 'pointer',
          transition: 'all .18s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 7,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = 'rgba(139,111,92,0.45)';
          e.currentTarget.style.background = 'rgba(139,111,92,0.07)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'rgba(139,111,92,0.28)';
          e.currentTarget.style.background = 'rgba(139,111,92,0.04)';
        }}
        onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.99)'; }}
        onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
      >
        {!hasFile && (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#C4B5A6' }}>
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="17 8 12 3 7 8"/>
            <line x1="12" y1="3" x2="12" y2="15"/>
          </svg>
        )}
        {hasFile ? (
          <>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#C4B5A6' }}>
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
            {replaceText}
          </>
        ) : buttonText}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        className="hidden"
        {...props}
      />
      {hint && (
        <span style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 10, color: '#C4B5A6', marginTop: 4, display: 'block' }}>
          {hint}
        </span>
      )}
    </section>
  );
}
