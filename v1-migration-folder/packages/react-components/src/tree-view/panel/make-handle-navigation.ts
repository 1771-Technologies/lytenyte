import { getFocusableNodes } from "../utils/get-focusable-nodes";
import { getFocusedNode } from "../utils/get-focused-node";

export function makeHandleNavigation() {
  const acceptedKeys = ["ArrowUp", "ArrowDown", "Home", "End"];

  return (panel: HTMLElement, ev: KeyboardEvent) => {
    if (!acceptedKeys.includes(ev.key) || ev.shiftKey || ev.ctrlKey || ev.metaKey) return;

    const current = getFocusedNode();
    if (!current) return;

    const nodes = getFocusableNodes(panel);
    const focusIndex = nodes.indexOf(current);

    if (ev.key === "ArrowUp") {
      if (focusIndex === -1) nodes.at(-1)?.focus();
      else if (focusIndex === 0) return;
      else nodes.at(focusIndex - 1)?.focus();
    }
    if (ev.key === "ArrowDown") {
      if (focusIndex === -1) nodes.at(0)?.focus();
      else if (focusIndex === nodes.length - 1) return;
      else nodes.at(focusIndex + 1)?.focus();
    }
    if (ev.key === "Home") {
      nodes.at(0)?.focus();
    }
    if (ev.key === "End") {
      nodes.at(-1)?.focus();
    }
  };
}
