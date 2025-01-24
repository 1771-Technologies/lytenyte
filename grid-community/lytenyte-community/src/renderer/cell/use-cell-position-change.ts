import { GRID_CELL_POSITION } from "@1771technologies/grid-constants";
import type { ApiCommunityReact } from "@1771technologies/grid-types";
import { useEvent } from "@1771technologies/react-utils";
import { useCallback, useEffect, useRef } from "react";

export function useCellPositionChange(
  api: ApiCommunityReact<any>,
  rowIndex: number,
  columnIndex: number,
) {
  const ref = useRef<HTMLElement | null>(null);

  const tryFocus = useEvent((element: HTMLElement | null) => {
    const sx = api.getState();

    const position = sx.internal.navigatePosition.peek();
    if (!element || !position || position.kind !== GRID_CELL_POSITION) return;

    const posRow = position.root?.rowIndex ?? position.rowIndex;
    const posCol = position.root?.columnIndex ?? position.columnIndex;

    if (
      rowIndex === posRow &&
      posCol === columnIndex &&
      !element.contains(document.activeElement) &&
      element !== document.activeElement
    ) {
      api.navigateScrollIntoView(posRow, posCol);
      element.focus();
    }
  });

  const handleRef = useCallback(
    (el: HTMLElement | null) => {
      tryFocus(el);
      ref.current = el;
    },
    [tryFocus],
  );

  useEffect(() => {
    const sx = api.getState();

    const unsub = sx.internal.navigatePosition.watch(() => {
      tryFocus(ref.current);
    }, false);
    return () => {
      unsub();
    };
  }, [api, columnIndex, ref, rowIndex, tryFocus]);

  return handleRef;
}
