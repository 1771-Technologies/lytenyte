import type { StoreEnterpriseReact } from "@1771technologies/grid-types";
import { SortManager } from "../sort-manager/sort-manager";

export function SortManagerFloating<D>({ grid }: { grid: StoreEnterpriseReact<D> }) {
  return (
    <SortManager
      grid={grid}
      onApply={() => grid.api.floatingFrameClose()}
      onCancel={() => grid.api.floatingFrameClose()}
    />
  );
}
