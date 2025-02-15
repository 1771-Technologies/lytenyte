import type { StoreEnterpriseReact } from "@1771technologies/grid-types";
import { Button } from "./buttons/button";
import { SortIcon } from "./icons/sort-icon";

export interface SortPanelProps<D> {
  readonly label?: string;
  readonly grid: StoreEnterpriseReact<D>;
}

export function SortPanel<D>({ grid, label = "Sort" }: SortPanelProps<D>) {
  const api = grid.api;
  return (
    <Button onClick={() => api.panelFrameOpen("sort")}>
      <SortIcon /> <span>{label}</span>
    </Button>
  );
}
