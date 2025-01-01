import { rangedBinarySearch } from "@1771technologies/js-utils";

export function getBoundEnd(
  positions: Uint32Array,
  offset: number,
  maxCount: number,
  space: number,
  overscan: number,
) {
  // We always go 1 past the end until the max count.
  return Math.min(maxCount, rangedBinarySearch(positions, offset + space) + overscan + 1);
}
