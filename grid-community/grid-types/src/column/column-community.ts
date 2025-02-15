import type {
  AggBuiltIns,
  AggFunc,
  AutosizeCellParameters,
  AutosizeHeaderParameters,
  CellEditBuiltInProviders,
  CellEditParams,
  CellEditParser,
  CellEditPredicate,
  CellEditProvider,
  CellEditRowUpdater,
  CellEditUnparser,
  CellRenderer,
  ColumnHeaderRenderer,
  ColumnPin,
  ColumnSpanCallback,
  Field,
  FilterParams,
  FloatingCellRenderer,
  RowSpanCallback,
  SortComparatorFunc,
  SortComparators,
  SortCycleOption,
  SortParams,
} from "../types";

export interface Column<A, D, E> {
  readonly id: string;
  readonly type?: "text" | "number" | "date" | "complex";

  readonly headerName?: string;
  readonly headerRenderer?: string | ColumnHeaderRenderer<A, this, E>;
  readonly headerAutosizeFunc?: (c: AutosizeHeaderParameters<A, this>) => number;

  readonly aggFunc?: AggBuiltIns | (string & {}) | AggFunc<A>;
  readonly aggFuncsAllowed?: (AggBuiltIns | (string & {}))[];
  readonly aggFuncDefault?: AggBuiltIns | (string & {});

  readonly hidable?: boolean;
  readonly hide?: boolean;

  readonly filterParams?: FilterParams;

  readonly cellEditPredicate?: boolean | CellEditPredicate<A, D, this>;
  readonly cellEditParser?: CellEditParser<A, D, this> | null;
  readonly cellEditUnparser?: CellEditUnparser<A, D, this> | null;
  readonly cellEditProvider?:
    | CellEditBuiltInProviders
    | (string & {})
    | CellEditProvider<A, D, this, E>;
  readonly cellEditParams?: CellEditParams;
  readonly cellEditRowUpdater?: CellEditRowUpdater<A, D, this>;

  readonly cellAutosizeFn?: (c: AutosizeCellParameters<A, D, this>) => number;
  readonly cellSkipOnAutosizeAll?: boolean;
  readonly cellJustify?: "start" | "center" | "end";

  readonly floatingCellRenderer?: string | FloatingCellRenderer<A, this, E>;

  readonly sortable?: boolean;
  readonly sortCycle?: SortCycleOption[];
  readonly sortComparator?: SortComparators | SortComparatorFunc<A, D>;
  readonly sortParams?: SortParams;

  readonly pin?: ColumnPin;

  readonly field?: Field<A, D, this>;

  readonly groupPath?: string[];
  readonly groupVisibility?: "visible-when-open" | "visible-when-closed" | "always-visible";

  readonly widthMin?: number;
  readonly widthMax?: number;
  readonly width?: number;
  readonly widthFlex?: number;

  readonly cellRenderer?: string | CellRenderer<A, D, this, E>;

  readonly columnSpan?: number | ColumnSpanCallback<A, D>;
  readonly rowSpan?: number | RowSpanCallback<A, D, this>;

  readonly rowGroupable?: boolean;
  readonly rowGroupField?: Field<A, D, this>;

  readonly resizable?: boolean;
  readonly movable?: boolean;
}

export type ColumnBase<A, D, E> = Omit<
  Column<A, D, E>,
  | "id"
  | "field"
  | "type"
  | "pin"
  | "rowGroupField"
  | "columnPivotField"
  | "inFilterField"
  | "quickSearchField"
  | "groupVisibility"
  | "groupPath"
  | "measureFuncDefault"
  | "aggFuncDefault"
>;

export type ColumnRowGroup<A, D, E> = Omit<
  Column<A, D, E>,
  "id" | "groupPath" | "groupVisibility" | "rowGroupField" | "rowGroup"
>;

export {};
