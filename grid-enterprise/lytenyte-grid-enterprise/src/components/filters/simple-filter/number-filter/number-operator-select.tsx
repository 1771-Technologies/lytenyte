import type { FilterNumber } from "@1771technologies/grid-types/community";
import { useMemo } from "react";
import { cc } from "../../../component-configuration";
import { Select } from "../../../select/select";

interface NumberOperatorSelectProps {
  readonly filter: Partial<FilterNumber>;
  readonly onChange: (v: { label: string; value: FilterNumber["operator"] }) => void;
}

export function NumberOperatorSelect({ filter, onChange }: NumberOperatorSelectProps) {
  const value = useMemo(() => {
    if (!filter.operator) return null;

    return { label: valueToLabel[filter.operator], value: filter.operator };
  }, [filter.operator]);

  const config = cc.filter.use();
  const noChoice = config.simpleFilter!.placeholderNoChoice;

  return (
    <Select
      axe={config.simpleFilter!.axeNumberOperator}
      placeholder={noChoice}
      value={value}
      items={selectItems}
      onSelect={onChange as any}
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
