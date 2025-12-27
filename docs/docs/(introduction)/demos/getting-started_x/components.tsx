import type { CellParamsWithIndex } from "@1771technologies/lytenyte-pro-experimental/types";
import type { GridSpec } from "./demo";
import { useMemo } from "react";
import { format } from "date-fns";

export function DateCell({ column, row, api }: CellParamsWithIndex<GridSpec>) {
  const field = api.columnField(column, row);

  const niceDate = useMemo(() => {
    if (typeof field !== "string") return null;
    return format(field, "MMM dd, yyyy HH:mm:ss");
  }, [field]);

  // Guard against bad values and render nothing
  if (!niceDate) return null;

  return <div className="text-(--ln-text) flex h-full w-full items-center tabular-nums">{niceDate}</div>;
}
