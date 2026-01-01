export function moveRelative<T>(items: T[], srcIndex: number, destIndex: number): T[] {
  const before = srcIndex < destIndex;
  const length = items.length;

  if (srcIndex < 0 || srcIndex >= length) return [...items];
  if (destIndex < 0 || destIndex >= length) return [...items];
  if (srcIndex === destIndex) return [...items];

  const result = [...items];
  const [item] = result.splice(srcIndex, 1);

  // After removing the item, indices may shift.
  // If we removed an element before `toIndex`, then `toIndex` decreases by 1.
  const adjustedToIndex = srcIndex < destIndex ? destIndex - 1 : destIndex;

  // Compute insertion index:
  // - isBefore true  -> insert AFTER adjustedToIndex (so +1)
  // - isBefore false -> insert BEFORE adjustedToIndex
  const insertIndex = before ? adjustedToIndex + 1 : adjustedToIndex;

  result.splice(insertIndex, 0, item);
  return result;
}
