import type { SelectHTMLAttributes } from 'react';

interface Option {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  label?: string;
  options: Option[];
  placeholder?: string;
  hint?: string;
  error?: string;
}

export function Select({
  label,
  options,
  placeholder,
  hint,
  error,
  className = '',
  ...props
}: SelectProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-[10px] font-semibold text-[#A39080] uppercase tracking-widest">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          className={`
            w-full
            px-3.5 py-2.5
            pr-10
            text-sm text-[#5C4A3A]
            bg-[#FDFBF9]
            border border-[#E8DFD6]
            rounded-xl
            outline-none
            appearance-none
            cursor-pointer
            transition-all duration-150
            focus:border-[#C4B5A6] focus:ring-2 focus:ring-[#8B6F5C]/10
            disabled:opacity-50 disabled:cursor-not-allowed
            ${error ? 'border-[#D4786A] focus:ring-[#D4786A]/10' : ''}
            ${className}
          `.trim().replace(/\s+/g, ' ')}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} disabled={opt.disabled}>
              {opt.label}
            </option>
          ))}
        </select>
        {/* Chevron icon */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#A39080]">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
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
