import { useRef, useEffect, useState } from 'react';
import type { ReactNode } from 'react';

interface DraggableOverlayProps {
  children: ReactNode;
  x: number; // percent 0-100
  y: number; // percent 0-100
  rotation: number; // degrees
  scale: number; // 1 = normal
  containerW: number; // px
  containerH: number; // px
  onMove: (x: number, y: number) => void;
  onRotate: (deg: number) => void;
  onScale: (s: number) => void;
}

export function DraggableOverlay({
  children,
  x,
  y,
  rotation,
  scale,
  containerW,
  containerH,
  onMove,
  onRotate,
  onScale,
}: DraggableOverlayProps) {
  const elRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  // Keep latest props in a ref so event listeners always see fresh values
  const stateRef = useRef({ x, y, rotation, scale, containerW, containerH });
  useEffect(() => {
    stateRef.current = { x, y, rotation, scale, containerW, containerH };
  });

  // All gesture state in one ref — never stale because we read stateRef above
  const gesture = useRef({
    // single-pointer drag
    dragging: false,
    pointerId: -1,
    startClientX: 0,
    startClientY: 0,
    origX: 0,
    origY: 0,
    // two-pointer pinch/rotate
    pinching: false,
    ptr0: { id: -1, x: 0, y: 0 },
    ptr1: { id: -1, x: 0, y: 0 },
    origRotation: 0,
    origScale: 1,
    origMidX: 0,
    origMidY: 0,
    origPosX: 0,
    origPosY: 0,
  });

  const cb = useRef({ onMove, onRotate, onScale });
  useEffect(() => { cb.current = { onMove, onRotate, onScale }; });

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;

    const dist = (a: { x: number; y: number }, b: { x: number; y: number }) =>
      Math.hypot(b.x - a.x, b.y - a.y);
    const angle = (a: { x: number; y: number }, b: { x: number; y: number }) =>
      Math.atan2(b.y - a.y, b.x - a.x) * (180 / Math.PI);
    const pct = (px: number, total: number) => (px / total) * 100;

    // Active pointer tracking
    const pointers = new Map<number, { x: number; y: number }>();

    const onDown = (e: PointerEvent) => {
      e.preventDefault();
      e.stopPropagation();
      el.setPointerCapture(e.pointerId);
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      setActive(true);

      const g = gesture.current;
      const s = stateRef.current;

      if (pointers.size === 1) {
        // Single finger — start drag
        g.dragging = true;
        g.pinching = false;
        g.pointerId = e.pointerId;
        g.startClientX = e.clientX;
        g.startClientY = e.clientY;
        g.origX = s.x;
        g.origY = s.y;
      } else if (pointers.size === 2) {
        // Second finger — switch to pinch
        g.dragging = false;
        g.pinching = true;
        const pts = [...pointers.values()];
        const p0 = pts[0], p1 = pts[1];
        const ids = [...pointers.keys()];
        g.ptr0 = { id: ids[0], x: p0.x, y: p0.y };
        g.ptr1 = { id: ids[1], x: p1.x, y: p1.y };
        g.origRotation = s.rotation;
        g.origScale = s.scale;
        // mid-point at gesture start in container %
        g.origMidX = g.ptr0.x;
        g.origMidY = g.ptr0.y;
        g.origPosX = s.x;
        g.origPosY = s.y;
      }
    };

    const onMove = (e: PointerEvent) => {
      e.preventDefault();
      if (!pointers.has(e.pointerId)) return;
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

      const g = gesture.current;
      const s = stateRef.current;

      if (g.dragging && e.pointerId === g.pointerId) {
        const dx = e.clientX - g.startClientX;
        const dy = e.clientY - g.startClientY;
        const newX = Math.max(-10, Math.min(110, g.origX + pct(dx, s.containerW)));
        const newY = Math.max(-10, Math.min(110, g.origY + pct(dy, s.containerH)));
        cb.current.onMove(newX, newY);
      }

      if (g.pinching && pointers.size >= 2) {
        const pts = [...pointers.values()];
        const p0 = pts[0], p1 = pts[1];
        const initAngle = angle(g.ptr0, g.ptr1);
        const initDist = dist(g.ptr0, g.ptr1);
        const nowAngle = angle({ x: p0.x, y: p0.y }, { x: p1.x, y: p1.y });
        const nowDist = dist({ x: p0.x, y: p0.y }, { x: p1.x, y: p1.y });

        if (initDist > 1) {
          const scaleFactor = nowDist / initDist;
          cb.current.onScale(Math.max(0.15, Math.min(6, g.origScale * scaleFactor)));
        }
        const deltaAngle = nowAngle - initAngle;
        cb.current.onRotate(g.origRotation + deltaAngle);
      }
    };

    const onUp = (e: PointerEvent) => {
      pointers.delete(e.pointerId);
      const g = gesture.current;
      if (e.pointerId === g.pointerId) {
        g.dragging = false;
      }
      if (pointers.size < 2) {
        g.pinching = false;
      }
      if (pointers.size === 0) setActive(false);
    };

    el.addEventListener('pointerdown', onDown, { passive: false });
    el.addEventListener('pointermove', onMove, { passive: false });
    el.addEventListener('pointerup', onUp);
    el.addEventListener('pointercancel', onUp);

    return () => {
      el.removeEventListener('pointerdown', onDown);
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerup', onUp);
      el.removeEventListener('pointercancel', onUp);
    };
  }, []); // mount once — all state via refs

  return (
    <div
      ref={elRef}
      className="absolute touch-none select-none"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        transform: `translate(-50%, -50%) rotate(${rotation}deg) scale(${scale})`,
        transformOrigin: 'center center',
        zIndex: 10,
        cursor: active ? 'grabbing' : 'grab',
        // Smooth visual response — no layout thrash
        willChange: 'transform',
      }}
    >
      {/* Selection ring */}
      {active && (
        <div
          className="absolute inset-0 rounded pointer-events-none"
          style={{
            outline: '1.5px dashed rgba(255,255,255,0.85)',
            boxShadow: '0 0 0 1px rgba(0,0,0,0.25)',
            margin: '-4px',
          }}
        />
      )}
      {children}
    </div>
  );
}

