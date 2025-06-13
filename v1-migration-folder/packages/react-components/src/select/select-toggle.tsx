import { forwardRef, type JSX } from "react";
import { useSelectRoot, type SelectState } from "./context";
import { useSlot, type SlotComponent } from "@1771technologies/lytenyte-react-hooks";

export interface SelectToggleProps {
  as?: SlotComponent<SelectState>;
}

export const SelectToggle = forwardRef<
  HTMLButtonElement,
  JSX.IntrinsicElements["button"] & SelectToggleProps
>(function SelectToggle({ as, ...props }, forwarded) {
  const ctx = useSelectRoot();

  const slot = useSlot({
    props: [ctx.getToggleProps(), props],
    ref: forwarded,
    slot: as ?? <button />,
    state: ctx.state,
  });

  return slot;
});
