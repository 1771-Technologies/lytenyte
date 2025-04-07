import type { SortModelItemPro } from "@1771technologies/grid-types/pro";
import type { SortItem } from "./use-sort-state.js";

export function sortItemsToSortModel(sortItems: SortItem[]): SortModelItemPro[] {
  return sortItems
    .filter((c) => {
      if (!c.columnId) return false;
      if (!c.sortOn) return false;

      return true;
    })
    .map<SortModelItemPro>((c) => {
      return {
        columnId: c.columnId!,
        isDescending: c.sortDirection === "descending",
        options: {
          isAbsolute: c.sortOn!.includes("absolute"),
          isAccented: c.sortOn!.includes("accented"),
          nullsAppearFirst: c.sortOn!.includes("nulls_first"),
        },
      };
    });
}
