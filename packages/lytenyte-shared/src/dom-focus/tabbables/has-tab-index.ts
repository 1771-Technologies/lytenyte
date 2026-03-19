/**
 * Returns true if the element has an explicit tabindex attribute set to a numeric value.
 */
export const hasTabIndex = (node: Element) => !isNaN(parseInt(node.getAttribute("tabindex")!, 10));
