import type { SortNumberComparatorOptions } from "../+types.js";

export function numberComparator(
  left: number | null,
  right: number | null,
  { nullsFirst = false, absoluteValue = false }: SortNumberComparatorOptions,
) {
  if (left === right) return 0;
  if (left != null && right == null) return nullsFirst ? 1 : -1;
  if (left == null && right != null) return nullsFirst ? -1 : 1;

  if (Number.isNaN(left) && Number.isNaN(right)) return 0;
  if (Number.isNaN(left) && !Number.isNaN(right)) return 1;
  if (!Number.isNaN(left) && Number.isNaN(right)) return -1;

  const res = absoluteValue ? Math.abs(left!) - Math.abs(right!) : left! - right!;
  if (Number.isNaN(res)) {
    if (typeof left === "number") return -1;
    else return 1;
  }

  return res;
}
