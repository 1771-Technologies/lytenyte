import type { Feature, GetProps } from "../../types";

type MultiInputFeature<T> = Feature<T, Pick<GetProps<T>, "getInputProps">>;

const multiInput =
  <T>(): MultiInputFeature<T> =>
  ({ removeSelect }) => ({
    getInputProps: () => ({
      onKeyDown: (e) =>
        !(e.target as HTMLInputElement).value && e.key === "Backspace" && removeSelect?.(),
    }),
  });

export { type MultiInputFeature, multiInput };
