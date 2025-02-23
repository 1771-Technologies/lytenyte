import { useState } from 'react';
import type { Feature, GetProps } from '../../types';

type InputFocusFeature<T> = Feature<
  T,
  Pick<GetProps<T>, 'getInputProps'> & { focused: boolean }
>;

const inputFocus =
  <T>(): InputFocusFeature<T> =>
  () => {
    const [focused, setFocused] = useState(false);

    return {
      focused,

      getInputProps: () => ({
        onFocusCapture: () => setFocused(true),
        onBlurCapture: () => setFocused(false)
      })
    };
  };

export { type InputFocusFeature, inputFocus };
