import { forwardRef, type JSX } from "react";
import { useSelectRoot, type SelectState } from "./context.js";
import { useSlot, type SlotComponent } from "@1771technologies/lytenyte-react-hooks";

export interface SelectOptionProps {
  readonly option: string;
  readonly index: number;
  as?: SlotComponent<SelectState>;
}

export const SelectOption = forwardRef<
  HTMLDivElement,
  JSX.IntrinsicElements["div"] & SelectOptionProps
>(function SelectOption({ option, index, as, ...props }, forwarded) {
  const ctx = useSelectRoot();

  const renderer = useSlot({
    props: [
      ctx.getItemProps(option, index),
      props,
      {
        "data-ln-select-active": index === ctx.state.focusIndex,
        "data-ln-selected": ctx.state.selected === option,
      },
    ],
    ref: forwarded,
    slot: as ?? <div />,
    state: ctx.state,
  });

  return renderer;
});
