import { ColumnManager } from "@1771technologies/grid-components";
import type { StoreEnterpriseReact } from "@1771technologies/grid-types";

export function ColumnManagerFloating<D>({ grid }: { grid: StoreEnterpriseReact<D> }) {
  return <ColumnManager api={grid.api} />;
}
