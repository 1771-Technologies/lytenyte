import { GRID_CELL_POSITION } from "@1771technologies/grid-constants";
import type { ApiCoreReact } from "@1771technologies/grid-types/core-react";
import { useEvent } from "@1771technologies/react-utils";
import { useCallback, useEffect, useRef } from "react";

export function useCellPositionChange(
  api: ApiCoreReact<any>,
  rowIndex: number,
  columnIndex: number,
  rowSpan: number,
  columnSpan: number,
) {
  const ref = useRef<HTMLElement | null>(null);
  const skipRef = useRef(false);

  const onFocus = useEvent(() => {
    if (skipRef.current) {
      skipRef.current = false;
      return;
    }

    api.getState().internal.navigatePosition.set({
      kind: GRID_CELL_POSITION,
      columnIndex,
      rowIndex,
      root: { columnIndex, columnSpan, rowIndex, rowSpan },
    });
  });

  const tryFocus = useEvent((element: HTMLElement | null, skip: boolean = true) => {
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
      skipRef.current = skip;
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

    const unsubFocus = sx.internal.cellFocusQueue.watch(() => {
      const focus = sx.internal.cellFocusQueue.peek();
      if (!focus) return;

      if (rowIndex === focus.rowIndex && columnIndex === focus.columnIndex) {
        ref.current?.focus();
      }
    }, false);

    return () => {
      unsub();
      unsubFocus();
    };
  }, [api, columnIndex, ref, rowIndex, tryFocus]);

  return { handleRef, onFocus };
}
