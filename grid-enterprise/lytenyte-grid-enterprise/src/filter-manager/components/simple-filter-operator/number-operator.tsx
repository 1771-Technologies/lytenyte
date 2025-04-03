import type { FilterNumber } from "@1771technologies/grid-types/community";
import { useMemo } from "react";
import { Select } from "../../../select/select";
import { useSimpleFilterRoot } from "../simple-filter-root";
import { useNumberFilterCallbacks } from "../use-number-filter-callbacks";

export function NumberOperatorSelect() {
  const { value: v } = useSimpleFilterRoot();
  const s = useNumberFilterCallbacks();

  const filter = v as Partial<FilterNumber>;

  const value = useMemo(() => {
    if (!filter.operator) return null;

    return { label: valueToLabel[filter.operator], value: filter.operator };
  }, [filter.operator]);

  return (
    <Select
      selected={value}
      options={selectItems}
      onSelect={s.onChange as any}
      placeholder="Select..."
    />
  );
}

const valueToLabel: Record<FilterNumber["operator"], string> = {
  equal: "Equal",
  not_equal: "Not Equal",
  greater_than: "Greater Than",
  greater_than_or_equal: "Greater Than Or Equal To",
  less_than: "Less Than",
  less_than_or_equal: "Less Than Or Equal To",
};

const selectItems: { label: string; value: FilterNumber["operator"] }[] = [
  { value: "equal", label: "Equal" },
  { value: "not_equal", label: "Not Equal" },
  { value: "greater_than", label: "Greater Than" },
  { value: "greater_than_or_equal", label: "Greater Than Or Equal To" },
  { value: "less_than", label: "Less Than" },
  { value: "less_than_or_equal", label: "Less Than Or Equal To" },
];
