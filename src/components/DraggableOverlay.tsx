import { useRef, useCallback, useEffect } from 'react';
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
  const dragState = useRef<{
    active: boolean;
    startX: number;
    startY: number;
    origX: number;
    origY: number;
    pointerId: number | null;
  }>({ active: false, startX: 0, startY: 0, origX: 0, origY: 0, pointerId: null });

  const gestureState = useRef<{
    active: boolean;
    startAngle: number;
    startDist: number;
    origRotation: number;
    origScale: number;
  }>({ active: false, startAngle: 0, startDist: 0, origRotation: 0, origScale: 1 });

  const pxToPercent = useCallback(
    (px: number, total: number) => (px / total) * 100,
    []
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (e.pointerType === 'touch' && dragState.current.active) return;

      e.preventDefault();
      e.stopPropagation();

      const el = elRef.current;
      if (!el) return;

      el.setPointerCapture(e.pointerId);
      dragState.current = {
        active: true,
        startX: e.clientX,
        startY: e.clientY,
        origX: x,
        origY: y,
        pointerId: e.pointerId,
      };
    },
    [x, y]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragState.current.active) return;
      if (e.pointerId !== dragState.current.pointerId) return;

      const dx = e.clientX - dragState.current.startX;
      const dy = e.clientY - dragState.current.startY;

      const newX = dragState.current.origX + pxToPercent(dx, containerW);
      const newY = dragState.current.origY + pxToPercent(dy, containerH);

      onMove(
        Math.max(-10, Math.min(110, newX)),
        Math.max(-10, Math.min(110, newY))
      );
    },
    [containerW, containerH, onMove, pxToPercent]
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (e.pointerId === dragState.current.pointerId) {
        dragState.current.active = false;
        dragState.current.pointerId = null;
      }
    },
    []
  );

  // Two-finger rotation + scale via touch events
  useEffect(() => {
    const el = elRef.current;
    if (!el) return;

    const getAngle = (t1: Touch, t2: Touch) =>
      Math.atan2(t2.clientY - t1.clientY, t2.clientX - t1.clientX) * (180 / Math.PI);

    const getDist = (t1: Touch, t2: Touch) =>
      Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        dragState.current.active = false;
        gestureState.current = {
          active: true,
          startAngle: getAngle(e.touches[0], e.touches[1]),
          startDist: getDist(e.touches[0], e.touches[1]),
          origRotation: rotation,
          origScale: scale,
        };
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!gestureState.current.active || e.touches.length < 2) return;
      e.preventDefault();

      const angle = getAngle(e.touches[0], e.touches[1]);
      const dist = getDist(e.touches[0], e.touches[1]);

      const deltaAngle = angle - gestureState.current.startAngle;
      onRotate(gestureState.current.origRotation + deltaAngle);

      const scaleFactor = dist / gestureState.current.startDist;
      onScale(Math.max(0.3, Math.min(4, gestureState.current.origScale * scaleFactor)));
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (gestureState.current.active && e.touches.length < 2) {
        gestureState.current.active = false;
      }
    };

    el.addEventListener('touchstart', onTouchStart, { passive: false });
    el.addEventListener('touchmove', onTouchMove, { passive: false });
    el.addEventListener('touchend', onTouchEnd);

    return () => {
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchmove', onTouchMove);
      el.removeEventListener('touchend', onTouchEnd);
    };
  }, [rotation, scale, onRotate, onScale]);

  return (
    <div
      ref={elRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className="absolute touch-none select-none cursor-grab active:cursor-grabbing"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        transform: `translate(-50%, -50%) rotate(${rotation}deg) scale(${scale})`,
        transformOrigin: 'center center',
        zIndex: 10,
      }}
    >
      {children}
    </div>
  );
}
