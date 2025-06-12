import type { ComboboxProps } from "../types.js";
import { defaultEqual } from "../common.js";
import { useAutocomplete } from "./use-autocomplete.js";

const useCombobox = <T, FeatureYield extends object>({
  isEqual = defaultEqual,
  selected,
  onSelectChange,
  flipOnSelect,
  ...passthrough
}: ComboboxProps<T, FeatureYield>) =>
  useAutocomplete({
    ...passthrough,
    selected,
    isEqual,
    isItemSelected: (item) => isEqual(item, selected),
    onSelectChange: (newItem) => {
      if (!isEqual(newItem, selected)) {
        onSelectChange?.(newItem);
      } else if (flipOnSelect) {
        onSelectChange?.();
      }
    },
  });

export { useCombobox };
