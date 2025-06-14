import { forwardRef, type JSX } from "react";
import { useMultiSelectRoot, type MultiSelectState } from "./context.js";
import { useSlot, type SlotComponent } from "@1771technologies/lytenyte-react-hooks";

export interface MultiSelectOptionProps {
  readonly option: string;
  readonly index: number;
  as?: SlotComponent<MultiSelectState>;
}

export const MultiSelectOption = forwardRef<
  HTMLDivElement,
  JSX.IntrinsicElements["div"] & MultiSelectOptionProps
>(function MultiSelectOption({ option, index, as, ...props }, forwarded) {
  const ctx = useMultiSelectRoot();

  const renderer = useSlot({
    props: [
      ctx.getItemProps(option, index),
      props,
      {
        "data-ln-active": index === ctx.state.focusIndex,
        "data-ln-selected": ctx.isItemSelected(option),
      },
    ],
    ref: forwarded,
    slot: as ?? <div />,
    state: ctx.state,
  });

  return renderer;
});
