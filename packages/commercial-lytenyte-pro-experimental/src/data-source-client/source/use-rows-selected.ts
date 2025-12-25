import { useEvent } from "@1771technologies/lytenyte-core-experimental/internal";
import type { RowNode, RowSource } from "@1771technologies/lytenyte-shared";
import type { RowSourceClient } from "../use-client-data-source";

export function useRowsSelected<T>(
  rowById: RowSource<T>["rowById"],
  selected: Set<string>,
  rowsIsolatedSelection: boolean,
) {
  const rowsSelected: RowSourceClient["rowsSelected"] = useEvent(() => {
    if (rowsIsolatedSelection) return [...selected].map((x) => rowById(x)!).filter(Boolean);

    return [...selected]
      .map((x) => {
        const row = rowById(x);
        if (row?.kind !== "leaf") return null as unknown as RowNode<any>;
        return row;
      })
      .filter(Boolean);
  });

  return rowsSelected;
}
