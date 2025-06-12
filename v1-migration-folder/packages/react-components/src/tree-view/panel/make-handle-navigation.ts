import { isInView } from "@1771technologies/lytenyte-dom-utils";
import type { TreeViewRootContext } from "../context";
import { getFirstNode } from "../navigation/get-first-node";
import { getLastNode } from "../navigation/get-last-node";
import { getNextNode } from "../navigation/get-next-node";
import { getPrevNode } from "../navigation/get-prev-node";
import { getFocusedNode } from "../utils/get-focused-node";

export function makeHandleNavigation(ctx: TreeViewRootContext) {
  const acceptedKeys = ["ArrowUp", "ArrowDown", "Home", "End"];

  return (ev: KeyboardEvent) => {
    if (!acceptedKeys.includes(ev.key) || ev.shiftKey || ev.ctrlKey || ev.metaKey) return;

    const current = getFocusedNode();
    if (!current) return;

    if (ev.key === "ArrowUp") {
      const prev = getPrevNode(current);
      if (!prev) return;

      const inView = isInView(prev, ctx.panel!);
      if (!inView) prev?.scrollIntoView({ behavior: "instant", block: "start" });

      prev?.focus();
    }
    if (ev.key === "ArrowDown") {
      const node = getNextNode(current);
      if (!node) return;

      const inView = isInView(node, ctx.panel!);
      if (!inView) node?.scrollIntoView({ behavior: "instant", block: "end" });

      node?.focus();
    }

    if (ev.key === "Home") getFirstNode(ctx.panel!)?.focus();
    if (ev.key === "End") getLastNode(ctx.panel!)?.focus();

    ev.preventDefault();
  };
}
