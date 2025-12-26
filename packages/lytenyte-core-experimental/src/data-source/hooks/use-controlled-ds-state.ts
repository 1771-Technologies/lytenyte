import { useCallback } from "react";
import { useControlled } from "../../hooks/use-controlled.js";
import type { UseClientDataSourceParams } from "../use-client-data-source.js";

export function useControlledState({
  rowGroupExpansions,
  rowGroupDefaultExpansion = false,
}: UseClientDataSourceParams<any>) {
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
