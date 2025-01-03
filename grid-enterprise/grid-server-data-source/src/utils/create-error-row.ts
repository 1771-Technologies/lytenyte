import { ROW_LEAF_KIND } from "@1771technologies/grid-constants";
import type { RowNodeLeaf } from "@1771technologies/grid-types/community";

const nodeCache = new Map<number, RowNodeLeaf<any>>();

export function createErrorRow<D>(index: number): RowNodeLeaf<D> {
  const row = nodeCache.get(index);
  if (row) return row;

  const freshNode = {
    id: `lng1771-error-${index}`,
    kind: ROW_LEAF_KIND,
    error: true,
    data: {} as D,
    rowIndex: index,
    rowPin: null,
  };

  nodeCache.set(index, freshNode);
  return freshNode;
}
