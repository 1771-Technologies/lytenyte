import { useCallback, useState } from "react";
import type { UseClientDataSourceParams } from "../use-client-data-source.js";
import { useControlled, useEvent } from "@1771technologies/lytenyte-core-experimental/internal";

export type Controlled = ReturnType<typeof useControlledState>;

export function useControlledState({
  rowGroupExpansions,
  rowsSelected: selectedRows,
  rowGroupDefaultExpansion = false,
  onRowSelectionChange: handleSelectChange,
  pivotStateRef,
}: UseClientDataSourceParams<any>) {
  const [expansions, setExpansions] = useControlled({
    controlled: rowGroupExpansions,
    default: {},
  });

  const [selected, setSelectedUncontrolled] = useControlled<Set<string>>({
    controlled: selectedRows,
    default: new Set(),
  });

  const setSelected = useEvent((s: Set<string>) => {
    handleSelectChange?.(s);
    setSelectedUncontrolled(s);
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

      if (typeof rowGroupDefaultExpansion === "boolean") return rowGroupDefaultExpansion;

      return rowGroupDefaultExpansion <= depth;
    },
    [pivotRowGroupExpansions, rowGroupDefaultExpansion],
  );

  return {
    selected,
    expansions,
    setExpansions,
    setSelected,
    expandedFn,
    pivotExpandedFn,
    pivotRowGroupExpansions,
    setPivotRowGroupExpansions,
  };
}
