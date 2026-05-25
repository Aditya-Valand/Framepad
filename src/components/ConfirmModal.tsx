'use client';

import { useEffect, useRef } from 'react';

interface ConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'default';
}

export function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  message = '',
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'default',
}: ConfirmModalProps) {
  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!open) return null;

  const isDanger = variant === 'danger';

  return (
    <div
      ref={backdropRef}
      onClick={(e) => { if (e.target === backdropRef.current) onClose(); }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(26, 23, 20, 0.4)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        animation: 'fadeIn .15s ease',
      }}
    >
      <div
        style={{
          background: '#FFFCF8',
          borderRadius: 16,
          padding: '28px 28px 22px',
          maxWidth: 380,
          width: '90%',
          boxShadow: '0 20px 60px rgba(26,23,20,0.18), 0 2px 8px rgba(26,23,20,0.08)',
          border: '0.5px solid rgba(26,23,20,0.08)',
          animation: 'scaleIn .18s ease',
        }}
      >
        {/* Icon */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
          <div style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            background: isDanger ? 'rgba(200,60,60,0.08)' : 'rgba(139,111,92,0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            {isDanger ? (
              <svg width="22" height="22" fill="none" stroke="#C83C3C" viewBox="0 0 24 24" strokeWidth="1.7">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              </svg>
            ) : (
              <svg width="22" height="22" fill="none" stroke="#8B6F5C" viewBox="0 0 24 24" strokeWidth="1.7">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
          </div>
        </div>

        {/* Title */}
        <h3 style={{
          fontFamily: '"Cormorant Garamond", serif',
          fontSize: 22,
          fontWeight: 500,
          color: '#1A1714',
          textAlign: 'center',
          margin: '0 0 8px',
          lineHeight: 1.3,
        }}>
          {title}
        </h3>

        {/* Message */}
        {message && (
          <p style={{
            fontFamily: '"DM Sans", sans-serif',
            fontSize: 13,
            color: '#5C4A3A',
            textAlign: 'center',
            margin: '0 0 24px',
            lineHeight: 1.5,
          }}>
            {message}
          </p>
        )}

        {/* Buttons */}
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: '11px 16px',
              borderRadius: 10,
              border: '0.5px solid rgba(26,23,20,0.12)',
              background: 'transparent',
              color: '#5C4A3A',
              fontFamily: '"DM Sans", sans-serif',
              fontSize: 13,
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all .15s ease',
            }}
          >
            {cancelLabel}
          </button>
          <button
            onClick={() => { onConfirm(); onClose(); }}
            style={{
              flex: 1,
              padding: '11px 16px',
              borderRadius: 10,
              border: 'none',
              background: isDanger ? '#C83C3C' : '#8B6F5C',
              color: '#fff',
              fontFamily: '"DM Sans", sans-serif',
              fontSize: 13,
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all .15s ease',
              boxShadow: isDanger
                ? '0 2px 8px rgba(200,60,60,0.3)'
                : '0 2px 8px rgba(139,111,92,0.3)',
            }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.95) } to { opacity: 1; transform: scale(1) } }
      `}</style>
    </div>
  );
}
