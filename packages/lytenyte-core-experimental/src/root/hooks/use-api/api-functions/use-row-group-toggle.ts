import type { RowSource } from "@1771technologies/lytenyte-shared";
import type { Root } from "../../../root.js";
import { useEvent } from "../../../../hooks/use-event.js";

export function useRowGroupToggle(props: Root.Props, source: RowSource): Root.API["rowGroupToggle"] {
  return useEvent((rowOrId, state) => {
    const rowId = typeof rowOrId === "string" ? rowOrId : rowOrId.id;
    const row = source.rowById(rowId);
    if (!row || row.kind !== "branch") return;

    if (!row.expandable) return;

    const next = state ?? !row.expanded;

    const change = { [row.id]: next };
    source.onRowGroupExpansionChange(change);
    props.onRowGroupExpansionChange?.(change);
  });
}
