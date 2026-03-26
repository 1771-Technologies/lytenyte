import { useEffect, useState } from "react";
import { trackFocus, type PositionState } from "@1771technologies/lytenyte-shared";

export function useFocusTracking(vp: HTMLElement | null, focusActive: PositionState, gridId: string) {
  const [focused, setFocused] = useState(false);
  const [vpFocused, setVpFocused] = useState(false);

  useEffect(() => {
    if (!vp) return;

    return trackFocus({
      gridId,
      element: vp,
      onElementFocused: setVpFocused,
      focusActive: focusActive,
      onHasFocusChange: setFocused,
    });
  }, [focusActive, gridId, vp]);

  return [focused, vpFocused];
}
