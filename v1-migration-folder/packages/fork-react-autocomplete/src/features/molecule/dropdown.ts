import type { MergedFeature, FeatureProps } from "../../types.js";
import { mergeModules } from "../../utils/merge-modules.js";
import { type AutocompleteLiteFeature, autocompleteLite } from "../atom/autocomplete-lite.js";
import { type DropdownToggleFeature, dropdownToggle } from "../atom/dropdown-toggle.js";

type DropdownFeature<T> = MergedFeature<T, [AutocompleteLiteFeature<T>, DropdownToggleFeature<T>]>;

const dropdown = <T>(
  props?: Pick<FeatureProps<T>, "rovingText" | "closeOnSelect" | "toggleRef">,
): DropdownFeature<T> =>
  mergeModules(
    autocompleteLite<T>({
      ...props,
      select: true,
      deselectOnClear: false,
    }),
    dropdownToggle<T>(props),
  );

export { type DropdownFeature, dropdown };
