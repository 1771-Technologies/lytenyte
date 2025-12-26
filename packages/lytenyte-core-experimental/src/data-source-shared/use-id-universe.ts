import { useMemo } from "react";
import type { RootNode } from "../data-source/hooks/use-group-tree";
import type { RowLeaf } from "@1771technologies/lytenyte-shared";

export function useIdUniverse<T>(
  tree: RootNode<T> | null,
  leafIds: Map<string, RowLeaf<T>>,
  additions: Set<string> | null | undefined,
) {
  const idUniverse = useMemo(() => {
    if (!tree) return new Set([...leafIds.keys(), ...(additions ?? [])]);

    return new Set([...leafIds.keys(), ...tree.groupLookup.keys(), ...(additions ?? [])]);
  }, [additions, leafIds, tree]);

  return idUniverse;
}
