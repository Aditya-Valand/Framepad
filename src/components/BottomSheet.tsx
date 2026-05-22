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
        className={`fixed inset-0 bottom-[52px] z-25 transition-opacity duration-250 ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        style={{ background: 'rgba(26,23,20,0.22)', backdropFilter: 'blur(2px)', WebkitBackdropFilter: 'blur(2px)' }}
        onClick={onClose}
      />

      {/* Sheet */}
      <div
        className={`fixed inset-x-0 bottom-[52px] z-30 transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] ${
          open ? 'translate-y-0 opacity-100 pointer-events-auto' : 'translate-y-full opacity-0 pointer-events-none'
        }`}
      >
        <div
          style={{
            background: 'rgba(252,249,246,0.98)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            borderRadius: '20px 20px 0 0',
            borderTop: '0.5px solid rgba(26,23,20,0.08)',
            boxShadow: '0 -8px 48px rgba(26,23,20,0.14), 0 -1px 0 rgba(255,255,255,0.55) inset',
            maxHeight: '65vh',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Drag handle */}
          <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 0 8px' }}>
            <button
              onClick={onClose}
              aria-label="Close panel"
              style={{
                width: 36,
                height: 4,
                background: 'rgba(26,23,20,0.13)',
                borderRadius: 100,
                border: 'none',
                cursor: 'pointer',
                transition: 'background .18s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(26,23,20,0.22)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(26,23,20,0.13)')}
            />
          </div>

          {/* Scrollable content */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '2px 20px 24px',
              overscrollBehavior: 'contain',
              color: '#5C4A3A',
            }}
            className="scrollbar-hide"
          >
            {children}
          </div>
        </div>
      </div>
    </>
  );
}
