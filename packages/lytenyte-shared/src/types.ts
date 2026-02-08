export type Writable<T> = { -readonly [k in keyof T]: T[k] };
export interface ColumnWidthItem {
  readonly width?: number;
  readonly widthMin?: number;
  readonly widthMax?: number;
  readonly widthFlex?: number;
}

export type RowHeight = number | ((i: number) => number) | "auto" | `fill:${number}`;

export type Row = number;
export type Column = number;
export type RowSpan = number;
export type ColSpan = number;
export type Empty = 0;
export type RowColTuple = [RowSpan, ColSpan] | [Empty, Row, Column];

export interface SpanLayout {
  readonly rowTopStart: Row;
  readonly rowTopEnd: Row;
  readonly rowCenterStart: Row;
  readonly rowCenterEnd: Row;
  readonly rowCenterLast: Row;
  readonly rowBotStart: Row;
  readonly rowBotEnd: Row;

  readonly colStartStart: Column;
  readonly colStartEnd: Column;
  readonly colCenterStart: Column;
  readonly colCenterEnd: Column;
  readonly colCenterLast: Column;
  readonly colEndStart: Column;
  readonly colEndEnd: Column;
}

export type SpanFn = (r: Row, c: Column) => number;
export type RowPredicate = (r: Row) => boolean;

export type ScrollIntoViewFn = (p: { row?: number; column?: number; behavior: "instant" }) => void;
export type RootCellFn = (r: number, c: number) => PositionGridCell | PositionFullWidthRow | null;

export type ColumnPin = "start" | "end" | null;
export type RowPin = "top" | "bottom" | null;

export type ColumnGroupVisibility = "always" | "close" | "open";

export interface RowSelectNode {
  readonly id: string;
  children?: Map<string, RowSelectNode>;
  selected?: boolean;
}
export interface RowSelectionLinked {
  readonly kind: "linked";
  readonly selected: boolean;
  readonly children: Map<string, RowSelectNode>;
}
export interface RowSelectionIsolated {
  readonly kind: "isolated";
  readonly selected: boolean;
  readonly exceptions: Set<string>;
}
export type RowSelectionState = RowSelectionIsolated | RowSelectionLinked;

export interface RowSelectNodeWithParent {
  readonly id: string;
  parent: RowSelectNodeWithParent | RowSelectionLinkedWithParent;
  selected?: boolean;
  children?: Map<string, RowSelectNodeWithParent>;
}
export interface RowSelectionLinkedWithParent {
  readonly kind: "linked";
  readonly selected: boolean;
  readonly children: Map<string, RowSelectNodeWithParent>;
}
export type RowSelectionStateWithParent = RowSelectionLinkedWithParent | RowSelectionIsolated;

export interface ColumnAbstract {
  readonly id: string;

  readonly name?: string;
  readonly type?: "string" | "number" | "date" | "datetime" | ({} & string);

  readonly width?: number;
  readonly widthMax?: number;
  readonly widthMin?: number;
  readonly widthFlex?: number;

  readonly groupVisibility?: ColumnGroupVisibility;
  readonly groupPath?: string[];

  readonly pin?: ColumnPin;
  readonly hide?: boolean;
  readonly resizable?: boolean;
  readonly movable?: boolean;
}

export interface RowAtom<T> {
  readonly get: () => T;
  readonly useValue: () => T;
}

export interface RowSource<T = any> {
  readonly useRowCount: () => number;
  readonly useTopCount: () => number;
  readonly useBottomCount: () => number;
  readonly useRows: () => { get: (i: number) => RowNode<T> | null | undefined; size: number };

  readonly useMaxRowGroupDepth: () => number;

  readonly rowIndexToRowId: (index: number) => string | null | undefined;
  readonly rowIdToRowIndex: (id: string) => number | null | undefined;
  readonly rowByIndex: (row: number) => RowAtom<RowNode<T> | null>;
  readonly rowById: (id: string) => RowNode<T> | null;
  readonly rowParents: (id: string) => string[];
  readonly rowSiblings: (id: string) => string[];
  readonly rowIsSelected: (id: string) => boolean;
  readonly rowChildren: (id: string) => string[];
  readonly rowLeafs: (id: string) => string[];
  readonly rowsBetween: (start: string, end: string) => string[];
  readonly rowInvalidate: (row?: number) => void;
  readonly rowsSelected: () => { state: RowSelectionState; rows: RowNode<T>[] };
  readonly rowSelectionState: () => RowSelectionState;

  readonly rowGroupExpansionChange: (deltaChanges: Record<string, boolean>) => void;
  readonly useSelectionState: () => RowSelectionState;

  // Methods the LyteNyte will call
  readonly onViewChange: (view: SpanLayout) => void;
  readonly onRowsUpdated: (rows: Map<RowNode<T>, T>) => void;
  readonly onRowsSelected: (params: {
    readonly selected: string[] | "all";
    readonly deselect?: boolean;
    readonly mode: "single" | "multiple" | "none";
  }) => void;
}

export type PathField = { kind: "path"; path: string };
export type Field<T> = string | number | PathField | ((params: { row: RowNode<T> }) => unknown);
export type Dimension<T> = { name?: string; field: Field<T> } | { id: string; field?: Field<T> };
export type DimensionSort<T> = { dim: Dimension<T> | SortFn<T>; descending?: boolean };
export type DimensionAgg<T> = {
  dim: { id: string; field?: Field<T> };
  fn: Aggregator<T> | string;
};

export type LeafIdFn<T> = (d: T, index: number, section: "top" | "center" | "bottom") => string;
export type GroupIdFn = (path: (string | null)[]) => string;
export type SortFn<T> = (left: RowNode<T>, right: RowNode<T>) => number;
export type FilterFn<T> = (node: RowLeaf<T>) => boolean;
export type GroupFn<T> = (node: RowLeaf<T>) => (string | null)[] | null;
export type AggregationFn<T> = (data: RowLeaf<T>[]) => Record<string, unknown>;
export type Aggregator<T> = (field: Field<T>, data: RowLeaf<T>[]) => unknown;

export interface RowLeaf<T = any> {
  readonly id: string;
  readonly loading?: boolean;
  readonly error?: unknown;
  readonly parentId?: string | null | undefined;
  readonly kind: "leaf";
  readonly depth: number;
  readonly data: T;
}

export interface RowGroup {
  readonly id: string;
  readonly kind: "branch";
  readonly key: string | null;
  readonly data: Record<string, unknown>;
  readonly depth: number;
  readonly last: boolean;

  readonly expanded: boolean;
  readonly expandable: boolean;

  readonly loading?: boolean;
  readonly error?: unknown;

  readonly errorGroup?: unknown;
  readonly loadingGroup?: boolean;

  readonly parentId: null | string;
}

export interface RowAggregated {
  readonly id: string;
  readonly kind: "aggregated";
  readonly data: Record<string, unknown>;
  readonly depth: number;
  readonly loading?: boolean;
  readonly error?: unknown;
}

export type RowNode<T> = RowLeaf<T> | RowGroup | RowAggregated;

export interface PositionDetailCell {
  readonly kind: "detail";
  readonly rowIndex: number;
  readonly colIndex: number;
}

export interface PositionFloatingCell {
  readonly kind: "floating-cell";
  readonly colIndex: number;
}

export interface PositionFullWidthRow {
  readonly kind: "full-width";
  readonly rowIndex: number;
  readonly colIndex: number;
}

export interface PositionGridCell {
  readonly kind: "cell";
  readonly rowIndex: number;
  readonly colIndex: number;
  readonly root: PositionGridCellRoot | null;
}

export interface PositionGridCellRoot {
  readonly colIndex: number;
  readonly rowIndex: number;
  readonly rowSpan: number;
  readonly colSpan: number;
}

export interface PositionHeaderCell {
  readonly kind: "header-cell";
  readonly colIndex: number;
}

export interface PositionHeaderGroupCell {
  readonly kind: "header-group-cell";
  readonly columnStartIndex: number;
  readonly columnEndIndex: number;
  readonly hierarchyRowIndex: number;
  readonly colIndex: number;
}

export type PositionUnion =
  | PositionGridCell
  | PositionFloatingCell
  | PositionHeaderCell
  | PositionDetailCell
  | PositionFullWidthRow
  | PositionHeaderGroupCell;
