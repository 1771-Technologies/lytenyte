import type { ColumnPivotSensitiveStateCore, GridCore } from "@1771technologies/grid-types/core";

export function initializePivotSensitiveState<D, E>(state: GridCore<D, E>["state"]) {
  const pivotSensitive = {
    columnGroupCenterLevels: state.internal.columnGroupCenterLevels,
    columnGroupEndLevels: state.internal.columnGroupEndLevels,
    columnGroupLevels: state.internal.columnGroupLevels,
    columnGroupStartLevels: state.internal.columnGroupStartLevels,
    columnPositions: state.internal.columnPositions,
    columnsVisible: state.internal.columnsVisible,
    columnsWithColSpan: state.internal.columnsWithColSpan,
    columnGroupExpansionState: state.columnGroupExpansionState,
    columnsWithRowSpan: state.internal.columnsWithRowSpan,
    columnVisibleCenterCount: state.internal.columnVisibleCenterCount,
    columnVisibleEndCount: state.internal.columnVisibleEndCount,
    columnVisibleStartCount: state.internal.columnVisibleStartCount,
    columnWidthDeltas: state.internal.columnWidthDeltas,
    columnGetColSpan: state.internal.columnGetColSpan,
    columnGetRowSpan: state.internal.columnGetRowSpan,

    filterModel: state.filterModel,
    sortModel: state.sortModel,
  } satisfies ColumnPivotSensitiveStateCore<D, E>;

  Object.assign(state, pivotSensitive);
}
