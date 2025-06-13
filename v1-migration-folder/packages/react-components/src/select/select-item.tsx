import { forwardRef, type JSX } from "react";
import { useSelectRoot, type SelectState } from "./context";
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
    props: [ctx.getItemProps(option, index), props],
    ref: forwarded,
    slot: as ?? <div />,
    state: ctx.state,
  });

  return renderer;
});
