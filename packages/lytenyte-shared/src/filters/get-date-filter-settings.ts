import type { FilterDate } from "../+types.js";

export interface FilterDateSetting {
  readonly includeNulls: boolean;
  readonly includeTime: boolean;
}

export function getDateFilterSettings(filter: FilterDate): FilterDateSetting {
  return {
    includeNulls: filter.options?.nullHandling == "include",
    includeTime: filter.options?.includeTime ?? false,
  };
}
