import { Input } from "@1771technologies/lytenyte-grid-community/internal";
import { useSimpleFilterRoot } from "../simple-filter-root";
import type { FilterText } from "@1771technologies/grid-types/core";
import { useTextFilterCallbacks } from "../use-text-filter-callbacks";

export function TextValue() {
  const { value } = useSimpleFilterRoot();

  const filter = value as Partial<FilterText>;

  const operator = filter.operator;
  const { onValueChange } = useTextFilterCallbacks();

  return (
    <Input
      small
      disabled={!operator}
      value={filter.value ?? ""}
      onChange={(e) => onValueChange(e.target.value)}
    />
  );
}
