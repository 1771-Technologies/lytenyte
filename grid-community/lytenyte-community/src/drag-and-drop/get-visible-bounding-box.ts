const toJSON = () => "";

export function getVisibleBoundingBox(element: HTMLElement) {
  if (!element) return null;

  // Get the bounding box of the element.
  let visibleBox = element.getBoundingClientRect();

  // Traverse up to the root of the tree (body or html element).
  let current = element.parentElement;

  while (current && current !== document.body && current !== document.documentElement) {
    // Check if the current ancestor has a constrained overflow (hidden, scroll, or auto).
    const style = getComputedStyle(current);
    const isClipping = style.overflow !== "visible";

    if (isClipping) {
      // Get the bounding box of the current ancestor.
      const parentRect = current.getBoundingClientRect();

      // Compute the intersection between the current visible box and the parent's bounding box.
      visibleBox = {
        top: Math.max(visibleBox.top, parentRect.top),
        y: Math.max(visibleBox.top, parentRect.top),
        right: Math.min(visibleBox.right, parentRect.right),
        bottom: Math.min(visibleBox.bottom, parentRect.bottom),
        left: Math.max(visibleBox.left, parentRect.left),
        x: Math.max(visibleBox.left, parentRect.left),
        width: 0, // Initialized to 0 for now (calculated below)
        height: 0, // Initialized to 0 for now (calculated below)
        toJSON,
      };

      // Calculate the width and height of the visible portion.
      visibleBox.width = Math.max(0, visibleBox.right - visibleBox.left);
      visibleBox.height = Math.max(0, visibleBox.bottom - visibleBox.top);

      // If the visible box is fully clipped (width or height is 0), return null.
      if (visibleBox.width === 0 || visibleBox.height === 0) {
        return null;
      }
    }

    // Move to the next ancestor.
    current = current.parentElement;
  }

  // Return the final visible bounding box.
  return visibleBox;
}
