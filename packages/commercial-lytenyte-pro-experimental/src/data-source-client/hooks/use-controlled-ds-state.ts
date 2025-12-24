import { useCallback } from "react";
import type { UseClientDataSourceParams } from "../use-client-data-source.js";
import { useControlled, useEvent } from "@1771technologies/lytenyte-core-experimental/internal";

export type Controlled = ReturnType<typeof useControlledState>;

export function useControlledState({
  rowGroupExpansions,
  rowsSelected: selectedRows,
  rowGroupDefaultExpansion = false,
  onRowSelectionChange: handleSelectChange,
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

  const expandedFn = useCallback(
    (id: string, depth: number) => {
      const s = expansions[id];
      if (s != null) return s;

      if (typeof rowGroupDefaultExpansion === "boolean") return rowGroupDefaultExpansion;

      return rowGroupDefaultExpansion <= depth;
    },
    [expansions, rowGroupDefaultExpansion],
  );

  return { selected, expansions, setExpansions, setSelected, expandedFn };
}
