export const hasTabIndex = (node: Element) => !isNaN(parseInt(node.getAttribute("tabindex")!, 10));
