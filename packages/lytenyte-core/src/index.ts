import { Header } from "./components/header/header.js";
import { HeaderRow } from "./components/header/header-row/header-row.js";
import { HeaderCell } from "./components/header/header-cell/header-cell.js";
import { HeaderGroupCell } from "./components/header/header-cell/header-group-cell.js";
import { RowsContainer } from "./components/rows/rows-container/rows-container.js";
import { RowsTop } from "./components/rows/row-sections/rows-top.js";
import { RowsCenter } from "./components/rows/row-sections/rows-center.js";
import { RowsBottom } from "./components/rows/row-sections/rows-bottom.js";
import { Row } from "./components/rows/row/row.js";
import { RowFullWidth } from "./components/rows/row-full-width.js";
import { Cell } from "./components/cells/cell.js";
import { Viewport } from "./components/viewport/viewport.js";
import { Root } from "./root/root.js";
import type { PropsWithChildren, ReactNode, Ref } from "react";
import type { RowHeight, RowSource } from "@1771technologies/lytenyte-shared";
import type * as LnTypes from "./types/index.js";
import type { ViewportShadowsProps } from "./components.js";

export const Grid = Root as GridComponent;
Grid.Header = Header;
Grid.HeaderRow = HeaderRow;
Grid.HeaderCell = HeaderCell;
Grid.HeaderGroupCell = HeaderGroupCell;
Grid.RowsContainer = RowsContainer;
Grid.RowsTop = RowsTop;
Grid.RowsCenter = RowsCenter;
Grid.RowsBottom = RowsBottom;
Grid.Row = Row;
Grid.RowFullWidth = RowFullWidth;
Grid.Cell = Cell;
Grid.Viewport = Viewport;

export { measureText } from "@1771technologies/dom-utils";
export { moveRelative, equal, arrayShallow } from "@1771technologies/js-utils";
export { getRowDragData } from "./dnd/get-drag-data.js";
export { computeField } from "./root/hooks/use-api/auxiliary-functions/compute-field.js";

export { useClientDataSource } from "./data-source/use-client-data-source.js";
export type { RowSourceClient, UseClientDataSourceParams } from "./data-source/use-client-data-source.js";

export type { Piece, PieceWritable } from "./hooks/use-piece.js";
export { usePiece } from "./hooks/use-piece.js";

// FROM HERE DOWN ONLY PUT TYPES RELATED TO THE GRID.

export interface GridComponent {
  <Spec extends Grid.GridSpec = Grid.GridSpec>(
    props: PropsWithChildren<
      Grid.Props<Spec> &
        (undefined extends Spec["api"]
          ? unknown
          : { apiExtension: ((incomplete: Root.API<Spec>) => Spec["api"] | null) | Spec["api"] })
    >,
  ): ReactNode;

  Header: typeof Header;
  HeaderRow: typeof HeaderRow;
  HeaderCell: typeof HeaderCell;

  HeaderGroupCell: typeof HeaderGroupCell;
  RowsContainer: typeof RowsContainer;
  RowsTop: typeof RowsTop;
  RowsCenter: typeof RowsCenter;
  RowsBottom: typeof RowsBottom;
  Row: typeof Row;
  RowFullWidth: typeof RowFullWidth;
  Cell: typeof Cell;
  Viewport: typeof Viewport;
}

export namespace Grid {
  export interface GridSpec<
    Data = unknown,
    ColExt extends Record<string, any> = object,
    S extends RowSource<Data> = RowSource,
    Ext extends Record<string, any> = object,
  > {
    readonly data?: Data;
    readonly column?: ColExt;
    readonly source?: S;
    readonly api?: Ext;
  }

  export type Props<Spec extends Grid.GridSpec = Grid.GridSpec> = {
    readonly cellSelectionMode?: "range" | "multi-range" | "none";
    readonly cellSelections?: T.DataRect[];
    readonly cellSelectionExcludeMarker?: boolean;
    readonly cellSelectionMaintainOnNonCellPosition?: boolean;
    readonly onCellSelectionChange?: (rects: T.DataRect[]) => void;

    readonly columns?: Column<Spec>[];
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
          props: T.HeaderParams<Spec> & {
            readonly x: number;
            readonly y: number;
            readonly outside: boolean;
          },
        ) => ReactNode);
    readonly columnGroupMoveDragPlaceholder?:
      | { query: string; offset?: [number, number] }
      | string
      | ((
          props: T.HeaderGroupParams<Spec> & {
            readonly x: number;
            readonly y: number;
            readonly outside: boolean;
          },
        ) => ReactNode);
    readonly columnGroupRenderer?: (props: T.HeaderGroupParams<Spec>) => ReactNode;

    readonly gridId?: string;
    readonly events?: LnTypes.GridEvents<Spec>;
    readonly styles?: LnTypes.GridStyle;

    readonly rtl?: boolean;

    readonly headerHeight?: number;
    readonly headerGroupHeight?: number;
    readonly floatingRowHeight?: number;
    readonly floatingRowEnabled?: boolean;

    /** @private */
    readonly z_internal_viewportInitialWidth?: number;
    /** @private */
    readonly z_internal_viewportInitialHeight?: number;

    readonly rowOverscanTop?: number;
    readonly rowOverscanBottom?: number;

    readonly colOverscanStart?: number;
    readonly colOverscanEnd?: number;

    readonly rowAlternateAttr?: boolean;
    readonly rowScanDistance?: number;
    readonly rowSource?: Spec["source"];
    readonly rowHeight?: RowHeight;
    readonly rowAutoHeightGuess?: number;

    readonly rowGroupColumn?: false | Omit<Column<Spec>, "field" | "id">;

    readonly rowFullWidthPredicate?: null | ((params: T.RowParams<Spec>) => boolean);
    readonly rowFullWidthRenderer?: (props: T.RowFullWidthRendererParams<Spec>) => ReactNode | null;

    readonly virtualizeCols?: boolean;
    readonly virtualizeRows?: boolean;

    readonly rowSelectionMode?: "single" | "multiple" | "none";
    readonly rowSelectionActivator?: "single-click" | "double-click" | "none";

    readonly rowDetailExpansions?: Set<string>;
    readonly rowDetailHeight?: number | "auto";
    readonly rowDetailAutoHeightGuess?: number;
    readonly rowDetailRenderer?: (props: T.RowParams<Spec>) => ReactNode | null;
    readonly rowDropAccept?: string[];

    readonly ref?: Ref<API<Spec>>;

    readonly editRowValidatorFn?: (
      params: Pick<T.EditParams<Spec>, "api" | "editData" | "row">,
    ) => boolean | Record<string, unknown>;
    readonly editClickActivator?: "single-click" | "double-click" | "none";
    readonly editMode?: "cell" | "row" | "readonly";

    // Values that can be changed by the grid
    readonly onColumnGroupExpansionChange?: (change: Record<string, boolean>) => void;
    readonly onRowDetailExpansionsChange?: (change: Set<string>) => void;
    readonly onColumnsChange?: (columns: Column<Spec>[]) => void;
    readonly onRowGroupColumnChange?: (column: Omit<Column<Spec>, "field" | "id">) => void;

    readonly slotShadows?: (props: ViewportShadowsProps) => ReactNode;
    readonly slotViewportOverlay?: ((props: { api: API<Spec> }) => ReactNode) | ReactNode;
    readonly slotRowsOverlay?: ((props: { api: API<Spec> }) => ReactNode) | ReactNode;

    // Events

    readonly onColumnMoveOutside?: (params: {
      readonly api: API<Spec>;
      readonly columns: Column<Spec>[];
    }) => void;

    readonly onEditBegin?: (params: {
      readonly api: API<Spec>;
      readonly preventDefault: () => void;
      readonly row: T.RowNode<Spec["data"]>;
      readonly column: Column<Spec>;
      readonly editData: unknown;
    }) => void;
    readonly onEditEnd?: (params: {
      readonly api: API<Spec>;
      readonly preventDefault: () => void;
      readonly row: T.RowNode<Spec["data"]>;
      readonly column: Column<Spec>;
      readonly editData: unknown;
    }) => void;
    readonly onEditCancel?: (params: {
      readonly api: API<Spec>;
      readonly row: T.RowNode<Spec["data"]>;
      readonly column: Column<Spec>;
      readonly editData: unknown;
    }) => void;
    readonly onEditFail?: (params: {
      readonly api: API<Spec>;
      readonly row: T.RowNode<Spec["data"]>;
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
      readonly source: {
        id: string;
        api: API<Grid.GridSpec>;
        row: T.RowNode<any>;
        rowIndex: number;
        data?: any;
      };
      readonly over:
        | { kind: "viewport"; id: string; element: HTMLElement; api: API<Grid.GridSpec> }
        | {
            kind: "row";
            id: string;
            api: API<Grid.GridSpec>;
            row: T.RowNode<any>;
            rowIndex: number;
            element: HTMLElement;
          };
    }) => void;

    readonly onRowDragEnter?: (params: {
      readonly source: {
        id: string;
        api: API<Grid.GridSpec>;
        row: T.RowNode<any>;
        rowIndex: number;
        data?: any;
      };
      readonly over:
        | { kind: "viewport"; id: string; element: HTMLElement; api: API<Grid.GridSpec> }
        | {
            kind: "row";
            id: string;
            api: API<Grid.GridSpec>;
            row: T.RowNode<any>;
            rowIndex: number;
            element: HTMLElement;
          };
    }) => void;
    readonly onRowDragLeave?: (params: {
      readonly source: {
        id: string;
        api: API<Grid.GridSpec>;
        row: T.RowNode<any>;
        rowIndex: number | null;
        data?: any;
      };
      readonly over:
        | { kind: "viewport"; id: string; element: HTMLElement; api: API<Grid.GridSpec> }
        | {
            kind: "row";
            id: string;
            api: API<Grid.GridSpec>;
            row: T.RowNode<any>;
            rowIndex: number | null;
            element: HTMLElement;
          };
    }) => void;
  };

  export type API<Spec extends GridSpec = GridSpec> = Root.API<Spec>;
  export type Column<Spec extends GridSpec = GridSpec> = Root.Column<Spec>;
  export type ColumnBase<Spec extends GridSpec = GridSpec> = Required<Props<Spec>>["columnBase"];
  export type ColumnMarker<Spec extends GridSpec = GridSpec> = Required<Props<Spec>>["columnMarker"];
  export type RowGroupColumn<Spec extends GridSpec = GridSpec> = Required<Props<Spec>>["rowGroupColumn"];
  export type Events<Spec extends GridSpec = GridSpec> = Required<Props<Spec>>["events"];
  export type Style = LnTypes.GridStyle;

  export namespace Components {
    export type Header = Header.Props;
    export type HeaderRow = HeaderRow.Props;
    export type HeaderCell = HeaderCell.Props;
    export type HeaderGroupCell = HeaderGroupCell.Props;
    export type RowsContainer = RowsContainer.Props;
    export type RowsTop = RowsTop.Props;
    export type RowsCenter = RowsCenter.Props;
    export type RowsBottom = RowsBottom.Props;
    export type Row = Row.Props;
    export type RowFullWidth = RowFullWidth.Props;
    export type Cell = Cell.Props;
    export type Viewport = Viewport.Props;
  }

  export namespace T {
    export type AggregationFn<T> = LnTypes.AggregationFn<T>;
    export type Aggregator<T> = LnTypes.Aggregator<T>;
    export type CellParams<Spec extends GridSpec> = LnTypes.CellParams<Spec>;
    export type CellParamsWithIndex<Spec extends GridSpec> = LnTypes.CellParamsWithIndex<Spec>;
    export type CellRendererParams<Spec extends GridSpec> = LnTypes.CellRendererParams<Spec>;
    export type DataRect = LnTypes.DataRect;
    export type Dimension<T> = LnTypes.Dimension<T>;
    export type DimensionAgg<T> = LnTypes.DimensionAgg<T>;
    export type DimensionSort<T> = LnTypes.DimensionSort<T>;
    export type EditParams<Spec extends GridSpec> = LnTypes.EditParams<Spec>;
    export type ExportDataRectResult = LnTypes.ExportDataRectResult;
    export type Field<T> = LnTypes.Field<T>;
    export type FilterFn<T> = LnTypes.FilterFn<T>;
    export type GroupFn<T> = LnTypes.GroupFn<T>;
    export type GroupIdFn = LnTypes.GroupIdFn;
    export type HeaderGroupParams<Spec extends GridSpec> = LnTypes.HeaderGroupParams<Spec>;
    export type HeaderParams<Spec extends GridSpec> = LnTypes.HeaderParams<Spec>;
    export type LeafIdFn<T> = LnTypes.LeafIdFn<T>;
    export type PathField = LnTypes.PathField;
    export type RowParams<Spec extends GridSpec> = LnTypes.RowParams<Spec>;
    export type RowSelectionState = LnTypes.RowSelectionState;
    export type RowSelectionIsolated = LnTypes.RowSelectionIsolated;
    export type RowSelectionLinked = LnTypes.RowSelectionLinked;
    export type RowSelectNode = LnTypes.RowSelectNode;
    export type SortFn<T> = LnTypes.SortFn<T>;
    export type RowFullWidthRendererParams<Spec extends GridSpec> = LnTypes.RowFullWidthRendererParams<Spec>;
    export type RowDragPlaceholderFn = LnTypes.ReactPlaceholderFn;
    export type DragItem = LnTypes.DragItem;
    export type DragItemSiteLocal = LnTypes.DragItemSiteLocal;
    export type DragItemTransfer = LnTypes.DragItemTransfer;

    export type RowNode<T> = LnTypes.RowNode<T>;
    export type RowLeaf<T> = LnTypes.RowLeaf<T>;
    export type RowGroup = LnTypes.RowGroup;
    export type RowAggregated = LnTypes.RowAggregated;
    export type ColumnPin = LnTypes.ColumnPin;
    export type LayoutCell = LnTypes.LayoutCell;
    export type LayoutHeader = LnTypes.LayoutHeader;
    export type LayoutHeaderCell = LnTypes.LayoutHeaderCell;
    export type LayoutHeaderGroup = LnTypes.LayoutHeaderGroup;
    export type LayoutHeaderFloating = LnTypes.LayoutHeaderFloating;
    export type LayoutFullWidthRow = LnTypes.LayoutFullWidthRow;
    export type LayoutRow = LnTypes.LayoutRow;
    export type LayoutRowWithCells = LnTypes.LayoutRowWithCells;
    export type PositionDetailCell = LnTypes.PositionDetailCell;
    export type PositionFloatingCell = LnTypes.PositionFloatingCell;
    export type PositionFullWidthRow = LnTypes.PositionFullWidthRow;
    export type PositionGridCell = LnTypes.PositionGridCell;
    export type PositionGridCellRoot = LnTypes.PositionGridCellRoot;
    export type PositionHeaderCell = LnTypes.PositionHeaderCell;
    export type PositionHeaderGroupCell = LnTypes.PositionHeaderGroupCell;
    export type PositionUnion = LnTypes.PositionUnion;
  }
}
