import type { ColumnView } from "@1771technologies/lytenyte-shared";
import { useEvent } from "../../../../hooks/use-event.js";
import type { Root } from "../../../root.js";
import { resolveColumn } from "../auxiliary-functions/resolve-column.js";
import type { Controlled } from "../../use-controlled-grid-state.js";

export function useColumnMove(view: ColumnView, controlled: Controlled): Root.API["columnMove"] {
  return useEvent((params) => {
    const errorRef = { current: false };
    const colSet = new Set(
      params.moveColumns.map((c) => {
        return resolveColumn(c, errorRef, view);
      }),
    );
    const dest = resolveColumn(params.moveTarget, errorRef, view);

    if (errorRef.current) return;
    if (colSet.has(dest)) {
      console.error(`Destination column cannot be in the move columns`);
      return;
    }
    const columns = controlled.columns;

    let columnsToMove = columns.filter((c) => colSet.has(c.id));
    const nextColumns = columns.filter((c) => !colSet.has(c.id));
    const indexOfDest = nextColumns.findIndex((c) => c.id === dest);

    const destCol = nextColumns[indexOfDest];

    const offset = params.before ? 0 : 1;

    if (params.updatePinState) columnsToMove = columnsToMove.map((x) => ({ ...x, pin: destCol.pin ?? null }));
    nextColumns.splice(indexOfDest + offset, 0, ...columnsToMove);

    controlled.onColumnsChange(nextColumns);
  });
}
