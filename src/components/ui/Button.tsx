import type { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
  iconRight?: ReactNode;
  fullWidth?: boolean;
  loading?: boolean;
}

const styles: Record<ButtonVariant, string> = {
  primary: `
    bg-[#8B6F5C] text-white border-transparent
    hover:bg-[#7A6050]
    active:scale-[0.98]
    shadow-sm
  `,
  secondary: `
    bg-[#F5EDE5] text-[#8B7B6B] border-transparent
    hover:bg-[#EDE3D9]
    active:scale-[0.98] active:bg-[#E5D9CD]
  `,
  ghost: `
    bg-transparent text-[#8B7B6B] border-transparent
    hover:bg-[#F5EDE5]
    active:scale-[0.98]
  `,
  outline: `
    bg-transparent text-[#8B7B6B] border-[#E8DFD6]
    hover:border-[#C4B5A6] hover:bg-[#FDFBF9]
    active:scale-[0.98]
  `,
  danger: `
    bg-transparent text-[#C07A5A] border-[#E8C4B8]
    hover:bg-[#FDF5F3] hover:border-[#D4A090]
    active:scale-[0.98]
  `,
};

const sizes: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-xs rounded-lg gap-1.5',
  md: 'px-4 py-2.5 text-sm rounded-xl gap-2',
  lg: 'px-6 py-3 text-base rounded-xl gap-2.5',
};

export function Button({
  variant = 'primary',
  size = 'md',
  icon,
  iconRight,
  fullWidth = false,
  loading = false,
  disabled,
  className = '',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center
        font-medium
        border
        transition-all duration-150
        disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none
        ${styles[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `.trim().replace(/\s+/g, ' ')}
      {...props}
    >
      {loading ? (
        <svg
          className="animate-spin"
          style={{ width: size === 'sm' ? 14 : 16, height: size === 'sm' ? 14 : 16 }}
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      ) : icon}
      {children && <span>{children}</span>}
      {iconRight}
    </button>
  );
}
