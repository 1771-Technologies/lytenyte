export const isShadowRootTabbable = (shadowHostNode: HTMLElement) => {
  const tabIndex = parseInt(shadowHostNode.getAttribute("tabindex")!, 10);
  if (isNaN(tabIndex) || tabIndex >= 0) {
    return true;
  }
  // If a custom element has an explicit negative tabindex,
  // browsers will not allow tab targeting said element's children.
  return false;
};
