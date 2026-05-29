import { type PropsWithChildren } from "react";
import { useGridIdContext } from "../../../root/contexts/grid-id.js";
import { useOffsetContext } from "../../../root/contexts/grid-areas/offset-context.js";
import { getTranslate } from "@1771technologies/dom-utils";
import { useRowViewContext } from "../../../root/contexts/row-layout/row-layout-context.js";
import { useYCoordinates } from "../../../root/contexts/coordinates.js";
import { useSyncScrollXY } from "../../../root/hooks/use-sync-scroll-xy.js";

export function SyncScroller(props: PropsWithChildren) {
  const id = useGridIdContext();

  const rowView = useRowViewContext();
  const yPositions = useYCoordinates();
  const offset = useOffsetContext();

  const { x, y } = useSyncScrollXY();

  return (
    <div
      data-ln-gridid={id}
      role="presentation"
      style={{ position: "sticky", top: offset.topOffset, left: 0, width: 0 }}
    >
      <div style={{ position: "absolute", width: 0, top: 0, transform: getTranslate(-x, -y) }}>
        <div style={{ height: yPositions[rowView.rowFirstCenter], background: y, width: "40px" }} />
        {props.children}
      </div>
    </div>
  );
}
