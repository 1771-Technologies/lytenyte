import type { MergedFeature, FeatureProps } from "../../types.js";
import { mergeModules } from "../../utils/merge-modules.js";
import { type MultiInputFeature, multiInput } from "../atom/multi-input.js";
import { type DropdownFeature, dropdown } from "./dropdown.js";

type MultiSelectDropdownFeature<T> = MergedFeature<T, [DropdownFeature<T>, MultiInputFeature<T>]>;

const multiSelectDropdown = <T>(
  props?: Pick<FeatureProps<T>, "rovingText" | "closeOnSelect" | "toggleRef">,
): MultiSelectDropdownFeature<T> => mergeModules(dropdown<T>(props), multiInput<T>());

export { type MultiSelectDropdownFeature, multiSelectDropdown };
