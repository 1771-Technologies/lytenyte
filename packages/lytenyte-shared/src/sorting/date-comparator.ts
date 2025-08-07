import type { SortDateComparatorOptions } from "../+types.js";

export function dateComparator(
  left: string | null,
  right: string | null,
  {
    includeTime = true,
    nullsFirst = true,
    toIsoDateString = (v) => v as string,
  }: SortDateComparatorOptions,
) {
  if (left == null && right == null) return 0;
  if (left != null && right == null) return nullsFirst ? 1 : -1;
  if (left == null && right != null) return nullsFirst ? -1 : 1;

  left = toIsoDateString(left);
  right = toIsoDateString(right);

  const leftDate = includeTime ? new Date(left!) : new Date(left!.substring(0, 10));
  const rightDate = includeTime ? new Date(right!) : new Date(right!.substring(0, 10));

  return leftDate.getTime() - rightDate.getTime();
}
