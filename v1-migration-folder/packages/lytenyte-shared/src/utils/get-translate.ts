const translateCache: Record<number, Record<number, string>> = {};

export function getTranslate(x: number, y: number) {
  const cached = translateCache[x]?.[y];
  if (cached) return cached;

  const v = `translate3d(${x}px, ${y}px, 0px)`;

  translateCache[x] ??= {};
  translateCache[x][y] = v;

  return v;
}
