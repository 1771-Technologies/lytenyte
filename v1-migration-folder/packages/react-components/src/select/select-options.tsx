import { forwardRef, type JSX } from "react";
import { useSelectRoot, type SelectState } from "./context";
import { useSlot, type SlotComponent } from "@1771technologies/lytenyte-react-hooks";

export interface SelectOptionsProps {
  readonly as?: SlotComponent<SelectState>;
}

export const SelectOptions = forwardRef<
  HTMLDivElement,
  JSX.IntrinsicElements["div"] & SelectOptionsProps
>(function SelectOptions({ as, ...props }, forwarded) {
  const ctx = useSelectRoot();

  const rendered = useSlot({
    props: [ctx.getListProps(), props],
    slot: as ?? <div />,
    ref: forwarded,
    state: ctx.state,
  });

  return rendered;
});
