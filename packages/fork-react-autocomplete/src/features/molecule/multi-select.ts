import type { MergedFeature, FeatureProps } from "../../types.js";
import { mergeModules } from "../../utils/merge-modules.js";
import { type AutocompleteLiteFeature, autocompleteLite } from "../atom/autocomplete-lite.js";
import { type NonblurToggleFeature, nonblurToggle } from "../atom/nonblur-toggle.js";
import { type LabelFeature, label } from "../atom/label.js";
import { type InputFocusFeature, inputFocus } from "../atom/input-focus.js";
import { type MultiInputFeature, multiInput } from "../atom/multi-input.js";

type MultiSelectFeature<T> = MergedFeature<
  T,
  [
    AutocompleteLiteFeature<T>,
    NonblurToggleFeature<T>,
    LabelFeature<T>,
    InputFocusFeature<T>,
    MultiInputFeature<T>,
  ]
>;

const multiSelect = <T>(
  props?: Pick<FeatureProps<T>, "rovingText" | "closeOnSelect">,
): MultiSelectFeature<T> =>
  mergeModules(
    autocompleteLite<T>({ ...props, select: true }),
    nonblurToggle<T>(),
    label<T>(),
    inputFocus<T>(),
    multiInput<T>(),
  );

export { type MultiSelectFeature, multiSelect };
