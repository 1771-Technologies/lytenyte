import type { FilterDate } from "@1771technologies/grid-types/community";
import type { SemiPartialFilter, SimpleFilterItemProps } from "../simple-filter";
import { useCallback } from "react";
import { FilterDateInput } from "./date-filter";

export function HandleDateFilter({ value, onFilterChange }: SimpleFilterItemProps) {
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

  return (
    <FilterDateInput
      filter={value as Partial<FilterDate>}
      onChange={onChange}
      onValueChange={onValueChange}
      onAllDatePeriodSelect={onDatePeriodChange}
    />
  );
}
