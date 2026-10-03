import { useCallback } from 'react';

export function useShutterEffect() {
  const trigger = useCallback(() => {
    // White flash overlay
    const flash = document.createElement('div');
    flash.style.cssText = [
      'position:fixed',
      'inset:0',
      'z-index:9999',
      'background:white',
      'pointer-events:none',
      'opacity:0.85',
      'transition:opacity 0.38s ease-out',
    ].join(';');
    document.body.appendChild(flash);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        flash.style.opacity = '0';
        setTimeout(() => flash.remove(), 400);
      });
    });

    // Shutter click via AudioContext
    try {
      const AudioCtx = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.setValueAtTime(900, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(180, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.28, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.12);
    } catch {
      // AudioContext blocked or unavailable — silent fail
    }
  }, []);

  return { trigger };
}
