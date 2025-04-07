import { useCallback } from "react";
import { useSimpleFilterRoot } from "./simple-filter-root";
import type { SemiPartialFilter } from "../types";
import type { FilterNumberPro } from "@1771technologies/grid-types/pro";

export function useNumberFilterCallbacks() {
  const { value, onChange: onFilterChange } = useSimpleFilterRoot();

  const onChange = useCallback(
    (c: { label: string; value: FilterNumberPro["operator"] }) => {
      const current = value.operator;
      if (current === c.value) return;

      const nextFilter: SemiPartialFilter = {
        kind: "number",
        columnId: value.columnId,
        operator: c.value,
        value: "" as unknown as number,
      };

      onFilterChange(nextFilter);
    },
    [onFilterChange, value.columnId, value.operator],
  );

  const onValueChange = useCallback(
    (c: number) => {
      const current = value.value;
      if (current === c) return;

      const nextFilter: SemiPartialFilter = {
        kind: "number",
        columnId: value.columnId,
        operator: value.operator as FilterNumberPro["operator"],
        value: c,
      };

      onFilterChange(nextFilter);
    },
    [onFilterChange, value.columnId, value.operator, value.value],
  );

  return { onChange, onValueChange };
}
