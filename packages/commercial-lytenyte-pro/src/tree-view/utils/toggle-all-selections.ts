import type { TreeViewRootContext } from "../context.js";
import { getAllIds } from "../navigation/get-all-ids.js";

export function toggleAllSelections(ctx: TreeViewRootContext) {
  const allIds = getAllIds(ctx.panel!);
  const selection = ctx.selection;

  if (allIds.isSubsetOf(selection)) ctx.onSelectionChange(new Set());
  else ctx.onSelectionChange(allIds);
}
