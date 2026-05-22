'use client';

import type { ReactNode } from 'react';

interface Tab {
  id: string;
  label: string;
  icon?: ReactNode;
  badge?: string | number;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (id: string) => void;
  variant?: 'default' | 'pills' | 'underline';
  size?: 'sm' | 'md';
  fullWidth?: boolean;
  className?: string;
}

export function Tabs({
  tabs,
  activeTab,
  onChange,
  variant = 'default',
  size = 'md',
  fullWidth = false,
  className = '',
}: TabsProps) {
  const sizeClasses = {
    sm: 'text-xs px-2.5 py-1.5 gap-1.5',
    md: 'text-sm px-3.5 py-2 gap-2',
  };

  if (variant === 'pills') {
    return (
      <div className={`flex gap-1 p-1 bg-[#F5EDE5] rounded-xl ${className}`}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`
              flex items-center justify-center
              ${sizeClasses[size]}
              ${fullWidth ? 'flex-1' : ''}
              font-medium
              rounded-lg
              transition-all duration-150
              ${activeTab === tab.id 
                ? 'bg-white text-[#5C4A3A] shadow-sm' 
                : 'text-[#8B7B6B] hover:text-[#5C4A3A]'
              }
            `}
          >
            {tab.icon}
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span className={`
                ml-1 px-1.5 py-0.5 text-[10px] font-medium rounded-full
                ${activeTab === tab.id 
                  ? 'bg-[#8B6F5C] text-white' 
                  : 'bg-[#E8DFD6] text-[#8B7B6B]'
                }
              `}>
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>
    );
  }

  if (variant === 'underline') {
    return (
      <div className={`flex border-b border-[#E8DFD6] ${className}`}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`
              flex items-center justify-center
              ${sizeClasses[size]}
              ${fullWidth ? 'flex-1' : ''}
              font-medium
              border-b-2
              transition-all duration-150
              -mb-px
              ${activeTab === tab.id 
                ? 'border-[#8B6F5C] text-[#5C4A3A]' 
                : 'border-transparent text-[#A39080] hover:text-[#8B7B6B] hover:border-[#D4C8BC]'
              }
            `}
          >
            {tab.icon}
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span className={`
                ml-1.5 px-1.5 py-0.5 text-[10px] font-medium rounded-full
                ${activeTab === tab.id 
                  ? 'bg-[#8B6F5C] text-white' 
                  : 'bg-[#E8DFD6] text-[#8B7B6B]'
                }
              `}>
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>
    );
  }

  // Default variant
  return (
    <div className={`flex gap-1 ${className}`}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`
            flex items-center justify-center
            ${sizeClasses[size]}
            ${fullWidth ? 'flex-1' : ''}
            font-medium
            rounded-xl
            transition-all duration-150
            active:scale-95
            ${activeTab === tab.id 
              ? 'bg-[#8B6F5C] text-white shadow-sm' 
              : 'bg-[#F8F3EE] text-[#8B7B6B] hover:bg-[#F0E8E0]'
            }
          `}
        >
          {tab.icon}
          <span>{tab.label}</span>
          {tab.badge !== undefined && (
            <span className={`
              ml-1.5 px-1.5 py-0.5 text-[10px] font-medium rounded-full
              ${activeTab === tab.id 
                ? 'bg-white/20 text-white' 
                : 'bg-[#E8DFD6] text-[#8B7B6B]'
              }
            `}>
              {tab.badge}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
