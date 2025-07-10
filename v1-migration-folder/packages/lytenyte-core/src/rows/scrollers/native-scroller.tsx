import type { PropsWithChildren } from "react";
import { useGridRoot } from "../../context";
import { sizeFromCoord } from "@1771technologies/lytenyte-shared";

export function NativeScroller(props: PropsWithChildren) {
  const cx = useGridRoot().grid;
  const view = cx.view.useValue().rows;
  const yPos = cx.state.yPositions.useValue();

  let offset = yPos[view.rowFirstCenter] - view.rowTopTotalHeight;

  if (view.rowFocusedIndex != null && view.rowFocusedIndex < view.rowFirstCenter) {
    const size = sizeFromCoord(view.rowFocusedIndex, yPos);
    offset -= size;
  }

  return (
    <div role="rowgroup" style={{ transform: `translate3d(0px, ${offset}px, 0px)` }}>
      {props.children}
    </div>
  );
}
