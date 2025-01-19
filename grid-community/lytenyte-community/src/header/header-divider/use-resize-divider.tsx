import type { ApiCommunityReact, ColumnCommunityReact } from "@1771technologies/grid-types";
import { getClientX } from "@1771technologies/js-utils";
import { useMemo, useRef, type PointerEvent } from "react";

export function useResizeDivider(api: ApiCommunityReact<any>, column: ColumnCommunityReact<any>) {
  const isResizable = api.columnIsResizable(column);

  const timeOutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dragStarted = useRef(false);

  const resizeProps = useMemo(() => {
    if (!isResizable) return {};

    const onPointerDown = (_: PointerEvent) => {
      let startX: number | null = null;
      let anim: number | null = null;
      const startWidth = api.columnVisualWidth(column);
      let delta = 0;

      if (timeOutRef.current) clearTimeout(timeOutRef.current);
      timeOutRef.current = setTimeout(() => {
        dragStarted.current = true;
        timeOutRef.current = null;
      }, 100);

      const controller = new AbortController();
      document.addEventListener(
        "pointermove",
        (ev) => {
          if (dragStarted.current === false) return;

          if (startX === null) {
            startX = getClientX(ev);
            return;
          }
          const endAdjust = column.pin === "end" ? -1 : 1;

          delta = (getClientX(ev) - startX!) * endAdjust;

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
          if (timeOutRef.current) clearTimeout(timeOutRef.current);
          if (anim) cancelAnimationFrame(anim);

          dragStarted.current = false;

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

  return resizeProps;
}
