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
  default:  'bg-[#FDFAF7] border border-[rgba(26,23,20,0.08)]',
  elevated: 'bg-white border border-[rgba(26,23,20,0.07)] shadow-sm',
  outlined: 'bg-transparent border border-[rgba(26,23,20,0.1)]',
  filled:   'bg-[rgba(139,111,92,0.05)] border border-transparent',
};

const paddings = {
  none: 'p-0',
  sm:   'p-2',
  md:   'p-3',
  lg:   'p-4',
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
        ${interactive ? 'cursor-pointer hover:bg-[rgba(139,111,92,0.08)] active:scale-[0.99]' : ''}
        ${selected ? 'ring-2 ring-[#8B6F5C] border-[rgba(139,111,92,0.2)] bg-[rgba(139,111,92,0.06)]' : ''}
        ${className}
      `.trim().replace(/\s+/g, ' ')}
      {...props}
    >
      {children}
    </div>
  );
}
