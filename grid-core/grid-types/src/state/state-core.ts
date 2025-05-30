import type { ReadonlySignal, Signal } from "@1771technologies/react-cascada";
import type { RowDataSourceCore } from "../row-data-source/rds-core.js";
import type { Position, PositionFocus } from "../types/position.js";
import type { CellEditLocation } from "../types/cell-edit.js";
import type { ColumnGroupRows } from "../types/column-group.js";
import type { ColumnPin } from "../types/column-pin.js";
import type { ScrollBounds } from "../types/virtualization.js";
import type { SortModelItem } from "../types/sort.js";
import type { ColumnFilter } from "../types/filters.js";
import type {
  ColumnCore as Column,
  ApiCore as Api,
  StateInitCore as Init,
  ColumnHeaderRendererCore,
} from "../export-core.js";

export type GridInternalState<D, E> = {
  readonly cellFocusQueue: Signal<PositionFocus | null>;

  readonly cellEditActiveLocation: Signal<CellEditLocation | null>;
  readonly cellEditActiveEdits: Signal<Map<string, CellEditLocation>>;
  readonly cellEditActiveEditValues: Signal<Map<string, unknown>>;
  readonly cellEditActiveInitialValues: Signal<Map<string, unknown>>;

  readonly columnGroupLevels: ReadonlySignal<ColumnGroupRows>;
  readonly columnGroupStartLevels: ReadonlySignal<ColumnGroupRows>;
  readonly columnGroupCenterLevels: ReadonlySignal<ColumnGroupRows>;
  readonly columnGroupEndLevels: ReadonlySignal<ColumnGroupRows>;
  readonly columnsVisible: ReadonlySignal<Column<D, E>[]>;
  readonly columnVisibleStartCount: ReadonlySignal<number>;
  readonly columnVisibleCenterCount: ReadonlySignal<number>;
  readonly columnVisibleEndCount: ReadonlySignal<number>;
  readonly columnsWithRowSpan: ReadonlySignal<Set<number>>;
  readonly columnsWithColSpan: ReadonlySignal<Set<number>>;
  readonly columnPositions: ReadonlySignal<Uint32Array>;
  readonly columnLookup: ReadonlySignal<Map<string, Column<D, E>>>;
  readonly columnGetColSpan: ReadonlySignal<(r: number, c: number) => number>;
  readonly columnGetRowSpan: ReadonlySignal<(r: number, c: number) => number>;

  readonly columnMoveActive: Signal<boolean>;
  readonly columnMoveLockedByRange: Signal<boolean>;
  readonly columnMovePin: Signal<ColumnPin>;
  readonly columnMoveIds: Signal<string[]>;
  readonly columnMoveOverIndex: Signal<number>;
  readonly columnMoveOverColumn: Signal<Column<D, E> | null>;
  readonly columnMoveOverPin: Signal<ColumnPin>;
  readonly columnMoveOverlayHeight: Signal<number>;

  readonly columnHeaderDefaultRenderer: Signal<ColumnHeaderRendererCore<D, E> | null>;

  readonly columnWidthDeltas: Signal<Record<string, number> | null>;
  readonly columnResizeIsActive: Signal<boolean>;

  readonly fieldCacheRef: {
    [c in "group" | "column" | "pivot" | "quick-search"]: {
      [rowId: string]: {
        [columnId: string]: unknown;
      };
    };
  };

  readonly navigatePosition: Signal<Position | null>;

  readonly rowBackingDataSource: ReadonlySignal<RowDataSourceCore<Api<D, E>, D>>;

  readonly rowUpdateStack: Signal<{ redo: Record<string, D>; undo: Record<string, D> }[]>;
  readonly rowUpdateStackPointer: Signal<number>;

  readonly rowCount: ReadonlySignal<number>;
  readonly rowTopCount: ReadonlySignal<number>;
  readonly rowBottomCount: ReadonlySignal<number>;

  readonly rowDragStartIndex: Signal<number>;
  readonly rowDragOverIndex: Signal<number>;

  readonly paginatePageCount: ReadonlySignal<number>;

  readonly rowPositions: ReadonlySignal<Uint32Array>;
  readonly rowDetailHeight: ReadonlySignal<(i: number) => number>;

  readonly rowSelectionPivotIndex: Signal<number | null>;
  readonly rowSelectionLastWasDeselect: Signal<boolean>;

  readonly rowRefreshCount: Signal<number>;
  readonly rowIsFullWidthInternal: ReadonlySignal<(r: number) => boolean>;

  readonly hoveredRow: Signal<number | null>;
  readonly hoveredCol: Signal<number | null>;

  readonly virtBounds: ReadonlySignal<ScrollBounds>;
  readonly virtLayout: ReadonlySignal<Map<number, Int32Array>>;

  readonly viewport: Signal<HTMLElement | null>;
  readonly viewportOuterHeight: Signal<number>;
  readonly viewportOuterWidth: Signal<number>;
  readonly viewportInnerHeight: Signal<number>;
  readonly viewportInnerWidth: Signal<number>;
  readonly viewportYScroll: Signal<number>;
  readonly viewportXScroll: Signal<number>;
  readonly viewportHeaderHeight: Signal<number>;
  readonly viewportHasYScroll: ReadonlySignal<boolean>;
  readonly viewportHasXScroll: ReadonlySignal<boolean>;
};

type Props<D, E> = Required<Init<D, E>>;

/**
 * In the pro grid some state is impacted by the present of pivot mode. These are the fields
 * That are impacted. We put these fields on state. In Core they will directly reference their
 * internal state. In Pro we the pivot mode determines the value.
 */
export type ColumnPivotSensitiveStateCore<D, E> = {
  readonly columnGroupLevels: ReadonlySignal<ColumnGroupRows>;
  readonly columnGroupStartLevels: ReadonlySignal<ColumnGroupRows>;
  readonly columnGroupCenterLevels: ReadonlySignal<ColumnGroupRows>;
  readonly columnGroupEndLevels: ReadonlySignal<ColumnGroupRows>;
  readonly columnGroupExpansionState: Signal<Record<string, boolean>>;
  readonly columnsVisible: ReadonlySignal<Column<D, E>[]>;
  readonly columnVisibleStartCount: ReadonlySignal<number>;
  readonly columnVisibleCenterCount: ReadonlySignal<number>;
  readonly columnVisibleEndCount: ReadonlySignal<number>;
  readonly columnsWithRowSpan: ReadonlySignal<Set<number>>;
  readonly columnsWithColSpan: ReadonlySignal<Set<number>>;
  readonly columnPositions: ReadonlySignal<Uint32Array>;
  readonly columnWidthDeltas: Signal<Record<string, number> | null>;
  readonly columnGetColSpan: ReadonlySignal<(r: number, c: number) => number>;
  readonly columnGetRowSpan: ReadonlySignal<(r: number, c: number) => number>;

  readonly filterModel: Signal<ColumnFilter<Api<D, E>, D>[]>;
  readonly sortModel: Signal<SortModelItem[]>;
};

export type InitialState<D, E> = {
  readonly [k in keyof Props<D, E>]: Signal<Props<D, E>[k]>;
};

export type InitialStateAndInternalState<D, E> = InitialState<D, E> & {
  readonly internal: GridInternalState<D, E>;
};

export type StateCore<D, E> = InitialStateAndInternalState<D, E> &
  ColumnPivotSensitiveStateCore<D, E>;
