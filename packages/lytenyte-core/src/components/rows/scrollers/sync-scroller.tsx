import { type CSSProperties, type PropsWithChildren } from "react";
import { useGridIdContext } from "../../../root/contexts/grid-id.js";
import { useOffsetContext } from "../../../root/contexts/grid-areas/offset-context.js";
import { useRowViewContext } from "../../../root/contexts/row-layout/row-layout-context.js";
import { useYCoordinates } from "../../../root/contexts/coordinates.js";

export function SyncScroller(props: PropsWithChildren) {
  const id = useGridIdContext();

  const rowView = useRowViewContext();
  const yPositions = useYCoordinates();
  const offset = useOffsetContext();

  return (
    <div
      data-ln-gridid={id}
      role="presentation"
      style={{ position: "sticky", top: offset.topOffset, left: 0, width: 0 }}
    >
      <div
        style={
          {
            position: "absolute",
            width: 0,
            top: 0,
            transform: "var(--ln-y-transform)",
          } as CSSProperties
        }
      >
        <div
          style={{
            height: yPositions[rowView.rowFirstCenter] - yPositions[rowView.top.length],
            width: "40px",
          }}
        />
        {props.children}
      </div>
    </div>
  );
}
