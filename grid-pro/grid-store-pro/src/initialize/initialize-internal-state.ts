import { computed, signal } from "@1771technologies/react-cascada";
import {
  cellFocusQueue,
  columnPositions as columnPositionsComputed,
  columnsVisibleState,
  columnsWithSpan,
  rowIsFullWidthComputed,
  rowPositionsComputed,
  virt,
} from "@1771technologies/grid-shared-state";
import { rowDataSource } from "./utils/row-data-source";
import { cellSelectionSplits } from "./utils/cell-selection-splits";
import { columnPivotsState } from "./utils/column-pivots-state";
import type {
  CellEditLocationPro,
  CellSelectionRectPro,
  ColumnHeaderRendererPro,
  ColumnPinPro,
  ColumnPro,
  GridPro,
  PositionPro,
  TargetPro,
} from "@1771technologies/grid-types/pro";

type InternalState<D, E> = GridPro<D, E>["state"]["internal"];

export function initializeInternalState<D, E>(
  state: GridPro<D, E>["state"],
  api: GridPro<D, E>["api"],
) {
  const viewportXScroll = signal(0);
  const viewportYScroll = signal(0);
  const rowRefreshCount = signal(0);

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
    cellEditActiveLocation: signal<CellEditLocationPro | null>(null),

    cellSelectionAdditiveRects: signal<CellSelectionRectPro[] | null>(null),
    cellSelectionFlashOn: signal(false),
    cellSelectionIsDeselect: signal(false),
    cellSelectionPivot: signal<CellSelectionRectPro | null>(null),
    cellSelectionSplits: cellSelectionSplits(state),

    columnMenuColumn: signal<ColumnPro<D, E> | null>(null),
    columnMenuTarget: signal<TargetPro | null>(null),

    contextMenuTarget: signal<TargetPro | null>(null),

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

    columnMoveActive: signal(false),
    columnMoveIds: signal<string[]>([]),
    columnMoveLockedByRange: signal(false),
    columnMoveOverColumn: signal<ColumnPro<D, E> | null>(null),
    columnMoveOverIndex: signal(-1),
    columnMoveOverlayHeight: signal(0),
    columnMoveOverPin: signal<ColumnPinPro>(null),
    columnMovePin: signal<ColumnPinPro>(null),

    columnResizeIsActive: signal(false),
    columnHeaderDefaultRenderer: signal<ColumnHeaderRendererPro<D, E> | null>(null),

    cellFocusQueue: cellFocusQueue(),
    navigatePosition: signal<PositionPro | null>(null),

    paginatePageCount,

    fieldCacheRef: { "quick-search": {}, column: {}, group: {}, pivot: {} },

    floatingFrameOpen: signal<string | null>(null),

    panelFrameOpen: signal<string | null>(null),
    dialogFrameOpen: signal<string | null>(null),
    popoverFrameOpen: signal<string | null>(null),
    popoverFrameBB: signal<TargetPro | null>(null),

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

    rowSelectionLastWasDeselect: signal(false),
    rowSelectionPivotIndex: signal<number | null>(null),

    rowUpdateStack: signal([]) as unknown as InternalState<D, E>["rowUpdateStack"],
    rowUpdateStackPointer: signal(-1),

    hoveredCol: signal<number | null>(null),
    hoveredRow: signal<number | null>(null),

    virtBounds: v.virtBounds,
    virtLayout: v.virtLayout,

    viewport: signal<HTMLElement | null>(null),
    viewportInnerHeight: signal(0),
    viewportInnerWidth: viewportInnerWidth,
    viewportOuterHeight: signal(0),
    viewportOuterWidth: signal(0),
    viewportHeaderHeight: signal(0),
    viewportXScroll,
    viewportYScroll,
    viewportHasXScroll: computed(() => viewportXScroll.get() > 0),
    viewportHasYScroll: computed(() => viewportYScroll.get() > 0),
  } satisfies GridPro<D, E>["state"]["internal"];

  Object.assign(state, { internal: s });
}
