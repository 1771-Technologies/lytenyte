// Aggregations

export type AggBuiltIns = "sum" | "min" | "max" | "avg" | "count" | "first" | "last" | "group";
export type AggFunc<A> = (data: unknown[], api: A) => unknown;
export type AggFuncs<A> = { [id: string]: AggFunc<A> };

// Autosize

export interface AutosizeOptions {
  readonly dryRun?: boolean;
  readonly includeHeader?: boolean;
}

export type AutosizeCellParameters<A, D, C> = {
  readonly column: C;
  readonly row: RowNode<D>;
  readonly api: A;
};

export interface AutosizeResult {
  readonly [columnId: string]: number;
}

export type AutosizeHeaderParameters<A, C> = {
  readonly column: C;
  readonly api: A;
};

// Field

export type FieldTypePath = 1;

export type Field<A, D, C> =
  | string
  | number
  | { kind: FieldTypePath; path: string }
  | ((data: D, column: C, api: A) => unknown);

// Cell Edit
export type CellEditDateFormat =
  `${number}${number}${number}${number}-${number}${number}-${number}${number}`;

export type CellEditParams = {
  maxLength?: number;
  min?: number | CellEditDateFormat;
  max?: number | CellEditDateFormat;
  step?: number;
} & { [key: string]: any };

export type CellEditLocation = {
  readonly rowIndex: number;
  readonly columnIndex: number;
};

export type CellEditBuiltInProviders = "text" | "number" | "date";
export type CellEditPointerActivator = "single-click" | "double-click" | "none";

export type CellEditPredicateParams<A, D, C> = {
  readonly api: A;
  readonly row: RowNode<D>;
  readonly column: C;
};

export type CellEditParserParams<A, D, C> = {
  readonly api: A;
  readonly row: RowNode<D>;
  readonly column: C;
  readonly value: unknown;
};
export type CellEditParser<A, D, C> = (p: CellEditParserParams<A, D, C>) => unknown;
export type CellEditUnparser<A, D, C> = (p: CellEditParserParams<A, D, C>) => unknown;

export type CellEditRowUpdaterParams<A, D, C> = {
  readonly api: A;
  readonly row: RowNode<D>;
  readonly column: C;
  readonly value: unknown;
};
export type CellEditRowUpdater<A, D, C> = (p: CellEditRowUpdaterParams<A, D, C>) => void;

export type CellEditProviderParams<A, D, C> = {
  readonly api: A;
  readonly row: RowNode<D>;
  readonly column: C;
  readonly value: unknown;
  readonly setValue: (v: unknown) => void;
  readonly isValid: boolean;
};

export type CellEditProvider<A, D, C, E> = (p: CellEditProviderParams<A, D, C>) => E;

export type CellEditProviders<A, D, C, E> = {
  [id: string]: CellEditProvider<A, D, C, E>;
};
export type CellEditPredicate<A, D, C> = (p: CellEditPredicateParams<A, D, C>) => boolean;

export type CellEditEventParams<A> = {
  readonly api: A;
  readonly location: CellEditLocation;
  readonly oldValue: unknown;
  readonly newValue: unknown;
  readonly error?: unknown;
};

export type CellEditBeginEventParams<A> = {
  readonly api: A;
  readonly locations: CellEditLocation[];
};
export type CellEditEndEventParams<A> = CellEditBeginEventParams<A>;
export type CellEditBeginEvent<A> = (p: CellEditBeginEventParams<A>) => void;
export type CellEditEndEvent<A> = CellEditBeginEvent<A>;
export type CellEditEvent<A> = (p: CellEditEventParams<A>) => void;

// Cell

export type CellRendererParams<A, D, C> = {
  column: C;
  columnIndex: number;
  api: A;
  row: RowNode<D>;
};

export type CellRenderer<A, D, C, E> = (params: CellRendererParams<A, D, C>) => E;
export type CellRenderers<A, D, C, E> = {
  [id: string]: CellRenderer<A, D, C, E>;
};

// Column Headers

export type ColumnHeaderHeightProperty = number;

export type ColumnHeaderRendererParams<A, C> = {
  columnIndex: number;
  column: C;
  api: A;
};

export type ColumnHeaderRenderer<A, C, E> = (p: ColumnHeaderRendererParams<A, C>) => E;
export type ColumnHeaderRenderers<A, C, E> = {
  [id: string]: ColumnHeaderRenderer<A, C, E>;
};

export type ColumnGroupRowItem = {
  id: string;
  start: number;
  end: number;
  occurrenceKey: string;
  isCollapsible: boolean;
};

export type ColumnGroupRow = (ColumnGroupRowItem | null)[];
export type ColumnGroupRows = ColumnGroupRow[];
export type ColumnGroupVisibility = "visible-when-open" | "visible-when-closed" | "always-visible";

// Column Span

export type ColumnSpanParams<A, D> = { api: A; row: RowNode<D> };
export type ColumnSpanCallback<A, D> = (p: ColumnSpanParams<A, D>) => number;

// Columns

export type ColumnPin = "start" | "end" | null;

export type ColumnMoveDragEvent<A> = (
  event: DragEvent,
  api: A,
  columns: string[],
  over: string | null,
) => void;

export type ColumnResizeDragEvent<A, C> = (
  api: A,
  column: C,
  resize: { delta: number; newWidth: number },
) => void;

// Row Node

export type RowPin = "top" | "bottom" | null;

export type RowLeafKind = 1;
export type RowGroupKind = 2;
export type RowTotalKind = 3;

export interface RowNodeBase {
  readonly id: string;
  readonly rowIndex: number | null;

  // meta parameters
  readonly loading?: boolean;
  readonly error?: boolean;
}

export interface RowNodeLeaf<D = unknown> extends RowNodeBase {
  readonly kind: RowLeafKind;
  readonly data: D;
  readonly rowPin: RowPin;
}

export interface RowNodeGroup extends RowNodeBase {
  readonly kind: RowGroupKind;
  readonly pathKey: string;
  readonly data: Record<string, unknown>;
}

export interface RowNodeTotal extends RowNodeBase {
  readonly kind: RowTotalKind;
  readonly data: Record<string, unknown>;
  readonly rowPin: RowPin;
}

export type RowNode<D = unknown> = RowNodeLeaf<D> | RowNodeGroup | RowNodeTotal;

export type RowLeafOrRowTotal<D> = RowNodeLeaf<D> | RowNodeTotal;

// Filters
export type FilterTextOperator =
  | "equal"
  | "not_equal"
  | "begins_with"
  | "not_begins_with"
  | "ends_with"
  | "not_ends_with"
  | "contains"
  | "not_contains";

export interface FilterText {
  readonly kind: "text";
  readonly columnId: string;
  readonly operator: FilterTextOperator;
  readonly value: string;
}

export type FilterNumberOperator =
  | "equal"
  | "not_equal"
  | "greater_than"
  | "greater_than_or_equal"
  | "less_than"
  | "less_than_or_equal";

export interface FilterNumber {
  readonly kind: "number";
  readonly columnId: string;
  readonly operator: FilterNumberOperator;
  readonly value: number;
}

export type FilterDateOperator =
  | "equal"
  | "before"
  | "after"
  | "tomorrow"
  | "today"
  | "yesterday"
  | "next_week"
  | "this_week"
  | "last_week"
  | "next_month"
  | "this_month"
  | "last_month"
  | "next_quarter"
  | "this_quarter"
  | "last_quarter"
  | "next_year"
  | "this_year"
  | "last_year"
  | "ytd"
  | "all_dates_in_the_period";

export type FilterDatePeriod =
  | null
  | "quarter-1"
  | "quarter-2"
  | "quarter-3"
  | "quarter-4"
  | "january"
  | "february"
  | "march"
  | "april"
  | "may"
  | "june"
  | "july"
  | "august"
  | "september"
  | "october"
  | "november"
  | "december";

export interface FilterDate {
  readonly kind: "date";
  readonly value: string;
  readonly columnId: string;
  readonly operator: FilterDateOperator;
  readonly datePeriod: FilterDatePeriod;
}

export interface FilterRegistered {
  readonly kind: "registered";
  readonly id: string;
  readonly name?: string;
}

export interface FilterCombined<A, D> {
  readonly kind: "combined";
  readonly operator: "and" | "or";
  readonly left: FilterNonCombined<A, D>;
  readonly right: FilterNonCombined<A, D>;
}

export interface FilterFunction<A, D> {
  readonly kind: "function";
  readonly func: (api: A, row: RowNode<D>) => boolean;
}

export interface FilterParams {
  toDate?: (d: unknown) => Date;
}

export type FilterSimpleColumn = FilterText | FilterDate | FilterNumber;
export type FilterNonCombined<A, D> =
  | FilterText
  | FilterNumber
  | FilterDate
  | FilterRegistered
  | FilterFunction<A, D>;

export type ColumnFilter<A, D> =
  | FilterText
  | FilterNumber
  | FilterDate
  | FilterCombined<A, D>
  | FilterRegistered
  | FilterFunction<A, D>;

export type ColumnFilterModel<A, D> = {
  [columnId: string]: { simple?: ColumnFilter<A, D> };
};

export type FilterRegisteredFunc<A, D> = (api: A, row: RowNode<D>) => boolean;
export type FilterRegisteredFuncs<A, D> = {
  [id: string]: FilterRegisteredFunc<A, D>;
};

export type FloatingCellRendererParams<A, C> = {
  column: C;
  api: A;
};

export type FloatingCellRenderer<A, C, E> = (p: FloatingCellRendererParams<A, C>) => E;
export type FloatingCellRenderers<A, C, E> = {
  [id: string]: FloatingCellRenderer<A, C, E>;
};

// Key Binding

// prettier-ignore
export type KeyBindingValidKeys =
 | 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h' | 'i' | 'j' | 'k' | 'l' | 'm'
  | 'n' | 'o' | 'p' | 'q' | 'r' | 's' | 't' | 'u' | 'v' | 'w' | 'x' | 'y' | 'z'
  | '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9'
  | '!' | '"' | '#' | '$' | '%' | '&' | '\'' | '(' | ')' | '*' | '+' | ',' | '-' | '.'
  | '/' | ':' | ';' | '<' | '=' | '>' | '?' | '@' | '[' | '\\' | ']' | '^' | '_' | '`'
  | '{' | '|' | '}' | '~' | ' '
  | 'pageup' | 'pagedown' | 'end' | 'home' | 'arrowleft' | 'arrowup' | 'arrowright' | 'arrowdown'
  | 'enter' | 'space'

export type KeyBindingString =
  | `ctrl-${KeyBindingValidKeys}`
  | `ctrl-shift-${KeyBindingValidKeys}`
  | `cmd-${KeyBindingValidKeys}`
  | `cmd-shift-${KeyBindingValidKeys}`
  | `shift-${KeyBindingValidKeys}`
  | KeyBindingValidKeys;

export interface KeyBinding<A> {
  id: string;
  action: (api: A) => void;
  when?: (api: A) => boolean;
  description?: string;
}

export type KeyBindingMap<A> = {
  [key in KeyBindingString]?: KeyBinding<A>[];
};

// Navigation
export type PositionGridCellKind = 1;
export type PositionFullWidthKind = 2;
export type PositionHeaderCellKind = 3;
export type PositionHeaderGroupCellKind = 4;
export type PositionFloatingCellKind = 5;

export type PositionGridCell = {
  readonly kind: PositionGridCellKind;
  readonly columnIndex: number;
  readonly rowIndex: number;

  readonly root: {
    columnIndex: number;
    rowIndex: number;
    rowSpan: number;
    columnSpan: number;
  } | null;
};

export type PositionFullWidthRow = {
  readonly kind: PositionFullWidthKind;
  readonly columnIndex: number;
  readonly rowIndex: number;
};

export type PositionHeaderCell = {
  readonly kind: PositionHeaderCellKind;
  readonly columnIndex: number;
};

export type PositionHeaderGroupCell = {
  readonly kind: PositionHeaderGroupCellKind;
  readonly columnStartIndex: number;
  readonly columnEndIndex: number;
  readonly columnIndex: number;
  readonly hierarchyRowIndex: number;
};

export type PositionFloatingCell = {
  readonly kind: PositionFloatingCellKind;
  readonly columnIndex: number;
};

export type Position =
  | PositionGridCell
  | PositionFloatingCell
  | PositionHeaderCell
  | PositionFullWidthRow
  | PositionHeaderGroupCell;

export type FocusPosition = { kind: "cell"; rowIndex: number; columnIndex: number };

// Row Detail

export type RowDetailParams<A, D> = {
  readonly api: A;
  readonly row: RowNode<D>;
};

export type RowDetailHeight<A, D> = number | ((p: RowDetailParams<A, D>) => number);
export type rowDetailEnabled<A, D> = boolean | "all" | ((p: RowDetailParams<A, D>) => boolean);
export type RowDetailRenderer<A, D, E> = (p: RowDetailParams<A, D>) => E;

// Row Dragging
export type RowDragPredicate<A, D> = (p: { api: A; row: RowNode<D> }) => boolean;

// Row Groups
export type RowGroupDisplayMode = "single-column" | "multi-column" | "custom";
export type RowGroupExpansions = { [rowId: string]: boolean | undefined };

// Rows

export interface RowDataSourceClient<D = unknown> {
  readonly kind: "client";
  data: D[];
  topData?: D[];
  bottomData?: D[];
}

export type RowFullWidthPredicateParams<A, D> = {
  api: A;
  row: RowNode<D>;
};
export type RowFullWidthPredicate<A, D> = (p: RowFullWidthPredicateParams<A, D>) => boolean;
export type RowHeight = number | ((i: number) => number);

export type RowDragEventParams<A, D> = {
  event: DragEvent;
  api: A;
  rows: RowNode<D>[];
  overIndex: number;
  isExternal?: boolean;
  externalGridApi?: A;
};

export type RowDragEvent<A, D> = (p: RowDragEventParams<A, D>) => void;

// Row Selection

export type RowSelectionPointerActivator = "single-click" | "double-click" | "none";
export type RowSelectionMode = "single" | "multiple" | "none";
export type RowSelectionCheckbox = "normal" | "hide-for-disabled" | "hide";

export type RowSelectionPredicateParams<A, D> = {
  readonly api: A;
  readonly row: RowNode<D>;
};

export type RowSelectionPredicate<A, D> = (p: RowSelectionPredicateParams<A, D>) => boolean;
export type RowFullWidthRenderer<A, D, E> = (p: RowSelectionPredicateParams<A, D>) => E;

export type RowSpanParams<A, D, C> = { api: A; row: RowNode<D>; column: C };
export type RowSpanCallback<A, D, C> = (p: RowSpanParams<A, D, C>) => number;

export type RowSelectionEventParams<A> = {
  readonly api: A;
  readonly rowIds: string[];
};
export type RowSelectionEvent<A> = (p: RowSelectionEventParams<A>) => void;

// Sort
export interface SortParams {
  toDate?: (d: unknown) => Date;
}

export interface SortOptions {
  readonly isAccented?: boolean;
  readonly isAbsolute?: boolean;
  readonly nullsAppearFirst?: boolean;
}

export interface SortModelItem {
  readonly columnId: string;
  readonly options?: SortOptions;
  readonly isDescending?: boolean;
}

export type SortComparatorFunc<A, D> = (
  api: A,
  leftField: unknown,
  rightField: unknown,
  leftRow: RowNode<D>,
  rightData: RowNode<D>,
  sort: SortModelItem,
) => number;

export type SortComparators = "string" | "number" | "date" | (string & {});

export type SortTypes = "asc" | "desc";
export type SortAccentModifier = "accented";
export type SortAbsoluteModifier = "abs";
export type SortNullModifier = "nulls-first";

export type SortCycleOption =
  | SortTypes
  | `${SortTypes}_${SortAccentModifier}`
  | `${SortTypes}_${SortAccentModifier}_${SortAbsoluteModifier}`
  | `${SortTypes}_${SortAccentModifier}_${SortNullModifier}`
  | `${SortTypes}_${SortAccentModifier}_${SortAbsoluteModifier}_${SortNullModifier}`
  | `${SortTypes}_${SortAbsoluteModifier}`
  | `${SortTypes}_${SortAbsoluteModifier}_${SortNullModifier}`
  | null;

// export

export interface DataRect {
  readonly rowStart: number;
  readonly rowEnd: number;
  readonly columnStart: number;
  readonly columnEnd: number;
}
export interface ExportTransformDataRowParams<A, C> {
  readonly api: A;
  readonly columns: C[];
  readonly data: unknown[];
}
export type ExportTransformDataRow<A, C> = (p: ExportTransformDataRowParams<A, C>) => unknown[];

export interface ExportCsvOptions<A, C> {
  readonly includeHeader?: boolean;
  readonly includeGroupHeaders?: boolean;
  readonly uniformGroupHeaders?: boolean;
  readonly delimiter?: "," | ";" | "\t" | (string & {});
  readonly transform?: ExportTransformDataRow<A, C>;
  readonly dataRect?: DataRect;
}

export interface ExportDataRectOptions<A, C> {
  readonly dataRect?: DataRect;
  readonly transform?: ExportTransformDataRow<A, C>;
  readonly uniformGroupHeaders?: boolean;
}

export interface DataRectResult<C> {
  readonly header: string[];
  readonly groupHeaders: (string | null)[][];
  readonly data: unknown[][];
  readonly columns: C[];
}

export type RowSections = RowPin | "flat";

export type Writable<T> = {
  -readonly [P in keyof T]: T[P];
};

// Virt

export type ScrollBounds = {
  readonly rowStart: number;
  readonly rowEnd: number;
  readonly columnStart: number;
  readonly columnEnd: number;
};
