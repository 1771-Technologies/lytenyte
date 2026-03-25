// test-maps.ts

function generateRandomId(): string {
  // Fast random ID (not cryptographically secure)
  return Math.random().toString(36).slice(2, 12);
}

function generateUniqueIds(count: number): Set<string> {
  const ids = new Set<string>();
  while (ids.size < count) {
    ids.add(generateRandomId());
  }
  return ids;
}

function createMapsWithOverlap(
  size: number,
  overlapRatio: number,
): { mapA: Map<string, number>; mapB: Map<string, number> } {
  const overlapCount = Math.floor(size * overlapRatio);
  const uniqueCountPerMap = size - overlapCount;

  // Shared IDs (overlap)
  const sharedIds = generateUniqueIds(overlapCount);

  // Unique IDs for each map
  const uniqueA = generateUniqueIds(uniqueCountPerMap);
  const uniqueB = generateUniqueIds(uniqueCountPerMap);

  const mapA = new Map<string, number>();
  const mapB = new Map<string, number>();

  // Fill Map A
  let i = 0;
  for (const id of sharedIds) {
    mapA.set(id, i++);
  }
  for (const id of uniqueA) {
    mapA.set(id, i++);
  }

  // Fill Map B
  i = 0;
  for (const id of sharedIds) {
    mapB.set(id, i++);
  }
  for (const id of uniqueB) {
    mapB.set(id, i++);
  }

  return { mapA, mapB };
}
