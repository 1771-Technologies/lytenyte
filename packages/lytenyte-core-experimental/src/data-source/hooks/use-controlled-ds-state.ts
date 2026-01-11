import { useCallback } from "react";
import { useControlled } from "../../hooks/use-controlled.js";
import type { UseClientDataSourceParams } from "../use-client-data-source.js";
import { useEvent } from "../../hooks/use-event.js";

export function useControlledState({
  onRowGroupExpansionChange,
  rowGroupExpansions,
  rowGroupDefaultExpansion = false,
}: UseClientDataSourceParams<any>) {
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

      return rowGroupDefaultExpansion <= depth;
    },
    [expansions, rowGroupDefaultExpansion],
  );

  return { expansions, onExpansionsChange, expandedFn };
}
