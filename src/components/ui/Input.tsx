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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 5 }}>
          {label && (
            <span style={{
              fontFamily: '"DM Sans", sans-serif',
              fontSize: 10,
              fontWeight: 600,
              color: '#A39080',
              letterSpacing: '.08em',
              textTransform: 'uppercase',
            }}>
              {label}
            </span>
          )}
          {hint && (
            <span style={{
              fontFamily: '"DM Sans", sans-serif',
              fontSize: 9,
              color: '#C4B5A6',
              letterSpacing: '.03em',
            }}>
              {hint}
            </span>
          )}
        </div>
      )}
      <input
        style={{
          width: '100%',
          padding: '10px 12px',
          borderRadius: 10,
          border: '0.5px solid rgba(26,23,20,0.14)',
          background: '#FFFFFF',
          fontFamily: '"DM Sans", sans-serif',
          fontSize: 13,
          color: '#3A2E28',
          outline: 'none',
          boxSizing: 'border-box' as const,
          transition: 'border-color .15s ease, box-shadow .15s ease',
          boxShadow: '0 1px 2px rgba(26,23,20,0.04)',
        }}
        className={`placeholder:text-[#C4B5A6] focus:border-[#8B6F5C] focus:shadow-[0_0_0_3px_rgba(139,111,92,0.1)] ${error ? 'border-red-300' : ''} ${className}`}
        {...props}
      />
      {error && (
        <span style={{ fontFamily: '"DM Sans",sans-serif', fontSize: 10, color: '#C07A5A', marginTop: 3, display: 'block' }}>
          {error}
        </span>
      )}
    </div>
  );
}
