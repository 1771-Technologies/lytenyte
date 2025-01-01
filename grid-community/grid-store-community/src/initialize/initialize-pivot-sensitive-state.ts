import type {
  ColumnPivotSensitiveStateCommunity,
  StateCommunity,
} from "@1771technologies/grid-types";

export function initializePivotSensitiveState<D, E>(state: StateCommunity<D, E>) {
  const pivotSensitive = {
    columnForceMountedColumnIndices: state.internal.columnForceMountedColumnIndices,
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
  } satisfies ColumnPivotSensitiveStateCommunity<D, E>;

  Object.assign(state, pivotSensitive);
}
