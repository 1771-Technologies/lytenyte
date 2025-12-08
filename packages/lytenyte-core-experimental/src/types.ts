import type { ReactNode, Ref } from "react";

import type {
  RowDetailRenderer,
  RowFullWidthPredicate,
  RowFullWidthRenderer,
  RowHeight,
  RowNode,
  RowSource,
} from "./types/row.js";
import type { ColumnGroupVisibility, ColumnPin, PathField } from "./types/column.js";
import type { PositionFullWidthRow, PositionGridCell } from "./types/position.js";

export namespace Ln {
  export type HeaderParams<
    T,
    C extends LnColumn<any> = LnColumn<any>,
    K extends Record<string, any> = object,
  > = {
    column: C;
    api: API<T, K>;
  };
  export type CellParams<
    T,
    C extends LnColumn<any> = LnColumn<any>,
    K extends Record<string, any> = object,
  > = {
    row: RowNode<T | null>;
    column: C;
    api: API<T, K>;
  };
  export type CellParamsWithIndex<
    T,
    C extends LnColumn<any> = LnColumn<any>,
    K extends Record<string, any> = object,
  > = CellParams<T, C, K> & {
    rowIndex: number;
    colIndex: number;
  };

  export interface LnColumn<T = any, K extends Record<string, any> = any> {
    readonly id: string;
    readonly name?: string;
    readonly type?: "string" | "number" | "date" | "datetime" | ({} & string);
    readonly hide?: boolean;

    readonly width?: number;
    readonly widthMax?: number;
    readonly widthMin?: number;
    readonly widthFlex?: number;

    readonly pin?: ColumnPin;

    readonly groupVisibility?: ColumnGroupVisibility;
    readonly groupPath?: string[];

    readonly colSpan?: number | ((params: CellParamsWithIndex<T, this, K>) => number);
    readonly rowSpan?: number | ((params: CellParamsWithIndex<T, this, K>) => number);

    readonly field?: string | number | PathField | ((params: CellParams<T, this, K>) => unknown);

    readonly floatingCellRenderer?: (props: HeaderParams<T, this, K>) => ReactNode;
    readonly headerRenderer?: (props: HeaderParams<T, this, K>) => ReactNode;
    readonly cellRenderer?: (props: CellParams<T, this, K>) => ReactNode;
    readonly editRenderer?: (props: CellParams<T, this, K>) => ReactNode;

    readonly resizable?: boolean | ((props: HeaderParams<T, this, K>) => boolean);
    readonly movable?: boolean | ((props: HeaderParams<T, this, K>) => boolean);
    readonly editable?: boolean | ((props: CellParams<T, this, K>) => boolean);

    readonly autosizeCellFn?: (params: CellParams<T, this, K>) => number | null | undefined;
    readonly autosizeHeaderFn?: (params: HeaderParams<T, this, K>) => number | null | undefined;
  }

  export interface ColumnMarker<T, K extends Record<string, any> = any> {
    readonly floatingCellRenderer?: (props: {
      column: ColumnMarker<T, K>;
      api: API<T, K>;
    }) => ReactNode;
    readonly headerRenderer?: (props: { column: ColumnMarker<T, K>; api: API<T, K> }) => ReactNode;
    readonly cellRenderer?: (props: {
      column: ColumnMarker<T, K>;
      row: RowNode<T | null>;
      api: API<T, K>;
      rowIndex: number;
      colIndex: number;
    }) => ReactNode;

    readonly width?: number;
    readonly pin?: Required<ColumnPin>;

    readonly autosizeCellFn?: (params: {
      column: ColumnMarker<T, K>;
      row: RowNode<T | null>;
      api: API<T, K>;
      rowIndex: number;
      colIndex: number;
    }) => number | null | undefined;
    readonly autosizeHeaderFn?: (params: {
      column: ColumnMarker<T, K>;
      api: API<T, K>;
    }) => number | null | undefined;
  }

  export type ColumnBase<T, K extends Record<string, any> = any> = Omit<
    LnColumn<T, K>,
    "pin" | "field"
  >;

  export interface Props<
    T = any,
    K extends Record<string, any> = object,
    V extends RowSource = RowSource,
    C extends LnColumn<T, K & V> = LnColumn<T, K & V>,
  > {
    readonly columns?: C[];
    readonly columnBase?: ColumnBase<T, K & V>;
    readonly columnMarker?: ColumnMarker<T, K & V>;
    readonly columnMarkerEnabled?: boolean;
    readonly columnGroupDefaultExpansion?: boolean;
    readonly columnGroupJoinDelimiter?: string;

    readonly sizeToFit?: boolean;
    readonly gridId?: string;

    readonly rtl?: boolean;

    readonly headerHeight?: number;
    readonly headerGroupHeight?: number;
    readonly floatingRowHeight?: number;
    readonly floatingRowEnabled?: boolean;

    readonly rowOverscanTop?: number;
    readonly rowOverscanBottom?: number;
    readonly colOverscanStart?: number;
    readonly colOverscanEnd?: number;

    readonly rowScanDistance?: number;
    readonly rowSource?: RowSource;
    readonly rowHeight?: RowHeight;

    readonly rowFullWidthPredicate?: RowFullWidthPredicate<T, K & V> | null;
    readonly rowFullWidthRenderer?: RowFullWidthRenderer<T, K & V> | null;

    readonly virtualizeCols?: boolean;
    readonly virtualizeRows?: boolean;

    readonly rowDetailHeight?: number | "auto";
    readonly rowDetailAutoHeightGuess?: number;
    readonly rowDetailRenderer?: RowDetailRenderer<T> | null;

    // Values that can be changed by the grid
    readonly columnGroupExpansions?: Record<string, boolean>;
    readonly onColumnGroupExpansionChange?: (change: Record<string, boolean>) => void;
    readonly rowDetailExpansions?: Set<string>;
    readonly onRowDetailExpansionsChange?: (change: Set<string>) => void;

    readonly ref?: Ref<API<T, K & V>>;
  }

  export type API<T, K extends Record<string, any> = object> = {
    readonly columnField: (columnOrId: string | LnColumn<T, K>, row: RowNode<T>) => unknown;
    readonly rowDetailHeight: (rowId: RowNode<T> | string) => number;

    readonly scrollIntoView: (params: {
      readonly column?: number | string | LnColumn<T, K>;
      readonly row?: number;
      readonly behavior?: "smooth" | "auto" | "instant";
    }) => void;

    readonly cellRoot: (
      row: number,
      column: number,
    ) => PositionGridCell | PositionFullWidthRow | null;

    readonly rowDetailExpanded: (rowOrId: RowNode<T> | string | number) => boolean;

    readonly props: () => Props<T>;
  } & K;

  export type Column<
    T,
    V extends RowSource = RowSource,
    K extends Record<string, any> = object,
  > = LnColumn<T, V & K>;
}
