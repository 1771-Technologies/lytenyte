import type { ApiCommunityReact, ColumnCommunityReact } from "@1771technologies/grid-types";
import type { RowNode } from "@1771technologies/grid-types/community";
import { useEvent } from "@1771technologies/react-utils";
import type { MouseEvent } from "react";
import { handleRowSelection } from "./utils/handle-row-selection";
import { GRID_CELL_POSITION } from "@1771technologies/grid-constants";

export function useCellEvents(
  api: ApiCommunityReact<any>,
  column: ColumnCommunityReact<any>,
  row: RowNode,
  rowIndex: number,
  columnIndex: number,
  rowSpan: number,
  columnSpan: number,
) {
  void column;
  void row;

  const onBlur = useEvent(() => {
    api.getState().internal.navigatePosition.set(null);
  });
  const onFocus = useEvent(() => {
    api.getState().internal.navigatePosition.set({
      kind: GRID_CELL_POSITION,
      columnIndex,
      rowIndex,
      root: { columnIndex, columnSpan, rowIndex, rowSpan },
    });
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

  return { onClick, onDoubleClick, onFocus, onBlur };
}
