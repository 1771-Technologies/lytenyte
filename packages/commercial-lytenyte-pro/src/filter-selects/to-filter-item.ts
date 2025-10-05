import type { FilterCombination } from "../+types";
import type {
  FilterSelectFlatDate,
  FilterSelectFlatNumber,
  FilterSelectFlatString,
} from "./use-filter-select";

export function toFilterItem(
  f: FilterSelectFlatDate | FilterSelectFlatNumber | FilterSelectFlatString,
): FilterCombination["filters"][number] {
  if (f.kind === "number")
    return { kind: "number", operator: f.operator!, value: f.value! as number };
  if (f.kind === "date") return { kind: "date", value: f.value!, operator: f.operator! };

  return { kind: "string", value: f.value!, operator: f.operator! };
}
