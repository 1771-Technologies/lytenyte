import type {
  FilterDateSetting,
  FilterNumberSettings,
  FilterStringSettings,
} from "@1771technologies/lytenyte-shared";
import type {
  FilterCombinationOperator,
  FilterDate,
  FilterFunc,
  FilterIn,
  FilterNumber,
  FilterString,
} from "../../+types";

export interface FilterDateWithSettings extends FilterDate {
  readonly field: string;
  readonly settings: FilterDateSetting;
}

export interface FilterStringWithSettings extends FilterString {
  readonly field: string;
  readonly settings: FilterStringSettings;
}

export interface FilterNumberWithSettings extends FilterNumber {
  readonly field: string;
  readonly settings: FilterNumberSettings;
}
export interface FilterInWithField extends FilterIn {
  readonly field: string;
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
  | FilterInWithField
  | FilterFunc<T>;
