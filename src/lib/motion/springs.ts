/**
 * Polamuse motion tokens — single source of truth for all animation timings.
 * GPU-safe: animate only transform + opacity.
 * Respects prefers-reduced-motion via CSS and the `reduced` flag.
 */

export const springs = {
  /** Immediate feedback: button presses, toggles (<100ms) */
  micro: { duration: 80,  easing: 'cubic-bezier(0.4, 0, 0.2, 1)' },
  /** Component transitions: bottom sheets, modals (180-320ms) */
  sheet: { duration: 320, easing: 'cubic-bezier(0.32, 0.72, 0,   1)' },
  /** Emotional moments: polaroid reveal, success states (400-600ms) */
  reveal: { duration: 520, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' },
  /** Page crossfades */
  page:  { duration: 220, easing: 'cubic-bezier(0.4, 0, 0.2, 1)' },
} as const;

export type SpringName = keyof typeof springs;

/** Returns true when the user prefers reduced motion */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Minimal spring simulation for JS-driven animations (bottom sheets, drag release).
 * stiffness ~170, damping ~26 gives a natural "settle" without bounce.
 */
export function createSpring(opts: {
  stiffness?: number;
  damping?: number;
  mass?: number;
}) {
  const k  = opts.stiffness ?? 170;
  const c  = opts.damping   ?? 26;
  const m  = opts.mass      ?? 1;

  return function simulate(
    from: number,
    to:   number,
    velocity: number,
    onTick: (value: number, done: boolean) => void,
  ): () => void {
    let pos = from;
    let vel = velocity;
    let raf = 0;
    let lastTime = performance.now();

    function tick(now: number) {
      const dt = Math.min((now - lastTime) / 1000, 0.064); // cap at 64ms
      lastTime  = now;

      const force = -k * (pos - to) - c * vel;
      vel += (force / m) * dt;
      pos += vel * dt;

      const done = Math.abs(pos - to) < 0.5 && Math.abs(vel) < 0.5;
      onTick(done ? to : pos, done);
      if (!done) raf = requestAnimationFrame(tick);
    }

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  };
}
