import {
  isHTMLElement,
  containsPoint,
  getClientX,
  getClientY,
  containsElement,
} from "@1771technologies/js-utils";

/**
 * Handles pointer events outside a dialog element for closing it. The function will NOT close the dialog if:
 * - The clicked target is not an HTML element
 * - The click occurred within the dialog's boundaries
 * - The clicked element is a child of the dialog
 *
 * If none of these conditions are met (i.e., a valid click outside), the dialog will close.
 *
 * @param ev - The pointer event to handle
 * @param dialog - The dialog element to check boundaries against
 * @param onOpenChange - Callback function to control dialog open state. Called with `false` to close the dialog.
 */
export function handlePointerDown(
  ev: PointerEvent,
  dialog: HTMLDialogElement,
  onOpenChange: (b: boolean) => void,
) {
  const target = ev.target;
  if (
    !isHTMLElement(target) || // Is not an element, not sure what we clicked???
    containsPoint(dialog, getClientX(ev), getClientY(ev)) ||
    containsElement(dialog, target, { excludeSelf: true })
  ) {
    return;
  }

  onOpenChange(false);
}
