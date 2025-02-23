import type { MergedFeature, FeatureProps } from "../../types";
import { mergeModules } from "../../utils/mergeModules";
import { type AutocompleteLiteFeature, autocompleteLite } from "../atom/autocompleteLite";
import { type DropdownToggleFeature, dropdownToggle } from "../atom/dropdownToggle";

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
