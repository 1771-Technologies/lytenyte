import { getFocusableElements } from "./get-focusable-elements";

/**
 * Returns the first and last focusable elements within a container, respecting tabindex order.
 * Elements with a positive tabindex are ordered first (in tabindex order),
 * followed by elements with tabindex="0" or naturally focusable elements.
 *
 * @param container - The container element to search within
 * @returns Object containing first and last focusable elements, or null for each if none found
 */
export function getFocusableBoundary(container: HTMLElement): {
  first: HTMLElement | null;
  last: HTMLElement | null;
} {
  const focusable = getFocusableElements(container);

  return {
    first: focusable[0] || null,
    last: focusable[focusable.length - 1] || null,
  };
}
