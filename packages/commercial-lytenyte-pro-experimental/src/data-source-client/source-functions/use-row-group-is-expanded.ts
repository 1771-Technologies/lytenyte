import type { RefObject } from "react";
import type { RowNode, RowSource } from "@1771technologies/lytenyte-shared";
import { useEvent } from "@1771technologies/lytenyte-core-experimental/internal";

export function useRowGroupIsExpanded<T>(
  rowByIdRef: RefObject<Map<string, RowNode<T>>>,
  expansions: Record<string, boolean | undefined>,
  rowGroupDefaultExpansion: number | boolean | undefined = false,
) {
  const rowGroupIsExpanded: RowSource["rowGroupIsExpanded"] = useEvent((id: string) => {
    const row = rowByIdRef.current.get(id);
    if (!row || row.kind !== "branch") return false;

    const state = expansions[row.id];
    if (state != null) return state;

    if (typeof rowGroupDefaultExpansion === "boolean") return rowGroupDefaultExpansion;

    return row.depth <= rowGroupDefaultExpansion;
  });

  return rowGroupIsExpanded;
}
