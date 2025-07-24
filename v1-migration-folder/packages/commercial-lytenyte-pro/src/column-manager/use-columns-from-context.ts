import { useMemo } from "react";
import type { TreeVirtualItem } from "../tree-view/virtualized/make-virtual-tree";
import type { Column } from "../+types";

export function useColumnsFromContext(item: TreeVirtualItem<Column<any>>) {
  const columns = useMemo(() => {
    if (item.kind === "branch") {
      const allChildren: Column<any>[] = [];
      const stack = [...item.children];
      while (stack.length) {
        const p = stack.pop()!;
        if (p.kind === "branch") {
          stack.push(...p.children);
          continue;
        }

        allChildren.push(p.leaf.data);
      }

      return allChildren;
    }

    return [item.leaf.data];
  }, [item]);

  return columns;
}
