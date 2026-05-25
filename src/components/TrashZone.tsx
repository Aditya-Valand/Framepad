'use client';

import React from 'react';

interface TrashZoneProps {
  visible: boolean;
  targeted: boolean;
  trashRef: React.RefObject<HTMLDivElement | null>;
}

export function TrashZone({ visible, targeted, trashRef }: TrashZoneProps) {
  return (
    <div
      ref={trashRef}
      style={{
        position: 'fixed',
        bottom: 104,
        left: '50%',
        transform: `translateX(-50%) scale(${visible ? 1 : 0.6})`,
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.2s ease, transform 0.2s cubic-bezier(0.34,1.4,0.64,1)',
        pointerEvents: 'none',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 6,
        willChange: 'transform, opacity',
      }}
    >
      {/* Circle background */}
      <div
        style={{
          width: 60,
          height: 60,
          borderRadius: '50%',
          background: targeted ? 'rgba(239,68,68,0.92)' : 'rgba(20,20,20,0.72)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'background 0.18s ease, box-shadow 0.18s ease',
          boxShadow: targeted
            ? '0 0 0 4px rgba(239,68,68,0.25), 0 8px 24px rgba(239,68,68,0.3)'
            : '0 4px 20px rgba(0,0,0,0.35)',
        }}
      >
        {/* Trash can SVG with animated lid */}
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ overflow: 'visible' }}
        >
          {/* Lid group — rotates open when targeted */}
          <g
            style={{
              transformOrigin: '12px 6px',
              transform: targeted ? 'rotate(-38deg)' : 'rotate(0deg)',
              transition: 'transform 0.25s cubic-bezier(0.34,1.56,0.64,1)',
            }}
          >
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M8 6V4h8v2" />
          </g>
          {/* Body */}
          <path d="M19 6l-1 14H6L5 6" />
          <line x1="10" y1="11" x2="10" y2="17" />
          <line x1="14" y1="11" x2="14" y2="17" />
        </svg>
      </div>

      {/* Label */}
      <span
        style={{
          fontSize: 11,
          fontWeight: 600,
          color: targeted ? '#ef4444' : 'rgba(255,255,255,0.85)',
          transition: 'color 0.18s ease',
          textShadow: '0 1px 4px rgba(0,0,0,0.6)',
          letterSpacing: '0.02em',
          fontFamily: 'Inter, system-ui, sans-serif',
          whiteSpace: 'nowrap',
          userSelect: 'none',
        }}
      >
        {targeted ? 'Release to delete' : 'Drag here to delete'}
      </span>
    </div>
  );
}
