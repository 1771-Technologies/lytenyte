import type { RowSource } from "@1771technologies/lytenyte-shared";
import { useEvent } from "../../../../hooks/use-event.js";
import type { Root } from "../../../root.js";

export function useRowDetailExpanded(
  detailExpansions: Set<string>,
  source: RowSource,
): Root.API["rowDetailExpanded"] {
  return useEvent((row) => {
    if (typeof row === "string") return detailExpansions.has(row);
    if (typeof row === "number") {
      const r = source.rowByIndex(row).get();
      return r == null ? false : detailExpansions.has(r.id);
    }
    return detailExpansions.has(row.id);
  });
}
