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
  className = '' 
}: SectionLabelProps) {
  return (
    <div className={`flex items-center justify-between mb-2 ${className}`}>
      <div className="flex items-center gap-1.5">
        {icon && (
          <span className="text-[#A39080]">{icon}</span>
        )}
        <h3 className="text-[10px] font-semibold text-[#A39080] uppercase tracking-widest">
          {children}
        </h3>
      </div>
      {action}
    </div>
  );
}
