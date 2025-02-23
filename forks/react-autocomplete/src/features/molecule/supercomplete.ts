import type { MergedFeature, FeatureProps } from '../../types';
import { mergeModules } from '../../utils/mergeModules';
import { type AutocompleteFeature, autocomplete } from './autocomplete';
import { type AutoInlineFeature, autoInline } from '../atom/autoInline';

type SupercompleteFeature<T> = MergedFeature<
  T,
  [AutocompleteFeature<T>, AutoInlineFeature<T>]
>;

const supercomplete = <T>(
  props: Pick<
    FeatureProps<T>,
    'onRequestItem' | 'select' | 'deselectOnClear' | 'deselectOnChange' | 'closeOnSelect'
  >
): SupercompleteFeature<T> =>
  mergeModules(autocomplete<T>({ ...props, rovingText: true }), autoInline<T>(props));

export { type SupercompleteFeature, supercomplete };
