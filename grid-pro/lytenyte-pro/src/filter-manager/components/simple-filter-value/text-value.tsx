import { Input } from "@1771technologies/lytenyte-core/internal";
import { useSimpleFilterRoot } from "../simple-filter-root";
import { useTextFilterCallbacks } from "../use-text-filter-callbacks";
import type { FilterTextPro } from "@1771technologies/grid-types/pro";

export function TextValue() {
  const { value } = useSimpleFilterRoot();

  const filter = value as Partial<FilterTextPro>;

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
