import type { MergedFeature, FeatureProps } from "../../types.js";
import { mergeModules } from "../../utils/merge-modules.js";
import { type AutocompleteFeature, autocomplete } from "./autocomplete.js";
import { type AutoInlineFeature, autoInline } from "../atom/auto-inline.js";

type SupercompleteFeature<T> = MergedFeature<T, [AutocompleteFeature<T>, AutoInlineFeature<T>]>;

const supercomplete = <T>(
  props: Pick<
    FeatureProps<T>,
    "onRequestItem" | "select" | "deselectOnClear" | "deselectOnChange" | "closeOnSelect"
  >,
): SupercompleteFeature<T> =>
  mergeModules(autocomplete<T>({ ...props, rovingText: true }), autoInline<T>(props));

export { type SupercompleteFeature, supercomplete };
