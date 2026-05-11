interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  hint?: string;
  disabled?: boolean;
  size?: 'sm' | 'md';
}

export function Toggle({
  checked,
  onChange,
  label,
  hint,
  disabled = false,
  size = 'md',
}: ToggleProps) {
  const trackSize = size === 'sm' ? 'w-8 h-[18px]' : 'w-10 h-5';
  const thumbSize = size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4';
  const thumbTranslate = size === 'sm' 
    ? (checked ? 'translate-x-[14px]' : 'translate-x-0.5')
    : (checked ? 'translate-x-[18px]' : 'translate-x-0.5');

  return (
    <label 
      className={`
        flex items-center gap-3 
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        group
      `}
    >
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={`
          relative inline-flex items-center
          ${trackSize}
          rounded-full
          border
          transition-all duration-200
          ${checked 
            ? 'bg-[#8B6F5C] border-[#8B6F5C]' 
            : 'bg-[#E8DFD6] border-[#E0D5C9] group-hover:bg-[#DED3C7]'
          }
          focus:outline-none focus:ring-2 focus:ring-[#8B6F5C]/20 focus:ring-offset-1
        `}
      >
        <span
          className={`
            ${thumbSize}
            rounded-full
            bg-white
            shadow-sm
            transition-transform duration-200
            ${thumbTranslate}
          `}
        />
      </button>
      
      {(label || hint) && (
        <div className="flex flex-col">
          {label && (
            <span className="text-sm text-[#5C4A3A] font-medium">{label}</span>
          )}
          {hint && (
            <span className="text-xs text-[#A39080]">{hint}</span>
          )}
        </div>
      )}
    </label>
  );
}
