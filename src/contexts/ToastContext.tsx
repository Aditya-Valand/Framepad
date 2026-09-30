'use client';
import { createContext, useContext, useState, useCallback, useRef, type ReactNode } from 'react';

export type ToastVariant = 'success' | 'error' | 'info';

interface Toast {
  id:      string;
  message: string;
  variant: ToastVariant;
}

interface ToastContextValue {
  toast: (message: string, variant?: ToastVariant) => void;
}

const ToastCtx = createContext<ToastContextValue>({ toast: () => {} });

export function useToast() { return useContext(ToastCtx); }

const ICONS: Record<ToastVariant, string> = {
  success: '✓',
  error:   '✕',
  info:    'i',
};

const COLORS: Record<ToastVariant, { bg: string; text: string; icon: string }> = {
  success: { bg: 'rgba(255,252,248,0.97)', text: '#1A1714', icon: '#2D7A4F' },
  error:   { bg: 'rgba(255,252,248,0.97)', text: '#1A1714', icon: '#B03030' },
  info:    { bg: 'rgba(255,252,248,0.97)', text: '#1A1714', icon: '#8B6F5C' },
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const dismiss = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
    const t = timers.current.get(id);
    if (t) { clearTimeout(t); timers.current.delete(id); }
  }, []);

  const toast = useCallback((message: string, variant: ToastVariant = 'success') => {
    const id = Math.random().toString(36).slice(2);
    setToasts(prev => [...prev.slice(-2), { id, message, variant }]); // max 3 visible
    const timer = setTimeout(() => dismiss(id), 3200);
    timers.current.set(id, timer);
  }, [dismiss]);

  return (
    <ToastCtx.Provider value={{ toast }}>
      {children}
      {/* Toast portal — fixed, top of stacking context */}
      <div
        aria-live="polite"
        aria-atomic="false"
        style={{
          position:  'fixed',
          top:       'max(env(safe-area-inset-top), 16px)',
          left:      '50%',
          transform: 'translateX(-50%)',
          zIndex:    9999,
          display:   'flex',
          flexDirection: 'column',
          gap: 8,
          pointerEvents: 'none',
          width: 'calc(100% - 32px)',
          maxWidth: 380,
        }}
      >
        {toasts.map((t) => {
          const c = COLORS[t.variant];
          return (
            <div
              key={t.id}
              role="status"
              onClick={() => dismiss(t.id)}
              style={{
                display:         'flex',
                alignItems:      'center',
                gap:             10,
                padding:         '11px 16px',
                background:      c.bg,
                border:          '0.5px solid rgba(26,23,20,0.1)',
                borderRadius:    12,
                boxShadow:       '0 4px 24px rgba(26,23,20,0.14), 0 1px 0 rgba(255,255,255,0.7) inset',
                backdropFilter:  'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                pointerEvents:   'auto',
                cursor:          'pointer',
                animation:       'toastIn 0.28s cubic-bezier(0.22,1,0.36,1) forwards',
                willChange:      'transform, opacity',
              }}
            >
              <span style={{
                width:          20, height: 20,
                borderRadius:   '50%',
                background:     `${c.icon}18`,
                display:        'flex',
                alignItems:     'center',
                justifyContent: 'center',
                fontFamily:     '"DM Mono", monospace',
                fontSize:       11,
                fontWeight:     700,
                color:          c.icon,
                flexShrink:     0,
              }}>
                {ICONS[t.variant]}
              </span>
              <span style={{
                fontFamily: '"DM Sans", sans-serif',
                fontSize:   13,
                color:      c.text,
                lineHeight: 1.4,
                flex:       1,
              }}>
                {t.message}
              </span>
            </div>
          );
        })}
      </div>
      <style>{`
        @keyframes toastIn {
          from { opacity: 0; transform: translateY(-10px) scale(0.95); }
          to   { opacity: 1; transform: translateY(0)     scale(1);    }
        }
      `}</style>
    </ToastCtx.Provider>
  );
}
