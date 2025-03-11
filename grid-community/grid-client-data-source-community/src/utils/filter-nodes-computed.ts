import { computed, type Signal } from "@1771technologies/react-cascada";
import { evaluateClientFilter } from "@1771technologies/grid-client-filter";
import type { ApiCommunity, ApiEnterprise, ColumnCommunity } from "@1771technologies/grid-types";
import type { RowNodeLeaf } from "@1771technologies/grid-types/community";

export function filterNodesComputed<D, E>(
  api$: Signal<ApiEnterprise<D, E>> | Signal<ApiCommunity<D, E>>,
  nodes: Signal<RowNodeLeaf<D>[]>,
  toDate: (value: unknown, column: ColumnCommunity<D, E>) => Date,
) {
  const filteredNodes = computed(() => {
    const api = api$.get();
    const sx = api.getState();

    const rowNodes = nodes.get();
    const filterModel = sx.filterModel.get();

    if (Object.keys(filterModel).length === 0) return rowNodes;

    const filteredNodes: RowNodeLeaf<D>[] = [];
    for (let i = 0; i < rowNodes.length; i++) {
      if (!evaluateClientFilter(api, filterModel, rowNodes[i], toDate as any)) continue;
      filteredNodes.push(rowNodes[i]);
    }

    return filteredNodes;
  });

  return filteredNodes;
}
