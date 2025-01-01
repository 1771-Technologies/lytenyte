import type { RowNodeLeaf, RowPin } from "@1771technologies/grid-types/community";
import { ROW_LEAF_KIND } from "../../grid-constants/src";

const idCacheCenter: {
  top: Record<number, string>;
  center: Record<number, string>;
  bottom: Record<number, string>;
} = {
  top: {},
  bottom: {},
  center: {},
};

export function dataToRowNodes<D>(c: D[], pin: RowPin, cacheKey: "top" | "center" | "bottom") {
  const nodes: RowNodeLeaf<D>[] = [];
  const cache = idCacheCenter[cacheKey];

  for (let i = 0; i < c.length; i++) {
    cache[i] ??= `${i}-${cacheKey}`;
    const id = cache[i];

    nodes.push({
      id,
      kind: ROW_LEAF_KIND,
      data: c[i],
      rowIndex: null,
      rowPin: pin,
    });
  }

  return nodes;
}
