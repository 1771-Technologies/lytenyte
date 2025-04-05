import { computed, signal } from "@1771technologies/react-cascada";
import type { ColumnCommunity, StateCommunity } from "@1771technologies/grid-types";
import { type StoreCommunity } from "@1771technologies/grid-types";
import type { ColumnPin, KeyBindingString, Position } from "@1771technologies/grid-types/core";
import { type CellEditLocation } from "@1771technologies/grid-types/core";
import { rowDataSource } from "./row-data-source";
import {
  cellFocusQueue,
  columnPositions as columnPositionsComputed,
  columnsVisibleState,
  columnsWithSpan,
  rowIsFullWidthComputed,
  rowPositionsComputed,
  virt,
} from "@1771technologies/grid-shared-state";

type InternalState<D, E> = StateCommunity<D, E>["internal"];

export function initializeInternalState<D, E>(
  state: StateCommunity<D, E>,
  api: StoreCommunity<D, E>["api"],
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

  const { rowBackingDataSource, rowCount, rowTopCount, rowBottomCount, paginatePageCount } =
    rowDataSource(state, api);

  const { rowPositions, rowDetailHeight } = rowPositionsComputed(state, api);

  const v = virt(api);

  const internal = {
    cellEditActiveEdits: signal(new Map()),
    cellEditActiveEditValues: signal(new Map()),
    cellEditActiveInitialValues: signal(new Map()),
    cellEditActiveLocation: signal<CellEditLocation | null>(null),

    columnVisibleCenterCount,
    columnVisibleEndCount,
    columnVisibleStartCount,

    columnGroupCenterLevels,
    columnGroupEndLevels,
    columnGroupStartLevels,
    columnGroupLevels,

    columnWidthDeltas,
    columnPositions: columnPositions,

    columnGetRowSpan: columnGetRowSpan,
    columnGetColSpan: columnGetColSpan,
    columnsWithColSpan: columnsWithColSpan,
    columnsWithRowSpan: columnsWithRowSpan,

    columnLookup,
    columnsVisible,

    columnMoveActive: signal(false),
    columnMoveIds: signal<string[]>([]),
    columnMoveLockedByRange: signal(false),
    columnMoveOverColumn: signal<ColumnCommunity<D, E> | null>(null),
    columnMoveOverIndex: signal(-1),
    columnMoveOverlayHeight: signal(0),
    columnMoveOverPin: signal<ColumnPin>(null),
    columnMovePin: signal<ColumnPin>(null),

    columnResizeIsActive: signal(false),

    cellFocusQueue: cellFocusQueue(),
    navigatePosition: signal<Position | null>(null),

    fieldCacheRef: { "quick-search": {}, column: {}, group: {}, pivot: {} },

    keyBindingIdToKey: computed<Record<string, KeyBindingString[]>>(() => {
      return {};
    }),

    paginatePageCount,

    rowRefreshCount,
    rowBackingDataSource,
    rowCount,
    rowTopCount,
    rowBottomCount,
    rowPositions,
    rowDetailHeight,

    rowDragStartIndex: signal(-1),
    rowDragOverIndex: signal(-1),

    rowIsFullWidthInternal: rowIsFullWidthComputed(state, api),

    rowSelectionLastWasDeselect: signal(false),
    rowSelectionPivotIndex: signal<number | null>(null),

    rowUpdateStack: signal([]) as unknown as InternalState<D, E>["rowUpdateStack"],
    rowUpdateStackPointer: signal(-1),

    virtBounds: v.virtBounds,
    virtLayout: v.virtLayout,

    hoveredCol: signal<number | null>(null),
    hoveredRow: signal<number | null>(null),

    viewport: signal<HTMLElement | null>(null),
    viewportInnerHeight: signal(0),
    viewportInnerWidth,
    viewportOuterHeight: signal(0),
    viewportOuterWidth: signal(0),
    viewportHeaderHeight: signal(0),
    viewportXScroll,
    viewportYScroll,
    viewportHasXScroll: computed(() => viewportXScroll.get() > 0),
    viewportHasYScroll: computed(() => viewportYScroll.get() > 0),
  } satisfies StateCommunity<D, E>["internal"];

  Object.assign(state, { internal });
}
