import { computed, type ReadonlySignal, type Signal } from "@1771technologies/react-cascada";
import {
  columnGroups,
  columnsByPin,
  columnsVisible as columnsVisibleCalc,
  type ColumnLike,
} from "@1771technologies/grid-core";
import { itemsWithIdToMap } from "@1771technologies/js-utils";
import type { ColumnGroupRowsCore } from "@1771technologies/grid-types/core";

export function columnsVisibleState<T extends ColumnLike, B extends { hide?: boolean }>(
  columns: Signal<T[]>,
  columnBase: Signal<B>,
  columnGroupIdDelimiter: Signal<string>,
  columnGroupExpansionState: Signal<Record<string, boolean>>,
): {
  columnLookup: ReadonlySignal<Map<string, T>>;
  columnsVisible: ReadonlySignal<T[]>;
  columnVisibleCenterCount: ReadonlySignal<number>;
  columnVisibleStartCount: ReadonlySignal<number>;
  columnVisibleEndCount: ReadonlySignal<number>;
  columnGroupCenterLevels: ReadonlySignal<ColumnGroupRowsCore>;
  columnGroupEndLevels: ReadonlySignal<ColumnGroupRowsCore>;
  columnGroupStartLevels: ReadonlySignal<ColumnGroupRowsCore>;
  columnGroupLevels: ReadonlySignal<ColumnGroupRowsCore>;
} {
  const columnLookup = computed(() => itemsWithIdToMap(columns.get()));

  const columnsVisible = computed(() => {
    const c = columns.get();
    const base = columnBase.get();
    const delimiter = columnGroupIdDelimiter.get();
    const expanded = columnGroupExpansionState.get();

    return columnsVisibleCalc(c, base, (id) => !(expanded[id] ?? true), delimiter);
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
