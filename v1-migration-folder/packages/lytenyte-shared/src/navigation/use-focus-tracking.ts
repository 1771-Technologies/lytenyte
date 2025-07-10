import { useEffect, useState } from "react";
import { getNearestFocusable, getPositionFromFocusable } from "@1771technologies/lytenyte-shared";
import type { GridAtom, PositionUnion } from "../+types";

export function useFocusTracking(
  vp: HTMLElement | null,
  focusActive: GridAtom<PositionUnion | null>,
) {
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
        focusActive.set(position);
      },
      { signal: controller.signal },
    );
    vp.addEventListener(
      "focusout",
      (e) => {
        if (!window.document.hasFocus()) return;

        if (e.relatedTarget && vp.contains(e.relatedTarget as HTMLElement)) return;

        setFocused(false);
        focusActive.set(null);
      },
      { signal: controller.signal },
    );

    return () => controller.abort();
  }, [focusActive, vp]);

  return focused;
}
