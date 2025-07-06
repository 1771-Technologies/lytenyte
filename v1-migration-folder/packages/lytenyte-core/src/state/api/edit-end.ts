import type { InternalAtoms } from "../+types";
import type { Grid, GridApi } from "../../+types";

export const makeEditEnd = (
  grid: Grid<any> & { internal: InternalAtoms },
): GridApi<any>["editEnd"] => {
  return () => {
    grid.internal.editActivePos.set(null);
  };
};
