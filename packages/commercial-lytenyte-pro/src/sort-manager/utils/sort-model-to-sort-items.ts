import type { Column, SortModelItem } from "../../+types";
import type { SortItem } from "../+types.js";

export function sortModelToSortItems<T>(
  items: SortModelItem<T>[],
  lookup: Map<string, Column<T>>,
): SortItem[] {
  return items
    .map((c) => {
      const columnId = c.columnId;

      const sortDirection: SortItem["sortDirection"] = c.isDescending ? "descending" : "ascending";
      if (c.sort.kind === "custom") {
        return {
          isCustom: true,
          sortDirection,
          columnId: c.columnId ?? undefined,
          originalSort: c,
        } satisfies SortItem;
      }

      const column = lookup.get(columnId!);
      if (!column) return;

      let value = "values";
      if (c.sort.kind === "string") {
        const opts = c.sort.options;
        if (opts?.nullsFirst) value += "_nulls_first";
        if (opts?.caseInsensitive) value += "_insensitive";
        if (opts?.ignorePunctuation) value += "_ignore";
        if (opts?.trimWhitespace) value += "_trim";
      }
      if (c.sort.kind === "number") {
        const opts = c.sort.options;
        if (opts?.nullsFirst) value += "_nulls_first";
        if (opts?.absoluteValue) value += "_absolute";
      }
      if (c.sort.kind === "date") {
        const opts = c.sort.options;
        if (opts?.nullsFirst) value += "_nulls_first";
      }

      return {
        isCustom: false,
        columnId,
        sortDirection,
        label: column?.name ?? column?.id,
        sortOn: value as SortItem["sortOn"],
      };
    })
    .filter((c) => c != null) as SortItem[];
}
