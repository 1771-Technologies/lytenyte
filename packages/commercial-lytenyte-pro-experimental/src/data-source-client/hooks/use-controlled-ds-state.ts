import { useCallback, useState } from "react";
import type { UseClientDataSourceParams } from "../use-client-data-source.js";
import { useControlled, useEvent } from "@1771technologies/lytenyte-core-experimental/internal";

export type SourceState = ReturnType<typeof useSourceState>;

export function useSourceState({
  onRowGroupExpansionChange,
  rowGroupExpansions,
  rowGroupDefaultExpansion = false,
  pivotStateRef,
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

      return depth <= rowGroupDefaultExpansion;
    },
    [expansions, rowGroupDefaultExpansion],
  );

  const [pivotRowGroupExpansions, setPivotRowGroupExpansions] = useState<Record<string, boolean | undefined>>(
    pivotStateRef?.current.rowGroupExpansions ?? {},
  );

  const onPivotExpansionsChange = useEvent((delta: Record<string, boolean | undefined>) => {
    setPivotRowGroupExpansions({ ...pivotRowGroupExpansions, ...delta });
  });

  const pivotExpandedFn = useCallback(
    (id: string, depth: number) => {
      const s = pivotRowGroupExpansions[id];
      if (s != null) return s;

      if (typeof rowGroupDefaultExpansion === "boolean") return rowGroupDefaultExpansion;

      return rowGroupDefaultExpansion >= depth;
    },
    [pivotRowGroupExpansions, rowGroupDefaultExpansion],
  );

  return {
    expansions,
    onExpansionsChange,
    expandedFn,
    pivotExpandedFn,
    pivotRowGroupExpansions,
    onPivotExpansionsChange,
  };
}
