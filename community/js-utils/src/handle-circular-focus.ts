import { getFocusableBoundary } from "./get-focusable-boundary.js";

/**
 * Handles circular focus within a container element, allowing focus to wrap from last to first element
 * and vice versa. This is useful for creating closed focus traps in modals, dialogs, and other
 * UI components where focus should be contained.
 *
 * @param root - The container element within which focus should be managed
 * @param direction - The direction of focus movement:
 *                   - "forwards" for Tab key navigation
 *                   - "backwards" for Shift+Tab navigation
 * @returns `true` if focus was wrapped around, `false` if no action was taken
 *
 * @example
 * ```typescript
 * // Handle Tab key in a modal
 * modal.addEventListener('keydown', (e) => {
 *   if (e.key === 'Tab') {
 *     const wrapped = handleCircularFocus(modal, e.shiftKey ? 'backwards' : 'forwards');
 *     if (wrapped) e.preventDefault();
 *   }
 * });
 * ```
 *
 * @remarks
 * - Returns false if there are no focusable elements in the container
 * - Only wraps focus when the active element is at the boundary (first/last focusable element)
 * - Takes into account disabled and hidden elements
 * - Respects tabindex ordering
 */
export function handleCircularFocus(
  root: HTMLElement,
  direction: "forwards" | "backwards",
): boolean {
  const { first, last } = getFocusableBoundary(root);

  const activeElement = document.activeElement;

  if (!first || !last) return false;

  switch (direction) {
    case "forwards":
      if (activeElement === last) {
        first.focus();
        return true;
      }
      break;

    case "backwards":
      // When going backwards and we're on the first element, wrap to last
      if (activeElement === first) {
        last.focus();
        return true;
      }
      break;
  }

  // No wrapping needed
  return false;
}
