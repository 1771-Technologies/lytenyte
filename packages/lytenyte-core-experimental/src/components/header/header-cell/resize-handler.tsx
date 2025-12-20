import { type CSSProperties } from "react";
import {
  DEFAULT_COLUMN_WIDTH_MAX,
  DEFAULT_COLUMN_WIDTH_MIN,
  sizeFromCoord,
  type LayoutHeaderCell,
} from "@1771technologies/lytenyte-shared";
import { getComputedStyle } from "@1771technologies/lytenyte-shared";
import { clamp, getClientX } from "@1771technologies/lytenyte-shared";
import { useRoot } from "../../../root/root-context.js";

interface ResizeHandlerProps {
  readonly cell: LayoutHeaderCell;
  readonly className?: string;
  readonly style?: CSSProperties;
}

export function ResizeHandler({ cell, style, className }: ResizeHandlerProps) {
  const { api, xPositions, columnDoubleClickToAutosize: double, view, base, viewport: vp, rtl } = useRoot();

  const width = sizeFromCoord(cell.colStart, xPositions, cell.colSpan);
  const column = view.lookup.get(cell.id)!;

  const resizable = column.resizable ?? base.resizable ?? false;

  return (
    <div
      role="button"
      data-ln-header-resizer
      aria-label={`Resize ${column.name ?? column.id}`}
      tabIndex={-1}
      className={className}
      style={{
        height: "100%",
        width: "6px",
        background: "blue",
        ...style,
        top: "0px",
        insetInlineEnd: cell.colPin !== "end" ? "0px" : undefined,
        insetInlineStart: cell.colPin === "end" ? "0px" : undefined,
        position: "absolute",
      }}
      onDoubleClick={() => {
        if (!double || !resizable) return;

        api.columnAutosize({ columns: [column], includeHeader: true });
      }}
      onPointerDown={(ev) => {
        if (!vp) return;
        if (ev.pointerType === "mouse" && ev.button !== 0) return;

        ev.preventDefault();
        ev.stopPropagation();

        let startX: number | null = null;
        let anim: number | null = null;

        const style = getComputedStyle(vp);
        const overflow = style.overflowX;
        vp.style.overflowX = "hidden";

        const minWidth = column.widthMin ?? base.widthMin ?? DEFAULT_COLUMN_WIDTH_MIN;
        const maxWidth = column.widthMax ?? base.widthMax ?? DEFAULT_COLUMN_WIDTH_MAX;

        const maxDelta = maxWidth - width;
        const minDelta = minWidth - width;

        const deltaRef = { current: 0 };
        const controller = new AbortController();

        document.addEventListener(
          "pointermove",
          (ev) => {
            if (startX === null) {
              startX = getClientX(ev);
              return;
            }

            const endAdjust = cell.colPin === "end" ? -1 : 1;
            const rtlAdjust = rtl ? -1 : 1;

            deltaRef.current = clamp(minDelta, (getClientX(ev) - startX!) * endAdjust * rtlAdjust, maxDelta);

            if (anim) return;
            anim = requestAnimationFrame(() => {
              const newWidth = width + deltaRef.current;

              api.columnResize({ [cell.id]: newWidth });

              anim = null;
            });
          },
          { signal: controller.signal },
        );

        window.addEventListener(
          "pointerup",
          () => {
            if (anim) cancelAnimationFrame(anim);
            controller.abort();

            vp.style.overflowX = overflow;
            const newWidth = width + deltaRef.current;

            api.columnResize({ [cell.id]: newWidth });
          },
          { signal: controller.signal },
        );
      }}
    />
  );
}
