import type { FilterNumber } from "../+types.js";

export interface FilterNumberSettings {
  readonly includeNulls: boolean;
  readonly absolute: boolean;
  readonly epsilon: number;
}

export function getNumberFilterSettings(filter: FilterNumber): FilterNumberSettings {
  const includeNulls = filter.options?.nullHandling === "include";
  const absolute = !!filter.options?.absolute;
  const epsilon = filter.options?.epsilon ?? 0.00001;

  return {
    includeNulls,
    absolute,
    epsilon,
  };
}
