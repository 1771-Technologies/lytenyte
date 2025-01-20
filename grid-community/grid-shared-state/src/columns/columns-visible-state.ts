import { computed, type Signal } from "@1771technologies/react-cascada";
import {
  columnGroups,
  columnsByPin,
  columnsVisible as columnsVisibleCalc,
  type ColumnLike,
} from "@1771technologies/grid-core";
import { itemsWithIdToMap } from "@1771technologies/js-utils";

export function columnsVisibleState<T extends ColumnLike, B extends { hide?: boolean }>(
  columns: Signal<T[]>,
  columnBase: Signal<B>,
  columnGroupIdDelimiter: Signal<string>,
  columnGroupExpansionState: Signal<Record<string, boolean>>,
) {
  const columnLookup = computed(() => itemsWithIdToMap(columns.get()));

  const columnsVisible = computed(() => {
    const c = columns.get();
    const base = columnBase.get();
    const delimiter = columnGroupIdDelimiter.get();
    const expanded = columnGroupExpansionState.get();

    return columnsVisibleCalc(c, base, (id) => expanded[id], delimiter);
  });

  const split = computed(() => {
    return columnsByPin(columnsVisible.get());
  });

  const columnVisibleStartCount = computed(() => split.get().start.length);
  const columnVisibleCenterCount = computed(() => split.get().center.length);
  const columnVisibleEndCount = computed(() => split.get().end.length);

  const groups = computed(() => {
    const delimiter = columnGroupIdDelimiter.get();
    const columns = columnsVisible.get();

    return columnGroups(columns, delimiter);
  });

  const columnGroupStartLevels = computed(() => groups.get().startLevels);
  const columnGroupCenterLevels = computed(() => groups.get().centerLevels);
  const columnGroupEndLevels = computed(() => groups.get().endLevels);
  const columnGroupLevels = computed(() => groups.get().allLevels);

  return {
    columnLookup,
    columnsVisible,
    columnVisibleCenterCount,
    columnVisibleStartCount,
    columnVisibleEndCount,
    columnGroupCenterLevels,
    columnGroupEndLevels,
    columnGroupStartLevels,
    columnGroupLevels,
  };
}
