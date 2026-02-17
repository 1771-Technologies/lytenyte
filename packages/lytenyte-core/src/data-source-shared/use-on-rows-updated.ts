import type { RowLeaf, RowSource } from "@1771technologies/lytenyte-shared";
import { useEvent } from "../hooks/use-event.js";
import type { UseClientDataSourceParams } from "../data-source/use-client-data-source.js";

export function useOnRowsUpdated<T>(onRowDataChange: UseClientDataSourceParams<T>["onRowDataChange"]) {
  const onRowsUpdated: RowSource["onRowsUpdated"] = useEvent((rows) => {
    if (!onRowDataChange) return;

    const top = new Map<number, T>();
    const center = new Map<number, T>();
    const bottom = new Map<number, T>();

    for (const [row, update] of rows.entries()) {
      if (row.kind === "branch") continue;

      const node = row as RowLeaf<T> & { __srcIndex: number; __pin: string };
      if (node.__pin === "top") top.set(node.__srcIndex, update);
      if (node.__pin === "center") center.set(node.__srcIndex, update);
      if (node.__pin === "bottom") bottom.set(node.__srcIndex, update);
    }

    onRowDataChange({ rows, top, center, bottom });
  });

  return onRowsUpdated;
}
