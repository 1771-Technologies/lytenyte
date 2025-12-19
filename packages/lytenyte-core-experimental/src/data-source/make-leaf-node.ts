import type { LeafIdFn, RowLeaf } from "@1771technologies/lytenyte-shared";

export const makeLeafNode = <T>(
  d: T,
  i: number,
  section: "top" | "center" | "bottom",
  leafIdFn: LeafIdFn<T>,
): RowLeaf<T> => ({
  kind: "leaf",
  data: d,
  id: leafIdFn(d, i, section),
});
