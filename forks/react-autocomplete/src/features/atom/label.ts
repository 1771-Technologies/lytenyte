import type { Feature, GetProps } from '../../types';
import { getId } from '../../common';

type LabelFeature<T> = Feature<
  T,
  Pick<GetProps<T>, 'getLabelProps' | 'getInputProps' | 'getListProps'>
>;

const label =
  <T>(): LabelFeature<T> =>
  ({ id }) => {
    const inputId = getId(id, 'i');
    const labelId = getId(id, 'a');

    return {
      getLabelProps: () => ({
        id: labelId,
        htmlFor: inputId
      }),

      getInputProps: () => ({
        id: inputId
      }),

      getListProps: () => ({
        'aria-labelledby': labelId
      })
    };
  };

export { type LabelFeature, label };
