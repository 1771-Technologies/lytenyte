import type { StoreEnterpriseReact } from "@1771technologies/grid-types";
import { Button } from "../buttons/button";
import { ManageColumnsIcon } from "../icons/manage-columns-icon";

export interface ColumnManagerButtonProps<D> {
  readonly label?: string;
  readonly panelId?: string;
  readonly grid: StoreEnterpriseReact<D>;
}

export function ColumnManagerButton<D>({
  grid,
  panelId = "columns",
  label = "Columns",
}: ColumnManagerButtonProps<D>) {
  const api = grid.api;
  return (
    <Button
      onClick={() => {
        api.floatingFrameOpen(panelId);
      }}
    >
      <ManageColumnsIcon /> <span>{label}</span>
    </Button>
  );
}
