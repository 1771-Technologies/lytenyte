/**
 * Retrieves the global object (window) that owns the given DOM element.
 * This is particularly useful when working with elements that might originate
 * from different window contexts, such as iframes or cross-window components.
 *
 * @param element - The DOM element or any object that might have an ownerDocument.
 *                 Can be null/undefined, in which case the current window is returned.
 *
 * @returns The owning window (globalThis) for the element. If the element doesn't
 *          have an ownerDocument or defaultView, returns the current window.
 *
 * @example
 * ```typescript
 * // Regular element
 * const div = document.createElement('div');
 * const divWindow = getOwningGlobalThis(div); // Returns current window
 *
 * // Iframe element
 * const iframe = document.createElement('iframe');
 * document.body.appendChild(iframe);
 * const iframeElement = iframe.contentDocument.createElement('div');
 * const iframeWindow = getOwningGlobalThis(iframeElement); // Returns iframe's window
 *
 * // Null handling
 * const fallbackWindow = getOwningGlobalThis(null); // Returns current window
 * ```
 *
 * @remarks
 * The function follows the optional chaining pattern to safely access
 * element?.ownerDocument?.defaultView, falling back to the current window
 * if any part of the chain is null or undefined.
 */
export function getOwningGlobalThis(element: any): typeof globalThis {
  return element?.ownerDocument?.defaultView || window;
}
