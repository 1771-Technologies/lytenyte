import { useCallback } from "react";
import type { SemiPartialFilter, SimpleFilterItemProps } from "../simple-filter";
import { TextFilterInput } from "./text-filter";
import type { FilterText } from "@1771technologies/grid-types/community";

export function HandleTextFilter({ value, onFilterChange }: SimpleFilterItemProps) {
  const onChange = useCallback(
    (c: { label: string; value: FilterText["operator"] }) => {
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
        operator: value.operator as FilterText["operator"],
        value: c,
      };

      onFilterChange(nextFilter);
    },
    [onFilterChange, value.columnId, value.operator, value.value],
  );

  return (
    <TextFilterInput
      filter={value as Partial<FilterText>}
      onChange={onChange}
      onValueChange={onValueChange}
    />
  );
}
