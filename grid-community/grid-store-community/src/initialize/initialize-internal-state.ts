import { computed, signal } from "@1771technologies/cascada";
import type { ColumnCommunity, StateCommunity } from "@1771technologies/grid-types";
import { type StoreCommunity } from "@1771technologies/grid-types";
import type { ColumnPin, KeyBindingString, Position } from "@1771technologies/grid-types/community";
import { type CellEditLocation } from "@1771technologies/grid-types/community";
import { rowDataSource } from "./row-data-source";
import {
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
  const rowRefreshCount = signal(0, { postUpdate: () => api.cellEditEndAll(true) });

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
    columnForceMountedColumnIndices,
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
    columnForceMountedColumnIndices,

    columnGetRowSpan: columnGetRowSpan,
    columnGetColSpan: columnGetColSpan,
    columnsWithColSpan: columnsWithColSpan,
    columnsWithRowSpan: columnsWithRowSpan,

    columnLookup,
    columnsVisible,

    columnFirstVisible: signal(-1),
    columnLastVisible: signal(-1),

    columnMoveActive: signal(false),
    columnMoveIds: signal<string[]>([]),
    columnMoveLockedByRange: signal(false),
    columnMoveOverColumn: signal<ColumnCommunity<D, E> | null>(null),
    columnMoveOverIndex: signal(-1),
    columnMoveOverlayHeight: signal(0),
    columnMoveOverPin: signal<ColumnPin>(null),
    columnMovePin: signal<ColumnPin>(null),

    columnResizeIsActive: signal(false),

    navigatePosition: signal<Position | null>(null),

    fieldCacheRef: {
      "quick-search": {},
      column: {},
      group: {},
      pivot: {},
    },

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

    rowDragIsActive: signal(false),
    rowDragOverIndex: signal(-1),

    rowIsFullWidthInternal: rowIsFullWidthComputed(state, api),

    rowAutoHeightCache: {},
    rowDetailAutoHeightCache: {},
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
