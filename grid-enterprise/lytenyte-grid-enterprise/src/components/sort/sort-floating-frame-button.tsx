import type { StoreEnterpriseReact } from "@1771technologies/grid-types";
import { Button } from "../buttons/button";
import { SortIcon } from "../icons/sort-icon";

export interface SortPanelProps<D> {
  readonly label?: string;
  readonly panelId?: string;
  readonly grid: StoreEnterpriseReact<D>;
}

export function SortPanel<D>({ grid, panelId = "sort", label = "Sort" }: SortPanelProps<D>) {
  const api = grid.api;
  return (
    <Button
      onClick={() => {
        api.floatingFrameOpen(panelId);
      }}
    >
      <SortIcon /> <span>{label}</span>
    </Button>
  );
}
