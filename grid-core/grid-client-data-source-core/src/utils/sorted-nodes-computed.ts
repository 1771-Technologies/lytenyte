import { computed, type ReadonlySignal, type Signal } from "@1771technologies/react-cascada";
import { getComparatorsForModel, makeCombinedComparator } from "@1771technologies/grid-client-sort";
import type { ApiCore, ColumnCore, RowNodeLeafCore } from "@1771technologies/grid-types/core";
import type { ApiPro } from "@1771technologies/grid-types/pro";

export function sortedNodesComputed<D, E>(
  api$: Signal<ApiPro<D, E>> | Signal<ApiCore<D, E>>,
  nodes: ReadonlySignal<RowNodeLeafCore<D>[]>,
  toDate: (value: unknown, column: ColumnCore<D, E>) => Date,
) {
  const sortedNodes = computed(() => {
    const api = api$.get();
    const sx = api.getState();

    const rowNodes = nodes.get();
    const sortModel = sx.sortModel.get();

    if (sortModel.length === 0) return rowNodes;

    const comparators = getComparatorsForModel(
      api as any,
      sortModel,
      sx.internal.columnLookup.get() as any,
      toDate as any,
    );
    const combined = makeCombinedComparator(api as any, sortModel, comparators);

    const sortedNodes = rowNodes.toSorted(combined);

    return sortedNodes;
  });

  return sortedNodes;
}
