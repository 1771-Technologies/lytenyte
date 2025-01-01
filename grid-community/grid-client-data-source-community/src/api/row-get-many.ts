import type { BlockGraph } from "@1771technologies/grid-graph";
import type { ApiCommunity, ApiEnterprise } from "@1771technologies/grid-types";
import type { RowNode } from "@1771technologies/grid-types/community";
import { rowByIndex } from "./row-by-index";

export function rowGetMany<D, E>(
  api: ApiEnterprise<D, E> | ApiCommunity<D, E>,
  start: number,
  end: number,
  graph: BlockGraph<D>,
  cache: Record<string, any>,
) {
  const rows: RowNode<D>[] = [];
  for (let i = start; i < end; i++) {
    const row = rowByIndex(api, i, graph, cache);
    if (row) rows.push(row);
  }

  return rows;
}
