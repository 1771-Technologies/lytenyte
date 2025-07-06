import type { PropsWithChildren } from "react";
import { useGridRoot } from "../../context";

export function NativeScroller(props: PropsWithChildren) {
  const cx = useGridRoot().grid;
  const view = cx.view.useValue().rows;
  const yPos = cx.state.yPositions.useValue();

  const offset = yPos[view.rowFirstCenter] - view.rowTopTotalHeight;

  return (
    <div role="rowgroup" style={{ transform: `translate3d(0px, ${offset}px, 0px)` }}>
      {props.children}
    </div>
  );
}
