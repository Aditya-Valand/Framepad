'use client';

import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean;
  icon?: ReactNode;
  size?: 'sm' | 'md';
}

export function Chip({
  selected = false,
  icon,
  size = 'md',
  className = '',
  children,
  ...props
}: ChipProps) {
  const sizeClasses = size === 'sm'
    ? 'flex-shrink-0 px-3 py-1.5 text-[11px]'
    : 'flex-shrink-0 px-4 py-2 text-xs';

  return (
    <button
      type="button"
      className={`
        ${sizeClasses}
        rounded-full font-medium capitalize transition-all
        ${selected
          ? 'bg-[#8B6F5C] text-white shadow-sm'
          : 'bg-[#F5EDE5] text-[#8B7B6B] active:bg-[#EDE3D9]'
        }
        ${className}
      `.trim().replace(/\s+/g, ' ')}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}

interface ChipGroupProps {
  children: ReactNode;
  label?: string;
  className?: string;
  scroll?: boolean;
}

export function ChipGroup({ children, label, className = '', scroll = false }: ChipGroupProps) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && (
        <h3 className="text-[10px] font-semibold text-[#A39080] uppercase tracking-widest">
          {label}
        </h3>
      )}
      <div className={scroll
        ? 'flex gap-2 overflow-x-auto pb-1 scrollbar-hide'
        : 'flex gap-2 flex-wrap'
      }>
        {children}
      </div>
    </div>
  );
}
