import type { HTMLAttributes, ReactNode } from 'react';

type CardVariant = 'default' | 'elevated' | 'outlined' | 'filled';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  children: ReactNode;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  interactive?: boolean;
  selected?: boolean;
}

const variants: Record<CardVariant, string> = {
  default: 'bg-[#FDFBF9] border border-[#F0E6DA]',
  elevated: 'bg-white border border-[#F0E6DA] shadow-sm',
  outlined: 'bg-transparent border border-[#E8DFD6]',
  filled: 'bg-[#F8F3EE] border border-transparent',
};

const paddings = {
  none: 'p-0',
  sm: 'p-2',
  md: 'p-3',
  lg: 'p-4',
};

export function Card({
  variant = 'default',
  padding = 'md',
  interactive = false,
  selected = false,
  className = '',
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={`
        rounded-xl
        transition-all duration-150
        ${variants[variant]}
        ${paddings[padding]}
        ${interactive ? 'cursor-pointer hover:bg-[#F5EDE5] active:scale-[0.98]' : ''}
        ${selected ? 'ring-2 ring-[#8B6F5C] border-[#8B6F5C]/20 bg-[#8B6F5C]/5' : ''}
        ${className}
      `.trim().replace(/\s+/g, ' ')}
      {...props}
    >
      {children}
    </div>
  );
}
