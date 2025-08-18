const translateCache: Record<number, Record<number | string, string>> = {};

export function getTranslate(x: number, y: number | string) {
  const cached = translateCache[x]?.[y];
  if (cached) return cached;

  const v = `translate3d(${x}px, ${typeof y === "string" ? y : `${y}px`}, 0px)`;

  translateCache[x] ??= {};
  translateCache[x][y] = v;

  return v;
}
