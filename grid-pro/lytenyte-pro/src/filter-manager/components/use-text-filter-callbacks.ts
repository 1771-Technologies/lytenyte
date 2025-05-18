import { useCallback } from "react";
import { useSimpleFilterRoot } from "./simple-filter-root";
import type { SemiPartialFilter } from "../types";
import type { FilterTextPro } from "@1771technologies/grid-types/pro";

export function useTextFilterCallbacks() {
  const { value, onChange: onFilterChange } = useSimpleFilterRoot();

  const onChange = useCallback(
    (c: { label: string; value: FilterTextPro["operator"] }) => {
      const current = value.operator;
      if (current === c.value) return;

      const nextFilter: SemiPartialFilter = {
        kind: "text",
        columnId: value.columnId,
        operator: c.value,
        value: "",
      };

      onFilterChange(nextFilter);
    },
    [onFilterChange, value.columnId, value.operator],
  );

  const onValueChange = useCallback(
    (c: string) => {
      const current = value.value;
      if (current === c) return;

      const nextFilter: SemiPartialFilter = {
        kind: "text",
        columnId: value.columnId,
        operator: value.operator as FilterTextPro["operator"],
        value: c,
      };

      onFilterChange(nextFilter);
    },
    [onFilterChange, value.columnId, value.operator, value.value],
  );

  return { onChange, onValueChange };
}
