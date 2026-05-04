/**
 * Returns the deepest active element within the given document or shadow root, walking down
 * through nested open shadow roots.
 */
export function getActiveElement(rootNode: Document | ShadowRoot): HTMLElement | null {
  let active = rootNode.activeElement as HTMLElement | null;

  // Walk down through open shadow roots to the deepest focused element
  while (active && active.shadowRoot) {
    const inner = active.shadowRoot.activeElement as HTMLElement | null;

    active = inner;
  }

  return active;
}
