const transformCache: Record<number, Record<number, string>> = {};

export function getTransform(x: number, y: number) {
  transformCache[x] ??= {};
  transformCache[x][y] ??= `translate3d(${x}px, ${y}px, 0px)`;

  return transformCache[x][y];
}
