import type { Grid, GridApi } from "../../+types";

export const makeRowGroupApplyExpansions = (
  grid: Grid<any>,
): GridApi<any>["rowGroupApplyExpansions"] => {
  return (expansions) => {
    const api = grid.api;
    let prevented = false;
    const preventNext = () => {
      prevented = true;
    };

    try {
      api.eventFire("rowExpandBegin", { expansions, grid, preventNext });

      if (prevented) return;

      const rds = grid.state.rowDataSource.get();
      rds.rowExpand(expansions);

      api.eventFire("rowExpand", { expansions, grid });
    } catch (error: unknown) {
      api.eventFire("rowExpandError", { expansions, grid, error });
    }
  };
};
