import { clamp, rangedBinarySearch } from "@1771technologies/js-utils";

export function getBoundStart(
  positions: Uint32Array,
  offset: number,
  overscan: number,
  minStart: number,
  maxStart: number,
) {
  return clamp(minStart, rangedBinarySearch(positions, offset) - overscan, maxStart);
}
