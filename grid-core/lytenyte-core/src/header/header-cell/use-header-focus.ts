import { HEADER_CELL_POSITION } from "@1771technologies/grid-constants";
import type { ApiCoreReact } from "@1771technologies/grid-types/core-react";
import { useEvent } from "@1771technologies/react-utils";
import { useEffect, type RefObject } from "react";

export function useHeaderFocus(
  api: ApiCoreReact<any>,
  ref: RefObject<HTMLElement | null>,
  columnIndex: number,
) {
  useEffect(() => {
    const sx = api.getState();
    const unsub = sx.internal.navigatePosition.watch(() => {
      const position = sx.internal.navigatePosition.peek();
      if (!ref.current || !position || position.kind !== HEADER_CELL_POSITION) return;

      if (position.columnIndex === columnIndex && !ref.current.contains(document.activeElement)) {
        api.navigateScrollIntoView(null, columnIndex);
        ref.current.focus();
      }
    });

    return () => unsub();
  }, [api, columnIndex, ref]);

  const onFocus = useEvent(() => {
    api.getState().internal.navigatePosition.set({ kind: HEADER_CELL_POSITION, columnIndex });
  });

  return { onFocus };
}
