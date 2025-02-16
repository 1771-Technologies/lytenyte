import { getOwnerScrollbarWidth } from "@1771technologies/js-utils";
import type { RefObject } from "react";

/**
 * Handles setup when opening a dialog or modal. This function:
 * - Stores the currently focused element for later restoration
 * - Calculates and stores the scrollbar width
 * - Compensates for scrollbar removal by setting a CSS custom property
 * - Opens the dialog in modal mode
 *
 * @param dialog - The dialog element to open
 * @param activeRef - Reference to store the currently focused element
 * @param scrollbarWidthRef - Reference to store the scrollbar width that will be removed
 */
export function handleOpen(
  dialog: HTMLDialogElement,
  activeRef: RefObject<HTMLElement | null>,
  scrollbarWidthRef: RefObject<number>,
) {
  activeRef.current = document.activeElement as HTMLElement | null;

  scrollbarWidthRef.current = getOwnerScrollbarWidth();

  if (scrollbarWidthRef.current)
    document.documentElement.style.setProperty(
      "--scrollbar-width-removed",
      `${scrollbarWidthRef.current}px`,
    );

  dialog.showModal();
}
