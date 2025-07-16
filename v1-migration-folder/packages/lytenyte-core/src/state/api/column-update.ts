import type { Grid, GridApi } from "../../+types";

export const makeColumnUpdate = (grid: Grid<any>): GridApi<any>["columnUpdate"] => {
  return (updates) => {
    const columns = [...grid.state.columns.get()];

    for (let i = 0; i < columns.length; i++) {
      const column = columns[i];

      if (updates[column.id]) {
        const next = { ...column, ...updates[column.id] };
        columns[i] = next;
      }
    }

    grid.state.columns.set(columns);
  };
};
