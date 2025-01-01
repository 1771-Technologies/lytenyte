import type { RefObject } from "react";

/**
 * Handles cleanup when closing a dialog or modal. This function:
 * - Aborts any pending operations via the controller
 * - Restores focus to the previously active element
 * - Removes the scrollbar width compensation from the document body
 *
 * @param controllerRef - Reference to an AbortController used to cancel pending operations
 * @param activeRef - Reference to the element that had focus before the dialog opened
 * @param scrollbarWidthRef - Reference to the scrollbar width that was removed when dialog opened
 */
export function handleClose(
  controllerRef: RefObject<AbortController | null>,
  activeRef: RefObject<HTMLElement | null>,
  scrollbarWidthRef: RefObject<number>,
) {
  if (controllerRef.current) controllerRef.current.abort();
  controllerRef.current = null;

  if (activeRef.current) activeRef.current.focus();
  activeRef.current = null;

  if (scrollbarWidthRef.current) document.body.style.removeProperty("--scrollbar-width-removed");
  scrollbarWidthRef.current = 0;
}
