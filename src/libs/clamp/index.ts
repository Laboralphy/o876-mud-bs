/**
 * Return a value clamped between min and max
 * @param value - value to be clamped
 * @param min - minimum value to be clamped to
 * @param max - maximum value to be clamped to
 */
export function clamp(value: number, min: number, max: number) {
    return Math.min(Math.max(value, min), max);
}
