/**
 * Checks if a parent element contains another node.
 * Handles all DOM node types including text nodes, comments, and processing instructions.
 * Note: Pseudo-elements are not supported as they are not part of the DOM tree.
 *
 * @param parent - The parent HTML element to check
 * @param target - The potential child node/element/event target
 * @param options - Configuration options
 * @param options.excludeSelf - If true, returns false when target is the same as parent. Defaults to false.
 * @returns `true` if the target is contained within the parent, `false` otherwise
 *
 * @remarks
 * Supported node types:
 * - Element nodes (regular DOM elements)
 * - Text nodes
 * - Comment nodes
 * - Processing instruction nodes
 * - DocumentFragment nodes
 * - Shadow DOM host elements
 *
 * Limitations:
 * - Pseudo-elements (::before, ::after) are NOT supported as they aren't actual DOM nodes
 * - Elements within a shadow DOM are only considered contained by their shadow host,
 *   not by ancestors of the shadow host
 *
 * @example
 * ```typescript
 * // Check regular element
 * const isChild = containsElement(parentDiv, childDiv);
 *
 * // Exclude parent self-reference
 * const isChild = containsElement(parentDiv, childDiv, { excludeSelf: true });
 *
 * // Check shadow DOM
 * const host = document.createElement('div');
 * const shadow = host.attachShadow({ mode: 'open' });
 * const shadowChild = document.createElement('div');
 * shadow.appendChild(shadowChild);
 * const isShadowChild = containsElement(host, shadowChild); // true
 * ```
 */
export function containsElement(
  parent: HTMLElement,
  target: Element | Node | EventTarget | null,
  options: { excludeSelf?: boolean } = {},
): boolean {
  // Handle null/undefined cases
  if (!parent || !target) return false;

  // Handle non-Node EventTargets
  if (!(target instanceof Node)) return false;

  // For shadow DOM elements
  if (parent instanceof HTMLElement && target instanceof Node) {
    // Check if target is in shadow DOM
    let current: Node | null = target;
    while (current) {
      if (current instanceof ShadowRoot) {
        // If we found a shadow root, check if its host is our parent
        return current.host === parent && (!options.excludeSelf || parent !== target);
      }
      current = current.parentNode;
    }
  }

  // Handle self-reference case
  if (parent === target) {
    return !options.excludeSelf;
  }

  // Handle all other node types (Element, Text, Comment, ProcessingInstruction, etc.)
  return parent.contains(target);
}
