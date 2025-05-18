import type { SortModelItemPro } from "@1771technologies/grid-types/pro";
import type { SortItem } from "./use-sort-state.js";
import type { GridProReact } from "../types.js";

export function sortModelToSortItems<D>(c: SortModelItemPro[], grid: GridProReact<D>): SortItem[] {
  return c.map<SortItem>((c) => {
    const columnId = c.columnId;
    const sortDirection: SortItem["sortDirection"] = c.isDescending ? "descending" : "ascending";

    let value = "values";
    if (c.options?.isAbsolute) {
      value += "_absolute";
    }
    if (c.options?.isAccented) {
      value += "_accented";
    }
    if (c.options?.nullsAppearFirst) {
      value += "_nulls_first";
    }
    const column = grid.api.columnById(c.columnId);

    return {
      columnId,
      sortDirection,
      label: column?.headerName ?? column?.id,
      sortOn: value as SortItem["sortOn"],
    };
  });
}
