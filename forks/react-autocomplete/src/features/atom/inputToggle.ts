import type { Feature, GetProps } from "../../types";
import { getInputToggleProps } from "../../common";
import { useToggle } from "../../hooks/useToggle";
import { useFocusCapture } from "../../hooks/useFocusCapture";

type InputToggleFeature<T> = Feature<T, Pick<GetProps<T>, "getToggleProps" | "getInputProps">>;

const inputToggle =
  <T>(): InputToggleFeature<T> =>
  ({ id, inputRef, open, setOpen }) => {
    const [startToggle, stopToggle] = useToggle(open, setOpen);
    const [startCapture, inCapture, stopCapture] = useFocusCapture(inputRef);

    return {
      getToggleProps: () => ({
        ...getInputToggleProps(id, open),

        onMouseDown: () => {
          startToggle();
          startCapture();
        },

        onClick: () => {
          stopToggle();
          stopCapture();
        },
      }),

      getInputProps: () => ({
        onBlur: inCapture,
      }),
    };
  };

export { type InputToggleFeature, inputToggle };
