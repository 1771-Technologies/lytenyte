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

/**
 * Returns an array of focusable DOM elements within a container element, sorted by their tabindex.
 * Focusable elements include buttons, links, form controls, and elements with tabindex attributes
 * that are visible and not disabled.
 *
 * The function considers the following elements as potentially focusable:
 * - Buttons (not disabled)
 * - Links with href attributes
 * - Form inputs (not disabled)
 * - Select elements (not disabled)
 * - Textarea elements (not disabled)
 * - Elements with tabindex
 * - Elements with contenteditable attribute
 * - Audio elements with controls
 * - Video elements with controls
 * - Details summary elements
 *
 * Elements are filtered out if they:
 * - Have the 'hidden' attribute
 * - Have an invalid tabindex
 * - Have a negative tabindex (unless allowNegativeTabIndex is true)
 * - Have 'display: none' or 'visibility: hidden' in their computed style
 *
 * The returned elements are sorted by tabindex with the following priority:
 * 1. Elements with positive tabindex (in ascending order)
 * 2. Elements with tabindex="0"
 * 3. Elements with no tabindex
 *
 * @param container - The HTML element to search within for focusable elements
 * @param allowNegativeTabIndex - Optional. When true, includes elements with negative tabindex. Defaults to false
 * @returns An array of focusable HTML elements sorted by tabindex
 *
 * @example
 * // Basic usage
 * const container = document.querySelector('.my-container');
 * const focusableElements = getFocusableElements(container);
 *
 * @example
 * // Including elements with negative tabindex
 * const container = document.createElement('div');
 * container.innerHTML = `
 *   <div tabindex="-1">Focusable with negative tabindex</div>
 *   <button>Regular button</button>
 * `;
 * const allFocusable = getFocusableElements(container, true);
 *
 * @example
 * // Handling tabindex order
 * const container = document.createElement('div');
 * container.innerHTML = `
 *   <button tabindex="2">Second</button>
 *   <button tabindex="1">First</button>
 *   <button>Last</button>
 * `;
 * const focusableElements = getFocusableElements(container);
 * // Returns elements in order: tabindex="1", tabindex="2", no tabindex
 *
 * @example
 * // Using with keyboard navigation
 * const container = document.querySelector('.dialog');
 * const focusableElements = getFocusableElements(container);
 *
 * container.addEventListener('keydown', (e) => {
 *   if (e.key === 'Tab') {
 *     const first = focusableElements[0];
 *     const last = focusableElements[focusableElements.length - 1];
 *     // Handle focus trap
 *   }
 * });
 *
 * @remarks
 * This function is particularly useful for:
 * - Implementing keyboard navigation
 * - Creating focus traps in modals or dialogs
 * - Ensuring proper tab order in complex UI components
 * - Managing focus for accessibility purposes
 *
 * The function uses `querySelectorAll` with a specific selector string that
 * targets potentially focusable elements, then filters and sorts them based
 * on visibility and tabindex values.
 *
 * @throws {TypeError} If container is null or undefined
 * @throws {Error} If container is not a valid HTML element
 */
export function getFocusableElements(container: HTMLElement, allowNegativeTabIndex?: boolean) {
  const elements = Array.from(container.querySelectorAll<HTMLElement>(focusableSelector));
  // Filter out unfocusable elements and sort by tabindex
  const focusable = elements
    .filter((el) => {
      if (el.hasAttribute("hidden")) return false;

      const tabindex = el.getAttribute("tabindex");
      if (tabindex !== null) {
        const tabValue = parseInt(tabindex, 10);
        if (isNaN(tabValue) || (tabValue < 0 && !allowNegativeTabIndex)) return false;
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

  return focusable;
}
