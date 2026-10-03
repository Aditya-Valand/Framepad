export const haptic = {
  light:   () => { try { navigator.vibrate?.(8); } catch {} },
  medium:  () => { try { navigator.vibrate?.(15); } catch {} },
  success: () => { try { navigator.vibrate?.([12, 50, 12]); } catch {} },
  error:   () => { try { navigator.vibrate?.([30, 40, 30]); } catch {} },
};
