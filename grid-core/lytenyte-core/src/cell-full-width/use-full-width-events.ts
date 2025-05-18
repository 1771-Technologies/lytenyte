import { useEvent } from "@1771technologies/react-utils";
import type { MouseEvent } from "react";
import { handleRowSelection } from "../cell/handle-row-selection";
import type { ApiCoreReact } from "@1771technologies/grid-types/core-react";
import type { RowNodeCore } from "@1771technologies/grid-types/core";

export function useFullWidthEvents(api: ApiCoreReact<any>, row: RowNodeCore<any>) {
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
