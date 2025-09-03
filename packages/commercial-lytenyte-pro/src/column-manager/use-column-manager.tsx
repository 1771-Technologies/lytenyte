import { useMemo } from "react";
import type { Column, Grid } from "../+types";
import { useTreeViewPaths } from "../tree-view/hooks/use-tree-view-paths";
import type { PathBranch } from "@1771technologies/lytenyte-shared";

export interface UseColumnManagerProps<T> {
  readonly grid: Grid<T>;
  readonly query?: string;
}
export function useColumnManager<T>({ grid, query }: UseColumnManagerProps<T>) {
  const columns = grid.state.columns.useValue();

  const filteredColumns = useMemo(() => {
    if (!query) return columns;

    return columns.filter((c) => (c.name ?? c.id).toLowerCase().includes(query.toLowerCase()));
  }, [columns, query]);

  const items = useTreeViewPaths(filteredColumns, true);

  const branchLookup = useMemo(() => {
    const stack = [...items];
    const lookup: Record<string, PathBranch<Column<any>>> = {};
    while (stack.length) {
      const item = stack.pop()!;
      if (item.kind === "leaf") continue;

      lookup[item.data.idOccurrence] = item;
      stack.push(...item.children.values());
    }

    return lookup;
  }, [items]);

  return { items, lookup: branchLookup };
}
