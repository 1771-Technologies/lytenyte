import { SortManager } from "@1771technologies/grid-components";
import type { StoreEnterpriseReact } from "@1771technologies/grid-types";

export function SortManagerFloating<D>({ grid }: { grid: StoreEnterpriseReact<D> }) {
  return (
    <SortManager
      grid={grid}
      onApply={() => grid.api.floatingFrameClose()}
      onCancel={() => grid.api.floatingFrameClose()}
    />
  );
}
