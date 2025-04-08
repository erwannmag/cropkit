// Utility functions for cropping
export function clamp(value, min, max) {
    return Math.max(min, Math.min(value, max));
}
export function roundToNearest(value, step) {
    return Math.round(value / step) * step;
}
