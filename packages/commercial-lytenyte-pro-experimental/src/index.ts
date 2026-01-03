export { activateLicense } from "./license.js";
import { Grid as GridCore } from "@1771technologies/lytenyte-core-experimental";
import type { PropsWithChildren, ReactNode } from "react";
import { Root } from "./root/root.js";
import type { RowSource } from "@1771technologies/lytenyte-shared";
import type * as LnTypes from "./types/index.js";

export { Root } from "./root/root.js";

export interface GridComponent {
  <Spec extends Root.GridSpec = Root.GridSpec>(
    props: PropsWithChildren<
      Root.Props<Spec> &
        (undefined extends Spec["api"]
          ? unknown
          : { apiExtension: ((incomplete: Root.API<Spec>) => Spec["api"] | null) | Spec["api"] })
    >,
  ): ReactNode;

  Header: typeof GridCore.Header;
  HeaderRow: typeof GridCore.HeaderRow;
  HeaderCell: typeof GridCore.HeaderCell;

  HeaderGroupCell: typeof GridCore.HeaderGroupCell;
  RowsContainer: typeof GridCore.RowsContainer;
  RowsTop: typeof GridCore.RowsTop;
  RowsCenter: typeof GridCore.RowsCenter;
  RowsBottom: typeof GridCore.RowsBottom;
  Row: typeof GridCore.Row;
  RowFullWidth: typeof GridCore.RowFullWidth;
  Cell: typeof GridCore.Cell;
  Viewport: typeof GridCore.Viewport;
}

export const Grid = Root as GridComponent;
Grid.Header = GridCore.Header;
Grid.HeaderRow = GridCore.HeaderRow;
Grid.HeaderCell = GridCore.HeaderCell;
Grid.HeaderGroupCell = GridCore.HeaderGroupCell;
Grid.RowsContainer = GridCore.RowsContainer;
Grid.RowsTop = GridCore.RowsTop;
Grid.RowsCenter = GridCore.RowsCenter;
Grid.RowsBottom = GridCore.RowsBottom;
Grid.Row = GridCore.Row;
Grid.RowFullWidth = GridCore.RowFullWidth;
Grid.Cell = GridCore.Cell;
Grid.Viewport = GridCore.Viewport;

export namespace Grid {
  export type GridSpec<
    T = unknown,
    C extends Record<string, any> = object,
    S extends RowSource<T> = RowSource,
    E extends Record<string, any> = object,
  > = Root.GridSpec<T, C, S, E>;

  export type Props<Spec extends GridSpec = GridSpec> = Root.Props<Spec>;
  export type API<Spec extends GridSpec = GridSpec> = Root.API<Spec>;
  export type Column<Spec extends GridSpec = GridSpec> = Root.Column<Spec>;
  export type ColumnBase<Spec extends GridSpec = GridSpec> = Required<Root.Props<Spec>>["columnBase"];
  export type ColumnMarker<Spec extends GridSpec = GridSpec> = Required<Root.Props<Spec>>["columnMarker"];
  export type RowGroupColumn<Spec extends GridSpec = GridSpec> = Required<Root.Props<Spec>>["rowGroupColumn"];
  export type Events<Spec extends GridSpec = GridSpec> = Required<Root.Props<Spec>>["events"];

  export namespace Components {
    export type Header = GridCore.Components.Header;
    export type HeaderRow = GridCore.Components.HeaderRow;
    export type HeaderCell = GridCore.Components.HeaderCell;
    export type HeaderGroupCell = GridCore.Components.HeaderGroupCell;
    export type RowsContainer = GridCore.Components.RowsContainer;
    export type RowsTop = GridCore.Components.RowsTop;
    export type RowsCenter = GridCore.Components.RowsCenter;
    export type RowsBottom = GridCore.Components.RowsBottom;
    export type Row = GridCore.Components.Row;
    export type RowFullWidth = GridCore.Components.RowFullWidth;
    export type Cell = GridCore.Components.Cell;
    export type Viewport = GridCore.Components.Viewport;
  }

  export namespace T {
    export type AggregationFn<T> = LnTypes.AggregationFn<T>;
    export type Aggregator<T> = LnTypes.Aggregator<T>;
    export type CellParams<Spec extends GridSpec> = LnTypes.CellParams<Spec>;
    export type CellParamsWithIndex<Spec extends GridSpec> = LnTypes.CellParamsWithIndex<Spec>;
    export type CellRendererParams<Spec extends GridSpec> = LnTypes.CellRendererParams<Spec>;
    export type DataRect = LnTypes.DataRect;
    export type Dimension<T> = LnTypes.Dimension<T>;
    export type DimensionAgg<T, K extends { id: string; field?: Field<T> }> = LnTypes.DimensionAgg<T, K>;
    export type DimensionSort<T> = LnTypes.DimensionSort<T>;
    export type EditParams = LnTypes.EditParams;
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
    export type SortFn<T> = LnTypes.SortFn<T>;
    export type RowFullWidthRendererParams<Spec extends GridSpec> = LnTypes.RowFullWidthRendererParams<Spec>;

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

    // PRO Specific types

    export type DataRectSplit = LnTypes.DataRectSplit;
    export type DialogFrame<Spec extends GridSpec> = LnTypes.DialogFrame<Spec>;
    export type DialogFrameProps<Spec extends GridSpec> = LnTypes.DialogFrameProps<Spec>;
    export type HavingFilterFn = LnTypes.HavingFilterFn;
    export type LabelFilter = LnTypes.LabelFilter;
    export type PivotField<Spec extends GridSpec> = LnTypes.PivotField<Spec>;
    export type PivotModel<Spec extends GridSpec> = LnTypes.PivotModel<Spec>;
    export type PopoverFrame<Spec extends GridSpec> = LnTypes.PopoverFrame<Spec>;
    export type PopoverFrameProps<Spec extends GridSpec> = LnTypes.PopoverFrameProps<Spec>;
    export type VirtualTarget = LnTypes.VirtualTarget;
  }
}

export type {
  UseClientDataSourceParams,
  RowSourceClient,
} from "./data-source-client/use-client-data-source.js";
export { useClientDataSource } from "./data-source-client/use-client-data-source.js";

export type {
  UseServerDataSourceParams,
  RowSourceServer,
} from "./data-source-server/use-server-data-source.js";
export { useServerDataSource } from "./data-source-server/use-server-data-source.js";

export type { RowSourceTree, UseTreeDataSourceParams } from "./data-source-tree/use-tree-data-source.js";
export { useTreeDataSource } from "./data-source-tree/use-tree-data-source.js";

export { measureText } from "@1771technologies/lytenyte-shared";

export type { ViewportShadowsProps } from "@1771technologies/lytenyte-core-experimental";
export { ViewportShadows } from "@1771technologies/lytenyte-core-experimental";

export { RowGroupCell } from "./components/row-group-cell.js";
export type { SelectAllProps } from "./components/select-all.js";
export { SelectAll } from "./components/select-all.js";

export type { Piece, PieceWritable } from "@1771technologies/lytenyte-core-experimental";
export { usePiece } from "@1771technologies/lytenyte-core-experimental";

export { PillManager } from "./components/pill-manager/index.js";
