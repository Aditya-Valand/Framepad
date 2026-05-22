'use client';

import type { ReactNode } from 'react';

interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}

export function BottomSheet({ open, onClose, children }: BottomSheetProps) {
  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bottom-[52px] z-25 bg-[#5C4A3A]/20 backdrop-blur-[2px] transition-opacity duration-300 ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Sheet */}
      <div
        className={`fixed inset-x-0 bottom-[52px] z-30 transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] ${
          open ? 'translate-y-0 opacity-100 pointer-events-auto' : 'translate-y-full opacity-0 pointer-events-none'
        }`}
      >
        <div className="bg-[#FFFCF8] rounded-t-2xl shadow-[0_-8px_40px_rgba(92,74,58,0.12)] border-t border-[#F0E6DA] max-h-[65vh] flex flex-col">
          {/* Handle */}
          <div className="flex justify-center pt-2.5 pb-1.5">
            <button
              onClick={onClose}
              className="w-9 h-1 bg-[#E0D5C9] rounded-full active:bg-[#D4C5B5] transition-colors"
              aria-label="Close panel"
            />
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-5 pb-5 overscroll-contain text-[#5C4A3A]">
            {children}
          </div>
        </div>
      </div>
    </>
  );
}
