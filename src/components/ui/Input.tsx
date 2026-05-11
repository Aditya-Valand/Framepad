import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
}

export function Input({
  label,
  hint,
  error,
  icon,
  iconRight,
  className = '',
  ...props
}: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-[10px] font-semibold text-[#A39080] uppercase tracking-widest">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#C4B5A6] pointer-events-none">
            {icon}
          </div>
        )}
        <input
          className={`
            w-full
            px-3.5 py-2.5
            text-sm text-[#5C4A3A]
            placeholder:text-[#C4B5A6]
            bg-[#FDFBF9]
            border border-[#E8DFD6]
            rounded-xl
            outline-none
            transition-all duration-150
            focus:border-[#C4B5A6] focus:ring-2 focus:ring-[#8B6F5C]/10
            disabled:opacity-50 disabled:cursor-not-allowed
            ${icon ? 'pl-10' : ''}
            ${iconRight ? 'pr-10' : ''}
            ${error ? 'border-[#D4786A] focus:ring-[#D4786A]/10' : ''}
            ${className}
          `.trim().replace(/\s+/g, ' ')}
          {...props}
        />
        {iconRight && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[#C4B5A6]">
            {iconRight}
          </div>
        )}
      </div>
      {hint && !error && (
        <span className="text-xs text-[#B0A090]">{hint}</span>
      )}
      {error && (
        <span className="text-xs text-[#D4786A]">{error}</span>
      )}
    </div>
  );
}
