'use client';

import { useRef, useEffect, useState } from 'react';
import type { ReactNode } from 'react';

interface DraggableOverlayProps {
  children: ReactNode;
  x: number;        // percent 0-100
  y: number;        // percent 0-100
  rotation: number; // degrees
  scale: number;    // 1 = normal
  containerW: number; // px
  containerH: number; // px
  onMove: (x: number, y: number) => void;
  onRotate: (deg: number) => void;
  onScale: (s: number) => void;
  /** Called when a drag gesture starts/ends so parent can show/hide trash zone */
  onDragStart?: () => void;
  onDragEnd?: () => void;
  /** Called on every pointermove with raw client coords — parent uses this to hit-test trash zone */
  onDragMove?: (clientX: number, clientY: number) => void;
  /** When true, the element shrinks + fades to signal it will be deleted on release */
  overTrash?: boolean;
  /** Called when the element is released over the trash zone */
  onDelete?: () => void;
}

export function DraggableOverlay({
  children, x, y, rotation, scale, containerW, containerH,
  onMove, onRotate, onScale,
  onDragStart, onDragEnd, onDragMove,
  overTrash = false, onDelete,
}: DraggableOverlayProps) {
  const elRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  // Always-fresh props for event handlers (no stale closure)
  const stateRef = useRef({ x, y, rotation, scale, containerW, containerH });
  useEffect(() => { stateRef.current = { x, y, rotation, scale, containerW, containerH }; });
  const cbRef = useRef({ onMove, onRotate, onScale, onDragStart, onDragEnd, onDragMove });
  useEffect(() => { cbRef.current = { onMove, onRotate, onScale, onDragStart, onDragEnd, onDragMove }; });

  // Refs for delete logic (must survive inside event handlers without re-registering)
  const overTrashRef = useRef(overTrash);
  useEffect(() => { overTrashRef.current = overTrash; }, [overTrash]);
  const onDeleteRef = useRef(onDelete);
  useEffect(() => { onDeleteRef.current = onDelete; }, [onDelete]);

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;

    // Live pointer map — keyed by pointerId
    const ptrs = new Map<number, { x: number; y: number }>();

    // Gesture baseline (captured at gesture-start, never mutated during the gesture)
    const base = {
      // drag
      dragging: false,
      dragId: -1,
      startCX: 0, startCY: 0,
      origX: 0, origY: 0,
      // pinch
      pinching: false,
      pinchId0: -1, pinchId1: -1,
      initP0: { x: 0, y: 0 }, initP1: { x: 0, y: 0 },
      initDist: 0, initAngle: 0,
      origScale: 1, origRot: 0,
    };

    const getDist = (a: { x: number; y: number }, b: { x: number; y: number }) =>
      Math.hypot(b.x - a.x, b.y - a.y);
    const getAngle = (a: { x: number; y: number }, b: { x: number; y: number }) =>
      Math.atan2(b.y - a.y, b.x - a.x) * (180 / Math.PI);

    const startPinch = () => {
      const ids = [...ptrs.keys()];
      if (ids.length < 2) return;
      const s = stateRef.current;
      const p0 = ptrs.get(ids[0])!;
      const p1 = ptrs.get(ids[1])!;
      base.pinching = true;
      base.dragging = false;
      base.pinchId0 = ids[0];
      base.pinchId1 = ids[1];
      base.initP0 = { ...p0 };
      base.initP1 = { ...p1 };
      base.initDist = getDist(p0, p1);
      base.initAngle = getAngle(p0, p1);
      base.origScale = s.scale;
      base.origRot = s.rotation;
    };

    const onDown = (e: PointerEvent) => {
      e.preventDefault();
      e.stopPropagation();
      el.setPointerCapture(e.pointerId);
      ptrs.set(e.pointerId, { x: e.clientX, y: e.clientY });
      setActive(true);

      if (ptrs.size === 1) {
        const s = stateRef.current;
        base.dragging = true;
        base.pinching = false;
        base.dragId = e.pointerId;
        base.startCX = e.clientX;
        base.startCY = e.clientY;
        base.origX = s.x;
        base.origY = s.y;
        cbRef.current.onDragStart?.();
      } else if (ptrs.size === 2) {
        startPinch();
      }
    };

    const onMove = (e: PointerEvent) => {
      if (!ptrs.has(e.pointerId)) return;
      e.preventDefault();
      ptrs.set(e.pointerId, { x: e.clientX, y: e.clientY });

      const s = stateRef.current;

      if (base.dragging && e.pointerId === base.dragId) {
        const dx = e.clientX - base.startCX;
        const dy = e.clientY - base.startCY;
        cbRef.current.onMove(
          Math.max(-10, Math.min(110, base.origX + (dx / s.containerW) * 100)),
          Math.max(-10, Math.min(110, base.origY + (dy / s.containerH) * 100)),
        );
        // Report live pointer position so parent can hit-test trash zone
        cbRef.current.onDragMove?.(e.clientX, e.clientY);
      }

      if (base.pinching) {
        const p0 = ptrs.get(base.pinchId0);
        const p1 = ptrs.get(base.pinchId1);
        if (!p0 || !p1) return;

        const nowDist = getDist(p0, p1);
        const nowAngle = getAngle(p0, p1);

        if (base.initDist > 2) {
          cbRef.current.onScale(
            Math.max(0.15, Math.min(6, base.origScale * (nowDist / base.initDist))),
          );
        }
        cbRef.current.onRotate(base.origRot + (nowAngle - base.initAngle));
      }
    };

    const onUp = (e: PointerEvent) => {
      ptrs.delete(e.pointerId);
      if (e.pointerId === base.dragId) base.dragging = false;
      if (ptrs.size < 2) {
        base.pinching = false;
        // If one finger remains, restart drag from current position
        if (ptrs.size === 1) {
          const [id, pos] = [...ptrs.entries()][0];
          const s = stateRef.current;
          base.dragging = true;
          base.dragId = id;
          base.startCX = pos.x;
          base.startCY = pos.y;
          base.origX = s.x;
          base.origY = s.y;
        }
      }
      if (ptrs.size === 0) {
        setActive(false);
        // Delete if released over trash
        if (overTrashRef.current && onDeleteRef.current) {
          onDeleteRef.current();
        }
        cbRef.current.onDragEnd?.();
      }
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
  }, []);

  return (
    <div
      ref={elRef}
      className="absolute touch-none select-none"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        transform: `translate(-50%, -50%) rotate(${rotation}deg) scale(${overTrash ? scale * 0.65 : scale})`,
        transformOrigin: 'center center',
        zIndex: 10,
        cursor: active ? 'grabbing' : 'grab',
        willChange: 'transform',
        opacity: overTrash ? 0.6 : 1,
        filter: overTrash ? 'brightness(0.7) saturate(0.5)' : 'none',
        transition: overTrash
          ? 'transform 0.15s ease, opacity 0.15s ease, filter 0.15s ease'
          : 'none',
      }}
    >
      {active && !overTrash && (
        <div
          className="absolute inset-0 rounded pointer-events-none"
          style={{
            outline: '1.5px dashed rgba(255,255,255,0.85)',
            boxShadow: '0 0 0 1px rgba(0,0,0,0.25)',
            margin: '-4px',
          }}
        />
      )}
      {overTrash && (
        <div
          className="absolute inset-0 rounded pointer-events-none"
          style={{
            outline: '1.5px solid rgba(239,68,68,0.8)',
            boxShadow: '0 0 0 1px rgba(239,68,68,0.3)',
            margin: '-4px',
          }}
        />
      )}
      {children}
    </div>
  );
}

