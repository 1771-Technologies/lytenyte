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
  const focusableSelector = [
    "button:not([disabled])",
    "[href]",
    "input:not([disabled])",
    "select:not([disabled])",
    "textarea:not([disabled])",
    "[tabindex]",
    "[contenteditable]",
    "audio[controls]",
    "video[controls]",
    "details summary",
  ].join(",");

  const elements = Array.from(container.querySelectorAll<HTMLElement>(focusableSelector));

  // Filter out unfocusable elements and sort by tabindex
  const focusable = elements
    .filter((el) => {
      if (el.hasAttribute("hidden")) return false;

      const tabindex = el.getAttribute("tabindex");
      if (tabindex !== null) {
        const tabValue = parseInt(tabindex, 10);
        if (isNaN(tabValue) || tabValue < 0) return false;
      }

      const style = window.getComputedStyle(el);
      return style.display !== "none" && style.visibility !== "hidden";
    })
    .sort((a, b) => {
      const aTab = parseInt(a.getAttribute("tabindex") || "0", 10);
      const bTab = parseInt(b.getAttribute("tabindex") || "0", 10);

      if (aTab === bTab) return 0;
      if (aTab === 0) return 1; // Elements with tabindex=0 come after those with positive values
      if (bTab === 0) return -1;
      return aTab - bTab;
    });

  return {
    first: focusable[0] || null,
    last: focusable[focusable.length - 1] || null,
  };
}
