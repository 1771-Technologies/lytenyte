import { useEffect, useState } from "react";
import type { GridAtom, PositionUnion } from "../+types.js";
import { equal } from "@1771technologies/lytenyte-js-utils";
import { getNearestFocusable } from "./getters/get-nearest-focusable.js";
import { getPositionFromFocusable } from "./getters/get-position-from-focusable.js";

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
        if (!el) {
          setFocused(false);
          focusActive.set(null);
          return;
        }

        const position = getPositionFromFocusable(el);

        // Maintain the current column index. This can happen when we are navigating via the keyboard and
        // there are multiple focusables in the cell.
        if (position.kind === "full-width" || position.kind === "header-group-cell")
          (position.colIndex as any) = focusActive.get()?.colIndex ?? position.colIndex ?? 0;

        focusActive.set((prev) => {
          if (equal(prev, position)) return prev;

          return position;
        });
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
