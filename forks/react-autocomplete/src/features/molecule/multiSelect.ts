import type { MergedFeature, FeatureProps } from '../../types';
import { mergeModules } from '../../utils/mergeModules';
import { type AutocompleteLiteFeature, autocompleteLite } from '../atom/autocompleteLite';
import { type NonblurToggleFeature, nonblurToggle } from '../atom/nonblurToggle';
import { type LabelFeature, label } from '../atom/label';
import { type InputFocusFeature, inputFocus } from '../atom/inputFocus';
import { type MultiInputFeature, multiInput } from '../atom/multiInput';

type MultiSelectFeature<T> = MergedFeature<
  T,
  [
    AutocompleteLiteFeature<T>,
    NonblurToggleFeature<T>,
    LabelFeature<T>,
    InputFocusFeature<T>,
    MultiInputFeature<T>
  ]
>;

const multiSelect = <T>(
  props?: Pick<FeatureProps<T>, 'rovingText' | 'closeOnSelect'>
): MultiSelectFeature<T> =>
  mergeModules(
    autocompleteLite<T>({ ...props, select: true }),
    nonblurToggle<T>(),
    label<T>(),
    inputFocus<T>(),
    multiInput<T>()
  );

export { type MultiSelectFeature, multiSelect };
