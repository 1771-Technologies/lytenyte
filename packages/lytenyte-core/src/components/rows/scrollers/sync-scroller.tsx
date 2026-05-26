import { useEffect, useState, type PropsWithChildren } from "react";
import { useGridIdContext } from "../../../root/contexts/grid-id.js";
import { useOffsetContext } from "../../../root/contexts/grid-areas/offset-context.js";
import { useViewportContext } from "../../../root/contexts/viewport/viewport-context.js";
import { getTranslate } from "@1771technologies/dom-utils";
import { useRowViewContext } from "../../../root/contexts/row-layout/row-layout-context.js";
import { useYCoordinates } from "../../../root/contexts/coordinates.js";

export function SyncScroller(props: PropsWithChildren) {
  const id = useGridIdContext();

  const rowView = useRowViewContext();
  const yPositions = useYCoordinates();
  const offset = useOffsetContext();
  const { viewport } = useViewportContext();

  const [scroller, setScroller] = useState<HTMLElement | null>(null);
  const [y, setY] = useState(0);
  const [x, setX] = useState(0);

  useEffect(() => {
    if (!viewport || !scroller) return;

    const controller = new AbortController();
    let raf: null | number = null;
    viewport.addEventListener(
      "scroll",
      () => {
        if (raf) return;
        raf = requestAnimationFrame(() => {
          raf = null;
          setY(viewport.scrollTop);
          setX(Math.abs(viewport.scrollLeft));
        });
      },
      { signal: controller.signal },
    );

    return () => controller.abort();
  }, [rowView.rowFirstCenter, scroller, viewport, yPositions]);

  return (
    <div
      data-ln-gridid={id}
      role="presentation"
      style={{ position: "sticky", top: offset.topOffset, left: 0, width: 0 }}
    >
      <div
        ref={setScroller}
        style={{ position: "absolute", width: 0, top: 0, transform: getTranslate(-x, -y) }}
      >
        <div style={{ height: yPositions[rowView.rowFirstCenter], background: y, width: "40px" }} />
        {props.children}
      </div>
    </div>
  );
}
