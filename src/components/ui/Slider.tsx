import type { InputHTMLAttributes } from 'react';

interface SliderProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  showValue?: boolean;
  valueFormatter?: (value: number) => string;
  min?: number;
  max?: number;
  step?: number;
  value?: number;
}

export function Slider({
  label,
  showValue = true,
  valueFormatter,
  className = '',
  value,
  min = 0,
  max = 100,
  ...props
}: SliderProps) {
  const displayValue = valueFormatter 
    ? valueFormatter(Number(value)) 
    : `${value}${props.step && props.step < 1 ? '' : 'px'}`;

  // Calculate progress percentage for the track fill
  const progress = ((Number(value) - min) / (max - min)) * 100;

  return (
    <div className="flex flex-col gap-1.5">
      {(label || showValue) && (
        <div className="flex justify-between items-center">
          {label && (
            <label className="text-[10px] font-semibold text-[#A39080] uppercase tracking-widest">
              {label}
            </label>
          )}
          {showValue && (
            <span className="text-[10px] font-medium text-[#C4B5A6] tabular-nums">
              {displayValue}
            </span>
          )}
        </div>
      )}
      <div className="relative h-6 flex items-center">
        <input
          type="range"
          value={value}
          min={min}
          max={max}
          className={`
            premium-slider
            w-full h-1.5 
            appearance-none 
            rounded-full 
            cursor-pointer
            ${className}
          `.trim().replace(/\s+/g, ' ')}
          style={{
            background: `linear-gradient(to right, #8B6F5C 0%, #8B6F5C ${progress}%, #E8DFD6 ${progress}%, #E8DFD6 100%)`,
          }}
          {...props}
        />
      </div>
      <style>{`
        .premium-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 18px;
          height: 18px;
          background: white;
          border: 2px solid #8B6F5C;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(0,0,0,0.1);
          transition: transform 0.15s, box-shadow 0.15s;
        }
        .premium-slider::-webkit-slider-thumb:hover {
          transform: scale(1.1);
          box-shadow: 0 3px 8px rgba(0,0,0,0.15);
        }
        .premium-slider::-webkit-slider-thumb:active {
          transform: scale(0.95);
        }
        .premium-slider::-moz-range-thumb {
          width: 18px;
          height: 18px;
          background: white;
          border: 2px solid #8B6F5C;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(0,0,0,0.1);
          transition: transform 0.15s, box-shadow 0.15s;
        }
        .premium-slider::-moz-range-thumb:hover {
          transform: scale(1.1);
        }
        .premium-slider:focus {
          outline: none;
        }
        .premium-slider:focus::-webkit-slider-thumb {
          box-shadow: 0 0 0 4px rgba(139, 111, 92, 0.15), 0 2px 6px rgba(0,0,0,0.1);
        }
      `}</style>
    </div>
  );
}
