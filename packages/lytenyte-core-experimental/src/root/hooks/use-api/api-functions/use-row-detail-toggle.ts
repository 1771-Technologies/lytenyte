import { useEvent } from "../../../../hooks/use-event.js";
import type { Root } from "../../../root.js";
import type { Controlled } from "../../use-controlled-grid-state";

export function useRowDetailToggle(api: Root.API, controlled: Controlled): Root.API["rowDetailToggle"] {
  return useEvent((row, state) => {
    const id =
      typeof row === "string" ? row : typeof row === "number" ? api.rowByIndex(row).get()?.id : row.id;
    if (!id) return;

    const next = new Set([...controlled.detailExpansions]);

    const nextState = state ?? !next.has(id);

    if (nextState) next.add(id);
    else next.delete(id);

    controlled.onRowDetailExpansionsChange(next);
  });
}
