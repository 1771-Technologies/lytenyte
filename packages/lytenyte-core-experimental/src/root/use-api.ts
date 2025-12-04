import { useMemo } from "react";
import type { Root } from "./root.js";
import type { RowDetailContext } from "./row-detail/row-detail-context";
import { useEvent } from "../hooks/use-event.js";
import type { MakeColumnViewReturn } from "./column-view/column-view.js";
import { get } from "@1771technologies/lytenyte-shared";

export function useApi<T>(
  props: Root.Props<T>,
  detailCtx: RowDetailContext,
  view: MakeColumnViewReturn<T>,
) {
  const columnField: Root.API<T>["columnField"] = useEvent((col, row) => {
    const column = typeof col === "string" ? view.lookup.get(col) : col;
    if (!column) {
      console.error(`Attempting to compute the field of a column that is not defined`, column);
      return null;
    }

    const field = column.field ?? column.id;
    if (row.kind === "branch") {
      if (typeof field === "function") return field({ column, row });
      if (!row.data) return null;
      return row.data[column.id];
    }

    if (typeof field === "function") return field({ column, row });
    else if (!row.data) return null;
    else if (typeof field === "object") return get(row.data, (field as { path: string }).path);

    return (row.data as any)[field] as unknown;
  });

  const getProps = useEvent(() => props);

  const api = useMemo<Root.API<T>>(() => {
    return {
      rowDetailHeight: detailCtx.getRowDetailHeight,
      columnField,

      getProps,
    };
  }, [columnField, detailCtx.getRowDetailHeight, getProps]);

  return api;
}
