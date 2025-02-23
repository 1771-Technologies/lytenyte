import type { Feature, GetProps, FeatureProps } from '../../types';

type AutoFocusFeature<T> = Feature<T, Pick<GetProps<T>, 'getInputProps'>>;

const autoFocus =
  <T>({ onRequestItem }: Pick<FeatureProps<T>, 'onRequestItem'>): AutoFocusFeature<T> =>
  ({ setFocusIndex }) => ({
    getInputProps: () => ({
      onChange: (e) => {
        const value = e.target.value;
        if (value) {
          onRequestItem({ value }, (data) => setFocusIndex(data.index));
        }
      }
    })
  });

export { type AutoFocusFeature, autoFocus };
