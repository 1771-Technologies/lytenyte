import { rowIndexForSection } from "@1771technologies/lytenyte-shared";
import type { Grid, GridApi } from "../../+types.js";

export const makeRowByIndex = (grid: Grid<any>): GridApi<any>["rowByIndex"] => {
  return (index, section = "flat") => {
    const rowIndex = rowIndexForSection(
      index,
      section,
      grid.state.rowDataStore.rowTopCount.get(),
      grid.state.rowDataStore.rowBottomCount.get(),
      grid.state.rowDataStore.rowCount.get(),
    );

    if (rowIndex == null) return null;

    return grid.state.rowDataSource.get().rowByIndex(rowIndex);
  };
};
