import type { GridSpec } from "../../../types/index.js";
import type { GroupFn } from "@1771technologies/lytenyte-shared";
import { useMemo } from "react";
import type { PivotModel } from "../../use-client-data-source";
import { computeField } from "@1771technologies/lytenyte-core-experimental/internal";

export function usePivotGroupFn<Spec extends GridSpec>(
  pivotMode: boolean,
  model: PivotModel<Spec> | undefined,
) {
  const groupFn = useMemo<GroupFn<Spec["data"]> | null>(() => {
    const pivotRows = model?.rows;
    if (!pivotMode || !pivotRows?.length) return () => [null];

    const fn: GroupFn<Spec["data"]> = (row) => {
      const paths: (string | null)[] = [];

      for (const c of pivotRows) {
        const field = c.field ?? (c as any).id;
        const value = field ? computeField(field, row) : null;
        if (value == null) paths.push(null);
        else paths.push(String(value));
      }

      return paths;
    };
    return fn;
  }, [model?.rows, pivotMode]);

  return groupFn;
}
