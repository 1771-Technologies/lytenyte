import { useMemo } from "react";
import type { RowDetailContext } from "./row-detail/row-detail-context";
import { useEvent } from "../hooks/use-event.js";
import type { MakeColumnViewReturn } from "./column-view/column-view.js";
import { get } from "@1771technologies/lytenyte-shared";
import type { Ln } from "../types.js";
import type { RowSource } from "../types/row";

export function useApi<T>(
  props: Ln.Props<T>,
  detailCtx: RowDetailContext,
  view: MakeColumnViewReturn<T>,
  rowSource: RowSource,
) {
  const columnField: Ln.API<T>["columnField"] = useEvent((col, row) => {
    const column = typeof col === "string" ? view.lookup.get(col) : col;
    if (!column) {
      console.error(`Attempting to compute the field of a column that is not defined`, column);
      return null;
    }

    const field = column.field ?? column.id;
    if (row.kind === "branch") {
      if (typeof field === "function") return field({ column, row, api });
      if (!row.data) return null;
      return row.data[column.id];
    }

    if (typeof field === "function") return field({ column, row, api });
    else if (!row.data) return null;
    else if (typeof field === "object") return get(row.data, (field as { path: string }).path);

    return (row.data as any)[field] as unknown;
  });

  const getProps = useEvent(() => props);

  const api = useMemo<Ln.API<T>>(() => {
    return {
      rowDetailHeight: detailCtx.getRowDetailHeight,
      columnField,
      props: getProps,
      ...rowSource,
    };
  }, [columnField, detailCtx.getRowDetailHeight, getProps, rowSource]);

  return api;
}
