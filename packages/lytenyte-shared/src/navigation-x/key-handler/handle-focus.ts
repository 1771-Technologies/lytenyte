import { getLastTabbable } from "../../dom-utils/index.js";

export function handleFocus(
  isBack: boolean,
  queryCell: () => HTMLElement | null,
  postFocus?: () => void,
) {
  const cell = queryCell();

  if (!cell) return false;
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
