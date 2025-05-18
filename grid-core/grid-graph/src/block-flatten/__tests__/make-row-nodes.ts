import { ROW_GROUP_KIND, ROW_LEAF_KIND } from "@1771technologies/grid-constants";
import type { RowNodeGroupCore, RowNodeLeafCore } from "@1771technologies/grid-types/core";

export function makeRowNodes(n: number, offset: number) {
  return Array.from(
    {
      length: n,
    },
    (_, i) => {
      return {
        data: { i: i + offset },
        id: `${i + offset}`,
        kind: ROW_LEAF_KIND,
        rowIndex: null,
        rowPin: null,
      } satisfies RowNodeLeafCore<any>;
    },
  );
}

export function makeLeafNode(s: string) {
  return {
    kind: ROW_LEAF_KIND,
    data: {},
    id: s,
    rowIndex: null,
    rowPin: null,
  } satisfies RowNodeLeafCore<any>;
}

export function makeGroupNode(s: string, path: string) {
  return {
    kind: ROW_GROUP_KIND,
    data: {},
    pathKey: path,
    id: s,
    rowIndex: null,
  } satisfies RowNodeGroupCore;
}
