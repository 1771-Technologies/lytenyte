import { computed, type Signal } from "@1771technologies/react-cascada";
import { evaluateClientFilter } from "@1771technologies/grid-client-filter";
import { evaluateQuickFilter } from "@1771technologies/grid-core-enterprise";
import { hasUppercaseLetter } from "@1771technologies/js-utils";
import type { ApiPro, ColumnPro, RowNodeLeafPro } from "@1771technologies/grid-types/pro";

export function filterNodesComputed<D, E>(
  api$: Signal<ApiPro<D, E>>,
  nodes: Signal<RowNodeLeafPro<D>[]>,

  toDate: (value: unknown, column: ColumnPro<D, E>) => Date,
) {
  const filteredNodes = computed(() => {
    const api = api$.get();
    const sx = api.getState();

    const mode = sx.columnPivotModeIsOn.get();
    const rowNodes = nodes.get();
    const filterModel = mode ? sx.internal.columnPivotFilterModel.get() : sx.filterModel.get();
    const quickFilter = sx.filterQuickSearch.get() ?? "";

    if (Object.keys(filterModel).length === 0 && !quickFilter) return rowNodes;

    const visible = sx.columnsVisible.get();
    const columnsWithQuickFilter = visible.filter((c) => c.filterSupportsQuickSearch);

    const caseSensitive = hasUppercaseLetter(quickFilter);
    const filteredNodes: RowNodeLeafPro<D>[] = [];
    for (let i = 0; i < rowNodes.length; i++) {
      if (!evaluateClientFilter(api, filterModel, rowNodes[i], toDate)) continue;
      console.log(quickFilter);
      if (quickFilter) {
        if (
          !evaluateQuickFilter(api, columnsWithQuickFilter, quickFilter, rowNodes[i], caseSensitive)
        )
          continue;
      }
      filteredNodes.push(rowNodes[i]);
    }

    return filteredNodes;
  });

  return filteredNodes;
}
