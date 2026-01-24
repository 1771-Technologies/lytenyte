import { useMemo } from "react";
import type { RootNode } from "../data-source/hooks/use-group-tree";
import type { RowLeaf } from "@1771technologies/lytenyte-shared";

export function useIdUniverse<T>(
  tree: RootNode<T> | null,
  leafIds: Map<string, RowLeaf<T>>,
  additions: { readonly id: string; readonly root: boolean }[] | null | undefined,
  subtractions: Set<string> | null | undefined,
) {
  const idsAndRootIds = useMemo(() => {
    const addSet = additions?.map((x) => x.id) ?? [];
    const subSet = subtractions ?? new Set();
    if (!tree) {
      const idUniverse = new Set([...leafIds.keys(), ...addSet]);
      return {
        idUniverse: idUniverse.difference(subSet),
        rootIds: idUniverse.difference(subSet),
      };
    }

    const idUniverse = new Set([...leafIds.keys(), ...tree.groupLookup.keys(), ...addSet]);

    const rootAdds = additions?.filter((x) => x.root).map((x) => x.id) ?? [];
    return {
      idUniverse: idUniverse.difference(subSet),
      rootIds: new Set([...tree.children.values()].map((x) => x.row.id).concat(rootAdds)).difference(subSet),
    };
  }, [additions, leafIds, subtractions, tree]);

  return idsAndRootIds;
}
