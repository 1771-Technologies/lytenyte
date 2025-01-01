import { computed } from "@1771technologies/cascada";
import type {
  ColumnPivotSensitiveStateEnterprise,
  StateEnterprise,
} from "@1771technologies/grid-types";

export function initializePivotSensitiveState<D, E>(state: StateEnterprise<D, E>) {
  const normalExpansionState = state.columnGroupExpansionState;
  const normalFilterModel = state.filterModel;
  const normalSortModel = state.sortModel;

  const pivotSensitive = {
    filterModel: computed(
      () => {
        const mode = state.columnPivotModeIsOn.get();

        return mode ? state.internal.columnPivotFilterModel.get() : normalFilterModel.get();
      },
      (v) => {
        const mode = state.columnPivotModeIsOn.peek();

        if (mode) state.internal.columnPivotFilterModel.set(v);
        else normalFilterModel.set(v);
      },
    ),
    sortModel: computed(
      () => {
        const mode = state.columnPivotModeIsOn.get();

        return mode ? state.internal.columnPivotSortModel.get() : normalSortModel.get();
      },
      (v) => {
        const mode = state.columnPivotModeIsOn.peek();

        if (mode) state.internal.columnPivotSortModel.set(v);
        else normalSortModel.set(v);
      },
    ),

    columnForceMountedColumnIndices: computed(() => {
      const mode = state.columnPivotModeIsOn.get();

      return mode
        ? state.internal.columnPivotForceMountedColumnIndices.get()
        : state.internal.columnForceMountedColumnIndices.get();
    }),
    columnGroupExpansionState: computed(
      () => {
        const mode = state.columnPivotModeIsOn.get();

        return mode
          ? state.internal.columnPivotGroupExpansionState.get()
          : normalExpansionState.get();
      },
      (v) => {
        const mode = state.columnPivotModeIsOn.peek();

        if (mode) state.internal.columnPivotGroupExpansionState.set(v);
        else normalExpansionState.set(v);
      },
    ),
    columnGroupCenterLevels: computed(() => {
      const mode = state.columnPivotModeIsOn.get();

      return mode
        ? state.internal.columnPivotGroupCenterLevels.get()
        : state.internal.columnGroupCenterLevels.get();
    }),
    columnGroupEndLevels: computed(() => {
      const mode = state.columnPivotModeIsOn.get();

      return mode
        ? state.internal.columnPivotGroupEndLevels.get()
        : state.internal.columnGroupEndLevels.get();
    }),
    columnGroupLevels: computed(() => {
      const mode = state.columnPivotModeIsOn.get();

      return mode
        ? state.internal.columnPivotGroupLevels.get()
        : state.internal.columnGroupLevels.get();
    }),
    columnGroupStartLevels: computed(() => {
      const mode = state.columnPivotModeIsOn.get();

      return mode
        ? state.internal.columnPivotGroupStartLevels.get()
        : state.internal.columnGroupStartLevels.get();
    }),
    columnPositions: computed(() => {
      const mode = state.columnPivotModeIsOn.get();

      return mode
        ? state.internal.columnPivotPositions.get()
        : state.internal.columnPositions.get();
    }),
    columnsVisible: computed(() => {
      const mode = state.columnPivotModeIsOn.get();

      return mode ? state.internal.columnPivotsVisible.get() : state.internal.columnsVisible.get();
    }),
    columnsWithColSpan: computed(() => {
      const mode = state.columnPivotModeIsOn.get();

      return mode
        ? state.internal.columnPivotsWithColSpan.get()
        : state.internal.columnsWithColSpan.get();
    }),
    columnGetColSpan: computed(() => {
      const mode = state.columnPivotModeIsOn.get();

      return mode
        ? state.internal.columnPivotsGetColSpan.get()
        : state.internal.columnGetColSpan.get();
    }),
    columnsWithRowSpan: computed(() => {
      const mode = state.columnPivotModeIsOn.get();

      return mode
        ? state.internal.columnPivotsWithRowSpan.get()
        : state.internal.columnsWithRowSpan.get();
    }),
    columnGetRowSpan: computed(() => {
      const mode = state.columnPivotModeIsOn.get();

      return mode
        ? state.internal.columnPivotsGetRowSpan.get()
        : state.internal.columnGetRowSpan.get();
    }),
    columnVisibleCenterCount: computed(() => {
      const mode = state.columnPivotModeIsOn.get();

      return mode
        ? state.internal.columnPivotVisibleCenterCount.get()
        : state.internal.columnVisibleCenterCount.get();
    }),
    columnVisibleEndCount: computed(() => {
      const mode = state.columnPivotModeIsOn.get();
      return mode
        ? state.internal.columnPivotVisibleEndCount.get()
        : state.internal.columnVisibleEndCount.get();
    }),
    columnVisibleStartCount: computed(() => {
      const mode = state.columnPivotModeIsOn.get();

      return mode
        ? state.internal.columnPivotVisibleStartCount.get()
        : state.internal.columnVisibleStartCount.get();
    }),
    columnWidthDeltas: computed(
      () => {
        const mode = state.columnPivotModeIsOn.get();

        return mode
          ? state.internal.columnPivotWidthDeltas.get()
          : state.internal.columnWidthDeltas.get();
      },
      (v) => {
        const mode = state.columnPivotModeIsOn.peek();

        if (mode) state.internal.columnPivotWidthDeltas.set(v);
        else state.internal.columnWidthDeltas.set(v);
      },
    ),
  } satisfies ColumnPivotSensitiveStateEnterprise<D, E>;

  Object.assign(state, pivotSensitive);
}
