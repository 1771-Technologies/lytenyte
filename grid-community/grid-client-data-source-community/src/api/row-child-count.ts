import type { BlockGraph } from "@1771technologies/grid-graph";
import type { ApiEnterprise, ApiCommunity } from "@1771technologies/grid-types";
import { rowByIndex } from "./row-by-index";

export function rowChildCount<D>(r: number, graph: BlockGraph<D>) {
  return graph.rowChildCount(r);
}
