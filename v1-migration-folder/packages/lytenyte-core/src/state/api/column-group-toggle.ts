import type { Grid, GridApi } from "../../+types";

export const makeColumnGroupToggle = (grid: Grid<any>): GridApi<any>["columnToggleGroup"] => {
  return (group, state) => {
    const delimiter = grid.state.columnGroupJoinDelimiter.get();
    const id = typeof group === "string" ? group : group.join(delimiter);

    const currentExpansions = grid.state.columnGroupExpansions.get();
    const currentState = currentExpansions[id] ?? grid.state.columnGroupDefaultExpansion.get();

    const next = state ?? !currentState;

    grid.state.columnGroupExpansions.set((prev) => ({ ...prev, [id]: next }));
  };
};
