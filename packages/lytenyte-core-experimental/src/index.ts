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
import type { PropsWithChildren, ReactNode } from "react";
import type { RowSource } from "@1771technologies/lytenyte-shared";
import type * as LnTypes from "./types/index.js";

export interface GridComponent {
  <Spec extends Root.GridSpec = Root.GridSpec>(props: PropsWithChildren<Root.Props<Spec>>): ReactNode;

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
  }
}

export type { ViewportShadowsProps } from "./components/viewport/viewport-shadows.js";
export { ViewportShadows } from "./components/viewport/viewport-shadows.js";

export { useClientDataSource } from "./data-source/use-client-data-source.js";
export type { RowSourceClient, UseClientDataSourceParams } from "./data-source/use-client-data-source.js";
