import type { InternalAtoms } from "../+types";
import type { Grid, GridApi } from "../../+types";

export const makeRowSelect = (
  grid: Grid<any> & { internal: InternalAtoms },
): GridApi<any>["rowSelect"] => {
  return (params) => {
    let stop = false;
    grid.api.eventFire("rowSelectBegin", {
      grid,
      preventDefault: () => {
        stop = true;
      },
      selected: params.selected,
      deselect: !!params.deselect,
    });
    if (stop) return;

    const rds = grid.state.rowDataSource.get();

    if (params.pivot) grid.internal.rowSelectionPivot.set(params.selected);
    else if (!params.selectBetweenPivot) grid.internal.rowSelectionPivot.set(null);

    const pivot = grid.internal.rowSelectionPivot.get() ?? params.selected;
    rds.rowSelect({
      deselect: !!params.deselect,
      startId: params.selected,
      endId: params.selectBetweenPivot ? pivot : params.selected,
      selectChildren: !!params.selectChildren,
      mode: grid.state.rowSelectionMode.get(),
    });

    if (!params.selectBetweenPivot)
      grid.internal.rowSelectionLastWasDeselect.set(!!params.deselect);

    grid.api.eventFire("rowSelectEnd", {
      grid,
      selected: params.selected,
      deselect: !!params.deselect,
    });
  };
};
