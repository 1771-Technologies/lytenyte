import { createContext, useContext } from "react";
import type { SelectOption } from "./operator-select";
import type { FilterSelectFlat } from "./use-filter-select";

export const context = createContext<{
  readonly filter: FilterSelectFlat;

  readonly extender: "AND" | "OR" | null;
  readonly showExtender: boolean;
  readonly onExtenderChange: (v: "AND" | "OR" | null) => void;

  readonly operatorOptions: SelectOption[];
  readonly operatorValue: SelectOption | null;
  readonly operatorOnChange: (v: SelectOption) => void;

  readonly value: string | number | null | undefined;
  readonly valueDisabled: boolean;
  readonly onValueChange: (v: string | number | null) => void;
  readonly isNumberInput: boolean;
  readonly filterHasNoValue: boolean;
}>({} as any);

export const useFilterRow = () => useContext(context);
