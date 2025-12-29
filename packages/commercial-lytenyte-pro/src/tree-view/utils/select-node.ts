import type { TreeViewRootContext } from "../context.js";
import { getTreeNodeId } from "./get-tree-node-id.js";
import { isTreeNodeDisabled } from "./is-tree-node-disabled.js";

export function selectNode(node: HTMLElement | null | undefined, ctx: TreeViewRootContext, focus?: boolean) {
  if (!node || isTreeNodeDisabled(node)) return;

  if (focus) node.focus();
  const id = getTreeNodeId(node);
  if (ctx.selection.has(id)) return;

  ctx.selectionPivotRef.current = id;
  const next = new Set(ctx.selection);
  next.add(id);
  ctx.onSelectionChange(next);
}
