import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { trackFocus, type PositionUnion } from "@1771technologies/lytenyte-shared";

export function useFocusTracking(
  vp: HTMLElement | null,
  focusActive: { get: () => PositionUnion | null; set: Dispatch<SetStateAction<PositionUnion | null>> },
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
      focusActive: focusActive,
      onHasFocusChange: setFocused,
    });
  }, [focusActive, gridId, vp]);

  return [focused, vpFocused];
}
