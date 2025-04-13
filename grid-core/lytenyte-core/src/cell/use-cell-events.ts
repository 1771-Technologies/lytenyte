import { useEvent } from "@1771technologies/react-utils";
import type { KeyboardEvent, MouseEvent } from "react";
import { handleRowSelection } from "./handle-row-selection";
import type { ApiCoreReact, ColumnCoreReact } from "@1771technologies/grid-types/core-react";
import type { RowNodeCore } from "@1771technologies/grid-types/core";

export function useCellEvents(
  api: ApiCoreReact<any>,
  column: ColumnCoreReact<any>,
  row: RowNodeCore<any>,
  rowIndex: number,
  columnIndex: number,
) {
  void column;

  const onPointerEnter = useEvent(() => {
    api.getState().internal.hoveredRow.set(rowIndex);
    api.getState().internal.hoveredCol.set(columnIndex);
  });

  const onPointerLeave = useEvent(() => {
    api.getState().internal.hoveredRow.set(null);
    api.getState().internal.hoveredCol.set(null);
  });

  const onKeyDown = useEvent((event: KeyboardEvent) => {
    const sx = api.getState();
    const mode = sx.rowSelectionMode.peek();
    if (mode !== "none") {
      if (event.key === " ") {
        handleRowSelection(api, row, false, false, true, "single-click");
        event.preventDefault();
      }
    }
  });

  const onClick = useEvent((event: MouseEvent) => {
    handleRowSelection(
      api,
      row,
      event.shiftKey,
      event.metaKey || event.ctrlKey,
      false,
      "single-click",
    );
  });

  const onDoubleClick = useEvent((event: MouseEvent) => {
    handleRowSelection(
      api,
      row,
      event.shiftKey,
      event.metaKey || event.ctrlKey,
      false,
      "double-click",
    );
  });

  return { onClick, onDoubleClick, onPointerEnter, onPointerLeave, onKeyDown };
}
