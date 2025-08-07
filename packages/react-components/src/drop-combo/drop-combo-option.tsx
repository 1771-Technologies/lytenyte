import { forwardRef, type JSX } from "react";
import { useSlot, type SlotComponent } from "@1771technologies/lytenyte-react-hooks";
import { useDropComboRoot, type DropComboState } from "./context.js";

export interface DropComboOptionProps {
  readonly option: string;
  readonly index: number;
  as?: SlotComponent<DropComboState>;
}

export const DropComboOption = forwardRef<
  HTMLDivElement,
  JSX.IntrinsicElements["div"] & DropComboOptionProps
>(function DropComboOption({ option, index, as, ...props }, forwarded) {
  const ctx = useDropComboRoot();

  const renderer = useSlot({
    props: [
      ctx.getItemProps(option, index),
      props,
      {
        "data-ln-active": index === ctx.state.focusIndex,
        "data-ln-selected": ctx.state.selected === option,
      },
    ],
    ref: forwarded,
    slot: as ?? <div />,
    state: ctx.state,
  });

  return renderer;
});
