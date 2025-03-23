import type { StoreEnterpriseReact } from "@1771technologies/grid-types";
import { GridProvider } from "../use-grid";
import type { PropsWithChildren } from "react";

interface RootProps {
  readonly grid: StoreEnterpriseReact<any>;
}

function Root({ grid, children }: PropsWithChildren<RootProps>) {
  return <GridProvider value={grid}>{children}</GridProvider>;
}

interface RowProps {
  readonly pillSource: "columns" | "column-pivots" | "row-groups" | "measures" | "aggregations";
}

function Row({ pillSource }: RowProps) {
  return <div className="lng1771-pill-manager__row" data-pill-source={pillSource}></div>;
}

export const PillManager = {
  Root,
  Row,
};
