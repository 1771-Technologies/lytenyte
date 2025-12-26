import { useCallback, useState } from "react";
import type { UseClientDataSourceParams } from "../use-client-data-source.js";
import { useControlled } from "@1771technologies/lytenyte-core-experimental/internal";

export type SourceState = ReturnType<typeof useSourceState>;

export function useSourceState({
  rowGroupExpansions,
  rowGroupDefaultExpansion = false,
  pivotRowGroupDefaultExpansion = rowGroupDefaultExpansion,
  pivotStateRef,
}: UseClientDataSourceParams<any>) {
  const [expansions, setExpansions] = useControlled({
    controlled: rowGroupExpansions,
    default: {},
  });

  const [pivotRowGroupExpansions, setPivotRowGroupExpansions] = useState<Record<string, boolean | undefined>>(
    pivotStateRef?.current.rowGroupExpansions ?? {},
  );

  const expandedFn = useCallback(
    (id: string, depth: number) => {
      const s = expansions[id];
      if (s != null) return s;

      if (typeof rowGroupDefaultExpansion === "boolean") return rowGroupDefaultExpansion;

      return rowGroupDefaultExpansion <= depth;
    },
    [expansions, rowGroupDefaultExpansion],
  );

  const pivotExpandedFn = useCallback(
    (id: string, depth: number) => {
      const s = pivotRowGroupExpansions[id];
      if (s != null) return s;

      if (typeof pivotRowGroupDefaultExpansion === "boolean") return pivotRowGroupDefaultExpansion;

      return pivotRowGroupDefaultExpansion <= depth;
    },
    [pivotRowGroupDefaultExpansion, pivotRowGroupExpansions],
  );

  return {
    expansions,
    setExpansions,
    expandedFn,
    pivotExpandedFn,
    pivotRowGroupExpansions,
    setPivotRowGroupExpansions,
  };
}
