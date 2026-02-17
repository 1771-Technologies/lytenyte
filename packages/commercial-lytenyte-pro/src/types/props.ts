import type { RowHeight, RowNode } from "@1771technologies/lytenyte-shared";
import type { ReactNode, Ref } from "react";
import type {
  Column,
  EditParams,
  HeaderGroupParams,
  HeaderParams,
  RowFullWidthRendererParams,
  RowParams,
} from "./column.js";
import type { GridSpec, GridStyle } from "./grid.js";
import type { API, DataRect } from "./api.js";
import type { ViewportShadowsProps } from "@1771technologies/lytenyte-core";
import type { GridEvents } from "./events.js";

export type Props<Spec extends GridSpec = GridSpec> = {
  readonly cellSelectionMode?: "range" | "multi-range" | "none";
  readonly cellSelections?: DataRect[];
  readonly cellSelectionExcludeMarker?: boolean;
  readonly cellSelectionMaintainOnNonCellPosition?: boolean;
  readonly onCellSelectionChange?: (rects: DataRect[]) => void;

  // CORE Shared Properties
  readonly columns?: Column<Spec>[] | null;
  readonly columnBase?: Omit<Partial<Column<Spec>>, "id" | "pin" | "field" | "editSetter">;
  readonly columnMarker?: Omit<Partial<Column<Spec>>, "id" | "field" | "pin"> & { on?: boolean };

  readonly columnGroupDefaultExpansion?: boolean;
  readonly columnGroupExpansions?: Record<string, boolean>;
  readonly columnGroupJoinDelimiter?: string;
  readonly columnSizeToFit?: boolean;
  readonly columnDoubleClickToAutosize?: boolean;

  readonly columnMoveDragPlaceholder?:
    | { query: string; offset?: [number, number] }
    | string
    | ((
        props: HeaderParams<Spec> & { readonly x: number; readonly y: number; readonly outside: boolean },
      ) => ReactNode);
  readonly columnGroupMoveDragPlaceholder?:
    | { query: string; offset?: [number, number] }
    | string
    | ((
        props: HeaderGroupParams<Spec> & {
          readonly x: number;
          readonly y: number;
          readonly outside: boolean;
        },
      ) => ReactNode);
  readonly columnGroupRenderer?: (props: HeaderGroupParams<Spec>) => ReactNode;

  readonly gridId?: string;
  readonly events?: GridEvents<Spec>;
  readonly styles?: GridStyle;
  readonly rtl?: boolean;

  readonly headerHeight?: number;
  readonly headerGroupHeight?: number;
  readonly floatingRowHeight?: number;
  readonly floatingRowEnabled?: boolean;

  readonly rowOverscanTop?: number;
  readonly rowOverscanBottom?: number;

  readonly colOverscanStart?: number;
  readonly colOverscanEnd?: number;

  readonly virtualizeCols?: boolean;
  readonly virtualizeRows?: boolean;

  readonly rowAlternateAttr?: boolean;
  readonly rowScanDistance?: number;
  readonly rowSource?: Spec["source"];
  readonly rowHeight?: RowHeight;
  // readonly rowAutoHeightGuess?: number;

  readonly rowGroupColumn?: false | Omit<Partial<Column<Spec>>, "field" | "id">;

  readonly rowFullWidthPredicate?: null | ((params: RowParams<Spec>) => boolean);
  readonly rowFullWidthRenderer?: (props: RowFullWidthRendererParams<Spec>) => ReactNode | null;

  readonly rowSelectionMode?: "single" | "multiple" | "none";
  readonly rowSelectionActivator?: "single-click" | "double-click" | "none";

  readonly rowDetailExpansions?: Set<string>;
  readonly rowDetailHeight?: number | "auto";
  readonly rowDetailAutoHeightGuess?: number;
  readonly rowDetailRenderer?: (props: RowParams<Spec>) => ReactNode | null;

  readonly rowDropAccept?: string[];

  readonly ref?: Ref<API<Spec>>;

  readonly slotShadows?: (props: ViewportShadowsProps) => ReactNode;
  readonly slotViewportOverlay?: ((props: { api: API<Spec> }) => ReactNode) | ReactNode;
  readonly slotRowsOverlay?: ((props: { api: API<Spec> }) => ReactNode) | ReactNode;

  readonly editRowValidatorFn?: (
    params: Pick<EditParams<Spec>, "api" | "editData" | "row">,
  ) => boolean | Record<string, unknown>;
  readonly editClickActivator?: "single-click" | "double-click" | "none";
  readonly editMode?: "cell" | "row" | "readonly";

  // Values that can be changed by the grid
  readonly onColumnGroupExpansionChange?: (change: Record<string, boolean>) => void;
  readonly onRowDetailExpansionsChange?: (change: Set<string>) => void;
  readonly onColumnsChange?: (columns: Column<Spec>[]) => void;
  readonly onRowGroupColumnChange?: (column: Omit<Column<Spec>, "field" | "id">) => void;

  // Events

  readonly onColumnMoveOutside?: (params: {
    readonly api: API<Spec>;
    readonly columns: Column<Spec>[];
  }) => void;

  readonly onEditBegin?: (params: {
    readonly api: API<Spec>;
    readonly preventDefault: () => void;
    readonly row: RowNode<Spec["data"]>;
    readonly column: Column<Spec>;
    readonly editData: unknown;
  }) => void;
  readonly onEditEnd?: (params: {
    readonly api: API<Spec>;
    readonly preventDefault: () => void;
    readonly row: RowNode<Spec["data"]>;
    readonly column: Column<Spec>;
    readonly editData: unknown;
  }) => void;
  readonly onEditCancel?: (params: {
    readonly api: API<Spec>;
    readonly row: RowNode<Spec["data"]>;
    readonly column: Column<Spec>;
    readonly editData: unknown;
  }) => void;
  readonly onEditFail?: (params: {
    readonly api: API<Spec>;
    readonly row: RowNode<Spec["data"]>;
    readonly column: Column<Spec>;
    readonly editData: unknown;
    readonly validation: null | Record<string, unknown> | boolean;
  }) => void;
  readonly onRowSelect?: (params: {
    readonly preventDefault: () => void;
    readonly api: API<Spec>;
    readonly rows: string[] | "all";
    readonly deselect: boolean;
  }) => void;

  readonly onRowDrop?: (params: {
    readonly source: { id: string; api: API<GridSpec>; row: RowNode<any>; rowIndex: number; data?: any };
    readonly over:
      | { kind: "viewport"; id: string; element: HTMLElement; api: API<GridSpec> }
      | {
          kind: "row";
          id: string;
          api: API<GridSpec>;
          row: RowNode<any>;
          rowIndex: number;
          element: HTMLElement;
        };
  }) => void;

  readonly onRowDragEnter?: (params: {
    readonly source: { id: string; api: API<GridSpec>; row: RowNode<any>; rowIndex: number; data?: any };
    readonly over:
      | { kind: "viewport"; id: string; element: HTMLElement; api: API<GridSpec> }
      | {
          kind: "row";
          id: string;
          api: API<GridSpec>;
          row: RowNode<any>;
          rowIndex: number;
          element: HTMLElement;
        };
  }) => void;
  readonly onRowDragLeave?: (params: {
    readonly source: {
      id: string;
      api: API<GridSpec>;
      row: RowNode<any>;
      rowIndex: number | null;
      data?: any;
    };
    readonly over:
      | { kind: "viewport"; id: string; element: HTMLElement; api: API<GridSpec> }
      | {
          kind: "row";
          id: string;
          api: API<GridSpec>;
          row: RowNode<any>;
          rowIndex: number | null;
          element: HTMLElement;
        };
  }) => void;
};
