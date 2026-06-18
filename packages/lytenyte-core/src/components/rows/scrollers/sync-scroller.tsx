import { type CSSProperties, type PropsWithChildren } from "react";
import { useGridIdContext } from "../../../root/contexts/grid-id.js";
import { useOffsetContext } from "../../../root/contexts/grid-areas/offset-context.js";

export function SyncScroller(props: PropsWithChildren) {
  const id = useGridIdContext();

  const offset = useOffsetContext();

  return (
    <div
      data-ln-gridid={id}
      role="presentation"
      style={{ position: "sticky", top: offset.topOffset, insetInlineStart: 0, width: 0 }}
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
        {props.children}
      </div>
    </div>
  );
}
