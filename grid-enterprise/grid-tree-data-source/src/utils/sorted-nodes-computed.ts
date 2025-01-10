import { computed, type ReadonlySignal, type Signal } from "@1771technologies/react-cascada";
import { getComparatorsForModel, makeCombinedComparator } from "@1771technologies/grid-client-sort";
import type { ApiEnterprise } from "@1771technologies/grid-types";
import type { RowNodeLeaf } from "@1771technologies/grid-types/community";

export function sortedNodesComputed<D, E>(
  api$: Signal<ApiEnterprise<D, E>>,
  nodes: ReadonlySignal<RowNodeLeaf<D>[]>,
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
    );
    const combined = makeCombinedComparator(api as any, sortModel, comparators);

    const sortedNodes = rowNodes.toSorted(combined);

    return sortedNodes;
  });

  return sortedNodes;
}
