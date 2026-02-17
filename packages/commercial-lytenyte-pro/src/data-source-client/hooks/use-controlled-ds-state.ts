import { useCallback } from "react";
import type { UseClientDataSourceParams } from "../use-client-data-source.js";
import { useControlled, useEvent } from "@1771technologies/lytenyte-core/internal";
import type { ControlledPivotState } from "./use-pivot/use-pivot-state.js";

export type SourceState = ReturnType<typeof useSourceState>;

export function useSourceState(
  {
    onRowGroupExpansionChange,
    rowGroupExpansions,
    rowGroupDefaultExpansion = false,
  }: UseClientDataSourceParams<any>,
  controlled: ControlledPivotState,
) {
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

  const onPivotExpansionsChange = useEvent((delta: Record<string, boolean | undefined>) => {
    controlled.onPivotRowGroupChange({ ...controlled.pivotRowGroupExpansions, ...delta });
  });

  const pivotExpandedFn = useCallback(
    (id: string, depth: number) => {
      const s = controlled.pivotRowGroupExpansions[id];
      if (s != null) return s;

      if (typeof rowGroupDefaultExpansion === "boolean") return rowGroupDefaultExpansion;

      return rowGroupDefaultExpansion >= depth;
    },
    [controlled.pivotRowGroupExpansions, rowGroupDefaultExpansion],
  );

  return {
    expansions,
    onExpansionsChange,
    expandedFn,
    pivotExpandedFn,
    pivotRowGroupExpansions: controlled.pivotRowGroupExpansions,
    onPivotExpansionsChange,
  };
}
