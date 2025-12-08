import { useEffect, useState } from "react";
import { trackFocus } from "@1771technologies/lytenyte-shared";
import type { PositionUnion } from "../types/position";
import type { PieceWritable } from "../hooks/use-piece";

export function useFocusTracking(
  vp: HTMLElement | null,
  focusActive: PieceWritable<PositionUnion | null>,
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
