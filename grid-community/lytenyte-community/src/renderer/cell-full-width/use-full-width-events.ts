import type { ApiCommunityReact } from "@1771technologies/grid-types";
import type { RowNode } from "@1771technologies/grid-types/community";
import { useEvent } from "@1771technologies/react-utils";
import type { MouseEvent } from "react";
import { FULL_WIDTH_POSITION } from "@1771technologies/grid-constants";
import { handleRowSelection } from "../cell/utils/handle-row-selection";

export function useFullWidthEvents(api: ApiCommunityReact<any>, row: RowNode, rowIndex: number) {
  const onFocus = useEvent(() => {
    api.getState().internal.navigatePosition.set({
      kind: FULL_WIDTH_POSITION,
      columnIndex: 0,
      rowIndex,
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

  return { onClick, onDoubleClick, onFocus };
}
