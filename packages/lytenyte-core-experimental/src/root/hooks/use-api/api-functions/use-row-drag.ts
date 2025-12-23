import { useDraggable } from "../../../../dnd/use-draggable.js";
import { useEvent } from "../../../../hooks/use-event.js";
import type { Root } from "../../../root.js";

export function useUseRowDrag(api: Root.API, gridId: string): Root.API["useRowDrag"] {
  return useEvent(({ rowIndex, data, placeholder }) => {
    const row = api.rowByIndex(rowIndex).get();
    if (!row) throw new Error("The row index provided for row drag must be a valid row");

    const rowSelect = `[data-ln-gridid="${gridId}"][data-ln-row="true"][data-ln-rowindex="${rowIndex}"]`;
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useDraggable({
      data: {
        ...data,
        [`grid:${gridId}`]: {
          kind: "site",
          data: {
            row,
            api,
            get rowIndex() {
              return api.rowIdToRowIndex(row.id);
            },
          },
        },
        [`grid:source`]: {
          kind: "site",
          data: {
            row,
            api,
            get rowIndex() {
              return api.rowIdToRowIndex(row.id);
            },
          },
        },
      },
      placeholder: placeholder ?? rowSelect,
    });
  });
}
