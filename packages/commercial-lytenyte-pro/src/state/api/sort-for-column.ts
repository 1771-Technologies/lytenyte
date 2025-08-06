import type { Grid, GridApi } from "../../+types";

export const makeSortForColumn = (grid: Grid<any>): GridApi<any>["sortForColumn"] => {
  return (id) => {
    const model = grid.state.sortModel.get();

    const index = model.findIndex((c) => c.columnId === id);
    if (index === -1) return null;

    return { index, sort: model[index] };
  };
};
