import { useEffect, useRef } from "react";
import type { Feature, FeatureProps, GetProps, FeatureState } from "../../types";
import { useToggle } from "../../hooks/useToggle";

type DropdownToggleFeature<T> = Feature<
  T,
  Pick<GetProps<T>, "getToggleProps" | "getInputProps"> &
    FeatureState & { toggleRef: React.RefObject<HTMLButtonElement | null> }
>;

const dropdownToggle =
  <T>({
    closeOnSelect = true,
    toggleRef: externalToggleRef,
  }: Pick<FeatureProps<T>, "closeOnSelect" | "toggleRef"> = {}): DropdownToggleFeature<T> =>
  ({ inputRef, open, setOpen, focusIndex, value, tmpValue }) => {
    const [startToggle, stopToggle] = useToggle(open, setOpen);
    const internalToggleRef = useRef<HTMLButtonElement>(null);
    const toggleRef = externalToggleRef || internalToggleRef;
    const inputValue = tmpValue || value || "";

    useEffect(() => {
      if (open) inputRef.current?.focus({ preventScroll: true });
    }, [open, inputRef]);

    // We don't want to flow through onBlur handler in `autocompleteLite`,
    // this is a workaround to short cut it by waiting for `open` becomes false
    const focusToggle = () => setTimeout(() => toggleRef.current?.focus(), 0);

    return {
      toggleRef,
      isInputEmpty: !inputValue,

      getToggleProps: () => ({
        type: "button",
        "aria-haspopup": true,
        "aria-expanded": open,
        ref: toggleRef,

        onMouseDown: startToggle,

        onClick: stopToggle,

        onKeyDown: (e) => {
          const { key } = e;
          if (key === "ArrowDown") {
            e.preventDefault();
            setOpen(true);
          }
        },
      }),

      getInputProps: () => ({
        value: inputValue,
        onKeyDown: (e) => {
          const { key } = e;
          if (key === "Escape" || (closeOnSelect && focusIndex >= 0 && key === "Enter")) {
            focusToggle();
          }
        },
      }),
    };
  };

export { type DropdownToggleFeature, dropdownToggle };
