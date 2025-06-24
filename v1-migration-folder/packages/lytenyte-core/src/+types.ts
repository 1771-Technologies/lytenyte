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
  readonly columnBase?: ColumnBase;

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
  readonly rowAutoHeightCache?: Record<number, number>;

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
  readonly columnBase: GridAtom<ColumnBase>;

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
  readonly rowDataStore: RowDataStore;

  /**
   *
   */
  readonly rowDataSource: GridAtom<RowDataSource<T>>;

  /**
   *
   */
  readonly rowAutoHeightCache: GridAtom<Record<number, number>>;

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
  readonly rows: RowSectionLayouts;
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
  readonly kind: "cell";

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
export type HeaderLayoutCell<T> = HeaderCellLayout<T> | HeaderGroupCellLayout;

/**
 *
 */
export interface RowCellLayout {
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
  readonly colSpan: number;

  /**
   *
   */
  readonly rowSpan: number;

  /**
   *
   */
  readonly rowPin: RowPin;

  /**
   *
   */
  readonly colPin: ColumnPin;
}

/**
 *
 */
export interface RowFullWidthRowLayout {
  /**
   *
   */
  readonly rowIndex: number;

  /**
   *
   */
  readonly kind: "full-width";

  /**
   *
   */
  readonly rowPin: RowPin;
}

/**
 *
 */
export type RowLayout = RowNormalRowLayout | RowFullWidthRowLayout;

/**
 *
 */
export interface RowNormalRowLayout {
  /**
   *
   */
  readonly rowIndex: number;

  /**
   *
   */
  readonly kind: "row";

  /**
   *
   */
  readonly cells: RowCellLayout[];

  /**
   *
   */
  readonly rowPin: RowPin;
}

/**
 *
 */
export interface RowSectionLayouts {
  /**
   *
   */
  readonly top: RowLayout[];

  /**
   *
   */
  readonly center: RowLayout[];

  /**
   *
   */
  readonly bottom: RowLayout[];

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
}

/**
 *
 */
export interface ColumnBase {
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
}

/**
 *
 */
export type ColumnPin = "start" | "end" | null;

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
}

/**
 *
 */
export interface RowDataStore {
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
}

/**
 *
 */
export type RowHeight = number | "auto" | `fill:${number}` | ((i: number) => number);

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
  readonly data: T;
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
export type Field<T> = number | string | FieldPath | FieldFn<T>;
