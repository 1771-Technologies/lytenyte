import { useCallback } from "react";
import { useSimpleFilterRoot } from "./simple-filter-root";
import type { FilterDate } from "@1771technologies/grid-types/core";
import type { SemiPartialFilter } from "../types";

export function useDateFilterCallbacks() {
  const { value, onChange: onFilterChange } = useSimpleFilterRoot();

  const onChange = useCallback(
    (item: { label: string; value: FilterDate["operator"] }) => {
      const currentOperator = value.operator;
      // No change in the operator value
      if (currentOperator === item.value) return;

      const nextFilter: SemiPartialFilter = {
        kind: "date",
        columnId: value.columnId,
        operator: item.value,
        value: "",
        datePeriod: null,
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
        kind: "date",
        columnId: value.columnId,
        operator: value.operator as FilterDate["operator"],
        value: c,
        datePeriod: null,
      };

      onFilterChange(nextFilter);
    },
    [onFilterChange, value.columnId, value.operator, value.value],
  );
  const onDatePeriodChange = useCallback(
    (c: FilterDate["datePeriod"]) => {
      const current = (value as FilterDate).datePeriod;
      if (current === c) return;

      const nextFilter: SemiPartialFilter = {
        kind: "date",
        columnId: value.columnId,
        operator: value.operator as FilterDate["operator"],
        value: value as unknown as string,
        datePeriod: c,
      };

      onFilterChange(nextFilter);
    },
    [onFilterChange, value],
  );

  return { onChange, onValueChange, onDatePeriodChange };
}
