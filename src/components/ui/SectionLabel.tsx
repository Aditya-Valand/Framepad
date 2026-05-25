import type { ReactNode } from 'react';

interface SectionLabelProps {
  children: ReactNode;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
}

export function SectionLabel({
  children,
  icon,
  action,
  className = '',
}: SectionLabelProps) {
  return (
    <div className={`flex items-center justify-between mb-2.5 ${className}`}>
      <div className="flex items-center gap-1.5">
        {icon && <span style={{ color: '#C4B5A6' }}>{icon}</span>}
        <h3 style={{
          fontFamily: '"DM Sans", sans-serif',
          fontSize: 10,
          fontWeight: 600,
          color: '#B5A49A',
          textTransform: 'uppercase',
          letterSpacing: '.1em',
          margin: 0,
        }}>
          {children}
        </h3>
      </div>
      {action}
    </div>
  );
}
