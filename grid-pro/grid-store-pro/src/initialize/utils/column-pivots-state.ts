import {
  computed,
  signal,
  type ReadonlySignal,
  type Signal,
} from "@1771technologies/react-cascada";
import {
  columnGroups,
  columnsByPin,
  columnsVisible,
  type ColumnLike,
} from "@1771technologies/grid-core";
import {
  columnsComputed,
  filterModelComputed,
  sortModelComputed,
} from "@1771technologies/grid-shared-state";
import { itemsWithIdToMap } from "@1771technologies/js-utils";
import type {
  ApiPro,
  ColumnGroupRowsPro,
  GridPro,
  SortModelItemPro,
} from "@1771technologies/grid-types/pro";

export function columnPivotsState<D, E>(
  state: GridPro<D, E>["state"],
  api: ApiPro<D, E>,
): {
  columnPivotColumns: any;
  columnPivotLookup: ReadonlySignal<Map<string, { id: string }>>;
  columnPivotsLoading: Signal<boolean>;
  columnPivotFilterModel: Signal<any>;
  columnPivotSortModel: Signal<SortModelItemPro[]>;
  columnPivotGroupExpansionState: Signal<Record<string, boolean>>;
  columnPivotsVisible: ReadonlySignal<ColumnLike[]>;
  columnPivotVisibleStartCount: ReadonlySignal<number>;
  columnPivotVisibleCenterCount: ReadonlySignal<number>;
  columnPivotVisibleEndCount: ReadonlySignal<number>;
  columnPivotGroupLevels: ReadonlySignal<ColumnGroupRowsPro>;
  columnPivotGroupStartLevels: ReadonlySignal<ColumnGroupRowsPro>;
  columnPivotGroupCenterLevels: ReadonlySignal<ColumnGroupRowsPro>;
  columnPivotGroupEndLevels: ReadonlySignal<ColumnGroupRowsPro>;
} {
  const columnPivotColumns = columnsComputed([], api, true);

  const columnPivotLookup = computed(() => itemsWithIdToMap(columnPivotColumns.get()));
  const columnPivotsLoading = signal(false);

  const columnPivotFilterModel = filterModelComputed({}, api, true);
  const columnPivotSortModel = sortModelComputed([], api, true);
  const columnPivotGroupExpansionState = signal<Record<string, boolean>>({});

  const columnPivotsVisible = computed(() => {
    const columns = columnPivotColumns.get();
    const base = state.columnBase.get();
    const delimiter = state.columnGroupIdDelimiter.get();
    const expanded = columnPivotGroupExpansionState.get();

    return columnsVisible(columns, base, (id) => expanded[id], delimiter);
  });

  const columnPivotsVisibleSplit = computed(() => {
    return columnsByPin(columnPivotsVisible.get());
  });

  const columnPivotVisibleStartCount = computed(() => columnPivotsVisibleSplit.get().start.length);
  const columnPivotVisibleCenterCount = computed(
    () => columnPivotsVisibleSplit.get().center.length,
  );
  const columnPivotVisibleEndCount = computed(() => columnPivotsVisibleSplit.get().end.length);

  const columnPivotGroups = computed(() => {
    const delimiter = state.columnGroupIdDelimiter.get();
    const columns = columnPivotsVisible.get();

    return columnGroups(columns, delimiter);
  });

  const columnPivotGroupStartLevels = computed(() => columnPivotGroups.get().startLevels);
  const columnPivotGroupCenterLevels = computed(() => columnPivotGroups.get().centerLevels);
  const columnPivotGroupEndLevels = computed(() => columnPivotGroups.get().endLevels);
  const columnPivotGroupLevels = computed(() => columnPivotGroups.get().allLevels);

  return {
    columnPivotColumns,
    columnPivotLookup,
    columnPivotsLoading,
    columnPivotFilterModel,
    columnPivotSortModel,
    columnPivotGroupExpansionState,

    columnPivotsVisible,
    columnPivotVisibleStartCount,
    columnPivotVisibleCenterCount,
    columnPivotVisibleEndCount,

    columnPivotGroupLevels,
    columnPivotGroupStartLevels,
    columnPivotGroupCenterLevels,
    columnPivotGroupEndLevels,
  };
}
