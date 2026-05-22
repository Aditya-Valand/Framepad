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
        <h3 className="text-[10px] font-semibold text-[#A39080] uppercase tracking-widest mb-2">
          {label}
        </h3>
      )}
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="w-full py-3.5 rounded-xl border-2 border-dashed border-[#E0D5C9] text-sm text-[#8B7B6B] font-medium hover:border-[#C4B5A6] hover:bg-[#FDFAF7] active:bg-[#F8F3EE] transition-all flex items-center justify-center gap-2"
      >
        {!hasFile && (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#C4B5A6]">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="17 8 12 3 7 8"/>
            <line x1="12" y1="3" x2="12" y2="15"/>
          </svg>
        )}
        {hasFile ? replaceText : buttonText}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        className="hidden"
        {...props}
      />
      {hint && <span className="text-[10px] text-[#C4B5A6] mt-1 block">{hint}</span>}
    </section>
  );
}
