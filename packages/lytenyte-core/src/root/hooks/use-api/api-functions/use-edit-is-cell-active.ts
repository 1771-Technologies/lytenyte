import { useEvent } from "../../../../hooks/use-event.js";
import type { Root } from "../../../root.js";
import type { EditContext } from "../../../root-context.js";

export function useEditIsCellActive(api: Root.API, edit: EditContext): Root.API["editIsCellActive"] {
  return useEvent(({ column: c, rowIndex }) => {
    const row = api.rowByIndex(rowIndex);
    const column =
      typeof c === "number"
        ? api.columnByIndex(c)
        : typeof c === "string"
          ? api.columnById(c)
          : api.columnById(c.id);

    if (!row || !column) return false;

    const active = edit.activeEdit;
    return active?.column === column.id && active.rowId === row.get()?.id;
  });
}
