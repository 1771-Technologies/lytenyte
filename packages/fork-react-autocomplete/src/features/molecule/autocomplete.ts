import type { MergedFeature, AutocompleteFeatureProps } from "../../types.js";
import { mergeModules } from "../../utils/merge-modules.js";
import { type AutocompleteLiteFeature, autocompleteLite } from "../atom/autocomplete-lite.js";
import { type InputToggleFeature, inputToggle } from "../atom/input-toggle.js";
import { type LabelFeature, label } from "../atom/label.js";

type AutocompleteFeature<T> = MergedFeature<
  T,
  [AutocompleteLiteFeature<T>, InputToggleFeature<T>, LabelFeature<T>]
>;

const autocomplete = <T>(props?: AutocompleteFeatureProps<T>): AutocompleteFeature<T> =>
  mergeModules(autocompleteLite<T>(props), inputToggle<T>(), label<T>());

export { type AutocompleteFeature, autocomplete };
