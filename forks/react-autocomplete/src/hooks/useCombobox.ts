import type { ComboboxProps } from "../types";
import { defaultEqual } from "../common";
import { useAutocomplete } from "./useAutocomplete";

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
