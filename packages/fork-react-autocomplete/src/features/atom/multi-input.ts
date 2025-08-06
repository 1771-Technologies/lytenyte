import { useState } from "react";
import type { Feature, GetProps } from "../../types.js";

type MultiInputFeature<T> = Feature<
  T,
  Pick<GetProps<T>, "getInputProps"> & {
    isInputActive: boolean;
    isTagActive: (item: T) => boolean;
  }
>;

const multiInput =
  <T>(): MultiInputFeature<T> =>
  ({ selected: _selected, setFocusIndex, removeSelect, isEqual }) => {
    if (process.env.NODE_ENV !== "production") {
      if (!removeSelect)
        throw new Error(
          "@szhsin/react-autocomplete: Multi-selection feature must be used with the useMultiSelect hook.",
        );

      if (!Array.isArray(_selected))
        throw new Error(
          "@szhsin/react-autocomplete: The `selected` prop in useMultiSelect must be an array.",
        );
    }

    const [activeTag, setActiveTag] = useState(-1);
    const resetTag = () => setActiveTag(-1);
    const selected = _selected as T[];

    return {
      isInputActive: activeTag < 0,

      isTagActive: (item) => isEqual(item, selected[activeTag]),

      getInputProps: () => ({
        onBlur: resetTag,
        onChange: resetTag,
        onKeyDown: (e) => {
          if ((e.target as HTMLInputElement).value) return;

          const tagLength = selected.length;
          let nextTag = activeTag;
          switch (e.key) {
            // @ts-expect-error intentional fallthrough
            case "Backspace":
              removeSelect!(selected[activeTag]);
            // fall through: intentionally combined cases to save bytes
            case "ArrowUp":
            case "ArrowDown":
            case "Escape":
              resetTag();
              break;

            case "ArrowLeft":
              if (nextTag < 0) {
                nextTag = tagLength - 1;
              } else if (nextTag > 0) {
                nextTag -= 1;
              }
              setActiveTag(nextTag);
              setFocusIndex(-1);
              break;

            case "ArrowRight":
              if (nextTag >= 0) nextTag += 1;
              if (nextTag >= tagLength) nextTag = -1;
              setActiveTag(nextTag);
            // intentionally removed break in the last case to save bytes
            // break;
          }
        },
      }),
    };
  };

export { type MultiInputFeature, multiInput };
