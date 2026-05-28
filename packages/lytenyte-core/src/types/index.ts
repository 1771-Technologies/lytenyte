/*
THIS FILE WILL SOON BE DEPRECATED
 */
import type { Grid } from "../index.js";

export type GridEvents<Spec extends Grid.GridSpec = Grid.GridSpec> = Grid.Events<Spec>;
export type GridStyle = Grid.Style;
export type Props<Spec extends Grid.GridSpec = Grid.GridSpec> = Grid.Props<Spec>;
export type API<Spec extends Grid.GridSpec = Grid.GridSpec> = Grid.API<Spec>;
export type ExportDataRectResult<Spec extends Grid.GridSpec = Grid.GridSpec> =
  Grid.T.ExportDataRectResult<Spec>;

export type { ReactPlaceholderFn, DragItem, DragItemTransfer, DragItemSiteLocal } from "../dnd/types.js";

export type PathField = Grid.T.PathField;
export type RowParams<Spec extends Grid.GridSpec = Grid.GridSpec> = Grid.T.RowParams<Spec>;
export type RowFullWidthRendererParams<Spec extends Grid.GridSpec = Grid.GridSpec> =
  Grid.T.RowFullWidthRendererParams<Spec>;

export type HeaderParams<Spec extends Grid.GridSpec = Grid.GridSpec> = Grid.T.HeaderParams<Spec>;
export type HeaderGroupParams<Spec extends Grid.GridSpec = Grid.GridSpec> = Grid.T.HeaderGroupParams<Spec>;
export type CellParams<Spec extends Grid.GridSpec = Grid.GridSpec> = Grid.T.CellParams<Spec>;
export type CellParamsWithIndex<Spec extends Grid.GridSpec = Grid.GridSpec> =
  Grid.T.CellParamsWithIndex<Spec>;
export type CellRendererParams<Spec extends Grid.GridSpec = Grid.GridSpec> = Grid.T.CellRendererParams<Spec>;
export type EditParams<Spec extends Grid.GridSpec = Grid.GridSpec> = Grid.T.EditParams<Spec>;
export type Field<T> = Grid.T.Field<T>;
export type Column<Spec extends Grid.GridSpec = Grid.GridSpec> = Grid.Column<Spec>;

export type {
  SortFn,
  GroupFn,
  DimensionSort,
  DimensionAgg,
  Dimension,
  DataRect,
  FilterFn,
  AggregationFn,
  Aggregator,
  LeafIdFn,
  GroupIdFn,
  RowSelectionState,
  RowSelectionIsolated,
  RowSelectionLinked,
  RowSelectNode,
  RowNode,
  RowLeaf,
  RowGroup,
  RowAggregated,
  ColumnPin,
  LayoutCell,
  LayoutHeader,
  LayoutHeaderCell,
  LayoutHeaderGroup,
  LayoutHeaderFloating,
  LayoutFullWidthRow,
  LayoutRow,
  LayoutRowWithCells,
  PositionDetailCell,
  PositionFloatingCell,
  PositionFullWidthRow,
  PositionGridCell,
  PositionGridCellRoot,
  PositionHeaderCell,
  PositionHeaderGroupCell,
  PositionUnion,
  VirtualTarget,
} from "@1771technologies/lytenyte-shared";
