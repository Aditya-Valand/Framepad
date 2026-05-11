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
    ? 'px-2.5 py-1 text-[10px] gap-1' 
    : 'px-3 py-1.5 text-xs gap-1.5';

  return (
    <button
      type="button"
      className={`
        inline-flex items-center justify-center
        font-medium
        rounded-full
        border
        transition-all duration-150
        active:scale-95
        ${sizeClasses}
        ${selected 
          ? 'bg-[#8B6F5C] text-white border-[#8B6F5C] shadow-sm' 
          : 'bg-[#F8F3EE] text-[#8B7B6B] border-transparent hover:bg-[#F0E8E0]'
        }
        ${className}
      `.trim().replace(/\s+/g, ' ')}
      {...props}
    >
      {icon}
      {children && <span>{children}</span>}
    </button>
  );
}

interface ChipGroupProps {
  children: ReactNode;
  label?: string;
  className?: string;
}

export function ChipGroup({ children, label, className = '' }: ChipGroupProps) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && (
        <label className="text-[10px] font-semibold text-[#A39080] uppercase tracking-widest">
          {label}
        </label>
      )}
      <div className="flex flex-wrap gap-2">
        {children}
      </div>
    </div>
  );
}
