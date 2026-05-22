'use client';

import type { InputHTMLAttributes } from 'react';

interface SliderProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  showValue?: boolean;
  valueFormatter?: (value: number) => string;
}

export function Slider({
  label,
  showValue = true,
  valueFormatter,
  value,
  className = '',
  ...props
}: SliderProps) {
  const display = valueFormatter
    ? valueFormatter(Number(value))
    : `${value}`;

  const min = Number(props.min ?? 0);
  const max = Number(props.max ?? 100);
  const pct = Math.round(((Number(value) - min) / (max - min)) * 100);

  return (
    <section>
      <div className="flex justify-between items-center mb-2">
        {label && (
          <h3 style={{
            fontFamily: '"DM Sans", sans-serif',
            fontSize: 10,
            fontWeight: 600,
            color: '#B5A49A',
            textTransform: 'uppercase',
            letterSpacing: '.1em',
            margin: 0,
          }}>
            {label}
          </h3>
        )}
        {showValue && (
          <span style={{
            fontFamily: '"DM Sans", sans-serif',
            fontSize: 10,
            color: '#C4B5A6',
            fontVariantNumeric: 'tabular-nums',
            letterSpacing: '.02em',
          }}>
            {display}
          </span>
        )}
      </div>
      <input
        type="range"
        value={value}
        style={{ '--fill': `${pct}%` } as React.CSSProperties}
        className={`w-full ${className}`.trim()}
        {...props}
      />
    </section>
  );
}
