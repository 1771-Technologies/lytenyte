import type { ReadonlySignal, Signal } from "@1771technologies/react-cascada";
import type {
  ColumnPivotSensitiveStateCore,
  GridInternalState as CoreInternal,
} from "../state/state-core";
import type { RowDataSourcePro } from "../row-data-source/rds-pro";
import type { ApiProRaw } from "../api/api-pro";
import type { CellSelectionRect } from "../types/cell-selection-pro";
import type { SortModelItem } from "../types/sort";
import type { ColumnFilterModel } from "../types/filter-pro";
import type { ColumnGroupRows } from "../types/column-group";
import type { Target } from "../types/context-menu-pro";
import type {
  ColumnPro as Column,
  ApiPro as Api,
  StateInitPro as Init,
  ColumnHeaderRendererPro,
  ColumnPro,
} from "../export-pro";

type CoreOmit =
  | "columnsVisible"
  | "columnMoveOverColumn"
  | "columnLookup"
  | "rowBackingDataSource"
  | "columnHeaderDefaultRenderer";

export interface GridInternalState<D, E> extends Omit<CoreInternal<D, E>, CoreOmit> {
  readonly columnsVisible: ReadonlySignal<Column<D, E>[]>;
  readonly columnMoveOverColumn: Signal<Column<D, E> | null>;
  readonly columnLookup: ReadonlySignal<Map<string, Column<D, E>>>;
  readonly rowBackingDataSource: ReadonlySignal<
    Required<RowDataSourcePro<Api<D, E>, D, Column<D, E>>>
  >;

  // Pro State
  readonly cellSelectionPivot: Signal<CellSelectionRect | null>;
  readonly cellSelectionSplits: ReadonlySignal<CellSelectionRect[]>;
  readonly cellSelectionAdditiveRects: Signal<CellSelectionRect[] | null>;
  readonly cellSelectionIsDeselect: Signal<boolean>;
  readonly cellSelectionFlashOn: Signal<boolean>;

  readonly columnManagerTreeExpansions: Signal<Record<string, boolean>>;
  readonly columnManagerBoxExpansions: Signal<{
    rowGroups: boolean;
    columnPivots: boolean;
    measures: boolean;
    values: boolean;
  }>;

  readonly columnPivotColumns: Signal<Column<D, E>[]>;
  readonly columnPivotLookup: ReadonlySignal<Map<string, Column<D, E>>>;
  readonly columnPivotVisibleStartCount: ReadonlySignal<number>;
  readonly columnPivotVisibleCenterCount: ReadonlySignal<number>;
  readonly columnPivotVisibleEndCount: ReadonlySignal<number>;

  readonly columnPivotGroupExpansionState: Signal<Record<string, boolean>>;
  readonly columnPivotsLoading: Signal<boolean>;
  readonly columnPivotSortModel: Signal<SortModelItem[]>;
  readonly columnPivotFilterModel: Signal<ColumnFilterModel<Api<D, E>, D>>;
  readonly columnPivotPositions: ReadonlySignal<Uint32Array>;
  readonly columnPivotsWithRowSpan: ReadonlySignal<Set<number>>;
  readonly columnPivotsWithColSpan: ReadonlySignal<Set<number>>;
  readonly columnPivotsGetColSpan: ReadonlySignal<(r: number, c: number) => number>;
  readonly columnPivotsGetRowSpan: ReadonlySignal<(r: number, c: number) => number>;
  readonly columnPivotWidthDeltas: Signal<Record<string, number> | null>;

  readonly columnPivotsVisible: ReadonlySignal<Column<D, E>[]>;
  readonly columnPivotGroupStartLevels: ReadonlySignal<ColumnGroupRows>;
  readonly columnPivotGroupCenterLevels: ReadonlySignal<ColumnGroupRows>;
  readonly columnPivotGroupEndLevels: ReadonlySignal<ColumnGroupRows>;
  readonly columnPivotGroupLevels: ReadonlySignal<ColumnGroupRows>;

  readonly columnMenuColumn: Signal<Column<D, E> | null>;
  readonly columnMenuTarget: Signal<Target | null>;

  readonly columnHeaderDefaultRenderer: Signal<ColumnHeaderRendererPro<D, E> | null>;

  readonly contextMenuTarget: Signal<Target | null>;

  readonly floatingFrameOpen: Signal<string | null>;

  readonly panelFrameOpen: Signal<string | null>;
  readonly dialogFrameOpen: Signal<string | null>;
  readonly popoverFrameOpen: Signal<string | null>;
  readonly popoverFrameBB: Signal<Target | null>;
}

type Props<D, E> = Required<Init<D, E>>;

export type InitialState<D, E> = {
  readonly [k in keyof Props<D, E>]: Signal<Props<D, E>[k]>;
} & {
  readonly columnMenuActiveColumn: ReadonlySignal<ColumnPro<D, E> | null>;
};

export type InitialStateAndInternalState<D, E> = InitialState<D, E> & {
  readonly internal: GridInternalState<D, E>;
};

export type ColumnPivotSensitiveStatePro<D, E> = Omit<
  ColumnPivotSensitiveStateCore<D, E>,
  "columnsVisible" | "filterModel"
> & {
  readonly columnsVisible: ReadonlySignal<Column<D, E>[]>;
  readonly filterModel: Signal<ColumnFilterModel<ApiProRaw<D, Column<D, E>, E>, D>>;
};

export type StatePro<D, E> = InitialStateAndInternalState<D, E> &
  ColumnPivotSensitiveStatePro<D, E>;
