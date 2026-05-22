'use client';

import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
}

export function Input({
  label,
  hint,
  error,
  className = '',
  ...props
}: InputProps) {
  return (
    <div>
      {(label || hint) && (
        <div className="flex justify-between items-baseline mb-1">
          {label && (
            <span className="text-[10px] font-semibold text-[#A39080] uppercase tracking-widest">
              {label}
            </span>
          )}
          {hint && (
            <span className="text-[9px] text-[#C4B5A6]">{hint}</span>
          )}
        </div>
      )}
      <input
        className={`
          w-full px-3 py-2.5 rounded-xl
          border border-[#E8DFD6]
          text-sm text-[#5C4A3A]
          bg-[#F8F3EE]
          placeholder:text-[#C4B5A6]
          focus:outline-none focus:border-[#C4B5A6]
          transition-colors
          ${error ? 'border-red-300' : ''}
          ${className}
        `.trim().replace(/\s+/g, ' ')}
        {...props}
      />
      {error && (
        <span className="text-[10px] text-red-400 mt-0.5 block">{error}</span>
      )}
    </div>
  );
}
