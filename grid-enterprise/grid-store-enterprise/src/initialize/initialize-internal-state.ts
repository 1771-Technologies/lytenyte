import { computed, signal } from "@1771technologies/react-cascada";
import type {
  ColumnEnterprise,
  StateEnterprise,
  StoreEnterprise,
} from "@1771technologies/grid-types";
import type { ColumnPin, KeyBindingString, Position } from "@1771technologies/grid-types/community";
import { type CellEditLocation } from "@1771technologies/grid-types/community";
import {
  columnPositions as columnPositionsComputed,
  columnsVisibleState,
  columnsWithSpan,
  rowIsFullWidthComputed,
  rowPositionsComputed,
  virt,
} from "@1771technologies/grid-shared-state";
import type { Target } from "@1771technologies/grid-types/enterprise";
import { type CellSelectionRect } from "@1771technologies/grid-types/enterprise";
import { rowDataSource } from "./utils/row-data-source";
import { cellSelectionSplits } from "./utils/cell-selection-splits";
import { columnPivotsState } from "./utils/column-pivots-state";

type InternalState<D, E> = StoreEnterprise<D, E>["state"]["internal"];

export function initializeInternalState<D, E>(
  state: StateEnterprise<D, E>,
  api: StoreEnterprise<D, E>["api"],
) {
  const viewportXScroll = signal(0);
  const viewportYScroll = signal(0);
  const rowRefreshCount = signal(0, {
    postUpdate: () => {
      api.cellEditEndAll(true);
    },
  });

  const {
    columnsVisible,
    columnGroupCenterLevels,
    columnGroupEndLevels,
    columnGroupLevels,
    columnGroupStartLevels,
    columnLookup,
    columnVisibleCenterCount,
    columnVisibleEndCount,
    columnVisibleStartCount,
  } = columnsVisibleState(
    state.columns,
    state.columnBase,
    state.columnGroupIdDelimiter,
    state.columnGroupExpansionState,
  );

  const viewportInnerWidth = signal(0);
  const { columnPositions, columnWidthDeltas } = columnPositionsComputed(
    columnsVisible,
    state.columnBase,
    viewportInnerWidth,
  );

  const { columnGetColSpan, columnGetRowSpan, columnsWithColSpan, columnsWithRowSpan } =
    columnsWithSpan(columnsVisible, state.columnBase, api);

  const { rowPositions, rowDetailHeight } = rowPositionsComputed(state, api);
  const { rowBackingDataSource, rowTopCount, rowCount, rowBottomCount, paginatePageCount } =
    rowDataSource(state, api);

  const {
    columnPivotColumns,
    columnPivotFilterModel,
    columnPivotGroupCenterLevels,
    columnPivotGroupEndLevels,
    columnPivotGroupLevels,
    columnPivotGroupStartLevels,
    columnPivotLookup,
    columnPivotSortModel,
    columnPivotVisibleCenterCount,
    columnPivotVisibleEndCount,
    columnPivotVisibleStartCount,
    columnPivotsLoading,
    columnPivotsVisible,
    columnPivotForceMountedColumnIndices,
    columnPivotGroupExpansionState,
  } = columnPivotsState(state, api);

  const { columnPositions: columnPivotPositions, columnWidthDeltas: columnPivotWidthDeltas } =
    columnPositionsComputed(columnPivotsVisible, state.columnBase, viewportInnerWidth);

  const {
    columnsWithColSpan: columnPivotsWithColSpan,
    columnsWithRowSpan: columnPivotsWithRowSpan,
    columnGetColSpan: columnPivotsGetColSpan,
    columnGetRowSpan: columnPivotsGetRowSpan,
  } = columnsWithSpan(columnPivotsVisible, state.columnBase, api);

  const v = virt(api);

  const s = {
    cellEditActiveEdits: signal(new Map()),
    cellEditActiveEditValues: signal(new Map()),
    cellEditActiveInitialValues: signal(new Map()),
    cellEditActiveLocation: signal<CellEditLocation | null>(null),

    cellSelectionAdditiveRects: signal<CellSelectionRect[] | null>(null),
    cellSelectionFlashOn: signal(false),
    cellSelectionIsDeselect: signal(false),
    cellSelectionPivot: signal<CellSelectionRect | null>(null),
    cellSelectionSplits: cellSelectionSplits(state),

    columnMenuColumn: signal<ColumnEnterprise<D, E> | null>(null),
    columnMenuTarget: signal<Target | null>(null),

    contextMenuTarget: signal<Target | null>(null),

    columnManagerTreeExpansions: signal<Record<string, boolean>>({}),
    columnManagerBoxExpansions: signal({
      // TS WTF
      columnPivots: true as boolean,
      measures: true as boolean,
      rowGroups: true as boolean,
      values: true as boolean,
    }),
    columnLookup,
    columnsVisible,
    columnVisibleCenterCount,
    columnVisibleEndCount,
    columnVisibleStartCount,

    columnGroupCenterLevels,
    columnGroupEndLevels,
    columnGroupStartLevels,
    columnGroupLevels,

    columnWidthDeltas,
    columnPositions: columnPositions,

    columnPivotColumns,
    columnPivotFilterModel,
    columnPivotLookup,
    columnPivotsLoading,
    columnPivotSortModel,
    columnPivotVisibleCenterCount,
    columnPivotVisibleEndCount,
    columnPivotVisibleStartCount,
    columnPivotForceMountedColumnIndices,
    columnPivotPositions,
    columnPivotWidthDeltas,
    columnPivotsGetColSpan,
    columnPivotsGetRowSpan,
    columnPivotsWithColSpan,
    columnPivotsWithRowSpan,
    columnPivotGroupExpansionState,

    columnPivotGroupStartLevels,
    columnPivotGroupCenterLevels,
    columnPivotGroupEndLevels,
    columnPivotGroupLevels,
    columnPivotsVisible,

    columnGetRowSpan: columnGetRowSpan,
    columnGetColSpan: columnGetColSpan,
    columnsWithColSpan: columnsWithColSpan,
    columnsWithRowSpan: columnsWithRowSpan,

    columnFirstVisible: signal(-1),
    columnLastVisible: signal(-1),

    columnMoveActive: signal(false),
    columnMoveIds: signal<string[]>([]),
    columnMoveLockedByRange: signal(false),
    columnMoveOverColumn: signal<ColumnEnterprise<D, E> | null>(null),
    columnMoveOverIndex: signal(-1),
    columnMoveOverlayHeight: signal(0),
    columnMoveOverPin: signal<ColumnPin>(null),
    columnMovePin: signal<ColumnPin>(null),

    columnResizeIsActive: signal(false),

    navigatePosition: signal<Position | null>(null),

    paginatePageCount,

    fieldCacheRef: { "quick-search": {}, column: {}, group: {}, pivot: {} },

    filterMenuColumn: signal<ColumnEnterprise<D, E> | null>(null),
    filterMenuTarget: signal<Target | null>(null),

    floatingFrameOpen: signal<string | null>(null),

    panelFrameOpen: signal<string | null>(null),

    keyBindingIdToKey: computed<Record<string, KeyBindingString[]>>(() => {
      return {};
    }),

    rowRefreshCount,
    rowBackingDataSource,
    rowCount,
    rowBottomCount,
    rowTopCount,
    rowPositions,
    rowDetailHeight,

    rowDragStartIndex: signal(-1),
    rowDragOverIndex: signal(-1),

    rowIsFullWidthInternal: rowIsFullWidthComputed(state, api),

    rowFirstVisible: signal(-1),
    rowLastVisible: signal(-1),

    rowSelectionLastWasDeselect: signal(false),
    rowSelectionPivotIndex: signal<number | null>(null),

    rowUpdateStack: signal([]) as unknown as InternalState<D, E>["rowUpdateStack"],
    rowUpdateStackPointer: signal(-1),

    virtBounds: v.virtBounds,
    virtLayout: v.virtLayout,

    viewport: signal<HTMLElement | null>(null),
    viewportInnerHeight: signal(0),
    viewportInnerWidth: signal(0),
    viewportOuterHeight: signal(0),
    viewportOuterWidth: signal(0),
    viewportHeaderHeight: signal(0),
    viewportXScroll,
    viewportYScroll,
    viewportHasXScroll: computed(() => viewportXScroll.get() > 0),
    viewportHasYScroll: computed(() => viewportYScroll.get() > 0),
  } satisfies StoreEnterprise<D, E>["state"]["internal"];

  Object.assign(state, { internal: s });
}
