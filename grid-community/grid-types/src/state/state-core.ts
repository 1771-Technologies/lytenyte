import type { Api, Column, Init } from "../make-grid-core.js";
import type { ReadonlySignal, Signal } from "@1771technologies/react-cascada";
import type {
  CellEditLocation,
  ColumnFilter,
  ColumnGroupRows,
  ColumnPin,
  FocusPosition,
  KeyBindingString,
  Position,
  ScrollBounds,
  SortModelItem,
} from "../types.js";
import type { RowDataSource } from "../row-data-source/rds-core.js";
import type { ApiCommunity } from "../index.js";

export type GridInternalState<D, E> = {
  readonly cellFocusQueue: Signal<FocusPosition | null>;

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

  readonly columnWidthDeltas: Signal<Record<string, number> | null>;
  readonly columnResizeIsActive: Signal<boolean>;

  readonly fieldCacheRef: {
    [c in "group" | "column" | "pivot" | "quick-search"]: {
      [rowId: string]: {
        [columnId: string]: unknown;
      };
    };
  };

  readonly keyBindingIdToKey: ReadonlySignal<Record<string, KeyBindingString[]>>;

  readonly navigatePosition: Signal<Position | null>;

  readonly rowBackingDataSource: ReadonlySignal<RowDataSource<Api<D, E>, D>>;

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
 * That are impacted. We put these fields on state. In community they will directly reference their
 * internal state. In Enterprise we the pivot mode determines the value.
 */
export type ColumnPivotSensitiveState<D, E> = {
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

  readonly filterModel: Signal<ColumnFilter<ApiCommunity<D, E>, D>[]>;
  readonly sortModel: Signal<SortModelItem[]>;
};

export type InitialState<D, E> = {
  readonly [k in keyof Props<D, E>]: Signal<Props<D, E>[k]>;
};

export type InitialStateAndInternalState<D, E> = InitialState<D, E> & {
  readonly internal: GridInternalState<D, E>;
};

export type State<D, E> = InitialStateAndInternalState<D, E> & ColumnPivotSensitiveState<D, E>;
