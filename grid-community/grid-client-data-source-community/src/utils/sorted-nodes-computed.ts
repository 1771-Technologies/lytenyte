import { computed, type ReadonlySignal, type Signal } from "@1771technologies/react-cascada";
import { getComparatorsForModel, makeCombinedComparator } from "@1771technologies/grid-client-sort";
import type { ApiCommunity, ApiEnterprise, ColumnCommunity } from "@1771technologies/grid-types";
import type { RowNodeLeaf } from "@1771technologies/grid-types/core";

export function sortedNodesComputed<D, E>(
  api$: Signal<ApiEnterprise<D, E>> | Signal<ApiCommunity<D, E>>,
  nodes: ReadonlySignal<RowNodeLeaf<D>[]>,
  toDate: (value: unknown, column: ColumnCommunity<D, E>) => Date,
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
