import type { AggBuiltIns } from "../types/aggregations";
import type { AutosizeCellParameters, AutosizeHeaderParameters } from "../types/autosize";
import type {
  CellEditBuiltInProviders,
  CellEditParams,
  CellEditParser,
  CellEditPredicate,
  CellEditProvider,
  CellEditRowUpdater,
  CellEditUnparser,
} from "../types/cell-edit";
import type { CellRenderer } from "../types/cell-renderer";
import type { ColumnHeaderRenderer } from "../types/column-header";
import type { ColumnPin } from "../types/column-pin";
import type { ColumnSpanCallback } from "../types/column-span";
import type { Field } from "../types/field";
import type { FloatingCellRenderer } from "../types/floating-cell";
import type { RowSpanCallback } from "../types/row-span";
import type { SortComparatorFn, SortComparators, SortCycleOption } from "../types/sort";

export interface Column<A, D, E> {
  readonly id: string;
  readonly type?: "text" | "number" | "date" | "complex";

  readonly headerName?: string;
  readonly headerRenderer?: string | ColumnHeaderRenderer<A, this, E>;
  readonly headerAutosizeFn?: (c: AutosizeHeaderParameters<A, this>) => number;

  readonly aggFnsAllowed?: (AggBuiltIns | (string & {}))[];
  readonly aggFnDefault?: AggBuiltIns | (string & {});

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
  readonly sortComparator?: SortComparators | SortComparatorFn<A, D>;

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
  | "measureFnDefault"
  | "aggFnDefault"
>;

export type ColumnRowGroup<A, D, E> = Omit<
  Column<A, D, E>,
  "id" | "groupPath" | "groupVisibility" | "rowGroupField" | "rowGroup"
>;

export {};
