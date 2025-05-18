import { getOwningGlobalThis } from "./get-owning-global-this.js";

/**
 * Checks if a given target is an HTMLElement by performing instanceof checks against both the current
 * window's HTMLElement and the target's owning window's HTMLElement.
 *
 * This function is particularly useful when working with elements across different window contexts,
 * such as iframes or cross-window components, where a simple instanceof check against the current
 * window's HTMLElement might fail.
 *
 * @param target - The value to check. Can be any type, will safely handle null/undefined.
 *
 * @returns {boolean} true if the target is an HTMLElement from either the current window
 * or its owning window context, false otherwise.
 *
 * @example
 * ```typescript
 * // Regular element check
 * const div = document.createElement('div');
 * console.log(isHTMLElement(div)); // true
 *
 * // Iframe element check
 * const iframe = document.createElement('iframe');
 * document.body.appendChild(iframe);
 * const iframeElement = iframe.contentDocument.createElement('div');
 * console.log(isHTMLElement(iframeElement)); // true
 *
 * // Non-element check
 * console.log(isHTMLElement({})); // false
 * console.log(isHTMLElement(null)); // false
 * ```
 *
 * @remarks
 * The function performs two checks:
 * 1. Against the current window's HTMLElement
 * 2. Against the HTMLElement from the target's owning window context
 *
 * This dual check ensures correct type checking even when dealing with elements
 * from different window contexts (e.g., iframes).
 */
export function isHTMLElement(target: any): target is HTMLElement {
  if (!target) return false;

  return (
    target instanceof globalThis.HTMLElement ||
    target instanceof getOwningGlobalThis(target).HTMLElement
  );
}
