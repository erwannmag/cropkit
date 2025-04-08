// Utility functions for cropping

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(value, max));
}

export function roundToNearest(value: number, step: number): number {
  return Math.round(value / step) * step;
}
