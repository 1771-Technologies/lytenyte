import type {
  FilterDateSetting,
  FilterNumberSettings,
  FilterStringSettings,
} from "@1771technologies/lytenyte-shared";
import type {
  FilterCombinationOperator,
  FilterDate,
  FilterFunc,
  FilterNumber,
  FilterString,
} from "../../+types";

export interface FilterDateWithSettings extends FilterDate {
  readonly settings: FilterDateSetting;
}

export interface FilterStringWithSettings extends FilterString {
  readonly settings: FilterStringSettings;
}

export interface FilterNumberWithSettings extends FilterNumber {
  readonly settings: FilterNumberSettings;
}

export interface FilterCombinationWithSettings {
  readonly kind: "combination";
  readonly operator: FilterCombinationOperator;
  readonly filters: Array<
    | FilterStringWithSettings
    | FilterNumberWithSettings
    | FilterDateWithSettings
    | FilterCombinationWithSettings
  >;
}

export type FilterWithSettings<T> =
  | FilterDateWithSettings
  | FilterStringWithSettings
  | FilterNumberWithSettings
  | FilterCombinationWithSettings
  | FilterFunc<T>;
