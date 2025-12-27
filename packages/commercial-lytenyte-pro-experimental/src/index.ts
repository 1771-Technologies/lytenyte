import { Grid as GridCore } from "@1771technologies/lytenyte-core-experimental";
import type { PropsWithChildren, ReactNode } from "react";
import { Root } from "./root/root.js";
import type { RowSource } from "@1771technologies/lytenyte-shared";

export { Root } from "./root/root.js";

export interface GridComponent {
  <Spec extends Root.GridSpec = Root.GridSpec>(props: PropsWithChildren<Root.Props<Spec>>): ReactNode;

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

  export namespace Props {
    export type Header = GridCore.Props.Header;
    export type HeaderRow = GridCore.Props.HeaderRow;
    export type HeaderCell = GridCore.Props.HeaderCell;
    export type HeaderGroupCell = GridCore.Props.HeaderGroupCell;
    export type RowsContainer = GridCore.Props.RowsContainer;
    export type RowsTop = GridCore.Props.RowsTop;
    export type RowsCenter = GridCore.Props.RowsCenter;
    export type RowsBottom = GridCore.Props.RowsBottom;
    export type Row = GridCore.Props.Row;
    export type RowFullWidth = GridCore.Props.RowFullWidth;
    export type Cell = GridCore.Props.Cell;
    export type Viewport = GridCore.Props.Viewport;
  }
}

export type { ViewportShadowsProps } from "@1771technologies/lytenyte-core-experimental";
export { ViewportShadows } from "@1771technologies/lytenyte-core-experimental";

export type {
  UseClientDataSourceParams,
  RowSourceClient,
} from "./data-source-client/use-client-data-source.js";
export { useClientDataSource } from "./data-source-client/use-client-data-source.js";
