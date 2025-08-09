import { useMemo } from "react";
import type { TreeVirtualItem } from "../tree-view/virtualized/make-virtual-tree.js";
import type { Column } from "../+types.js";
import { useBranchLookup } from "./branch-lookup-context.js";

export function useColumnsFromContext(item: TreeVirtualItem<Column<any>>) {
  const lookup = useBranchLookup();

  const columns = useMemo(() => {
    if (item.kind === "branch") {
      const allChildren: Column<any>[] = [];
      const branch = lookup[item.branch.data.idOccurrence];

      const stack = [...branch.children.values()];
      while (stack.length) {
        const p = stack.pop()!;
        if (p.kind === "branch") {
          stack.push(...p.children.values());
          continue;
        }

        allChildren.push(p.data);
      }

      return allChildren;
    }

    return [item.leaf.data];
  }, [item, lookup]);

  return columns;
}
