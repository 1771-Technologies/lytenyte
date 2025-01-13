import type {
  AggBuiltIns,
  AggFunc,
  AutosizeHeaderParameters,
  CellEditBuiltInProviders,
  CellEditParams,
  CellEditParser,
  CellEditPredicate,
  CellEditProvider,
  CellEditRowUpdater,
  CellEditUnparser,
  CellOptions,
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
import type { ColumnMenuItem } from "../types-enterprise";

export type HeaderTooltip<A, C, E> =
  | string
  | {
      component: (p: { api: A; column: C }) => E;
      placement?: "top" | "bottom" | "left" | "right";
    };

export interface Column<A, D, E> {
  readonly id: string;
  readonly type?: "text" | "number" | "date" | "complex";

  readonly headerJustify?: "start" | "end" | "center";
  readonly headerTooltip?: HeaderTooltip<A, this, E>;
  readonly headerName?: string;
  readonly secondaryLabel?: string;
  readonly headerRenderer?: string | ColumnHeaderRenderer<A, this, E>;
  readonly headerClass?: string;
  readonly headerAutosizeFunc?: (c: AutosizeHeaderParameters<A, this>) => number;

  readonly aggFunc?: AggBuiltIns | (string & {}) | AggFunc<A>;
  readonly aggFuncsAllowed?: (AggBuiltIns | (string & {}))[];
  readonly aggFuncDefault?: AggBuiltIns | (string & {});
  readonly headerAggFuncDisplayMode?: "secondary" | "inline" | "none";

  readonly columnMenuTrigger?: "header" | "icon" | "icon-on-hover" | "none";
  readonly columnMenuGetItems?: (api: A, column: this) => ColumnMenuItem<E>[];

  readonly filterMenuTrigger?: "icon" | "icon-on-hover" | "none";
  readonly filterTreeFilterable?: boolean;
  readonly filterColumnFilterable?: boolean;
  readonly filterParams?: FilterParams;
  readonly filterQuickSearchable?: boolean;

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

  readonly floatingCellRenderer?:
    | "number"
    | "text"
    | "date"
    | (string & {})
    | FloatingCellRenderer<A, this, E>;

  readonly sortable?: boolean;
  readonly sortCycle?: SortCycleOption[];
  readonly sortComparator?: SortComparators | SortComparatorFunc<A, D>;
  readonly sortParams?: SortParams;

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
  readonly cellOptions?: CellOptions<A, D, this>;

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
  readonly keepMounted?: boolean;
}

export type ColumnBase<D, E, I> = Omit<
  Column<D, E, I>,
  | "id"
  | "field"
  | "pin"
  | "headerName"
  | "secondaryLabel"
  | "headerTooltip"
  | "rowGroupField"
  | "columnPivotField"
  | "inFilterField"
  | "quickSearchField"
  | "groupVisibility"
  | "groupPath"
>;

export type ColumnRowGroup<D, E, I> = Omit<
  Column<D, E, I>,
  "id" | "groupPath" | "groupVisibility" | "rowGroupKey" | "rowGroup"
>;
