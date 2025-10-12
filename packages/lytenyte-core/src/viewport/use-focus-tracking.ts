import { useEffect, useState } from "react";
import type { GridAtom, PositionUnion } from "../+types.js";
import { equal, trackFocus } from "@1771technologies/lytenyte-shared";

export function useFocusTracking(
  vp: HTMLElement | null,
  focusActive: Omit<GridAtom<PositionUnion | null>, "$">,
  gridId: string,
) {
  const [focused, setFocused] = useState(false);
  const [vpFocused, setVpFocused] = useState(false);

  useEffect(() => {
    if (!vp) return;

    return trackFocus({
      gridId,
      element: vp,
      onElementFocused: setVpFocused,
      onFocusChange: (pos) => {
        if (equal(pos, focusActive.get())) return;
        focusActive.set(pos);
      },
      onHasFocusChange: setFocused,
    });
  }, [focusActive, gridId, vp]);

  return [focused, vpFocused];
}
