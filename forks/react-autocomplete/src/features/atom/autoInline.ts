import type { Feature, GetProps, FeatureProps } from '../../types';

type AutoInlineFeature<T> = Feature<T, Pick<GetProps<T>, 'getInputProps'>>;

const autoInline =
  <T>({ onRequestItem }: Pick<FeatureProps<T>, 'onRequestItem'>): AutoInlineFeature<T> =>
  ({ getItemValue, setTmpValue, setFocusIndex }) => ({
    getInputProps: () => ({
      'aria-autocomplete': 'both',

      onChange: ({ target, nativeEvent }) => {
        if ((nativeEvent as unknown as { inputType: string }).inputType !== 'insertText') {
          return;
        }

        const value = target.value;
        onRequestItem({ value }, (data) => {
          setFocusIndex(data.index);
          const itemValue = getItemValue(data.item);
          const start = value.length;
          const end = itemValue.length;
          setTmpValue(value + itemValue.slice(start));
          setTimeout(() => target.setSelectionRange(start, end), 0);
        });
      }
    })
  });

export { type AutoInlineFeature, autoInline };
