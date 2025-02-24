import { useCallback } from "react";
import type { SemiPartialFilter, SimpleFilterItemProps } from "../simple-filter";
import type { FilterNumber } from "@1771technologies/grid-types/community";
import { FilterNumberInput } from "./number-filter";

export function HandleNumberFilter({ value, onFilterChange }: SimpleFilterItemProps) {
  const onChange = useCallback(
    (c: { label: string; value: FilterNumber["operator"] }) => {
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
        operator: value.operator as FilterNumber["operator"],
        value: c,
      };

      onFilterChange(nextFilter);
    },
    [onFilterChange, value.columnId, value.operator, value.value],
  );

  return (
    <FilterNumberInput
      filter={value as Partial<FilterNumber>}
      onChange={onChange}
      onValueChange={onValueChange}
    />
  );
}
