import type {
  EventsCoreRaw,
  LngAddEventListenerCore,
  LngRemoveEventListenerCore,
} from "../events/events-core";
import type { StateCore } from "../state/state-core";
import type { AutosizeOptions, AutosizeResult } from "../types/autosize";
import type { CellEditLocation } from "../types/cell-edit";
import type { DataRectResult, ExportCsvOptions, ExportDataRectOptions } from "../types/export";
import type { Position } from "../types/position";
import type { RowSections } from "../types/row";
import type { RowNode, RowNodeGroup, RowNodeLeaf, RowNodeTotal } from "../types/row-nodes";
import type { SortCycleOption } from "../types/sort";

export interface ApiCoreRaw<D, C, E> {
  readonly getState: () => StateCore<D, E>;

  readonly autosizeColumn: (c: C, options?: AutosizeOptions) => AutosizeResult | null;
  readonly autosizeColumns: (
    c?: string[] | null,
    options?: AutosizeOptions,
  ) => AutosizeResult | null;
  readonly autosizeMeasure: (text: string, font?: string) => TextMetrics | null;

  readonly cellEditBegin: (p: CellEditLocation, makeActive?: boolean) => void;
  readonly cellEditEnd: (p: CellEditLocation, cancel?: boolean) => void;
  readonly cellEditValue: (p: CellEditLocation) => unknown;
  readonly cellEditSetValue: (p: CellEditLocation, v: unknown) => void;
  readonly cellEditIsValueValid: (p: CellEditLocation) => boolean;
  readonly cellEditPredicate: (row: RowNode<D>, column: C) => boolean;
  readonly cellEditIsActive: () => boolean;

  readonly columnField: (row: RowNode<D>, column: C) => unknown;
  readonly columnFieldGroup: (row: RowNodeLeaf<D>, column: C) => unknown;

  readonly columnGroupToggle: (id: string, state?: boolean) => void;

  readonly columnVisualWidth: (column: C) => number;

  readonly columnUpdate: (column: C, update: Omit<C, "id">) => void;
  readonly columnUpdateMany: (updates: Record<string, Omit<C, "id">>) => void;

  readonly columnMoveAfter: (src: string[], destId: string) => void;
  readonly columnMoveBefore: (src: string[], destId: string) => void;
  readonly columnMoveToVisibleIndex: (src: string[], toIndex: number, before?: boolean) => void;

  readonly columnResize: (column: C, newWidth: number) => void;
  readonly columnResizeMany: (columns: Record<string, number>) => void;

  readonly columnById: (columnId: string) => C | undefined;
  readonly columnByIndex: (i: number) => C | undefined;

  readonly columnIndex: (c: C) => number | null;

  readonly columnIsResizable: (c: C) => boolean;
  readonly columnIsSortable: (c: C) => boolean;
  readonly columnIsMovable: (c: C) => boolean;
  readonly columnIsHidable: (c: C) => boolean;
  readonly columnIsEmpty: (c: C) => boolean;
  readonly columnIsMarker: (c: C) => boolean;
  readonly columnIsGroupAutoColumn: (c: C) => boolean;
  readonly columnIsGridGenerated: (c: C) => boolean;
  readonly columnIsRowGroupable: (c: C) => boolean;
  readonly columnIsEditable: (c: C) => boolean;

  readonly columnIsVisible: (c: C, ignoreGroupVisibility?: boolean) => boolean;

  readonly columnSortModelIndex: (c: C) => number;
  readonly columnSortCycle: (c: C) => SortCycleOption[] | null;
  readonly columnSortCycleIndex: (c: C) => number | null;
  readonly columnSortDirection: (c: C) => "asc" | "desc" | null;
  readonly columnSortGetNext: (c: C) => SortCycleOption | null;
  readonly columnSortCycleToNext: (c: C, additive?: boolean) => void;

  readonly exportDataRect: (
    opts?: ExportDataRectOptions<this, C>,
  ) => DataRectResult<C> | Promise<DataRectResult<C>>;
  readonly exportCsv: (opts?: ExportCsvOptions<this, C>) => string | Promise<string>;
  readonly exportCsvFile: (opts?: ExportCsvOptions<this, C>) => Promise<Blob>;

  readonly navigateNext: () => void;
  readonly navigatePrev: () => void;
  readonly navigateUp: () => void;
  readonly navigateDown: () => void;

  readonly navigateToStart: () => void;
  readonly navigateToEnd: () => void;
  readonly navigateToTop: () => void;
  readonly navigateToBottom: () => void;

  readonly navigatePageDown: () => void;
  readonly navigatePageUp: () => void;

  readonly navigateGetNext: () => Position | null;
  readonly navigateGetPrev: () => Position | null;

  readonly navigateGetUp: () => Position | null;
  readonly navigateGetDown: () => Position | null;
  readonly navigateGetPageDown: () => Position | null;
  readonly navigateGetPageUp: () => Position | null;

  readonly navigateGetStart: () => Position | null;
  readonly navigateGetEnd: () => Position | null;
  readonly navigateGetTop: () => Position | null;
  readonly navigateGetBottom: () => Position | null;

  readonly navigateScrollIntoView: (rowIndex?: number | null, columnIndex?: number | null) => void;

  readonly navigateSetPosition: (p: Position | null) => void;
  readonly navigateGetPosition: () => Position | null;

  readonly paginateRowStartAndEndForPage: (i: number) => [number, number];

  readonly rowRefresh: () => void;
  readonly rowByIndex: (rowIndex: number, section?: RowSections) => RowNode<D> | null | undefined;
  readonly rowById: (id: string) => RowNode<D> | null | undefined;
  readonly rowDepth: (rowIndex: number, section?: RowSections) => number;

  readonly rowDetailIsExpanded: (id: string) => boolean;
  readonly rowDetailToggle: (id: string, state?: boolean) => void;
  readonly rowDetailRowPredicate: (id: string) => boolean;
  readonly rowDetailVisibleHeight: (id: string) => number;

  readonly rowSelectionGetSelected: () => RowNode[];
  readonly rowSelectionSelect: (id: string[], childrenAsWell?: boolean) => void;
  readonly rowSelectionDeselect: (id: string[], childrenAsWell?: boolean) => void;
  readonly rowSelectionIsIndeterminate: (id: string) => boolean;
  readonly rowSelectionAllRowsSelected: () => boolean;
  readonly rowSelectionSelectAll: () => void;
  readonly rowSelectionClear: () => void;
  readonly rowSelectionSelectAllSupported: () => boolean;

  readonly rowIsGroup: (row: RowNode<D>) => row is RowNodeGroup;
  readonly rowIsLeaf: (row: RowNode<D>) => row is RowNodeLeaf<D>;
  readonly rowIsTotal: (row: RowNode<D>) => row is RowNodeTotal;
  readonly rowIsDraggable: (id: string) => boolean;
  readonly rowVisibleRowHeight: (i: number, section?: RowSections) => number;

  readonly rowGroupToggle: (row: RowNodeGroup, state?: boolean) => void;
  readonly rowGroupIsExpanded: (row: RowNode<D>) => boolean;

  readonly rowUpdateRedo: () => void;
  readonly rowUpdateUndo: () => void;

  readonly rowSetData: (id: string, data: D) => void;
  readonly rowSetDataMany: (updates: Record<string, D>) => void;
  readonly rowReplaceData: (d: D[]) => void;
  readonly rowReplaceTopData: (d: D[]) => void;
  readonly rowReplaceBottomData: (d: D[]) => void;

  readonly eventAddListener: LngAddEventListenerCore<this, D, C>;
  readonly eventRemoveListener: LngRemoveEventListenerCore<this, D, C>;
  readonly eventGetListeners: <K extends keyof EventsCoreRaw<this, D, C>>(
    eventName: K,
  ) => Set<EventsCoreRaw<this, D, C>[K]> | null;
  readonly eventFire: <K extends keyof EventsCoreRaw<this, D, C>>(
    name: K,
    ...args: Parameters<EventsCoreRaw<this, D, C>[K]>
  ) => void;
}
