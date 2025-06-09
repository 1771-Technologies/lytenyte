import type { TreeViewRootContext } from "../context";
import { getFocusableNodes } from "../utils/get-focusable-nodes";
import { getFocusedNode } from "../utils/get-focused-node";
import { getTreeNodeId } from "../utils/get-tree-node-id";

export function makeHandleSelection(ctx: TreeViewRootContext) {
  const acceptedKeys = ["Enter", "Home", "End", "ArrowDown", "ArrowUp", "Space", " ", "a"];

  const make = (ev: KeyboardEvent) => {
    if (ctx.selectionMode === "none") return;
    if (!acceptedKeys.includes(ev.key)) return;

    const pivot = ctx.selectionPivotRef.current;

    if (ev.key === " " && (ctx.selectionMode === "single" || !ev.shiftKey || !pivot)) {
      const node = getFocusedNode()!;
      const id = getTreeNodeId(node);

      const isSelected = ctx.selection.has(id);

      if (ctx.selectionMode === "single") {
        if (isSelected) ctx.onSelectionChange(new Set());
        else ctx.onSelectionChange(new Set([id]));
        return;
      }

      const next = new Set(ctx.selection);
      if (next.has(id)) {
        next.delete(id);
        ctx.selectionPivotRef.current = null;
      } else {
        next.add(id);
        ctx.selectionPivotRef.current = id;
      }

      ctx.onSelectionChange(next);
    }

    if (ctx.selectionMode !== "multiple") return;

    const focusables = getFocusableNodes(ctx.panel!);
    const focused = getFocusedNode()!;
    const focusedIndex = focusables.indexOf(focused);

    if (focusedIndex === -1) return;

    if (ev.ctrlKey || ev.metaKey) {
      if (ev.key === "a") {
        ev.preventDefault();

        const allIds = new Set(focusables.map((c) => getTreeNodeId(c)));
        const selection = ctx.selection;
        if (allIds.isSubsetOf(selection)) {
          ctx.onSelectionChange(new Set());
        } else {
          ctx.onSelectionChange(allIds);
        }
      }
    }

    if (ev.shiftKey) {
      if (ev.key === "ArrowUp" && focusedIndex !== 0) {
        const node = focusables[focusedIndex - 1];
        node.focus();
        const id = getTreeNodeId(node);
        if (ctx.selection.has(id)) return;

        ctx.selectionPivotRef.current = id;
        const next = new Set(ctx.selection);
        next.add(id);
        ctx.onSelectionChange(next);
        return;
      }
      if (ev.key === "ArrowDown" && focusedIndex !== focusables.length) {
        const node = focusables[focusedIndex + 1];
        node.focus();
        const id = getTreeNodeId(node);
        if (ctx.selection.has(id)) return;

        ctx.selectionPivotRef.current = id;
        const next = new Set(ctx.selection);
        next.add(id);
        ctx.onSelectionChange(next);
        return;
      }

      if (ev.key === " ") {
        const pivotIndex = focusables.findIndex((c) => getTreeNodeId(c) === pivot);
        if (pivotIndex === -1) return;

        const [start, end] = [
          Math.min(pivotIndex, focusedIndex),
          Math.max(pivotIndex, focusedIndex),
        ];

        const idsToSelect = focusables.slice(start, end + 1).map((c) => getTreeNodeId(c));
        const next = new Set(ctx.selection);
        idsToSelect.forEach((c) => next.add(c));
        ctx.onSelectionChange(next);
        ctx.selectionPivotRef.current = getTreeNodeId(focused);
        return;
      }

      if (ev.ctrlKey || ev.metaKey) {
        if (ev.key === "Home") {
          const idsToSelect = focusables.slice(0, focusedIndex).map((c) => getTreeNodeId(c));
          const next = new Set(ctx.selection);
          idsToSelect.forEach((c) => next.add(c));
          ctx.onSelectionChange(next);
          ctx.selectionPivotRef.current = getTreeNodeId(focused);

          focusables.at(0)?.focus();
          ctx.selectionPivotRef.current = idsToSelect.at(0) ?? null;
          return;
        }
        if (ev.key === "End") {
          const idsToSelect = focusables.slice(focusedIndex).map((c) => getTreeNodeId(c));
          const next = new Set(ctx.selection);
          idsToSelect.forEach((c) => next.add(c));
          ctx.onSelectionChange(next);
          ctx.selectionPivotRef.current = getTreeNodeId(focused);

          focusables.at(-1)?.focus();
          ctx.selectionPivotRef.current = idsToSelect.at(-1) ?? null;
          return;
        }
      }
    }
  };

  return make;
}
