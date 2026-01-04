export function moveRelative<T>(
  items: T[],
  srcIndex: number,
  destIndex: number,
  additional: number[] = [],
): T[] {
  if (additional.includes(destIndex)) return items;

  const length = items.length;

  if (srcIndex < 0 || srcIndex >= length) return [...items];
  if (destIndex < 0 || destIndex >= length) return [...items];
  if (srcIndex === destIndex) return [...items];

  const itemsToFilter = [srcIndex, ...additional].sort((l, r) => l - r);

  const set = new Set(itemsToFilter.map((x) => items[x]));

  const result = items.filter((x) => !set.has(x));

  const dest = items[destIndex];
  const newTarget = result.indexOf(dest);

  result.splice(
    newTarget + (srcIndex < destIndex ? 1 : 0),
    0,
    ...[srcIndex, ...additional].sort((l, r) => l - r).map((x) => items[x]),
  );
  return result;
}
