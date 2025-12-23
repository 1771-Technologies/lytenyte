import type { RowSource } from "@1771technologies/lytenyte-shared";
import { useEvent } from "../../../../hooks/use-event.js";
import type { Root } from "../../../root.js";
import type { Controlled } from "../../use-controlled-grid-state.js";

export function useRowDetailExpanded(
  controlled: Controlled,
  source: RowSource,
): Root.API["rowDetailExpanded"] {
  return useEvent((row) => {
    if (typeof row === "string") return controlled.detailExpansions.has(row);
    if (typeof row === "number") {
      const r = source.rowByIndex(row).get();
      return r == null ? false : controlled.detailExpansions.has(r.id);
    }
    return controlled.detailExpansions.has(row.id);
  });
}
