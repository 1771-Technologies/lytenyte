import type { ReactNode } from "react";

/**
 *
 */
export interface UseLyteNyteProps<T> {
  /**
   *
   */
  readonly columns?: Column<T>[];

  /**
   *
   */
  readonly columnBase?: ColumnBase<T>;

  /**
   *
   */
  readonly columnGroupDefaultExpansion?: boolean;

  /**
   *
   */
  readonly columnGroupExpansions?: Record<string, boolean>;

  /**
   *
   */
  readonly columnGroupJoinDelimiter?: string;

  /**
   *
   */
  readonly columnSizeToFit?: boolean;

  /**
   *
   */
  readonly headerHeight?: number;

  /**
   *
   */
  readonly headerGroupHeight?: number;

  /**
   *
   */
  readonly gridId: string;

  /**
   *
   */
  readonly rowDataSource?: RowDataSource<T>;

  /**
   *
   */
  readonly rowAutoHeightGuess?: number;

  /**
   *
   */
  readonly rowHeight?: RowHeight;

  /**
   *
   */
  readonly colScanDistance?: number;

  /**
   *
   */
  readonly rowScanDistance?: number;

  /**
   *
   */
  readonly rowOverscanTop?: number;

  /**
   *
   */
  readonly rowOverscanBottom?: number;

  /**
   *
   */
  readonly colOverscanStart?: number;

  /**
   *
   */
  readonly colOverscanEnd?: number;

  /**
   *
   */
  readonly rowFullWidthPredicate?: RowFullWidthPredicate<T>;

  /**
   *
   */
  readonly rowFullWidthRenderer?: RowFullWidthRendererFn<T>;

  /**
   *
   */
  readonly cellRenderers?: Record<string, CellRendererFn<T>>;

  /**
   *
   */
  readonly rtl?: boolean;

  /**
   *
   */
  readonly sortModel?: SortModelItem<T>[];

  /**
   *
   */
  readonly filterModel?: FilterModelItem<T>[];

  /**
   *
   */
  readonly aggModel?: { [columnId: string]: { fn: AggModelFn<T> } };

  /**
   *
   */
  readonly rowGroupColumn?: RowGroupColumn<T>;

  /**
   *
   */
  readonly rowGroupModel?: RowGroupModelItem<T>[];

  /**
   *
   */
  readonly rowGroupDisplayMode?: RowGroupDisplayMode;

  /**
   *
   */
  readonly rowGroupDefaultExpansion?: boolean | number;

  /**
   *
   */
  readonly rowGroupExpansions?: { [rowId: string]: boolean | undefined };

  /**
   *
   */
  readonly floatingRowHeight?: number;

  /**
   *
   */
  readonly floatingRowEnabled?: boolean;

  /**
   *
   */
  readonly floatingCellRenderers?: Record<
    string,
    HeaderFloatingCellRendererFn<T>
  >;

  /**
   *
   */
  readonly headerCellRenderers?: Record<string, HeaderCellRendererFn<T>>;

  /**
   *
   */
  readonly editRenderers?: Record<string, EditRendererFn<T>>;

  /**
   *
   */
  readonly editRowValidatorFn?: EditRowValidatorFn<T>;

  /**
   *
   */
  readonly editClickActivator?: EditClickActivator;

  /**
   *
   */
  readonly editCellMode?: EditCellMode;

  /**
   *
   */
  readonly columnMarker?: ColumnMarker<T>;

  /**
   *
   */
  readonly columnMarkerEnabled?: boolean;

  /**
   *
   */
  readonly columnDoubleClickToAutosize?: boolean;

  /**
   *
   */
  readonly rowDetailRenderer?: RowDetailRendererFn<T>;

  /**
   *
   */
  readonly rowDetailHeight?: RowDetailHeight;

  /**
   *
   */
  readonly rowDetailExpansions?: Set<string>;

  /**
   *
   */
  readonly rowDetailAutoHeightGuess?: number;

  /**
   *
   */
  readonly rowSelectedIds?: Set<string>;

  /**
   *
   */
  readonly rowSelectionMode?: RowSelectionMode;

  /**
   *
   */
  readonly rowSelectionActivator?: RowSelectionActivator;

  /**
   *
   */
  readonly rowSelectChildren?: boolean;

  /**
   *
   */
  readonly virtualizeCols?: boolean;

  /**
   *
   */
  readonly virtualizeRows?: boolean;
}

/**
 *
 */
export interface GridState<T> {
  /**
   *
   */
  readonly columns: GridAtom<Column<T>[]>;

  /**
   *
   */
  readonly columnMeta: GridAtomReadonly<ColumnMeta<T>>;

  /**
   *
   */
  readonly columnBase: GridAtom<ColumnBase<T>>;

  /**
   *
   */
  readonly columnGroupDefaultExpansion: GridAtom<boolean>;

  /**
   *
   */
  readonly columnGroupExpansions: GridAtom<Record<string, boolean>>;

  /**
   *
   */
  readonly columnGroupJoinDelimiter: GridAtom<string>;

  /**
   *
   */
  readonly columnGroupMeta: GridAtomReadonly<ColumnGroupMeta>;

  /**
   *
   */
  readonly columnSizeToFit: GridAtom<boolean>;

  /**
   *
   */
  readonly gridId: GridAtom<string>;

  /**
   *
   */
  readonly xPositions: GridAtomReadonly<Uint32Array>;

  /**
   *
   */
  readonly yPositions: GridAtomReadonly<Uint32Array>;

  /**
   *
   */
  readonly widthTotal: GridAtomReadonly<number>;

  /**
   *
   */
  readonly heightTotal: GridAtomReadonly<number>;

  /**
   *
   */
  readonly viewport: GridAtom<HTMLElement | null>;

  /**
   *
   */
  readonly viewportWidthInner: GridAtom<number>;

  /**
   *
   */
  readonly viewportWidthOuter: GridAtom<number>;

  /**
   *
   */
  readonly viewportHeightInner: GridAtom<number>;

  /**
   *
   */
  readonly viewportHeightOuter: GridAtom<number>;

  /**
   *
   */
  readonly headerHeight: GridAtom<number>;

  /**
   *
   */
  readonly headerGroupHeight: GridAtom<number>;

  /**
   *
   */
  readonly rowDataStore: RowDataStore<T>;

  /**
   *
   */
  readonly rowDataSource: GridAtom<RowDataSource<T>>;

  /**
   *
   */
  readonly rowAutoHeightGuess: GridAtom<number>;

  /**
   *
   */
  readonly rowHeight: GridAtom<RowHeight>;

  /**
   *
   */
  readonly rowScanDistance: GridAtom<number>;

  /**
   *
   */
  readonly colScanDistance: GridAtom<number>;

  /**
   *
   */
  readonly rowOverscanTop: GridAtom<number>;

  /**
   *
   */
  readonly rowOverscanBottom: GridAtom<number>;

  /**
   *
   */
  readonly colOverscanStart: GridAtom<number>;

  /**
   *
   */
  readonly colOverscanEnd: GridAtom<number>;

  /**
   *
   */
  readonly rowFullWidthPredicate: GridAtom<{ fn: RowFullWidthPredicate<T> }>;

  /**
   *
   */
  readonly rowFullWidthRenderer: GridAtom<{ fn: RowFullWidthRendererFn<T> }>;

  /**
   *
   */
  readonly cellRenderers: GridAtom<Record<string, CellRendererFn<T>>>;

  /**
   *
   */
  readonly rtl: GridAtom<boolean>;

  /**
   *
   */
  readonly sortModel: GridAtom<SortModelItem<T>[]>;

  /**
   *
   */
  readonly filterModel: GridAtom<FilterModelItem<T>[]>;

  /**
   *
   */
  readonly aggModel: GridAtom<{ [columnId: string]: { fn: AggModelFn<T> } }>;

  /**
   *
   */
  readonly rowGroupModel: GridAtom<RowGroupModelItem<T>[]>;

  /**
   *
   */
  readonly rowGroupColumn: GridAtom<RowGroupColumn<T>>;

  /**
   *
   */
  readonly rowGroupDisplayMode: GridAtom<RowGroupDisplayMode>;

  /**
   *
   */
  readonly rowGroupDefaultExpansion: GridAtom<boolean | number>;

  /**
   *
   */
  readonly rowGroupExpansions: GridAtom<{
    [rowId: string]: boolean | undefined;
  }>;

  /**
   *
   */
  readonly floatingRowEnabled: GridAtom<boolean>;

  /**
   *
   */
  readonly floatingRowHeight: GridAtom<number>;

  /**
   *
   */
  readonly floatingCellRenderers: GridAtom<
    Record<string, HeaderFloatingCellRendererFn<T>>
  >;

  /**
   *
   */
  readonly headerCellRenderers: GridAtom<
    Record<string, HeaderCellRendererFn<T>>
  >;

  /**
   *
   */
  readonly editRenderers: GridAtom<Record<string, EditRendererFn<T>>>;

  /**
   *
   */
  readonly editRowValidatorFn: GridAtom<{ fn: EditRowValidatorFn<T> }>;

  /**
   *
   */
  readonly editClickActivator: GridAtom<EditClickActivator>;

  /**
   *
   */
  readonly editCellMode: GridAtom<EditCellMode>;

  /**
   *
   */
  readonly editActivePosition: GridAtomReadonly<EditActivePosition<T> | null>;

  /**
   *
   */
  readonly columnMarker: GridAtom<ColumnMarker<T>>;

  /**
   *
   */
  readonly columnMarkerEnabled: GridAtom<boolean>;

  /**
   *
   */
  readonly columnDoubleClickToAutosize: GridAtom<boolean>;

  /**
   *
   */
  readonly rowDetailRenderer: GridAtom<{ fn: RowDetailRendererFn<T> }>;

  /**
   *
   */
  readonly rowDetailHeight: GridAtom<RowDetailHeight>;

  /**
   *
   */
  readonly rowDetailAutoHeightGuess: GridAtom<number>;

  /**
   *
   */
  readonly rowDetailExpansions: GridAtom<Set<string>>;

  /**
   *
   */
  readonly rowSelectedIds: GridAtom<Set<string>>;

  /**
   *
   */
  readonly rowSelectionMode: GridAtom<RowSelectionMode>;

  /**
   *
   */
  readonly rowSelectionPivot: GridAtom<string | null>;

  /**
   *
   */
  readonly rowSelectionActivator: GridAtom<RowSelectionActivator>;

  /**
   *
   */
  readonly rowSelectChildren: GridAtom<boolean>;

  /**
   *
   */
  readonly viewBounds: GridAtomReadonly<ViewBounds>;

  /**
   *
   */
  readonly virtualizeCols: GridAtom<boolean>;

  /**
   *
   */
  readonly virtualizeRows: GridAtom<boolean>;
}

/**
 *
 */
export interface ViewBounds {
  /**
   *
   */
  readonly rowTopStart: number;

  /**
   *
   */
  readonly rowTopEnd: number;

  /**
   *
   */
  readonly rowCenterStart: number;

  /**
   *
   */
  readonly rowCenterEnd: number;

  /**
   *
   */
  readonly rowCenterLast: number;

  /**
   *
   */
  readonly rowBotStart: number;

  /**
   *
   */
  readonly rowBotEnd: number;

  /**
   *
   */
  readonly colStartStart: number;

  /**
   *
   */
  readonly colStartEnd: number;

  /**
   *
   */
  readonly colCenterStart: number;

  /**
   *
   */
  readonly colCenterEnd: number;

  /**
   *
   */
  readonly colCenterLast: number;

  /**
   *
   */
  readonly colEndStart: number;

  /**
   *
   */
  readonly colEndEnd: number;
}

/**
 *
 */
export interface Grid<T> {
  /**
   *
   */
  readonly state: GridState<T>;

  /**
   *
   */
  readonly view: GridAtomReadonly<GridView<T>>;

  /**
   *
   */
  readonly api: GridApi<T>;
}

/**
 *
 */
export interface GridView<T> {
  /**
   *
   */
  readonly header: HeaderLayout<T>;

  /**
   *
   */
  readonly rows: RowSectionLayouts<T>;
}

/**
 *
 */
export interface HeaderCellLayout<T> {
  /**
   *
   */
  readonly rowStart: number;

  /**
   *
   */
  readonly rowEnd: number;

  /**
   *
   */
  readonly rowSpan: number;

  /**
   *
   */
  readonly colStart: number;

  /**
   *
   */
  readonly colEnd: number;

  /**
   *
   */
  readonly colSpan: number;

  /**
   *
   */
  readonly colPin: ColumnPin;

  /**
   *
   */
  readonly colFirstEndPin?: boolean;

  /**
   *
   */
  readonly colLastStartPin?: boolean;

  /**
   *
   */
  readonly id: string;

  /**
   *
   */
  readonly kind: "cell";

  /**
   *
   */
  readonly column: Column<T>;
}

/**
 *
 */
export interface HeaderCellFloating<T> {
  /**
   *
   */
  readonly rowStart: number;

  /**
   *
   */
  readonly rowEnd: number;

  /**
   *
   */
  readonly rowSpan: number;

  /**
   *
   */
  readonly colStart: number;

  /**
   *
   */
  readonly colEnd: number;

  /**
   *
   */
  readonly colSpan: number;

  /**
   *
   */
  readonly colPin: ColumnPin;

  /**
   *
   */
  readonly colFirstEndPin?: boolean;

  /**
   *
   */
  readonly colLastStartPin?: boolean;

  /**
   *
   */
  readonly id: string;

  /**
   *
   */
  readonly kind: "floating";

  /**
   *
   */
  readonly column: Column<T>;
}

/**
 *
 */
export interface HeaderGroupCellLayout {
  /**
   *
   */
  readonly rowStart: number;

  /**
   *
   */
  readonly rowEnd: number;

  /**
   *
   */
  readonly rowSpan: number;

  /**
   *
   */
  readonly colStart: number;

  /**
   *
   */
  readonly colEnd: number;

  /**
   *
   */
  readonly colSpan: number;

  /**
   *
   */
  readonly colPin: ColumnPin;

  /**
   *
   */
  readonly colFirstEndPin?: boolean;

  /**
   *
   */
  readonly colLastStartPin?: boolean;

  /**
   *
   */
  readonly kind: "group";

  /**
   *
   */
  readonly isCollapsible: boolean;

  /**
   *
   */
  readonly id: string;

  /**
   *
   */
  readonly idOccurrence: string;

  /**
   *
   */
  readonly groupPath: string[];

  /**
   *
   */
  readonly columnIds: string[];

  /**
   *
   */
  readonly start: number;

  /**
   *
   */
  readonly end: number;

  /**
   *
   */
  readonly isHiddenMove?: boolean;
}

/**
 *
 */
export interface HeaderLayout<T> {
  /**
   *
   */
  readonly maxRow: number;

  /**
   *
   */
  readonly maxCol: number;

  /**
   *
   */
  readonly layout: HeaderLayoutCell<T>[][];
}

/**
 *
 */
export type HeaderLayoutCell<T> =
  | HeaderCellLayout<T>
  | HeaderCellFloating<T>
  | HeaderGroupCellLayout;

/**
 *
 */
export interface RowCellLayout<T> {
  /**
   *
   */
  readonly kind: "cell";

  /**
   *
   */
  readonly colSpan: number;

  /**
   *
   */
  readonly rowSpan: number;

  /**
   *
   */
  readonly id: string;

  /**
   *
   */
  readonly rowIndex: number;

  /**
   *
   */
  readonly colIndex: number;

  /**
   *
   */
  readonly row: GridAtomReadonlyUnwatchable<RowNode<T> | null>;

  /**
   *
   */
  readonly column: Column<T>;

  /**
   *
   */
  readonly colPin: ColumnPin;

  /**
   *
   */
  readonly rowPin: RowPin;

  /**
   *
   */
  readonly colFirstEndPin?: boolean;

  /**
   *
   */
  readonly colLastStartPin?: boolean;

  /**
   *
   */
  readonly rowLastPinTop?: boolean;

  /**
   *
   */
  readonly rowFirstPinBottom?: boolean;

  /**
   *
   */
  readonly rowIsFocusRow?: boolean;
}

/**
 *
 */
export interface RowFullWidthRowLayout<T> {
  /**
   *
   */
  readonly kind: "full-width";

  /**
   *
   */
  readonly id: string;

  /**
   *
   */
  readonly rowIndex: number;

  /**
   *
   */
  readonly row: GridAtomReadonlyUnwatchable<RowNode<T> | null>;

  /**
   *
   */
  readonly rowPin: RowPin;

  /**
   *
   */
  readonly rowLastPinTop?: boolean;

  /**
   *
   */
  readonly rowFirstPinBottom?: boolean;

  /**
   *
   */
  readonly rowIsFocusRow?: boolean;
}

/**
 *
 */
export type RowLayout<T> = RowNormalRowLayout<T> | RowFullWidthRowLayout<T>;

/**
 *
 */
export interface RowNormalRowLayout<T> {
  /**
   *
   */
  readonly kind: "row";

  /**
   *
   */
  readonly rowIndex: number;

  /**
   *
   */
  readonly row: GridAtomReadonlyUnwatchable<RowNode<T> | null>;

  /**
   *
   */
  readonly rowPin: RowPin;

  /**
   *
   */
  readonly rowLastPinTop?: boolean;

  /**
   *
   */
  readonly rowFirstPinBottom?: boolean;

  /**
   *
   */
  readonly rowIsFocusRow?: boolean;

  /**
   *
   */
  readonly id: string;

  /**
   *
   */
  readonly cells: RowCellLayout<T>[];
}

/**
 *
 */
export interface RowSectionLayouts<T> {
  /**
   *
   */
  readonly top: RowLayout<T>[];

  /**
   *
   */
  readonly center: RowLayout<T>[];

  /**
   *
   */
  readonly bottom: RowLayout<T>[];

  /**
   *
   */
  readonly rowTopTotalHeight: number;

  /**
   *
   */
  readonly rowCenterTotalHeight: number;

  /**
   *
   */
  readonly rowBottomTotalHeight: number;

  /**
   *
   */
  readonly rowFocusedIndex: number | null;

  /**
   *
   */
  readonly rowFirstCenter: number;
}

/**
 *
 */
export type AutosizeCellFn<T> = (
  /**
   *
   */
  params: AutosizeCellParams<T>,
) => number | null;

/**
 *
 */
export interface AutosizeCellParams<T> {
  /**
   *
   */
  readonly column: Column<T>;

  /**
   *
   */
  readonly grid: Grid<T>;

  /**
   *
   */
  readonly row: RowNode<T>;
}

/**
 *
 */
export type AutosizeHeaderFn<T> = (
  /**
   *
   */
  params: AutosizeHeaderParams<T>,
) => number | null;

/**
 *
 */
export interface AutosizeHeaderParams<T> {
  /**
   *
   */
  readonly column: Column<T>;

  /**
   *
   */
  readonly grid: Grid<T>;
}

/**
 *
 */
export interface Column<T> {
  /**
   *
   */
  readonly id: string;

  /**
   *
   */
  readonly name?: string;

  /**
   *
   */
  readonly type?: "string" | "number" | "date" | "datetime" | ({} & string);

  /**
   *
   */
  readonly hide?: boolean;

  /**
   *
   */
  readonly width?: number;

  /**
   *
   */
  readonly widthMax?: number;

  /**
   *
   */
  readonly widthMin?: number;

  /**
   *
   */
  readonly widthFlex?: number;

  /**
   *
   */
  readonly pin?: ColumnPin;

  /**
   *
   */
  readonly groupVisibility?: ColumnGroupVisibility;

  /**
   *
   */
  readonly groupPath?: string[];

  /**
   *
   */
  readonly colSpan?: number | CellSpanFn<T>;

  /**
   *
   */
  readonly rowSpan?: number | CellSpanFn<T>;

  /**
   *
   */
  readonly field?: Field<T>;

  /**
   *
   */
  readonly headerRenderer?: HeaderCellRenderer<T>;

  /**
   *
   */
  readonly floatingRenderer?: HeaderFloatingCellRenderer<T>;

  /**
   *
   */
  readonly cellRenderer?: string | CellRendererFn<T>;

  /**
   *
   */
  readonly uiHints?: ColumnUIHints;

  /**
   *
   */
  readonly editable?: Editable<T>;

  /**
   *
   */
  readonly editRenderer?: EditRenderer<T>;

  /**
   *
   */
  readonly editSetter?: EditSetterFn<T>;

  /**
   *
   */
  readonly autosizeCellFn?: AutosizeCellFn<T>;

  /**
   *
   */
  readonly autosizeHeaderFn?: AutosizeHeaderFn<T>;
}

/**
 *
 */
export interface ColumnBase<T> {
  /**
   *
   */
  readonly hide?: boolean;

  /**
   *
   */
  readonly width?: number;

  /**
   *
   */
  readonly widthMax?: number;

  /**
   *
   */
  readonly widthMin?: number;

  /**
   *
   */
  readonly widthFlex?: number;

  /**
   *
   */
  readonly headerRenderer?: HeaderCellRenderer<T>;

  /**
   *
   */
  readonly floatingRenderer?: HeaderFloatingCellRenderer<T>;

  /**
   *
   */
  readonly cellRenderer?: string | CellRendererFn<T>;

  /**
   *
   */
  readonly uiHints?: ColumnUIHints;

  /**
   *
   */
  readonly editable?: Editable<T>;

  /**
   *
   */
  readonly editRenderer?: EditRenderer<T>;

  /**
   *
   */
  readonly editSetter?: EditSetterFn<T>;

  /**
   *
   */
  readonly autosizeCellFn?: AutosizeCellFn<T>;

  /**
   *
   */
  readonly autosizeHeaderFn?: AutosizeHeaderFn<T>;
}

/**
 *
 */
export interface ColumnMarker<T> {
  /**
   *
   */
  readonly cellRenderer?: string | CellRendererFn<T>;

  /**
   *
   */
  readonly headerRenderer?: HeaderCellRenderer<T>;

  /**
   *
   */
  readonly floatingRenderer?: HeaderFloatingCellRenderer<T>;

  /**
   *
   */
  readonly width?: number;

  /**
   *
   */
  readonly uiHints?: ColumnUIHints;
}

/**
 *
 */
export interface ColumnMeta<T> {
  /**
   *
   */
  readonly columnsVisible: Column<T>[];

  /**
   *
   */
  readonly columnLookup: Map<string, Column<T>>;

  /**
   *
   */
  readonly columnVisibleStartCount: number;

  /**
   *
   */
  readonly columnVisibleCenterCount: number;

  /**
   *
   */
  readonly columnVisibleEndCount: number;
}

/**
 *
 */
export type ColumnPin = "start" | "end" | null;

/**
 *
 */
export interface RowGroupColumn<T> {
  /**
   *
   */
  readonly name?: string;

  /**
   *
   */
  readonly hide?: boolean;

  /**
   *
   */
  readonly width?: number;

  /**
   *
   */
  readonly widthMax?: number;

  /**
   *
   */
  readonly widthMin?: number;

  /**
   *
   */
  readonly widthFlex?: number;

  /**
   *
   */
  readonly pin?: ColumnPin;

  /**
   *
   */
  readonly field?: Field<T>;

  /**
   *
   */
  readonly cellRenderer?: string | CellRendererFn<T>;

  /**
   *
   */
  readonly headerRenderer?: HeaderCellRenderer<T>;

  /**
   *
   */
  readonly floatingRenderer?: HeaderFloatingCellRenderer<T>;

  /**
   *
   */
  readonly uiHints?: ColumnUIHints;

  /**
   *
   */
  readonly autosizeCellFn?: AutosizeCellFn<T>;

  /**
   *
   */
  readonly autosizeHeaderFn?: AutosizeHeaderFn<T>;
}

/**
 *
 */
export interface ColumnUIHints {
  /**
   *
   */
  readonly sortable?: boolean;

  /**
   *
   */
  readonly rowGroupable?: boolean;

  /**
   *
   */
  readonly resizable?: boolean;

  /**
   *
   */
  readonly movable?: boolean;

  /**
   *
   */
  readonly aggDefault?: string;

  /**
   *
   */
  readonly aggsAllowed?: string[];
}

/**
 *
 */
export interface ColumnGroupMeta {
  /**
   *
   */
  readonly colIdToGroupIds: Map<string, string[]>;

  /**
   *
   */
  readonly validGroupIds: Set<string>;

  /**
   *
   */
  readonly groupIsCollapsible: Map<string, boolean>;
}

/**
 *
 */
export type ColumnGroupVisibility = "always" | "close" | "open";

/**
 *
 */
export interface ClientRowDataSourceParams<T> {
  /**
   *
   */
  readonly data: T[];

  /**
   *
   */
  readonly topData?: T[];

  /**
   *
   */
  readonly bottomData?: T[];

  /**
   *
   */
  readonly reflectData?: boolean;

  /**
   *
   */
  readonly rowIdBranch?: (path: string[]) => string;

  /**
   *
   */
  readonly rowIdLeaf?: (d: RowLeaf<T>, i: number) => string;
}

/**
 *
 */
export interface RowDataSource<T> {
  /**
   *
   */
  readonly init: (grid: Grid<T>) => void;

  /**
   *
   */
  readonly rowById: (id: string) => RowNode<T> | null;

  /**
   *
   */
  readonly rowByIndex: (index: number) => RowNode<T> | null;

  /**
   *
   */
  readonly rowToIndex: (rowId: string) => number | null;

  /**
   *
   */
  readonly rowExpand: (expansion: Record<string, boolean>) => void;

  /**
   *
   */
  readonly rowSelect: (params: RdsRowSelectParams) => void;

  /**
   *
   */
  readonly rowSelectAll: (params: RowSelectAllOptions) => void;

  /**
   *
   */
  readonly rowAllChildIds: (rowId: string) => string[];

  /**
   *
   */
  readonly rowUpdate: (updates: Map<string | number, any>) => void;

  /**
   *
   */
  readonly rowDelete: (deletions: (string | number)[]) => void;

  /**
   *
   */
  readonly rowAdd: (
    newRows: any[],
    atIndex?: number | "beginning" | "end",
  ) => void;

  /**
   *
   */
  readonly rowSetTopData: (data: any[]) => void;

  /**
   *
   */
  readonly rowSetBotData: (data: any[]) => void;
}

/**
 *
 */
export interface RowDataSourceClient<T> {
  /**
   *
   */
  readonly init: (grid: Grid<T>) => void;

  /**
   *
   */
  readonly rowById: (id: string) => RowNode<T> | null;

  /**
   *
   */
  readonly rowByIndex: (index: number) => RowNode<T> | null;

  /**
   *
   */
  readonly rowToIndex: (rowId: string) => number | null;

  /**
   *
   */
  readonly rowExpand: (expansion: Record<string, boolean>) => void;

  /**
   *
   */
  readonly rowSelect: (params: RdsRowSelectParams) => void;

  /**
   *
   */
  readonly rowSelectAll: (params: RowSelectAllOptions) => void;

  /**
   *
   */
  readonly rowAllChildIds: (rowId: string) => string[];

  /**
   *
   */
  readonly rowUpdate: (updates: Map<string | number, any>) => void;

  /**
   *
   */
  readonly rowDelete: (deletions: (string | number)[]) => void;

  /**
   *
   */
  readonly rowAdd: (
    newRows: any[],
    atIndex?: number | "beginning" | "end",
  ) => void;

  /**
   *
   */
  readonly rowSetTopData: (data: any[]) => void;

  /**
   *
   */
  readonly rowSetBotData: (data: any[]) => void;
}

/**
 *
 */
export interface RowDataSourceClientPaginated<T> {
  /**
   *
   */
  readonly init: (grid: Grid<T>) => void;

  /**
   *
   */
  readonly rowById: (id: string) => RowNode<T> | null;

  /**
   *
   */
  readonly rowByIndex: (index: number) => RowNode<T> | null;

  /**
   *
   */
  readonly rowToIndex: (rowId: string) => number | null;

  /**
   *
   */
  readonly rowExpand: (expansion: Record<string, boolean>) => void;

  /**
   *
   */
  readonly rowSelect: (params: RdsRowSelectParams) => void;

  /**
   *
   */
  readonly rowSelectAll: (params: RowSelectAllOptions) => void;

  /**
   *
   */
  readonly rowAllChildIds: (rowId: string) => string[];

  /**
   *
   */
  readonly rowUpdate: (updates: Map<string | number, any>) => void;

  /**
   *
   */
  readonly rowDelete: (deletions: (string | number)[]) => void;

  /**
   *
   */
  readonly rowAdd: (
    newRows: any[],
    atIndex?: number | "beginning" | "end",
  ) => void;

  /**
   *
   */
  readonly rowSetTopData: (data: any[]) => void;

  /**
   *
   */
  readonly rowSetBotData: (data: any[]) => void;

  /**
   *
   */
  readonly page: RowDataSourceClientPageState;
}

/**
 *
 */
export interface RowDataSourceClientPageState {
  /**
   *
   */
  readonly current: GridAtom<number>;

  /**
   *
   */
  readonly perPage: GridAtom<number>;

  /**
   *
   */
  readonly pageCount: GridAtomReadonly<number>;
}

/**
 *
 */
export interface RowDataStore<T> {
  /**
   *
   */
  readonly rowCount: GridAtomReadonly<number>;

  /**
   *
   */
  readonly rowTopCount: GridAtom<number>;

  /**
   *
   */
  readonly rowCenterCount: GridAtom<number>;

  /**
   *
   */
  readonly rowBottomCount: GridAtom<number>;

  /**
   *
   */
  readonly rowForIndex: (
    row: number,
  ) => GridAtomReadonlyUnwatchable<RowNode<T> | null>;

  /**
   *
   */
  readonly rowClearCache: () => void;

  /**
   *
   */
  readonly rowInvalidateIndex: (row: number) => void;
}

/**
 *
 */
export interface RdsRowSelectParams {
  /**
   *
   */
  readonly startId: string;

  /**
   *
   */
  readonly endId: string;

  /**
   *
   */
  readonly selectChildren: boolean;

  /**
   *
   */
  readonly deselect: boolean;

  /**
   *
   */
  readonly mode: RowSelectionMode;
}

/**
 *
 */
export interface GridAtom<T> {
  /**
   *
   */
  readonly get: () => T;

  /**
   *
   */
  readonly set: (v: T | ((p: T) => T)) => void;

  /**
   *
   */
  readonly watch: (fn: () => void) => () => void;

  /**
   *
   */
  readonly useValue: () => T;
}

/**
 *
 */
export interface GridAtomReadonly<T> {
  /**
   *
   */
  readonly get: () => T;

  /**
   *
   */
  readonly watch: (fn: () => void) => () => void;

  /**
   *
   */
  readonly useValue: () => T;
}

/**
 *
 */
export interface GridAtomReadonlyUnwatchable<T> {
  /**
   *
   */
  readonly get: () => T;

  /**
   *
   */
  readonly useValue: () => T;
}

/**
 *
 */
export type RowFullWidthPredicate<T> = (
  /**
   *
   */
  params: RowFullWidthPredicateParams<T>,
) => boolean;

/**
 *
 */
export interface RowFullWidthPredicateParams<T> {
  /**
   *
   */
  readonly grid: Grid<T>;

  /**
   *
   */
  readonly rowIndex: number;

  /**
   *
   */
  readonly row: RowNode<T>;
}

/**
 *
 */
export type RowFullWidthRendererFn<T> = (
  /**
   *
   */
  params: RowFullWidthRendererParams<T>,
) => ReactNode;

/**
 *
 */
export interface RowFullWidthRendererParams<T> {
  /**
   *
   */
  readonly rowIndex: number;

  /**
   *
   */
  readonly row: RowNode<T>;

  /**
   *
   */
  readonly grid: Grid<T>;

  /**
   *
   */
  readonly rowSelected: boolean;

  /**
   *
   */
  readonly rowIndeterminate: boolean;
}

/**
 * The branch row type represents a row that has more rows underneath it, considered its child
 * rows. A branch row may be expanded (in which case the children rows will be visible) or
 * collapsed (in which case the children rows will not be visible). The children rows may be
 * {@link RowLeaf} or {@link RowGroup} rows.
 */
export interface RowGroup {
  /**
   * A unique `id` for a given row. The `id` is generated by a given {@link RowDataSource}.
   * Every row should have a unique `id` associated with.
   *
   * See:
   * - [Row Data Source](TODO): Learn how rows are created and updated.
   */
  readonly id: string;

  /**
   * An optional property that indicates if a row is loading data. Primarily used to support
   * asynchronous row loading.
   *
   * See:
   * - [Async Row Data Source](TODO): An asynchronous row data source
   */
  readonly loading?: boolean;

  /**
   * An error associated with a row. This is implementation dependent. The type is not known
   * ahead of time, and should be checked for interacting with the error value.
   */
  readonly error?: unknown;

  /**
   * A type discriminant used to narrow the {@link RowNode} to the {@link RowGroup} type.
   */
  readonly kind: "branch";

  /**
   * A path key associated with the branch node. The view of the grid is a flattened tree. A
   * branch represents a fork in the tree, and the key is the path value associated with that
   * fork.
   */
  readonly key: string;

  /**
   * The data associated with the branch node. This must be a JavaScript object with string values
   * for the key. The data values may be any type. This data is usually the result of aggregating
   * the children rows of a branch node, but this is not strictly enforced.
   */
  readonly data: Record<string, unknown>;

  /**
   *
   */
  readonly depth: number;
}

/**
 *
 */
export type RowHeight = number | `fill:${number}` | ((i: number) => number);

/**
 * The leaf row type. As the name suggests, leaf rows do not have any further children rows
 * underneath them. Leaf rows are generally used to derivate aggregations and groupings. A
 * complete flat data grid will only have leaf rows.
 */
export interface RowLeaf<T = any> {
  /**
   * A unique `id` for a given row. The `id` is generated by a given {@link RowDataSource}.
   * Every row should have a unique `id` associated with.
   *
   * See:
   * - [Row Data Source](TODO): Learn how rows are created and updated.
   */
  readonly id: string;

  /**
   * An optional property that indicates if a row is loading data. Primarily used to support
   * asynchronous row loading.
   *
   * See:
   * - [Async Row Data Source](TODO): An asynchronous row data source
   */
  readonly loading?: boolean;

  /**
   * An error associated with a row. This is implementation dependent. The type is not known
   * ahead of time, and should be checked for interacting with the error value.
   */
  readonly error?: unknown;

  /**
   * A type discriminant used to narrow the {@link RowNode} type to a {@link RowLeaf} type.
   */
  readonly kind: "leaf";

  /**
   * The data associated with the row. The data may be any type but is normally a plain
   * JavaScript object or array. The row data is provided to a column field to determine
   * the value for a given cell for a particular column.
   *
   * See:
   * - {@link Column}: Column's use a row's data field to determine the value of a cell.
   * - {@link ColumnField}: The column field determines how a cell's value is calculated.
   * - [Column Field](TODO): See the full guide on column fields and learn how cell values are determined.
   */
  readonly data: T;
}

/**
 * The union type of {@link RowLeaf} and {@link RowGroup}. A row node is a any row that may be
 * displayed in the grid or used for data aggregation purposes.
 *
 * See:
 * - [Row Nodes](TODO): Learn more about the row nodes in the grid
 */
export type RowNode<T> = RowLeaf<T> | RowGroup;

/**
 * The frozen state of the row. Rows may be pinned top or bottom. A pinned row remains visible
 * regardless of the scroll position. Rows pinned bottom will be displayed above rows pinned top
 * if there is not enough viewport space available.
 *
 * See:
 * - [Row Pinning](TODO): Learn how row pinning works.
 * - [Column Pinning](TODO): The opposite of pinning rows, is pinning columns. They can be used together.
 */
export type RowPin = "top" | "bottom" | null;

/**
 *
 */
export type RowSection = "top" | "bottom" | "center" | "flat";

/**
 *
 */
export type CellSpanFn<T> = (
  /**
   *
   */
  params: CellSpanFnParams<T>,
) => number;

/**
 *
 */
export interface CellSpanFnParams<T> {
  /**
   *
   */
  readonly grid: Grid<T>;

  /**
   *
   */
  readonly rowIndex: number;

  /**
   *
   */
  readonly colIndex: number;

  /**
   *
   */
  readonly row: RowNode<T>;
}

/**
 *
 */
export type FieldDataParam<T> =
  | { kind: "leaf"; data: T }
  | { kind: "branch"; data: Record<string, unknown>; key: string };

/**
 *
 */
export type FieldFn<T> = (
  /**
   *
   */
  params: FieldFnParams<T>,
) => unknown;

/**
 *
 */
export interface FieldFnParams<T> {
  /**
   *
   */
  readonly grid: Grid<T>;

  /**
   *
   */
  readonly column: Column<T>;

  /**
   *
   */
  readonly data: FieldDataParam<T>;
}

/**
 *
 */
export interface FieldPath {
  /**
   *
   */
  readonly kind: "path";

  /**
   *
   */
  readonly path: string;
}

/**
 *
 */
export type FieldRowGroupFn<T> = (
  /**
   *
   */
  params: FieldRowGroupParamsFn<T>,
) => unknown;

/**
 *
 */
export interface FieldRowGroupParamsFn<T> {
  /**
   *
   */
  readonly grid: Grid<T>;

  /**
   *
   */
  readonly data: T;
}

/**
 *
 */
export type FieldRowGroup<T> = number | string | FieldPath | FieldRowGroupFn<T>;

/**
 *
 */
export type Field<T> = number | string | FieldPath | FieldFn<T>;

/**
 *
 */
export type CellRendererFn<T> = (
  /**
   *
   */
  params: CellRendererParams<T>,
) => ReactNode;

/**
 *
 */
export interface CellRendererParams<T> {
  /**
   *
   */
  readonly grid: Grid<T>;

  /**
   *
   */
  readonly column: Column<T>;

  /**
   *
   */
  readonly row: RowNode<T>;

  /**
   *
   */
  readonly rowIndex: number;

  /**
   *
   */
  readonly colIndex: number;

  /**
   *
   */
  readonly rowSelected: boolean;

  /**
   *
   */
  readonly rowIndeterminate: boolean;
}

/**
 *
 */
export interface ColumnAutosizeParams<T> {
  /**
   *
   */
  readonly dryRun?: boolean;

  /**
   *
   */
  readonly includeHeader?: boolean;

  /**
   *
   */
  readonly columns?: (string | number | Column<T>)[];
}

/**
 *
 */
export interface ColumnMoveParams<T> {
  /**
   *
   */
  readonly moveColumns: (string | Column<T>)[];

  /**
   *
   */
  readonly moveTarget: string | number | Column<T>;

  /**
   *
   */
  readonly before?: boolean;

  /**
   *
   */
  readonly updatePinState?: boolean;
}

/**
 *
 */
export type FocusCellParams<T> =
  | { row: number; column: string | number | Column<T> }
  | PositionHeaderCell
  | Omit<PositionHeaderGroupCell, "columnStartIndex" | "columnEndIndex">
  | "next"
  | "prev"
  | "up"
  | "down";

/**
 *
 */
export interface GridApi<T> {
  /**
   *
   */
  readonly columnField: (
    columnOrId: string | Column<T>,
    row: FieldDataParam<T>,
  ) => unknown;

  /**
   *
   */
  readonly columnFromIndex: (columnIndex: number) => Column<T> | null;

  /**
   *
   */
  readonly columnIndex: (columnOrId: string | Column<T>) => number;

  /**
   *
   */
  readonly sortForColumn: (
    columnOrId: string,
  ) => { sort: SortModelItem<T>; index: number } | null;

  /**
   *
   */
  readonly rowIsLeaf: (row: RowNode<T>) => row is RowLeaf<T>;

  /**
   *
   */
  readonly rowIsGroup: (row: RowNode<T>) => row is RowGroup;

  /**
   *
   */
  readonly rowGroupColumnIndex: (c: Column<T>) => number;

  /**
   *
   */
  readonly rowGroupToggle: (row: RowGroup, state?: boolean) => void;

  /**
   *
   */
  readonly rowGroupApplyExpansions: (
    expansions: Record<string, boolean>,
  ) => void;

  /**
   *
   */
  readonly rowGroupIsExpanded: (row: RowGroup) => boolean;

  /**
   *
   */
  readonly eventAddListener: <K extends keyof GridEvents<T>>(
    event: K,
    fn: (event: Parameters<Required<GridEvents<T>>[K]>[0]) => void,
  ) => () => void;

  /**
   *
   */
  readonly eventRemoveListener: <K extends keyof GridEvents<T>>(
    event: K,
    fn: (event: Parameters<Required<GridEvents<T>>[K]>[0]) => void,
  ) => void;

  /**
   *
   */
  readonly eventFire: <K extends keyof GridEvents<T>>(
    name: K,
    event: Parameters<Required<GridEvents<T>>[K]>[0],
  ) => void;

  /**
   *
   */
  readonly scrollIntoView: (options: ScrollIntoViewOptions<T>) => void;

  /**
   *
   */
  readonly focusCell: (position: FocusCellParams<T>) => void;

  /**
   *
   */
  readonly editBegin: (params: EditBeginParams<T>) => void;

  /**
   *
   */
  readonly editEnd: (cancel?: boolean) => void;

  /**
   *
   */
  readonly editIsCellActive: (params: EditBeginParams<T>) => boolean;

  /**
   *
   */
  readonly editUpdate: (params: EditUpdateParams<T>) => void;

  /**
   *
   */
  readonly rowDetailIsExpanded: (rowOrId: string | RowNode<T>) => boolean;

  /**
   *
   */
  readonly rowDetailToggle: (
    rowOrId: string | RowNode<T>,
    state?: boolean,
  ) => void;

  /**
   *
   */
  readonly rowDetailRenderedHeight: (rowOrId: string | RowNode<T>) => number;

  /**
   *
   */
  readonly rowById: (id: string) => RowNode<T> | null | undefined;

  /**
   *
   */
  readonly rowByIndex: (
    index: number,
    section?: RowSection,
  ) => RowNode<T> | null | undefined;

  /**
   *
   */
  readonly rowSelect: (params: RowSelectOptions) => void;

  /**
   *
   */
  readonly rowSelectAll: (params?: RowSelectAllOptions) => void;

  /**
   *
   */
  readonly rowSelected: () => RowNode<T>[];

  /**
   *
   */
  readonly rowHandleSelect: (params: RowHandleSelect) => void;

  /**
   *
   */
  readonly useRowDrag: (params: UseRowDragParams<T>) => {
    dragProps: any;
    isDragging: boolean;
  };

  /**
   *
   */
  readonly columnResize: (columns: Record<string, number>) => void;

  /**
   *
   */
  readonly columnById: (id: string) => Column<T> | undefined;

  /**
   *
   */
  readonly columnUpdate: (
    updates: Record<string, Omit<Column<T>, "id">>,
  ) => void;

  /**
   *
   */
  readonly columnMove: (params: ColumnMoveParams<T>) => void;

  /**
   *
   */
  readonly columnToggleGroup: (
    group: string | string[],
    state?: boolean,
  ) => void;

  /**
   *
   */
  readonly columnAutosize: (
    params: ColumnAutosizeParams<T>,
  ) => Record<string, number>;

  /**
   *
   */
  readonly exportDataRect: (
    params?: ExportDataRectParams,
  ) => ExportDataRectResult<T>;

  /**
   *
   */
  readonly exportCsv: (params?: ExportCsvParams) => Promise<string>;

  /**
   *
   */
  readonly exportCsvFile: (params?: ExportCsvParams) => Promise<Blob>;
}

/**
 *
 */
export interface RowHandleSelect {
  /**
   *
   */
  readonly target: EventTarget;

  /**
   *
   */
  readonly shiftKey: boolean;
}

/**
 *
 */
export interface ScrollIntoViewOptions<T> {
  /**
   *
   */
  readonly column?: number | string | Column<T>;

  /**
   *
   */
  readonly row?: number;

  /**
   *
   */
  readonly behavior?: "smooth" | "auto" | "instant";
}

/**
 *
 */
export type SortComparatorFn<T> = (
  /**
   *
   */
  left: FieldDataParam<T>,
  /**
   *
   */
  right: FieldDataParam<T>,
  /**
   *
   */
  options: any,
) => number;

/**
 *
 */
export type SortComparators = "string" | "number" | "date" | (string & {});

/**
 *
 */
export interface SortCustomSort<T> {
  /**
   *
   */
  readonly columnId: string | null;

  /**
   *
   */
  readonly kind: "custom";

  /**
   *
   */
  readonly comparator: SortComparatorFn<T>;

  /**
   *
   */
  readonly options?: any;
}

/**
 *
 */
export interface SortDateColumnSort {
  /**
   *
   */
  readonly kind: "date";

  /**
   *
   */
  readonly options?: SortDateComparatorOptions;
}

/**
 *
 */
export interface SortDateComparatorOptions {
  /**
   *
   */
  readonly nullsFirst?: boolean;

  /**
   *
   */
  readonly toIsoDateString?: (v: unknown) => string;

  /**
   *
   */
  readonly includeTime?: boolean;
}

/**
 *
 */
export type SortGridSorts<T> =
  | SortCustomSort<T>
  | SortDateColumnSort
  | SortNumberColumnSort
  | SortStringColumnSort;

/**
 *
 */
export interface SortModelItem<T> {
  /**
   *
   */
  readonly sort: SortGridSorts<T>;

  /**
   *
   */
  readonly columnId: string | null;

  /**
   *
   */
  readonly isDescending?: boolean;
}

/**
 *
 */
export interface SortNumberColumnSort {
  /**
   *
   */
  readonly kind: "number";

  /**
   *
   */
  readonly options?: SortNumberComparatorOptions;
}

/**
 *
 */
export interface SortNumberComparatorOptions {
  /**
   *
   */
  readonly nullsFirst?: boolean;

  /**
   *
   */
  readonly absoluteValue?: boolean;
}

/**
 *
 */
export interface SortStringColumnSort {
  /**
   *
   */
  readonly kind: "string";

  /**
   *
   */
  readonly options?: SortStringComparatorOptions;
}

/**
 *
 */
export interface SortStringComparatorOptions {
  /**
   *
   */
  readonly caseInsensitive?: boolean;

  /**
   *
   */
  readonly trimWhitespace?: boolean;

  /**
   *
   */
  readonly ignorePunctuation?: boolean;

  /**
   *
   */
  readonly locale?: string;

  /**
   *
   */
  readonly collator?: Intl.Collator;

  /**
   *
   */
  readonly nullsFirst?: boolean;
}

/**
 *
 */
export interface FilterCombination {
  /**
   *
   */
  readonly kind: "combination";

  /**
   *
   */
  readonly operator: FilterCombinationOperator;

  /**
   *
   */
  readonly filters: Array<
    FilterNumber | FilterString | FilterDate | FilterCombination
  >;
}

/**
 *
 */
export type FilterCombinationOperator = "AND" | "OR";

/**
 *
 */
export interface FilterDate {
  /**
   *
   */
  readonly kind: "date";

  /**
   *
   */
  readonly field: string;

  /**
   *
   */
  readonly operator: FilterDateOperator;

  /**
   *
   */
  readonly value: string | number | null;

  /**
   *
   */
  readonly options?: FilterDateOptions;
}

/**
 * The operators available for the date filter. The operator used determines the type of
 * value that should be used.
 */
export type FilterDateOperator =
  | "equals"
  | "not_equals"
  | "before"
  | "before_or_equals"
  | "after"
  | "after_or_equals"
  | "year_to_date"
  | "this_week"
  | "this_month"
  | "this_year"
  | "last_week"
  | "last_month"
  | "last_year"
  | "next_week"
  | "next_month"
  | "next_year"
  | "today"
  | "tomorrow"
  | "yesterday"
  | "week_of_year"
  | "quarter_of_year"
  | "is_weekend"
  | "is_weekday"
  | "n_days_ago"
  | "n_days_ahead"
  | "n_weeks_ago"
  | "n_weeks_ahead"
  | "n_months_ago"
  | "n_months_ahead"
  | "n_years_ago"
  | "n_years_ahead";

/**
 *
 */
export interface FilterDateOptions {
  /**
   * When filtering `null` values represent the absence of a value. Since there is not value
   * to compare the filter on - there are two choices; keep the value, or filter it out. The
   * `nullHandling` property determines which option to take, where `"ignore"` will filter
   * out null values and `"include"` will keep them.
   *
   * It's important to note that filtering is performed by the row data source attached to the
   * grid, hence the actual behavior depends on the source. A properly behaving data source will
   * filter `null` values accordingly but not all sources may choose to do this. Furthermore,
   * depending on the operator used for the filter, the `nullHandling` property may be ignored.
   * For example, when comparing for equality ('===') the filter implementation should check that
   * the current value is equal to the filter value - including the absence of a value. Intuitively
   * this makes sense as it allows the equality operator to be used to check for `null` values
   * themselves.
   */
  readonly nullHandling?: "ignore" | "include";

  /**
   * If the time should be used for date filter evaluations. By default only the date is
   * considered. Setting the `includeTime` to `true` will make the comparisons time aware.
   */
  readonly includeTime?: boolean;
}

/**
 *
 */
export interface FilterDynamic<T> {
  /**
   *
   */
  readonly kind: "func";

  /**
   *
   */
  readonly func: FilterFn<T>;
}

/**
 *
 */
export type FilterFn<T> = (
  /**
   *
   */
  params: FilterFnParams<T>,
) => boolean;

/**
 *
 */
export interface FilterFnParams<T> {
  /**
   *
   */
  readonly data: T;

  /**
   *
   */
  readonly grid: Grid<T>;
}

/**
 *
 */
export type FilterModelItem<T> =
  | FilterNumber
  | FilterString
  | FilterDate
  | FilterCombination
  | FilterDynamic<T>;

/**
 * The number filter is used to filter out rows based on a column that contains number values.
 * Most useful for numerical datasets.
 *
 * See:
 * - [Filters](TODO): Overview of the filters
 */
export interface FilterNumber {
  /**
   * A type discriminant for the {@link FilterNumber} type, which may be used to narrow the
   * the type when given a set of filters. Mainly used in the evaluation of filters, for example
   * a {@link FilterCombination} accepts filters of different types.
   */
  readonly kind: "number";

  /**
   * The column reference the filter should use. This is used to extract a field value for the
   * filter for a given row. This should be the `id` of a column.
   */
  readonly field: string;

  /**
   * The number filter operator to use when evaluating the filter. This value should be the string
   * name of the operator, for example "equals" and not "==".
   */
  readonly operator: FilterNumberOperator;

  /**
   * The filter value to compare with. The actual filter evaluation outcome is determined by the
   * operator applied.
   */
  readonly value: number | null;

  /**
   * The filter number options to apply to the filter. Filter options alter the evaluation result
   * of a filter, for example using the absolute value of a number when performing the operator
   * calculation.
   */
  readonly options?: FilterNumberOptions;
}

/**
 * The operators that may be used for the a number filter. These correspond to the standard expected
 * logical operators, like >, and <.
 */
export type FilterNumberOperator =
  | "greater_than"
  | "greater_than_or_equals"
  | "less_than"
  | "less_than_or_equals"
  | "equals"
  | "not_equals";

/**
 * The filter options that may be provided to a number filter. The filter options will adjust
 * how the number filter behaves providing more flexibility to less effort.
 */
export interface FilterNumberOptions {
  /**
   * Makes the number filter only consider the magnitude of a number value ignoring its sign.
   * Useful when the size of the number is the main consideration.
   */
  readonly absolute?: boolean;

  /**
   * The epsilon value to use when comparing numbers. Mostly useful when comparing floats. By
   * default the value is 0.0001 however it may be adjusted for higher or lower precision.
   */
  readonly epsilon?: number;

  /**
   * When filtering `null` values represent the absence of a value. Since there is not value
   * to compare the filter on - there are two choices; keep the value, or filter it out. The
   * `nullHandling` property determines which option to take, where `"ignore"` will filter
   * out null values and `"include"` will keep them.
   *
   * It's important to note that filtering is performed by the row data source attached to the
   * grid, hence the actual behavior depends on the source. A properly behaving data source will
   * filter `null` values accordingly but not all sources may choose to do this. Furthermore,
   * depending on the operator used for the filter, the `nullHandling` property may be ignored.
   * For example, when comparing for equality ('===') the filter implementation should check that
   * the current value is equal to the filter value - including the absence of a value. Intuitively
   * this makes sense as it allows the equality operator to be used to check for `null` values
   * themselves.
   */
  readonly nullHandling?: "ignore" | "include";
}

/**
 * The string filter used to evaluate values that are string based. Used to filter out rows based
 * on the string values of a particular column.
 */
export interface FilterString {
  /**
   * A type discriminant for the {@link FilterString} type, which may be used to narrow the
   * the type when given a set of filters. Mainly used in the evaluation of filters, for example
   * a {@link FilterCombination} accepts filters of different types.
   */
  readonly kind: "string";

  /**
   * The column reference the filter should use. This is used to extract a field value for the
   * filter for a given row. This should be the `id` of a column.
   */
  readonly field: string;

  /**
   * The string filter operator to use when evaluating the filter. This value should be the string
   * name of the operator, for example "equals" and not "==".
   */
  readonly operator: FilterStringOperator;

  /**
   * The string filter evaluation value. For some filter operators a `number` value makes
   * sense, for example, when comparing the lengths of strings. It is an undefined error to
   * use a `number` value where a filter operator expects a `string`.
   */
  readonly value: string | number | null;

  /**
   * The options to apply for the string filter evaluation. The string options may be used to
   * alter the behavior of filter evaluation, for example to make comparisons case insensitive.
   */
  readonly options?: FilterStringOptions;
}

/**
 * The string collation options used to create an Intl.Collator object that will be used for
 * string comparisons.
 */
export interface FilterStringCollation {
  /**
   * The locale to use for string comparisons and operators. It should be one of the predefined
   * types. If not provided the default locale on the system is used.
   */
  readonly locale: Locale;

  /**
   * The locale sensitivity - used to construct an Intl.Collator object. Refer to the
   * [MDN docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Collator)
   * for more information.
   */
  readonly sensitivity?: Intl.CollatorOptions["sensitivity"];
}

/**
 * The filter operator for strings. Some operators expect the value provided to be a number,
 * for example when comparing the length of strings.
 */
export type FilterStringOperator =
  | "equals"
  | "not_equals"
  | "less_than"
  | "less_than_or_equals"
  | "greater_than"
  | "greater_than_or_equals"
  | "begins_with"
  | "not_begins_with"
  | "ends_with"
  | "not_ends_with"
  | "contains"
  | "not_contains"
  | "length"
  | "not_length"
  | "matches"
  | "length_less_than"
  | "length_less_than_or_equals"
  | "length_greater_than"
  | "length_greater_than_or_equals";

/**
 * The options to use for filter string evaluation. The options allow filter evaluation behavior
 * to be altered in specific ways, such as ignoring letter casing, trimming whitespace, and
 * ignoring punctuation. The filter string options additionally allow a locale to be used for
 * string filtering.
 */
export interface FilterStringOptions {
  /**
   * The regex opts to use for the construction of a regex object to use for the `matches`
   * string filter operator. See the [MDN docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_expressions#advanced_searching_with_flags)
   * for information on the different flags.
   */
  readonly regexOpts?: string;

  /**
   * A flag to determine if whitespace should be stripped before string comparisons. This will
   * result in leading and trailing whitespace to be ignored when performing string comparisons.
   */
  readonly trimWhitespace?: boolean;

  /**
   * A flag indicating if the comparison should be case insensitive. By default comparisons
   * are case insensitive if the filter value does not contain an upper case letter. However,
   * depending on the collator sensitivity the default value may
   * actually be case insensitive. For example a collator sensitivity of `"base"` or
   * `"accent"` result in case case insensitive comparisons.
   */
  readonly caseInsensitive?: boolean;

  /**
   * If punctuation characters should be ignored when performing string comparisons. By default
   * punctuation is considered.
   */
  readonly ignorePunctuation?: boolean;

  /**
   * When filtering `null` values represent the absence of a value. Since there is not value
   * to compare the filter on - there are two choices; keep the value, or filter it out. The
   * `nullHandling` property determines which option to take, where `"ignore"` will filter
   * out null values and `"include"` will keep them.
   *
   * It's important to note that filtering is performed by the row data source attached to the
   * grid, hence the actual behavior depends on the source. A properly behaving data source will
   * filter `null` values accordingly but not all sources may choose to do this. Furthermore,
   * depending on the operator used for the filter, the `nullHandling` property may be ignored.
   * For example, when comparing for equality ('===') the filter implementation should check that
   * the current value is equal to the filter value - including the absence of a value. Intuitively
   * this makes sense as it allows the equality operator to be used to check for `null` values
   * themselves.
   */
  readonly nullHandling?: "ignore" | "include";

  /**
   * The collation parameters to use for the filter evaluation. If provided these parameters will
   * be used to create an `Intl.Collator` object that is then used in the comparison operator
   * for filter evaluation.
   */
  readonly collation?: FilterStringCollation;
}

/**
 *
 */
export type Locale =
  | "en-US"
  | "en-GB"
  | "en-CA"
  | "en-AU"
  | "en-IN"
  | "fr-FR"
  | "fr-CA"
  | "fr-BE"
  | "fr-CH"
  | "es-ES"
  | "es-MX"
  | "es-AR"
  | "es-CO"
  | "zh-CN"
  | "zh-TW"
  | "zh-HK"
  | "zh-Hant"
  | "zh-Hans"
  | "ar-SA"
  | "ar-EG"
  | "ar-AE"
  | "de-DE"
  | "de-AT"
  | "de-CH"
  | "ja-JP"
  | "ko-KR"
  | "hi-IN"
  | "pt-BR"
  | "pt-PT"
  | "ru-RU"
  | "uk-UA"
  | "pl-PL"
  | "it-IT"
  | "nl-NL"
  | "sv-SE"
  | "tr-TR"
  | "th-TH"
  | "vi-VN"
  | "he-IL"
  | "fa-IR"
  | "el-GR";

/**
 *
 */
export type AggFn<T> = (
  /**
   *
   */
  data: T[],
  /**
   *
   */
  grid: Grid<T>,
) => unknown;

/**
 *
 */
export type AggModelFn<T> = string | AggFn<T>;

/**
 *
 */
export type RowGroupDisplayMode = "single-column" | "multi-column" | "custom";

/**
 *
 */
export interface RowGroupField<T> {
  /**
   *
   */
  readonly kind: "field";

  /**
   *
   */
  readonly id: string;

  /**
   *
   */
  readonly field: FieldRowGroup<T>;

  /**
   *
   */
  readonly name?: string;
}

/**
 *
 */
export type RowGroupModelItem<T> = string | RowGroupField<T>;

/**
 *
 */
export type ColumnMoveBeginFn<T> = (
  /**
   *
   */
  params: ColumnMoveBeginParams<T>,
) => void;

/**
 *
 */
export interface ColumnMoveBeginParams<T> {
  /**
   *
   */
  readonly grid: Grid<T>;

  /**
   *
   */
  readonly preventDefault: () => void;

  /**
   *
   */
  readonly moveColumns: Column<T>[];

  /**
   *
   */
  readonly moveTarget: Column<T>;

  /**
   *
   */
  readonly before: boolean;

  /**
   *
   */
  readonly updatePinState: boolean;
}

/**
 *
 */
export type ColumnMoveEndFn<T> = (
  /**
   *
   */
  params: ColumnMoveEndParams<T>,
) => void;

/**
 *
 */
export interface ColumnMoveEndParams<T> {
  /**
   *
   */
  readonly grid: Grid<T>;

  /**
   *
   */
  readonly moveColumns: Column<T>[];

  /**
   *
   */
  readonly moveTarget: Column<T>;

  /**
   *
   */
  readonly before: boolean;

  /**
   *
   */
  readonly updatePinState: boolean;
}

/**
 *
 */
export type EditBegin<T> = (
  /**
   *
   */
  params: OnEditBeginParams<T>,
) => void;

/**
 *
 */
export type EditCancel<T> = (
  /**
   *
   */
  params: OnEditCancelParams<T>,
) => void;

/**
 *
 */
export type EditEnd<T> = (
  /**
   *
   */
  params: OnEditEndParams<T>,
) => void;

/**
 *
 */
export type EditError<T> = (
  /**
   *
   */
  params: OnEditErrorParams<T>,
) => void;

/**
 *
 */
export interface GridEvents<T> {
  /**
   *
   */
  readonly rowExpandBegin?: RowExpandBeginFn<T>;

  /**
   *
   */
  readonly rowExpand?: RowExpandFn<T>;

  /**
   *
   */
  readonly rowExpandError?: RowExpandErrorFn<T>;

  /**
   *
   */
  readonly editBegin?: EditBegin<T>;

  /**
   *
   */
  readonly editEnd?: EditEnd<T>;

  /**
   *
   */
  readonly editCancel?: EditCancel<T>;

  /**
   *
   */
  readonly editError?: EditError<T>;

  /**
   *
   */
  readonly rowDetailExpansionBegin?: RowDetailExpansionBegin<T>;

  /**
   *
   */
  readonly rowDetailExpansionEnd?: RowDetailExpansionEnd<T>;

  /**
   *
   */
  readonly rowSelectBegin?: RowSelectBegin<T>;

  /**
   *
   */
  readonly rowSelectEnd?: RowSelectEnd<T>;

  /**
   *
   */
  readonly rowSelectAllBegin?: RowSelectAllBegin<T>;

  /**
   *
   */
  readonly rowSelectAllEnd?: RowSelectAllEnd<T>;

  /**
   *
   */
  readonly columnMoveDragBegin?: ColumnMoveBeginFn<T>;

  /**
   *
   */
  readonly columnMoveDragEnd?: ColumnMoveEndFn<T>;

  /**
   *
   */
  readonly columnMoveBegin?: ColumnMoveBeginFn<T>;

  /**
   *
   */
  readonly columnMoveEnd?: ColumnMoveEndFn<T>;
}

/**
 *
 */
export type RowDetailExpansionBegin<T> = (
  /**
   *
   */
  params: RowDetailExpansionBeginParams<T>,
) => void;

/**
 *
 */
export interface RowDetailExpansionBeginParams<T> {
  /**
   *
   */
  readonly grid: Grid<T>;

  /**
   *
   */
  readonly expansions: Set<string>;

  /**
   *
   */
  readonly preventDefault: () => void;
}

/**
 *
 */
export type RowDetailExpansionEnd<T> = (
  /**
   *
   */
  params: RowDetailExpansionEndParams<T>,
) => void;

/**
 *
 */
export interface RowDetailExpansionEndParams<T> {
  /**
   *
   */
  readonly grid: Grid<T>;

  /**
   *
   */
  readonly expansions: Set<string>;
}

/**
 *
 */
export type RowExpandFn<T> = (
  /**
   *
   */
  params: RowExpandParams<T>,
) => void;

/**
 *
 */
export type RowExpandBeginFn<T> = (
  /**
   *
   */
  params: RowExpandBeginParams<T>,
) => void;

/**
 *
 */
export interface RowExpandBeginParams<T> {
  /**
   *
   */
  readonly grid: Grid<T>;

  /**
   *
   */
  readonly expansions: { [rowId: string]: boolean };

  /**
   *
   */
  readonly preventNext: () => void;
}

/**
 *
 */
export type RowExpandErrorFn<T> = (
  /**
   *
   */
  params: RowExpandErrorParams<T>,
) => void;

/**
 *
 */
export interface RowExpandErrorParams<T> {
  /**
   *
   */
  readonly grid: Grid<T>;

  /**
   *
   */
  readonly expansions: { [rowId: string]: boolean };

  /**
   *
   */
  readonly error: unknown;
}

/**
 *
 */
export interface RowExpandParams<T> {
  /**
   *
   */
  readonly grid: Grid<T>;

  /**
   *
   */
  readonly expansions: { [rowId: string]: boolean };
}

/**
 *
 */
export type RowSelectAllBegin<T> = (
  /**
   *
   */
  params: RowSelectAllBeginParams<T>,
) => void;

/**
 *
 */
export interface RowSelectAllBeginParams<T> {
  /**
   *
   */
  readonly deselect: boolean;

  /**
   *
   */
  readonly grid: Grid<T>;

  /**
   *
   */
  readonly preventDefault: () => void;
}

/**
 *
 */
export type RowSelectAllEnd<T> = (
  /**
   *
   */
  params: RowSelectAllEndParams<T>,
) => void;

/**
 *
 */
export interface RowSelectAllEndParams<T> {
  /**
   *
   */
  readonly deselect: boolean;

  /**
   *
   */
  readonly grid: Grid<T>;
}

/**
 *
 */
export type RowSelectBegin<T> = (
  /**
   *
   */
  params: RowSelectBeginParams<T>,
) => void;

/**
 *
 */
export interface RowSelectBeginParams<T> {
  /**
   *
   */
  readonly selected: string;

  /**
   *
   */
  readonly grid: Grid<T>;

  /**
   *
   */
  readonly deselect: boolean;

  /**
   *
   */
  readonly preventDefault: () => void;
}

/**
 *
 */
export type RowSelectEnd<T> = (
  /**
   *
   */
  params: RowSelectEndParams<T>,
) => void;

/**
 *
 */
export interface RowSelectEndParams<T> {
  /**
   *
   */
  readonly selected: string;

  /**
   *
   */
  readonly grid: Grid<T>;

  /**
   *
   */
  readonly deselect: boolean;
}

/**
 *
 */
export type HeaderCellRendererFn<T> = (
  /**
   *
   */
  params: HeaderCellRendererParams<T>,
) => ReactNode;

/**
 *
 */
export interface HeaderCellRendererParams<T> {
  /**
   *
   */
  readonly grid: Grid<T>;

  /**
   *
   */
  readonly column: Column<T>;
}

/**
 *
 */
export type HeaderFloatingCellRendererFn<T> = (
  /**
   *
   */
  params: HeaderFloatingCellRendererParams<T>,
) => ReactNode;

/**
 *
 */
export interface HeaderFloatingCellRendererParams<T> {
  /**
   *
   */
  readonly grid: Grid<T>;

  /**
   *
   */
  readonly column: Column<T>;
}

/**
 *
 */
export type HeaderFloatingCellRenderer<T> =
  | string
  | HeaderFloatingCellRendererFn<T>;

/**
 *
 */
export type HeaderCellRenderer<T> = string | HeaderCellRendererFn<T>;

/**
 *
 */
export interface EditActivePosition<T> {
  /**
   *
   */
  readonly rowIndex: number;

  /**
   *
   */
  readonly column: Column<T>;
}

/**
 *
 */
export interface EditBeginParams<T> {
  /**
   *
   */
  readonly init?: any;

  /**
   *
   */
  readonly column: Column<T> | string | number;

  /**
   *
   */
  readonly rowIndex: number;
}

/**
 *
 */
export type EditCellMode = "cell" | "readonly";

/**
 *
 */
export type EditClickActivator = "single" | "double-click" | "none";

/**
 *
 */
export type EditRenderer<T> = string | EditRendererFn<T>;

/**
 *
 */
export type EditRendererFn<T> = (
  /**
   *
   */
  params: EditRendererFnParams<T>,
) => ReactNode;

/**
 *
 */
export interface EditRendererFnParams<T> {
  /**
   *
   */
  readonly rowIndex: number;

  /**
   *
   */
  readonly row: RowNode<T>;

  /**
   *
   */
  readonly grid: Grid<T>;

  /**
   *
   */
  readonly column: Column<T>;

  /**
   *
   */
  readonly rowValidationState: Record<string, any> | boolean | null;

  /**
   *
   */
  readonly value: any;

  /**
   *
   */
  readonly onChange: (c: any) => void;
}

/**
 *
 */
export type EditRowValidatorFn<T> = (
  /**
   *
   */
  params: EditRowValidatorFnParams<T>,
) => Record<string, any> | boolean;

/**
 *
 */
export interface EditRowValidatorFnParams<T> {
  /**
   *
   */
  readonly grid: Grid<T>;

  /**
   *
   */
  readonly row: RowNode<T>;

  /**
   *
   */
  readonly rowIndex: number;

  /**
   *
   */
  readonly data: any;
}

/**
 *
 */
export type EditSetterFn<T> = (
  /**
   *
   */
  params: EditSetterParams<T>,
) => any;

/**
 *
 */
export interface EditSetterParams<T> {
  /**
   *
   */
  readonly grid: Grid<T>;

  /**
   *
   */
  readonly row: RowNode<T>;

  /**
   *
   */
  readonly rowIndex: number;

  /**
   *
   */
  readonly column: Column<T>;

  /**
   *
   */
  readonly data: any;
}

/**
 *
 */
export interface EditUpdateParams<T> {
  /**
   *
   */
  readonly value: any;

  /**
   *
   */
  readonly column: Column<T> | string | number;

  /**
   *
   */
  readonly rowIndex: number;
}

/**
 *
 */
export type Editable<T> = boolean | EditableFn<T>;

/**
 *
 */
export type EditableFn<T> = (
  /**
   *
   */
  params: EditableFnParams<T>,
) => boolean;

/**
 *
 */
export interface EditableFnParams<T> {
  /**
   *
   */
  readonly rowIndex: number;

  /**
   *
   */
  readonly row: RowNode<T>;

  /**
   *
   */
  readonly grid: Grid<T>;

  /**
   *
   */
  readonly column: Column<T>;
}

/**
 *
 */
export interface OnEditBeginParams<T> {
  /**
   *
   */
  readonly column: Column<T>;

  /**
   *
   */
  readonly rowIndex: number;

  /**
   *
   */
  readonly preventDefault: () => void;
}

/**
 *
 */
export interface OnEditCancelParams<T> {
  /**
   *
   */
  readonly column: Column<T>;

  /**
   *
   */
  readonly rowIndex: number;

  /**
   *
   */
  readonly data: any;
}

/**
 *
 */
export interface OnEditEndParams<T> {
  /**
   *
   */
  readonly column: Column<T>;

  /**
   *
   */
  readonly rowIndex: number;

  /**
   *
   */
  readonly data: any;
}

/**
 *
 */
export interface OnEditErrorParams<T> {
  /**
   *
   */
  readonly column: Column<T>;

  /**
   *
   */
  readonly rowIndex: number;

  /**
   *
   */
  readonly data: any;

  /**
   *
   */
  readonly validation: Record<string, any> | boolean;

  /**
   *
   */
  readonly error?: unknown;
}

/**
 *
 */
export interface PositionFloatingCell {
  /**
   *
   */
  readonly kind: "floating-cell";

  /**
   *
   */
  readonly colIndex: number;
}

/**
 *
 */
export interface PositionFullWidthRow {
  /**
   *
   */
  readonly kind: "full-width";

  /**
   *
   */
  readonly rowIndex: number;

  /**
   *
   */
  readonly colIndex: number;
}

/**
 *
 */
export interface PositionGridCell {
  /**
   *
   */
  readonly kind: "cell";

  /**
   *
   */
  readonly rowIndex: number;

  /**
   *
   */
  readonly colIndex: number;

  /**
   *
   */
  readonly root: PositionGridCellRoot | null;
}

/**
 *
 */
export interface PositionGridCellRoot {
  /**
   *
   */
  readonly colIndex: number;

  /**
   *
   */
  readonly rowIndex: number;

  /**
   *
   */
  readonly rowSpan: number;

  /**
   *
   */
  readonly colSpan: number;
}

/**
 *
 */
export interface PositionHeaderCell {
  /**
   *
   */
  readonly kind: "header-cell";

  /**
   *
   */
  readonly colIndex: number;
}

/**
 *
 */
export interface PositionHeaderGroupCell {
  /**
   *
   */
  readonly kind: "header-group-cell";

  /**
   *
   */
  readonly columnStartIndex: number;

  /**
   *
   */
  readonly columnEndIndex: number;

  /**
   *
   */
  readonly hierarchyRowIndex: number;

  /**
   *
   */
  readonly colIndex: number;
}

/**
 *
 */
export type PositionUnion =
  | PositionGridCell
  | PositionFloatingCell
  | PositionHeaderCell
  | PositionFullWidthRow
  | PositionHeaderGroupCell;

/**
 *
 */
export type RowDetailHeight = number | "auto";

/**
 *
 */
export type RowDetailRendererFn<T> = (
  /**
   *
   */
  params: RowDetailRendererParams<T>,
) => ReactNode;

/**
 *
 */
export interface RowDetailRendererParams<T> {
  /**
   *
   */
  readonly rowIndex: number;

  /**
   *
   */
  readonly row: RowNode<T>;

  /**
   *
   */
  readonly grid: Grid<T>;
}

/**
 *
 */
export interface RowSelectAllOptions {
  /**
   *
   */
  readonly deselect?: boolean;
}

/**
 *
 */
export interface RowSelectOptions {
  /**
   *
   */
  readonly selected: string;

  /**
   *
   */
  readonly pivot?: string;

  /**
   *
   */
  readonly selectBetweenPivot?: boolean;

  /**
   *
   */
  readonly deselect?: boolean;

  /**
   *
   */
  readonly selectChildren?: boolean;
}

/**
 *
 */
export type RowSelectionActivator = "single-click" | "double-click" | "none";

/**
 *
 */
export type RowSelectionMode = "single" | "multiple" | "none";

/**
 *
 */
export interface DragData {
  /**
   *
   */
  readonly siteLocalData?: Record<string, any>;

  /**
   *
   */
  readonly dataTransfer?: Record<string, string>;
}

/**
 *
 */
export type DragEventFn = (
  /**
   *
   */
  params: DragEventParams,
) => void;

/**
 *
 */
export interface DragEventParams {
  /**
   *
   */
  readonly state: DragData;

  /**
   *
   */
  readonly position: DragPosition;

  /**
   *
   */
  readonly dragElement: HTMLElement;
}

/**
 *
 */
export type DragPlaceholderFn<T> = (
  /**
   *
   */
  params: DragPlaceholderParams<T>,
) => ReactNode;

/**
 *
 */
export interface DragPlaceholderParams<T> {
  /**
   *
   */
  readonly grid: Grid<T>;

  /**
   *
   */
  readonly dragData: DragData;
}

/**
 *
 */
export interface DragPosition {
  /**
   *
   */
  readonly x: number;

  /**
   *
   */
  readonly y: number;
}

/**
 *
 */
export type DropEventFn = (
  /**
   *
   */
  params: DropEventParams,
) => void;

/**
 *
 */
export interface DropEventParams {
  /**
   *
   */
  readonly state: DragData;

  /**
   *
   */
  readonly moveState: DragMoveState;

  /**
   *
   */
  readonly dropElement: HTMLElement;

  /**
   *
   */
  readonly dragElement: HTMLElement;
}

/**
 *
 */
export interface DragMoveState {
  /**
   *
   */
  readonly isKeyboard: boolean;

  /**
   *
   */
  readonly x: number;

  /**
   *
   */
  readonly y: number;

  /**
   *
   */
  readonly dropElement: HTMLElement;

  /**
   *
   */
  readonly dragElement: HTMLElement;

  /**
   *
   */
  readonly rect: DOMRect;

  /**
   *
   */
  readonly topHalf: boolean;

  /**
   *
   */
  readonly leftHalf: boolean;
}

/**
 *
 */
export type GetDragDataFn<T> = (
  /**
   *
   */
  params: GetDragDataParams<T>,
) => DragData;

/**
 *
 */
export interface GetDragDataParams<T> {
  /**
   *
   */
  readonly grid: Grid<T>;

  /**
   *
   */
  readonly row: RowNode<T>;
}

/**
 *
 */
export interface UseRowDragParams<T> {
  /**
   *
   */
  readonly getDragData: GetDragDataFn<T>;

  /**
   *
   */
  readonly onDragMove?: DragEventFn;

  /**
   *
   */
  readonly onDragStart?: DragEventFn;

  /**
   *
   */
  readonly onDragEnd?: DragEventFn;

  /**
   *
   */
  readonly onDrop?: DropEventFn;

  /**
   *
   */
  readonly placeholder?: DragPlaceholderFn<T>;

  /**
   *
   */
  readonly placeholderOffset?: [number, number];

  /**
   *
   */
  readonly keyActivate?: string;

  /**
   *
   */
  readonly keyNext?: string;

  /**
   *
   */
  readonly keyPrev?: string;

  /**
   *
   */
  readonly keyDrop?: string;

  /**
   *
   */
  readonly dragInstructions?: string;

  /**
   *
   */
  readonly announceDragStart?: string;

  /**
   *
   */
  readonly announceDragEnd?: string;
}

/**
 *
 */
export interface DataRect {
  /**
   *
   */
  readonly rowStart: number;

  /**
   *
   */
  readonly rowEnd: number;

  /**
   *
   */
  readonly columnStart: number;

  /**
   *
   */
  readonly columnEnd: number;
}

/**
 *
 */
export interface ExportCsvParams {
  /**
   *
   */
  readonly includeHeader?: boolean;

  /**
   *
   */
  readonly includeGroupHeaders?: boolean;

  /**
   *
   */
  readonly uniformGroupHeaders?: boolean;

  /**
   *
   */
  readonly delimiter?: string;

  /**
   *
   */
  readonly dataRect?: DataRect;
}

/**
 *
 */
export type ExportDataRectFn<T> = (
  /**
   *
   */
  params: ExportDataRectParams,
) => ExportDataRectResult<T>;

/**
 *
 */
export interface ExportDataRectParams {
  /**
   *
   */
  readonly dataRect?: DataRect;

  /**
   *
   */
  readonly uniformGroupHeaders?: boolean;
}

/**
 *
 */
export interface ExportDataRectResult<T> {
  /**
   *
   */
  readonly headers: string[];

  /**
   *
   */
  readonly groupHeaders: (string | null)[][];

  /**
   *
   */
  readonly data: unknown[][];

  /**
   *
   */
  readonly columns: Column<T>[];
}
