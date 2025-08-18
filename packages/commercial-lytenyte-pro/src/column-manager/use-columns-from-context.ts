import { useMemo } from "react";
import type { Column } from "../+types.js";
import { useBranchLookup } from "./branch-lookup-context.js";
import type { PathBranch, PathLeaf } from "@1771technologies/lytenyte-shared";

export function useColumnsFromContext<T>(item: PathBranch<Column<T>> | PathLeaf<Column<T>>) {
  const lookup = useBranchLookup();

  const columns = useMemo(() => {
    if (item.kind === "branch") {
      const allChildren: Column<any>[] = [];
      const branch = lookup[item.data.idOccurrence];

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

    return [item.data];
  }, [item, lookup]);

  return columns;
}
