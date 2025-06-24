import type { Item } from "./+types";

export function getMaxDepth(columns: Item[]) {
  const maxDepth = Math.max(...columns.map((c) => c.groupPath?.length ?? 0));
  return maxDepth;
}
