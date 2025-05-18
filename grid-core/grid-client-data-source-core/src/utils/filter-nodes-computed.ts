import { computed, type Signal } from "@1771technologies/react-cascada";
import { evaluateClientFilter } from "@1771technologies/grid-client-filter";
import type { ApiPro } from "@1771technologies/grid-types/pro";
import type { ApiCore, ColumnCore, RowNodeLeafCore } from "@1771technologies/grid-types/core";

export function filterNodesComputed<D, E>(
  api$: Signal<ApiPro<D, E>> | Signal<ApiCore<D, E>>,
  nodes: Signal<RowNodeLeafCore<D>[]>,
  toDate: (value: unknown, column: ColumnCore<D, E>) => Date,
) {
  const filteredNodes = computed(() => {
    const api = api$.get();
    const sx = api.getState();

    const rowNodes = nodes.get();
    const filterModel = sx.filterModel.get();

    if (Object.keys(filterModel).length === 0) return rowNodes;

    const filteredNodes: RowNodeLeafCore<D>[] = [];
    for (let i = 0; i < rowNodes.length; i++) {
      if (!evaluateClientFilter(api, filterModel, rowNodes[i], toDate as any)) continue;
      filteredNodes.push(rowNodes[i]);
    }

    return filteredNodes;
  });

  return filteredNodes;
}
