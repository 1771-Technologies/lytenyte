import { getNearestRow, getRowIndexFromEl } from "@1771technologies/lytenyte-shared";
import { useEvent } from "../../../../hooks/use-event.js";
import type { Root } from "../../../root.js";
import type { RefObject } from "react";

export function useRowHandleSelect(
  props: Root.Props,
  api: Root.API,
  gridId: string,
  selectPivot: RefObject<number | null>,
): Root.API["rowHandleSelect"] {
  return useEvent((params) => {
    const mode = props.rowSelectionMode ?? "none";
    if (mode === "none") return;

    const rowEl = getNearestRow(gridId, params.target as HTMLElement);
    if (!rowEl) return;

    const selectIndex = getRowIndexFromEl(rowEl);
    const row = api.rowByIndex(selectIndex).get();
    if (!row) return;

    if (mode === "single") {
      api.rowSelect({ selected: row.id, deselect: api.rowIsSelected(row.id) });
      return;
    }

    if (mode === "multiple") {
      const pivotRow = selectPivot.current != null ? api.rowByIndex(selectPivot.current).get() : null;
      if (params.shiftKey && pivotRow) {
        // If the pivot row is not selected then it must've been deselected last.
        const isDeselect = !api.rowIsSelected(pivotRow.id);
        api.rowSelect({ selected: [row.id, pivotRow.id], deselect: isDeselect });
      } else {
        selectPivot.current = selectIndex;
        api.rowSelect({ selected: row.id, deselect: api.rowIsSelected(row.id) });
      }
    }
  });
}
