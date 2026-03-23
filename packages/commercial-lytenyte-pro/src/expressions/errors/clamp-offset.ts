export function clampOffset(source: string, offset: number): number {
  return Math.max(0, Math.min(offset, source.length));
}
