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

  export namespace Props {
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
}

export type { ViewportShadowsProps } from "./components/viewport/viewport-shadows.js";
export { ViewportShadows } from "./components/viewport/viewport-shadows.js";
