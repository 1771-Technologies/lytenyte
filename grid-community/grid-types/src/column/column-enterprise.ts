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
  FloatingCellRenderer,
  RowSpanCallback,
  SortComparatorFunc,
  SortComparators,
  SortCycleOption,
} from "../types";

export type HeaderTooltip<A, C, E> =
  | string
  | {
      component: (p: { api: A; column: C }) => E;
      placement?: "top" | "bottom" | "left" | "right";
    };

export interface Column<A, D, E> {
  readonly id: string;
  readonly type?: "text" | "number" | "date" | "complex";

  readonly headerName?: string;
  readonly headerRenderer?: string | ColumnHeaderRenderer<A, this, E>;
  readonly headerAutosizeFunc?: (c: AutosizeHeaderParameters<A, this>) => number;

  readonly aggFunc?: AggBuiltIns | (string & {}) | AggFunc<A>;
  readonly aggFuncsAllowed?: (AggBuiltIns | (string & {}))[];
  readonly aggFuncDefault?: AggBuiltIns | (string & {});

  readonly filterSupportsQuickSearch?: boolean;
  readonly filterSupportsIn?: boolean;

  readonly hidable?: boolean;
  readonly hide?: boolean;

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

  readonly floatingCellRenderer?: string | FloatingCellRenderer<A, this, E>;

  readonly sortable?: boolean;
  readonly sortCycle?: SortCycleOption[];
  readonly sortComparator?: SortComparators | SortComparatorFunc<A, D>;

  readonly pin?: ColumnPin;

  readonly inFilterLabelFormatter?: (v: unknown) => string;
  readonly field?: Field<A, D, this>;
  readonly inFilterField?: Field<A, D, this>;
  readonly quickSearchField?: Field<A, D, this>;

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

  readonly columnPivotable?: boolean;
  readonly columnPivotField?: Field<A, D, this>;

  readonly measureFunc?: AggBuiltIns | (string & {}) | AggFunc<A>;
  readonly measureFuncsAllowed?: (AggBuiltIns | (string & {}))[];
  readonly measureFuncDefault?: AggBuiltIns | (string & {});

  readonly resizable?: boolean;
  readonly movable?: boolean;
}

export type ColumnBase<D, E, I> = Omit<
  Column<D, E, I>,
  | "id"
  | "field"
  | "type"
  | "pin"
  | "headerName"
  | "headerSecondaryLabel"
  | "rowGroupField"
  | "columnPivotField"
  | "inFilterField"
  | "quickSearchField"
  | "groupVisibility"
  | "groupPath"
  | "measureFuncDefault"
  | "aggFuncDefault"
>;

export type ColumnRowGroup<D, E, I> = Omit<
  Column<D, E, I>,
  "id" | "groupPath" | "groupVisibility" | "rowGroupKey" | "rowGroup"
>;
