import type { RowSource } from "@1771technologies/lytenyte-shared";
import { useEvent } from "../../../../hooks/use-event.js";
import type { Root } from "../../../root.js";

export function useRowGroupToggle(props: Root.Props, source: RowSource): Root.API["rowGroupToggle"] {
  return useEvent((rowOrId, state) => {
    const rowId = typeof rowOrId === "string" ? rowOrId : rowOrId.id;
    const row = source.rowById(rowId);
    if (!row || row.kind !== "branch") return;

    const next = state ?? !source.rowGroupIsExpanded(row.id);
    const change = { [row.id]: next };
    source.onRowGroupExpansionsChange(change);
    props.onRowGroupExpansionChange?.(change);
  });
}
