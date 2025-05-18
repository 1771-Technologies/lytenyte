import { ROW_LEAF_KIND } from "@1771technologies/grid-constants";
import type { RowNodeLeafCore, RowPinCore } from "@1771technologies/grid-types/core";

const idCacheCenter: {
  top: Record<number, string>;
  center: Record<number, string>;
  bottom: Record<number, string>;
} = {
  top: {},
  bottom: {},
  center: {},
};

export function dataToRowNodes<D>(c: D[], pin: RowPinCore, cacheKey: "top" | "center" | "bottom") {
  const nodes: RowNodeLeafCore<D>[] = [];
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
