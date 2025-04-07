import { computed, type ReadonlySignal, type Signal } from "@1771technologies/react-cascada";
import { getComparatorsForModel, makeCombinedComparator } from "@1771technologies/grid-client-sort";
import type { ApiPro, ColumnPro, RowNodeLeafPro } from "@1771technologies/grid-types/pro";

export function sortedNodesComputed<D, E>(
  api$: Signal<ApiPro<D, E>>,
  nodes: ReadonlySignal<RowNodeLeafPro<D>[]>,
  toDate: (value: unknown, column: ColumnPro<D, E>) => Date,
) {
  const sortedNodes = computed(() => {
    const api = api$.get();
    const sx = api.getState();

    const mode = sx.columnPivotModeIsOn.peek();

    const rowNodes = nodes.get();
    const sortModel = mode ? sx.internal.columnPivotSortModel.get() : sx.sortModel.get();

    if (sortModel.length === 0) return rowNodes;

    const comparators = getComparatorsForModel(
      api as any,
      sortModel,
      sx.internal.columnLookup.get() as any,
      toDate,
    );
    const combined = makeCombinedComparator(api as any, sortModel, comparators);

    const sortedNodes = rowNodes.toSorted(combined);

    return sortedNodes;
  });

  return sortedNodes;
}
