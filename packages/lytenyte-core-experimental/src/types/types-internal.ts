import type { Ref } from "react";
import type {
  ColumnAbstract,
  RowGroupDisplayMode,
  RowNode,
  RowSource,
} from "@1771technologies/lytenyte-shared";
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

  readonly columnMoveDragPlaceholder?:
    | { query: string; offset?: [number, number] }
    | string
    | ((props: any) => any);
  readonly columnGroupMoveDragPlaceholder?:
    | { query: string; offset?: [number, number] }
    | string
    | ((props: any) => any);
  readonly columnGroupRenderer?: (props: any) => any;

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

  readonly rowDetailExpansions?: Set<string>;
  readonly rowDetailHeight?: number | "auto";
  readonly rowDetailAutoHeightGuess?: number;
  readonly rowDetailRenderer?: ((params: any) => any) | null;
  readonly rowDropAccept?: string[];

  readonly ref?: Ref<API>;

  readonly editRowValidatorFn?: any;
  readonly editClickActivator?: "single" | "double-click" | "none";
  readonly editMode?: "cell" | "readonly";

  // Values that can be changed by the grid
  readonly onColumnGroupExpansionChange?: (change: Record<string, boolean>) => void;
  readonly onRowDetailExpansionsChange?: (change: Set<string>) => void;
  readonly onRowGroupExpansionChange?: (deltaChange: Record<string, boolean>) => void;
  readonly onColumnsChange?: (columns: ColumnAbstract[]) => void;
  readonly onRowGroupColumnChange?: (column: Omit<ColumnAbstract, "id">) => void;

  readonly onEditBegin?: (params: {
    readonly preventDefault: () => void;
    readonly api: API;
    readonly row: RowNode<any>;
    readonly column: ColumnAbstract;
    readonly editData: unknown;
  }) => void;
  readonly onEditEnd?: (params: {
    readonly preventDefault: () => void;
    readonly api: API;
    readonly row: RowNode<any>;
    readonly column: ColumnAbstract;
    readonly editData: unknown;
  }) => void;
  readonly onEditCancel?: (params: {
    readonly api: API;
    readonly row: RowNode<any>;
    readonly column: ColumnAbstract;
    readonly editData: unknown;
  }) => void;
  readonly onEditFail?: (params: {
    readonly api: API;
    readonly row: RowNode<any>;
    readonly column: ColumnAbstract;
    readonly editData: unknown;
    readonly validation: null | Record<string, unknown> | boolean;
  }) => void;

  readonly onRowSelect?: (params: {
    readonly preventDefault: () => void;
    readonly api: API;
    readonly rows: string[] | "all";
    readonly deselect: boolean;
  }) => boolean;

  readonly onRowDrop?: (params: {
    readonly source: { id: string; api: API; row: RowNode<any>; rowIndex: number | null; data?: any };
    readonly over:
      | { kind: "viewport"; id: string; element: HTMLElement; api: API }
      | {
          kind: "row";
          id: string;
          api: API;
          row: RowNode<any>;
          rowIndex: number | null;
          element: HTMLElement;
        };
  }) => void;

  readonly onRowDragEnter?: (params: {
    readonly source: { id: string; api: API; row: RowNode<any>; rowIndex: number | null; data?: any };
    readonly over:
      | { kind: "viewport"; id: string; element: HTMLElement; api: API }
      | {
          kind: "row";
          id: string;
          api: API;
          row: RowNode<any>;
          rowIndex: number | null;
          element: HTMLElement;
        };
  }) => void;
  readonly onRowDragLeave?: (params: {
    readonly source: { id: string; api: API; row: RowNode<any>; rowIndex: number | null; data?: any };
    readonly over:
      | { kind: "viewport"; id: string; element: HTMLElement; api: API }
      | {
          kind: "row";
          id: string;
          api: API;
          row: RowNode<any>;
          rowIndex: number | null;
          element: HTMLElement;
        };
  }) => void;
}
