import { forwardRef, type JSX } from "react";
import { useForkRef, useSlot, type SlotComponent } from "@1771technologies/lytenyte-react-hooks";
import { useDropComboRoot, type DropComboState } from "./context.js";

export interface DropComboToggleProps {
  as?: SlotComponent<DropComboState>;
}

export const DropComboToggle = forwardRef<
  HTMLButtonElement,
  JSX.IntrinsicElements["button"] & DropComboToggleProps
>(function SelectToggle({ as, ...props }, forwarded) {
  const ctx = useDropComboRoot();

  const slot = useSlot({
    props: [ctx.getToggleProps(), props, { "data-ln-drop-combo-open": ctx.state.open }],
    ref: useForkRef(forwarded, ctx.setToggle),
    slot: as ?? <button />,
    state: ctx.state,
  });

  return slot;
});
