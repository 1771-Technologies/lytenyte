import { useControlled, useEvent } from "@1771technologies/lytenyte-core/internal";
import type { UseTreeDataSourceParams } from "../use-tree-data-source";
import { useCallback } from "react";

export function useControlledState<T>({
  onRowGroupExpansionChange,
  rowGroupDefaultExpansion = false,
  rowGroupExpansions,
}: UseTreeDataSourceParams<T>) {
  const [expansions, setExpansions] = useControlled({
    controlled: rowGroupExpansions,
    default: {},
  });

  const onExpansionsChange = useEvent((delta: Record<string, boolean | undefined>) => {
    setExpansions({ ...expansions, ...delta });
    onRowGroupExpansionChange?.({ ...expansions, ...delta });
  });

  const expandedFn = useCallback(
    (id: string, depth: number) => {
      const s = expansions[id];
      if (s != null) return s;

      if (typeof rowGroupDefaultExpansion === "boolean") return rowGroupDefaultExpansion;

      return depth <= rowGroupDefaultExpansion;
    },
    [expansions, rowGroupDefaultExpansion],
  );

  return { expansions, onExpansionsChange, expandedFn };
}
