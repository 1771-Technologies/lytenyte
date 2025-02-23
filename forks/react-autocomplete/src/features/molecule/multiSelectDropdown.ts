import type { MergedFeature, FeatureProps } from '../../types';
import { mergeModules } from '../../utils/mergeModules';
import { type MultiInputFeature, multiInput } from '../atom/multiInput';
import { type DropdownFeature, dropdown } from './dropdown';

type MultiSelectDropdownFeature<T> = MergedFeature<
  T,
  [DropdownFeature<T>, MultiInputFeature<T>]
>;

const multiSelectDropdown = <T>(
  props?: Pick<FeatureProps<T>, 'rovingText' | 'closeOnSelect' | 'toggleRef'>
): MultiSelectDropdownFeature<T> => mergeModules(dropdown<T>(props), multiInput<T>());

export { type MultiSelectDropdownFeature, multiSelectDropdown };
