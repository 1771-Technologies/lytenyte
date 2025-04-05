import type { ReadonlySignal, Signal } from "@1771technologies/react-cascada";
import type { Api, Column, Init } from "../make-grid-pro";
import type {
  ColumnPivotSensitiveState,
  GridInternalState as CommunityInternalState,
} from "./state-community";
import type { RowDataSourceEnterprise } from "../row-data-source/rds-pro";
import type { CellSelectionRect, ColumnFilterModel, Target } from "../types-pro";
import type { ColumnGroupRows, SortModelItem } from "../types";
import type { ApiEnterprise } from "../api/api-pro";
import type { ColumnEnterprise } from "..";

type CommunityOmit =
  | "columnsVisible"
  | "columnMoveOverColumn"
  | "columnLookup"
  | "rowBackingDataSource";

export interface GridInternalState<D, E> extends Omit<CommunityInternalState<D, E>, CommunityOmit> {
  readonly columnsVisible: ReadonlySignal<Column<D, E>[]>;
  readonly columnMoveOverColumn: Signal<Column<D, E> | null>;
  readonly columnLookup: ReadonlySignal<Map<string, Column<D, E>>>;
  readonly rowBackingDataSource: ReadonlySignal<
    Required<RowDataSourceEnterprise<Api<D, E>, D, Column<D, E>>>
  >;

  // Enterprise State
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
};

export type InitialStateAndInternalState<D, E> = InitialState<D, E> & {
  readonly internal: GridInternalState<D, E>;
};

export type ColumnPivotSensitiveStateEnterprise<D, E> = Omit<
  ColumnPivotSensitiveState<D, E>,
  "columnsVisible" | "filterModel"
> & {
  readonly columnsVisible: ReadonlySignal<Column<D, E>[]>;
  readonly filterModel: Signal<ColumnFilterModel<ApiEnterprise<D, ColumnEnterprise<D, E>, E>, D>>;
};

export type State<D, E> = InitialStateAndInternalState<D, E> &
  ColumnPivotSensitiveStateEnterprise<D, E>;
