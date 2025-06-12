import { isInView } from "@1771technologies/lytenyte-dom-utils";
import type { TreeViewRootContext } from "../context";
import { getFirstNode } from "../navigation/get-first-node";
import { getLastNode } from "../navigation/get-last-node";
import { getNextNode } from "../navigation/get-next-node";
import { getPrevNode } from "../navigation/get-prev-node";
import { getFocusableNodes } from "../utils/get-focusable-nodes";
import { getFocusedNode } from "../utils/get-focused-node";
import { getIdsBetweenNodes } from "../utils/get-ids-between-nodes";
import { getTreeNodeId } from "../utils/get-tree-node-id";
import { selectNode } from "../utils/select-node";
import { toggleAllSelections } from "../utils/toggle-all-selections";
import { toggleSelection } from "../utils/toggle-selection";

export function makeHandleSelection(ctx: TreeViewRootContext) {
  const acceptedKeys = ["Enter", "Home", "End", "ArrowDown", "ArrowUp", "Space", " ", "a"];

  const make = (ev: KeyboardEvent) => {
    if (ctx.selectionMode === "none") return;
    if (!acceptedKeys.includes(ev.key)) return;

    ev.preventDefault();

    const pivot = ctx.selectionPivotRef.current;

    if (ev.key === " " && (ctx.selectionMode === "single" || !ev.shiftKey || !pivot)) {
      const node = getFocusedNode()!;
      toggleSelection(node, ctx);
      return;
    }

    if (ctx.selectionMode !== "multiple") return;

    const focusables = getFocusableNodes(ctx.panel!);
    const focused = getFocusedNode()!;
    const focusedIndex = focusables.indexOf(focused);

    if (focusedIndex === -1) return;

    if (ev.ctrlKey || ev.metaKey) {
      if (ev.key === "a") {
        ev.preventDefault();
        toggleAllSelections(ctx);
        return;
      }
    }

    if (!ev.shiftKey) return;

    if (ev.key === "ArrowUp" && focusedIndex !== 0) {
      const node = getPrevNode(focused);
      if (!isInView(node!, ctx.panel!))
        node?.scrollIntoView({ behavior: "instant", block: "start" });
      selectNode(node, ctx, true);
      return;
    }
    if (ev.key === "ArrowDown" && focusedIndex !== focusables.length) {
      const node = getNextNode(focused);
      if (!isInView(node!, ctx.panel!)) node?.scrollIntoView({ behavior: "instant", block: "end" });
      selectNode(node, ctx, true);
      return;
    }

    if (ev.key === " ") {
      const pivotNode = focusables.find((c) => getTreeNodeId(c) === pivot);
      if (!pivotNode) return;

      const ids = ctx.getIdsBetweenNodes(pivotNode, focused, ctx.panel!);

      const next = new Set(ctx.selection);
      ids.forEach((c) => next.add(c));
      ctx.onSelectionChange(next);
      ctx.selectionPivotRef.current = getTreeNodeId(focused);
      return;
    }

    if (!ev.ctrlKey && !ev.metaKey) return;

    if (ev.key === "Home") {
      const firstNode = getFirstNode(ctx.panel!);

      const ids = getIdsBetweenNodes(firstNode!, focused, ctx.panel!);

      const next = new Set(ctx.selection);
      ids.forEach((c) => next.add(c));
      ctx.onSelectionChange(next);

      firstNode?.focus();
      ctx.selectionPivotRef.current = getTreeNodeId(firstNode!);
      return;
    }

    if (ev.key === "End") {
      const lastNode = getLastNode(ctx.panel!)!;

      const ids = ctx.getIdsBetweenNodes(focused, lastNode, ctx.panel!);

      const next = new Set(ctx.selection);
      ids.forEach((c) => next.add(c));
      ctx.onSelectionChange(next);

      lastNode?.focus();
      ctx.selectionPivotRef.current = getTreeNodeId(lastNode!);
      return;
    }
  };

  return make;
}
