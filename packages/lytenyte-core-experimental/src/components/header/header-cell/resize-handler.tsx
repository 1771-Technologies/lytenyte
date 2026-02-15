import { useMemo, type CSSProperties } from "react";
import {
  sizeFromCoord,
  type LayoutHeaderCell,
  type LayoutHeaderGroup,
} from "@1771technologies/lytenyte-shared";
import { getClientX } from "@1771technologies/lytenyte-shared";
import { useRoot } from "../../../root/root-context.js";

interface ResizeHandlerProps {
  readonly cell: LayoutHeaderCell | LayoutHeaderGroup;
  readonly className?: string;
  readonly style?: CSSProperties;
}

export function ResizeHandler({ cell, style, className }: ResizeHandlerProps) {
  const { api, xPositions, columnDoubleClickToAutosize: double, view, base, viewport: vp, rtl } = useRoot();

  const columns = useMemo(() => {
    if (cell.kind === "cell") return [view.lookup.get(cell.id)!];

    return cell.columnIds.map((x) => view.lookup.get(x)!);
  }, [cell, view.lookup]);

  const resizable = useMemo(() => {
    return columns.every((x) => x?.resizable ?? base.resizable ?? false);
  }, [base.resizable, columns]);

  if (!resizable) return null;

  return (
    <div
      role="button"
      data-ln-header-resizer
      aria-label={"Resize column"}
      tabIndex={-1}
      className={className}
      style={{
        height: "100%",
        width: 6,
        ...style,
        top: "0px",
        insetInlineEnd: cell.colPin !== "end" ? "0px" : undefined,
        insetInlineStart: cell.colPin === "end" ? "0px" : undefined,
        position: "absolute",
      }}
      onDoubleClick={() => {
        if (!double || !resizable) return;
        api.columnAutosize({ columns, includeHeader: true });
      }}
      onPointerDown={(ev) => {
        if (!vp) return;
        if (ev.pointerType === "mouse" && ev.button !== 0) return;

        ev.preventDefault();
        ev.stopPropagation();

        let startX: number | null = null;
        let anim: number | null = null;

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

            deltaRef.current = (getClientX(ev) - startX!) * endAdjust * rtlAdjust;

            if (anim) return;
            anim = requestAnimationFrame(() => {
              const portion = Math.round(deltaRef.current / columns.length);

              const widths = Object.fromEntries(
                columns.map((x) => {
                  const index = view.visibleColumns.findIndex((c) => c.id === x.id);
                  const w = sizeFromCoord(index, xPositions);

                  return [x.id, w + portion];
                }),
              );

              api.columnResize(widths);

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

            const portion = Math.round(deltaRef.current / columns.length);

            const widths = Object.fromEntries(
              columns.map((x) => {
                const index = view.visibleColumns.findIndex((c) => c.id === x.id);
                const w = sizeFromCoord(index, xPositions);

                return [x.id, w + portion];
              }),
            );

            api.columnResize(widths);
          },
          { signal: controller.signal },
        );
      }}
    />
  );
}
