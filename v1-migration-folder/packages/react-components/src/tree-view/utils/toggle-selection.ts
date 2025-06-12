import type { TreeViewRootContext } from "../context";
import { getTreeNodeId } from "./get-tree-node-id";

export function toggleSelection(el: HTMLElement, ctx: TreeViewRootContext) {
  const id = getTreeNodeId(el);

  if (ctx.selectionMode === "single") {
    if (ctx.selection.has(id)) ctx.onSelectionChange(new Set());
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
