import { getFocusableNodes } from "../utils/get-focusable-nodes";
import { getFocusedNode } from "../utils/get-focused-node";
import { isBranchNode } from "../utils/is-branch-node";

export function makeHandleTypeahead() {
  let typeaheadCapture: string[] = [];
  let typeaheadTimeout: ReturnType<typeof setTimeout> | null = null;
  const handleTypeahead = (panel: HTMLElement, ev: KeyboardEvent) => {
    if (ev.ctrlKey || ev.shiftKey || ev.metaKey) return;
    if (ev.key.length === 1 && ev.key.match(/[\S\s]/) && ev.key != " ") {
      // Begin the typeahead.
      typeaheadCapture.push(ev.key);
      if (typeaheadTimeout) clearTimeout(typeaheadTimeout);

      typeaheadTimeout = setTimeout(() => {
        const text = typeaheadCapture.join("");

        const nodes = getFocusableNodes(panel!);
        const focused = getFocusedNode();
        if (!focused) return;

        const index = nodes.indexOf(focused);
        if (index === -1) return;
        const nodesAfterCurrent = nodes.slice(index);
        const nodeToFocus = nodesAfterCurrent.find((c) => {
          let textContent = "";
          if (isBranchNode(c)) {
            // On a branch node the text content of the expanded should not be included. We should simply
            // look at the text content of the node.
            textContent = c.firstElementChild?.lastElementChild?.textContent ?? "";
          } else {
            textContent = c.textContent ?? "";
          }

          return textContent?.toLowerCase()?.startsWith(text);
        });

        if (nodeToFocus) nodeToFocus.focus();

        typeaheadCapture = [];
        typeaheadTimeout = null;
      }, 300);
    }
  };

  return handleTypeahead;
}
