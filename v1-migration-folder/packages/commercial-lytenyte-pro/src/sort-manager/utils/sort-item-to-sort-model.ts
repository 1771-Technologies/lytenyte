import type { SortItem } from "../+types";
import type { Column, SortModelItem } from "../../+types";

export function sortItemsToSortModel(
  sortItems: SortItem[],
  lookup: Map<string, Column<any>>,
): SortModelItem<any>[] {
  return sortItems
    .filter((c) => {
      if (!c.columnId) return false;
      if (!c.sortOn) return false;
      if (!lookup.has(c.columnId)) return false;

      return true;
    })
    .map<SortModelItem<any>>((c) => {
      const col = lookup.get(c.columnId!)!;

      if (col.type === "number") {
        return {
          columnId: col.id,
          isDescending: c.sortDirection === "descending",
          sort: {
            columnId: col.id,
            kind: "number",
            options: {
              absoluteValue: c.sortOn!.includes("absolute"),
              nullsFirst: c.sortOn!.includes("nulls_first"),
            },
          },
        };
      }

      if (col.type === "date" || col.type === "datetime") {
        return {
          columnId: col.id,
          isDescending: c.sortDirection === "descending",
          sort: {
            columnId: col.id,
            kind: "date",
            options: {
              includeTime: col.type === "datetime",
              nullsFirst: c.sortOn!.includes("nulls_first"),
            },
          },
        };
      }

      return {
        columnId: col.id,
        isDescending: c.sortDirection === "descending",
        sort: {
          columnId: col.id,
          kind: "string",
          options: {
            caseInsensitive: c.sortOn?.includes("insensitive"),
            ignorePunctuation: c.sortOn?.includes("ignore"),
            nullsFirst: c.sortOn?.includes("nulls_first"),
            trimWhitespace: c.sortOn?.includes("trim"),
          },
        },
      };
    });
}
