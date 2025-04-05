import type { FilterNumber } from "@1771technologies/grid-types/core";
import { useSimpleFilterRoot } from "../simple-filter-root";
import { Input } from "@1771technologies/lytenyte-grid-community/internal";
import { useNumberFilterCallbacks } from "../use-number-filter-callbacks";

export function NumberValue() {
  const { value } = useSimpleFilterRoot();

  const filter = value as Partial<FilterNumber>;

  const operator = filter.operator;
  const { onValueChange } = useNumberFilterCallbacks();

  return (
    <Input
      small
      type="number"
      disabled={!operator}
      value={filter.value ?? ""}
      onChange={(e) => onValueChange(Number.parseFloat(e.target.value))}
    />
  );
}
