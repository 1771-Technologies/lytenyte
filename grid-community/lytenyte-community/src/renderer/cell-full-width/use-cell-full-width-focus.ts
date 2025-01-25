import { FULL_WIDTH_POSITION } from "@1771technologies/grid-constants";
import type { ApiCommunityReact } from "@1771technologies/grid-types";
import { useEvent } from "@1771technologies/react-utils";
import { useCallback, useEffect, useRef } from "react";

export function useCellFullWidthFocus(api: ApiCommunityReact<any>, rowIndex: number) {
  const ref = useRef<HTMLElement | null>(null);

  const tryFocus = useEvent((element: HTMLElement | null) => {
    const sx = api.getState();

    const position = sx.internal.navigatePosition.peek();
    if (!element || !position || position.kind !== FULL_WIDTH_POSITION) return;

    const posRow = position.rowIndex;
    const posCol = position.columnIndex;

    if (
      rowIndex === posRow &&
      !element.contains(document.activeElement) &&
      element !== document.activeElement
    ) {
      api.navigateScrollIntoView(posRow, posCol);

      setTimeout(() => {
        element.focus();
      });
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
  }, [api, ref, rowIndex, tryFocus]);

  return handleRef;
}
