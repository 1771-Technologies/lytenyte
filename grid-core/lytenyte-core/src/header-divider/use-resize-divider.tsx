import type { ApiCoreReact, ColumnCoreReact } from "@1771technologies/grid-types/core-react";
import { getClientX } from "@1771technologies/js-utils";
import { useMemo, useState, type PointerEvent } from "react";

export function useResizeDivider(api: ApiCoreReact<any>, column: ColumnCoreReact<any>) {
  const isResizable = api.columnIsResizable(column);

  const [active, setActive] = useState(false);

  const resizeProps = useMemo(() => {
    if (!isResizable) return {};

    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;

      const startWidth = api.columnVisualWidth(column);
      const isRtl = api.getState().rtl.peek();

      let startX: number | null = null;
      let anim: number | null = null;
      let delta = 0;

      e.preventDefault();
      e.stopPropagation();

      document.body.classList.add("lng1771-column-resize-active");

      setActive(true);

      const controller = new AbortController();
      document.addEventListener(
        "pointermove",
        (ev) => {
          if (startX === null) {
            startX = getClientX(ev);
            return;
          }
          const endAdjust = column.pin === "end" ? -1 : 1;
          const rtlAdjust = isRtl ? -1 : 1;

          delta = (getClientX(ev) - startX!) * endAdjust * rtlAdjust;

          if (anim) cancelAnimationFrame(anim);
          anim = requestAnimationFrame(() => {
            api.getState().internal.columnWidthDeltas.set({ [column.id]: delta });
          });
        },
        { signal: controller.signal },
      );

      window.addEventListener(
        "pointerup",
        () => {
          if (anim) cancelAnimationFrame(anim);
          setActive(false);
          document.body.classList.remove("lng1771-column-resize-active");

          const newWidth = startWidth + delta;
          api.columnResize(column, newWidth);
          api.getState().internal.columnWidthDeltas.set(null);

          controller.abort();
        },
        { signal: controller.signal },
      );
    };
    return { onPointerDown };
  }, [api, column, isResizable]);

  return { ...resizeProps, active };
}
