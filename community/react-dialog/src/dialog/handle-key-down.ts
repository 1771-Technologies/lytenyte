import { handleCircularFocus } from "@1771technologies/js-utils";

/**
 * Handles keyboard events for a dialog element, including:
 * - Escape key for closing the dialog
 * - Tab key for managing focus within the dialog
 *
 * When Tab is pressed, this function ensures focus stays within the dialog
 * by implementing circular focus navigation. This prevents focus from moving
 * to browser UI elements like the URL bar.
 *
 * @param ev - The keyboard event to handle
 * @param dialog - The dialog element to manage focus within
 * @param onOpenChange - Callback function to control dialog open state
 */
export function handleKeydown(
  ev: KeyboardEvent,
  dialog: HTMLDialogElement,
  onOpenChange: (b: boolean) => void,
) {
  if (ev.key === "Escape") {
    ev.preventDefault();
    onOpenChange(false);
  }

  // Handles circular focus. A minimal amount of focus management is required otherwise
  // the dialog element will focus items outside of the page, like the URL bar.
  if (ev.key === "Tab") {
    if (handleCircularFocus(dialog, ev.shiftKey ? "backwards" : "forwards")) {
      ev.preventDefault();
    }
  }
}
