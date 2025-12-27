import { useControlled } from "@1771technologies/lytenyte-core-experimental/internal";
import type { UseTreeDataSourceParams } from "../use-tree-data-source";
import { useCallback } from "react";

export function useControlledState<T>({
  rowGroupDefaultExpansion = false,
  rowGroupExpansions,
}: UseTreeDataSourceParams<T>) {
  const [expansions, setExpansions] = useControlled({
    controlled: rowGroupExpansions,
    default: {},
  });
  const expandedFn = useCallback(
    (id: string, depth: number) => {
      const s = expansions[id];
      if (s != null) return s;

      if (typeof rowGroupDefaultExpansion === "boolean") return rowGroupDefaultExpansion;

      return rowGroupDefaultExpansion <= depth;
    },
    [expansions, rowGroupDefaultExpansion],
  );

  return { expansions, setExpansions, expandedFn };
}
