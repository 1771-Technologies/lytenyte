import { getNearestFocusable, getPositionFromFocusable } from "@1771technologies/lytenyte-shared";
import type { GridApi } from "../../+types";

export const makePositionFromElement = (): GridApi<any>["positionFromElement"] => {
  return (el) => {
    const focusable = getNearestFocusable(el);
    if (!focusable) return null;

    return getPositionFromFocusable(focusable);
  };
};
