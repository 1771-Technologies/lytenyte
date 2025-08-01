import type { FilterCombination, FilterDate, FilterNumber, FilterString } from "../../+types";

export type SimpleFilter = FilterCombination | FilterNumber | FilterString | FilterDate;
