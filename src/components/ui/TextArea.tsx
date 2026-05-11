import type { TextareaHTMLAttributes } from 'react';

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  hint?: string;
  error?: string;
  charCount?: number;
  maxChars?: number;
}

export function TextArea({
  label,
  hint,
  error,
  charCount,
  maxChars,
  className = '',
  ...props
}: TextAreaProps) {
  const showCounter = typeof charCount === 'number' && typeof maxChars === 'number';
  const isNearLimit = showCounter && charCount > maxChars * 0.9;
  const isOverLimit = showCounter && charCount > maxChars;

  return (
    <div className="flex flex-col gap-1.5">
      {(label || showCounter) && (
        <div className="flex justify-between items-center">
          {label && (
            <label className="text-[10px] font-semibold text-[#A39080] uppercase tracking-widest">
              {label}
            </label>
          )}
          {showCounter && (
            <span className={`text-[10px] font-medium tabular-nums ${
              isOverLimit ? 'text-[#D4786A]' : isNearLimit ? 'text-[#C98B60]' : 'text-[#C4B5A6]'
            }`}>
              {charCount}/{maxChars}
            </span>
          )}
        </div>
      )}
      <textarea
        className={`
          w-full
          px-3.5 py-3
          text-sm text-[#5C4A3A]
          placeholder:text-[#C4B5A6]
          bg-[#FDFBF9]
          border border-[#E8DFD6]
          rounded-xl
          resize-none
          outline-none
          transition-all duration-150
          focus:border-[#C4B5A6] focus:ring-2 focus:ring-[#8B6F5C]/10
          disabled:opacity-50 disabled:cursor-not-allowed
          ${error ? 'border-[#D4786A] focus:ring-[#D4786A]/10' : ''}
          ${className}
        `.trim().replace(/\s+/g, ' ')}
        {...props}
      />
      {hint && !error && (
        <span className="text-xs text-[#B0A090]">{hint}</span>
      )}
      {error && (
        <span className="text-xs text-[#D4786A]">{error}</span>
      )}
    </div>
  );
}
