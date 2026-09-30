'use client';

import { useRef, useEffect, useCallback, type ReactNode } from 'react';
import { createSpring, prefersReducedMotion } from '@/lib/motion/springs';

interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  /** Max height as a fraction of viewport height. Default 0.72 */
  maxHeight?: number;
}

/**
 * Spring-physics bottom sheet with 1:1 finger-drag tracking and swipe-to-dismiss.
 * Animates only `transform` (GPU-composited). No layout shifts.
 */
export function BottomSheet({ open, onClose, children, maxHeight = 0.72 }: BottomSheetProps) {
  const sheetRef   = useRef<HTMLDivElement>(null);
  const backdropRef= useRef<HTMLDivElement>(null);
  const cancelSpring = useRef<(() => void) | null>(null);
  const simulate   = createSpring({ stiffness: 300, damping: 32, mass: 1 });

  // ── Animate sheet to a target Y (0 = fully open, height = closed) ──
  const animateTo = useCallback((targetY: number, fromY?: number, vel = 0) => {
    if (!sheetRef.current) return;
    const el     = sheetRef.current;
    const height = el.offsetHeight;
    const start  = fromY ?? (open ? 0 : height);

    if (cancelSpring.current) cancelSpring.current();

    if (prefersReducedMotion()) {
      el.style.transform = `translateY(${targetY}px)`;
      if (backdropRef.current)
        backdropRef.current.style.opacity = String(targetY === 0 ? 1 : 0);
      return;
    }

    cancelSpring.current = simulate(start, targetY, vel, (y, done) => {
      el.style.transform = `translateY(${y}px)`;
      if (backdropRef.current) {
        const progress = 1 - y / height;
        backdropRef.current.style.opacity = String(Math.max(0, Math.min(1, progress)));
      }
    });
  }, [open, simulate]);

  // ── Open / close transitions ──────────────────────────────────
  useEffect(() => {
    const el = sheetRef.current;
    if (!el) return;
    const height = el.offsetHeight;

    if (open) {
      // Start below screen, spring to 0
      el.style.transform = `translateY(${height}px)`;
      el.style.visibility = 'visible';
      if (backdropRef.current) backdropRef.current.style.display = 'block';
      requestAnimationFrame(() => animateTo(0, height));
    } else {
      animateTo(height, undefined, 0);
      setTimeout(() => {
        if (!open && sheetRef.current) {
          sheetRef.current.style.visibility = 'hidden';
          if (backdropRef.current) backdropRef.current.style.display = 'none';
        }
      }, 380);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // ── Drag-to-dismiss ───────────────────────────────────────────
  const dragState = useRef({ startY: 0, lastY: 0, vel: 0, dragging: false, time: 0 });

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    // Only respond to drags starting on the handle / header area
    const target = e.target as HTMLElement;
    if (!target.closest('[data-sheet-handle]')) return;

    dragState.current = { startY: e.clientY, lastY: e.clientY, vel: 0, dragging: true, time: Date.now() };
    if (cancelSpring.current) cancelSpring.current();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragState.current.dragging || !sheetRef.current) return;
    const dy   = Math.max(0, e.clientY - dragState.current.startY); // resist upward drag
    const now  = Date.now();
    const dt   = now - dragState.current.time || 16;
    dragState.current.vel = (e.clientY - dragState.current.lastY) / dt * 1000;
    dragState.current.lastY = e.clientY;
    dragState.current.time  = now;

    sheetRef.current.style.transform = `translateY(${dy}px)`;
    if (backdropRef.current) {
      const height   = sheetRef.current.offsetHeight;
      const progress = 1 - dy / height;
      backdropRef.current.style.opacity = String(Math.max(0, progress));
    }
  }, []);

  const onPointerUp = useCallback((e: React.PointerEvent) => {
    if (!dragState.current.dragging || !sheetRef.current) return;
    dragState.current.dragging = false;

    const el     = sheetRef.current;
    const height = el.offsetHeight;
    const dy     = Math.max(0, e.clientY - dragState.current.startY);
    const vel    = dragState.current.vel;

    // Dismiss if dragged >40% of height or flicked down fast
    const shouldDismiss = dy > height * 0.38 || vel > 600;
    if (shouldDismiss) {
      animateTo(height, dy, vel);
      setTimeout(onClose, 260);
    } else {
      animateTo(0, dy, vel);
    }
  }, [animateTo, onClose]);

  return (
    <>
      {/* Backdrop */}
      <div
        ref={backdropRef}
        onPointerDown={onClose}
        style={{
          position:       'fixed',
          inset:          0,
          bottom:         52,
          zIndex:         25,
          background:     'rgba(26,23,20,0.28)',
          backdropFilter: 'blur(3px)',
          WebkitBackdropFilter: 'blur(3px)',
          display:        open ? 'block' : 'none',
          opacity:        open ? 1 : 0,
          transition:     'none', // spring-driven
        }}
      />

      {/* Sheet */}
      <div
        ref={sheetRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        style={{
          position:   'fixed',
          insetInline: 0,
          bottom:      52,
          zIndex:      30,
          visibility:  open ? 'visible' : 'hidden',
          transform:   'translateY(100%)',
          willChange:  'transform',
          touchAction: 'none',
        }}
      >
        <div
          style={{
            background:          'rgba(252,249,246,0.98)',
            backdropFilter:      'blur(28px)',
            WebkitBackdropFilter:'blur(28px)',
            borderRadius:        '22px 22px 0 0',
            borderTop:           '0.5px solid rgba(26,23,20,0.07)',
            boxShadow:           '0 -8px 56px rgba(26,23,20,0.16), 0 -1px 0 rgba(255,255,255,0.6) inset',
            maxHeight:           `${maxHeight * 100}vh`,
            display:             'flex',
            flexDirection:       'column',
          }}
        >
          {/* Drag handle — the touch target for swipe-to-dismiss */}
          <div
            data-sheet-handle
            style={{
              display:       'flex',
              justifyContent:'center',
              padding:       '12px 0 6px',
              cursor:        'grab',
              touchAction:   'none',
              userSelect:    'none',
            }}
          >
            <div
              style={{
                width:        40,
                height:       4,
                background:   'rgba(26,23,20,0.14)',
                borderRadius: 100,
                transition:   'background .18s',
              }}
            />
          </div>

          {/* Scrollable content — separate from drag handle */}
          <div
            style={{
              flex:             1,
              overflowY:        'auto',
              padding:          '2px 20px max(24px, env(safe-area-inset-bottom))',
              overscrollBehavior:'contain',
              color:             '#5C4A3A',
              WebkitOverflowScrolling: 'touch',
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
