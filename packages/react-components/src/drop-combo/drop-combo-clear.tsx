import { forwardRef, type JSX } from "react";
import { useSlot, type SlotComponent } from "@1771technologies/lytenyte-react-hooks";
import { useDropComboRoot, type DropComboState } from "./context.js";

export interface DropComboClearProps {
  as?: SlotComponent<DropComboState>;
}

export const DropComboClear = forwardRef<
  HTMLButtonElement,
  JSX.IntrinsicElements["button"] & DropComboClearProps
>(function DropComboClear({ as, ...props }, forwarded) {
  const ctx = useDropComboRoot();

  const slot = useSlot({
    props: [
      ctx.getClearProps(),
      props,
      {
        "data-ln-drop-combo-empty": ctx.state.isInputEmpty,
        "data-ln-drop-combo-open": ctx.state.open,
      },
    ],
    ref: forwarded,
    slot: as ?? <button />,
    state: ctx.state,
  });

  return slot;
});
