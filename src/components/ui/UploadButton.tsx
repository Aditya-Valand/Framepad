import { useRef, type InputHTMLAttributes } from 'react';

interface UploadButtonProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  onUpload: (file: File) => void;
  label?: string;
  buttonText?: string;
  replaceText?: string;
  hasFile?: boolean;
  hint?: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'compact';
}

const defaultIcon = (
  <svg 
    className="w-5 h-5" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);

export function UploadButton({
  onUpload,
  label,
  buttonText = 'Upload Photo',
  replaceText = 'Change Photo',
  hasFile = false,
  hint,
  icon = defaultIcon,
  variant = 'default',
  accept = 'image/jpeg,image/png,image/webp',
  className = '',
  ...props
}: UploadButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUpload(file);
    }
    e.target.value = '';
  };

  if (variant === 'compact') {
    return (
      <div className={`flex flex-col gap-1.5 ${className}`}>
        {label && (
          <label className="text-[10px] font-semibold text-[#A39080] uppercase tracking-widest">
            {label}
          </label>
        )}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="
            flex items-center gap-2
            px-3 py-2
            text-sm text-[#8B7B6B] font-medium
            bg-[#F8F3EE]
            rounded-xl
            transition-all duration-150
            hover:bg-[#F0E8E0]
            active:scale-[0.98]
          "
        >
          {icon}
          <span>{hasFile ? replaceText : buttonText}</span>
        </button>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleChange}
          className="hidden"
          {...props}
        />
        {hint && <span className="text-xs text-[#B0A090]">{hint}</span>}
      </div>
    );
  }

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label className="text-[10px] font-semibold text-[#A39080] uppercase tracking-widest">
          {label}
        </label>
      )}
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="
          w-full 
          py-3.5 
          rounded-xl 
          border-2 border-dashed border-[#E0D5C9] 
          text-sm text-[#8B7B6B] font-medium 
          bg-[#FDFBF9]
          transition-all duration-150
          hover:border-[#C4B5A6] hover:bg-[#FAF7F3]
          active:scale-[0.99] active:bg-[#F8F3EE]
          flex items-center justify-center gap-2
        "
      >
        {icon}
        <span>{hasFile ? replaceText : buttonText}</span>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        className="hidden"
        {...props}
      />
      {hint && <span className="text-xs text-[#B0A090]">{hint}</span>}
    </div>
  );
}
