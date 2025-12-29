import type { RowLeaf, RowSource } from "@1771technologies/lytenyte-shared";
import { useEvent } from "../hooks/use-event.js";
import type { RootNode } from "../data-source/hooks/use-group-tree.js";
import type { RefObject } from "react";

export function useRowById<T>(tree: RootNode<T> | null, leafIdsRef: RefObject<Map<string, RowLeaf<T>>>) {
  const rowById: RowSource<T>["rowById"] = useEvent((id) => {
    if (!tree) return leafIdsRef.current.get(id) ?? null;

    const node = tree.groupLookup.get(id)?.row ?? leafIdsRef.current.get(id) ?? null;
    return node;
  });

  return rowById;
}
