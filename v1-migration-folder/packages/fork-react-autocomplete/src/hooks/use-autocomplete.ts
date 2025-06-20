import { useState, useRef, useId } from "react";
import { defaultFocusIndex } from "../common.js";
import type { AutocompleteProps, AutocompleteReturn } from "../types.js";

const useAutocomplete = <T, FeatureYield extends object>({
  onChange,
  feature: useFeature,
  isItemSelected,
  inputRef: externalInputRef,
  getItemValue,
  ...passthrough
}: AutocompleteProps<T, FeatureYield>) => {
  const internalInputRef = useRef<HTMLInputElement>(null);
  const [tmpValue, setTmpValue] = useState<string | undefined>();
  const [open, setOpen] = useState(false);
  const [focusIndex, setFocusIndex] = useState(defaultFocusIndex);

  const state: AutocompleteReturn<T> = {
    isItemSelected,
    inputRef: externalInputRef || internalInputRef,
    focusIndex,
    setFocusIndex,
    open,
    setOpen,
  };

  const featureYield = useFeature({
    id: useId(),
    tmpValue,
    setTmpValue,
    onChange: (newValue) => passthrough.value != newValue && onChange?.(newValue),
    getItemValue: (item) =>
      item == null ? "" : getItemValue ? getItemValue(item) : item.toString(),
    ...passthrough,
    ...state,
  });

  return {
    ...state,
    ...featureYield,
  };
};

export { useAutocomplete };
