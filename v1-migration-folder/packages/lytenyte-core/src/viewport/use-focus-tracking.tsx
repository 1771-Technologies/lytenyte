import { useEffect, useState } from "react";
import { getNearestFocusable } from "../navigation/getters/get-nearest-focusable";
import { getPositionFromFocusable } from "../navigation/getters/get-position-from-focusable";
import { type GridRootContext } from "../context";

export function useFocusTracking(vp: HTMLElement | null, ctx: GridRootContext) {
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (!vp) return;

    const controller = new AbortController();
    vp.addEventListener(
      "focusin",
      (ev) => {
        setFocused(true);

        const el = getNearestFocusable(ev.target as HTMLElement);
        if (!el) return;

        const position = getPositionFromFocusable(el);
        ctx.grid.internal.focusActive.set(position);
      },
      { signal: controller.signal },
    );
    vp.addEventListener(
      "focusout",
      () => {
        if (!window.document.hasFocus()) return;

        setFocused(false);
        ctx.grid.internal.focusActive.set(null);
      },
      { signal: controller.signal },
    );

    return () => controller.abort();
  }, [ctx.grid, vp]);

  return focused;
}
