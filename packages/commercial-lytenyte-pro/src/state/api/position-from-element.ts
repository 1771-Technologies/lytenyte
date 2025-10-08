import { getNearestFocusable, getPositionFromFocusable } from "@1771technologies/lytenyte-shared";
import type { Grid, GridApi } from "../../+types";
import type { InternalAtoms } from "../+types";

export const makePositionFromElement = (
  grid: Grid<any> & { internal: InternalAtoms },
): GridApi<any>["positionFromElement"] => {
  return (el) => {
    const focusable = getNearestFocusable(grid.state.gridId.get(), el);
    if (!focusable) return null;

    return getPositionFromFocusable(focusable, grid.state.gridId.get());
  };
};
