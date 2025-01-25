import type { ApiCommunityReact, ColumnCommunityReact } from "@1771technologies/grid-types";
import type { RowNode } from "@1771technologies/grid-types/community";
import { useEvent } from "@1771technologies/react-utils";
import type { MouseEvent } from "react";
import { handleRowSelection } from "./utils/handle-row-selection";

export function useCellEvents(
  api: ApiCommunityReact<any>,
  column: ColumnCommunityReact<any>,
  row: RowNode,
) {
  void column;

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

  return { onClick, onDoubleClick };
}
