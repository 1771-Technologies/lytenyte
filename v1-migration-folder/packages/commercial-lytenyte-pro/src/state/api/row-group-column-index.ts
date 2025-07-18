import {
  GROUP_COLUMN_PREFIX,
  GROUP_COLUMN_SINGLE_ID,
  GROUP_COLUMN_TREE_DATA,
} from "@1771technologies/lytenyte-shared";
import type { Grid, GridApi } from "../../+types";

export const makeRowGroupColumnIndex = (grid: Grid<any>): GridApi<any>["rowGroupColumnIndex"] => {
  return (c) => {
    if (!grid.state.rowGroupModel.get().length || !c.id.startsWith(GROUP_COLUMN_PREFIX)) {
      return -1;
    }
    if (c.id === GROUP_COLUMN_SINGLE_ID || c.id === GROUP_COLUMN_TREE_DATA) return 0;

    const n = c.id.split(":").at(-1);
    if (n == null) return -1;

    return Number.parseInt(n);
  };
};
