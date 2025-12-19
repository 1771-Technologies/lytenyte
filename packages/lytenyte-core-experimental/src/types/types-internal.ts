import type { Ref } from "react";
import type { ColumnAbstract, RowGroupDisplayMode, RowSource } from "@1771technologies/lytenyte-shared";
import type { Root } from "../root/root";

export type API = Root.API<any>;

export type RowHeight = number | `fill:${number}` | ((i: number) => number);
export type RowPin = "top" | "bottom" | null;

export interface Props {
  readonly columns?: ColumnAbstract[];
  readonly columnBase?: Omit<ColumnAbstract, "pin" | "field">;
  readonly columnMarker?: Omit<ColumnAbstract, "field"> & { width?: number };

  readonly columnMarkerEnabled?: boolean;
  readonly columnGroupDefaultExpansion?: boolean;
  readonly columnGroupExpansions?: Record<string, boolean>;
  readonly columnGroupJoinDelimiter?: string;
  readonly columnSizeToFit?: boolean;
  readonly columnDoubleClickToAutosize?: boolean;

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
  readonly rowAutoHeightGuess?: number;

  readonly rowGroupColumn?: Pick<
    ColumnAbstract,
    "width" | "widthMax" | "widthFlex" | "widthMin" | "pin" | "resizable" | "hide" | "name" | "type"
  >;
  readonly rowGroupDisplayMode?: RowGroupDisplayMode;

  readonly rowFullWidthPredicate?: null | ((params: any) => boolean);
  readonly rowFullWidthRenderer?: ((params: any) => any) | null;

  readonly virtualizeCols?: boolean;
  readonly virtualizeRows?: boolean;

  readonly rowSelectionMode?: "single" | "multiple" | "none";
  readonly rowSelectionActivator?: "single-click" | "double-click" | "none";
  readonly rowSelectChildren?: boolean;

  readonly rowDetailExpansions?: Set<string>;
  readonly rowDetailHeight?: number | "auto";
  readonly rowDetailAutoHeightGuess?: number;
  readonly rowDetailRenderer?: ((params: any) => any) | null;

  readonly ref?: Ref<API>;

  readonly editRowValidatorFn?: any;
  readonly editClickActivator?: "single" | "double-click" | "none";
  readonly editCellMode?: "cell" | "readonly";

  // Values that can be changed by the grid
  readonly onColumnGroupExpansionChange?: (change: Record<string, boolean>) => void;
  readonly onRowDetailExpansionsChange?: (change: Set<string>) => void;
}
