import type {
  EventsEnterprise,
  LngAddEventListenerEnterprise,
  LngRemoveEventListenerEnterprise,
} from "../events/events-pro";
import type { State } from "../state/state-pro";
import type { ColumnFilterModel, RowNode, RowNodeGroup, SortModelItem } from "../types";
import type {
  CellSelectionRect,
  ClipboardCopyOptions,
  ColumnInFilterItem,
  Target,
} from "../types-pro";
import type { ApiCommunity } from "./api-core";

export interface ApiEnterprise<D, C, E>
  extends Omit<
    ApiCommunity<D, C, E>,
    "eventAddListener" | "eventRemoveListener" | "eventGetListeners" | "eventFire" | "getState"
  > {
  readonly getState: () => State<D, E>;

  readonly cellSelectionIsSelected: (r: number, c: number) => boolean;
  readonly cellSelectionExpandDown: (p?: {
    ref: CellSelectionRect;
    pivot: CellSelectionRect;
  }) => void;
  readonly cellSelectionExpandUp: (p?: {
    ref: CellSelectionRect;
    pivot: CellSelectionRect;
  }) => void;
  readonly cellSelectionExpandStart: (p?: {
    ref: CellSelectionRect;
    pivot: CellSelectionRect;
  }) => void;
  readonly cellSelectionExpandEnd: (p?: {
    ref: CellSelectionRect;
    pivot: CellSelectionRect;
  }) => void;
  readonly cellSelectionDeselectRect: (rect: CellSelectionRect) => void;
  readonly cellSelectionSelectRect: (rect: CellSelectionRect, additive?: boolean) => void;

  readonly columnPivotsLoading: () => boolean;
  readonly columnPivotsReload: () => void;

  readonly columnPivotFilterModel: () => ColumnFilterModel<this, D>;
  readonly columnPivotSortModel: () => SortModelItem[];
  readonly columnPivotSetSortModel: (s: SortModelItem[]) => void;
  readonly columnPivotSetFilterModel: (s: ColumnFilterModel<this, D>) => void;

  readonly columnPivotField: (row: RowNode<D>, column: C) => unknown;
  readonly columnPivotFieldFromData: (data: D, column: C) => unknown;
  readonly columnPivotMeasureField: (data: D, measureColumn: C) => unknown;

  readonly columnPivots: () => C[];
  readonly columnIsPivot: (c: C) => boolean;

  readonly columnInFilterItems: (column: C) => Promise<ColumnInFilterItem[]> | ColumnInFilterItem[];

  readonly columnIsMeasurable: (c: C) => boolean;

  readonly columnQuickSearchField: (row: RowNode<D>, column: C) => unknown;

  readonly columnIsPivotable: (c: C) => boolean;

  readonly columnMenuOpen: (c: C, bb: Target) => void;
  readonly columnMenuClose: () => void;

  readonly contextMenuClose: () => void;

  readonly clipboardCopyCells: (
    rect?: CellSelectionRect | null,
    opts?: ClipboardCopyOptions,
  ) => Promise<void>;
  readonly clipboardCutCells: (
    rect?: CellSelectionRect | null,
    opts?: ClipboardCopyOptions,
  ) => Promise<void>;
  readonly clipboardPasteCells: (rect?: CellSelectionRect | null) => Promise<void>;

  readonly panelFrameOpen: (id: string) => void;
  readonly panelFrameClose: () => void;

  readonly dialogFrameOpen: (id: string) => void;
  readonly dialogFrameClose: () => void;

  readonly popoverFrameOpen: (id: string, bb: Target) => void;
  readonly popoverFrameClose: () => void;

  readonly rowReload: () => void;
  readonly rowReloadExpansion: (row: RowNodeGroup) => void;
  readonly rowReset: () => void;

  readonly eventAddListener: LngAddEventListenerEnterprise<this, D, C>;
  readonly eventRemoveListener: LngRemoveEventListenerEnterprise<this, D, C>;
  readonly eventGetListeners: <K extends keyof EventsEnterprise<this, D, C>>(
    eventName: K,
  ) => Set<EventsEnterprise<this, D, C>[K]> | null;
  readonly eventFire: <K extends keyof EventsEnterprise<this, D, C>>(
    name: K,
    ...args: Parameters<EventsEnterprise<this, D, C>[K]>
  ) => void;
}
