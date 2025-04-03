import type { FilterText } from "@1771technologies/grid-types/community";
import { useMemo } from "react";
import { Select } from "../../../select/select";
import { useSimpleFilterRoot } from "../simple-filter-root";
import { useTextFilterCallbacks } from "../use-text-filter-callbacks";

export function TextOperatorSelect() {
  const { value: v } = useSimpleFilterRoot();
  const s = useTextFilterCallbacks();

  const filter = v as Partial<FilterText>;

  const value = useMemo(() => {
    if (!filter.operator) return null;

    return { label: valueToToLabel[filter.operator], value: filter.operator };
  }, [filter.operator]);

  return (
    <Select
      placeholder="Select..."
      options={selectItems}
      selected={value}
      onSelect={s.onChange as any}
    />
  );
}

const valueToToLabel: Record<FilterText["operator"], string> = {
  equal: "Equal",
  not_equal: "Not Equal",
  begins_with: "Begins With",
  not_begins_with: "Does Not Begin With",
  ends_with: "Ends With",
  not_ends_with: "Does Not End With",
  contains: "Contains",
  not_contains: "Does Not Contain",
};

const selectItems: { label: string; value: FilterText["operator"] }[] = [
  { value: "equal", label: "Equal" },
  { value: "not_equal", label: "Not Equal" },
  { value: "begins_with", label: "Begins With" },
  { value: "not_begins_with", label: "Does Not Begin With" },
  { value: "ends_with", label: "Ends With" },
  { value: "not_ends_with", label: "Does Not End With" },
  { value: "contains", label: "Contains" },
  { value: "not_contains", label: "Does Not Contain" },
];
