import { getLastTabbable } from "../../dom-utils/index.js";

export function handleFocus(
  isBack: boolean,
  queryCell: () => HTMLElement | null | undefined,
  postFocus?: () => void,
) {
  const cell = queryCell();

  if (!cell) return false;

  // If we are going back, then we want to try focus the last focusable
  // element in our target. This is because we cycle the the tabbable
  // elements, so we want a consistent horizontal move order.
  if (isBack) {
    // -- cycleInnerHook
    const last = getLastTabbable(cell);
    if (last) last.focus();
    else cell.focus();
  } else {
    cell.focus();
  }

  postFocus?.();
  return true;
}
