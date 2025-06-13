import { forwardRef, type JSX } from "react";
import { useSelectRoot, type SelectState } from "./context.js";
import { useSlot, type SlotComponent } from "@1771technologies/lytenyte-react-hooks";

export interface SelectClearProps {
  as?: SlotComponent<SelectState>;
}

export const SelectClear = forwardRef<
  HTMLButtonElement,
  JSX.IntrinsicElements["button"] & SelectClearProps
>(function SelectClear({ as, ...props }, forwarded) {
  const ctx = useSelectRoot();

  const slot = useSlot({
    props: [
      ctx.getClearProps(),
      props,
      { "data-ln-select-empty": ctx.state.isInputEmpty, "data-ln-select-open": ctx.state.open },
    ],
    ref: forwarded,
    slot: as ?? <button />,
    state: ctx.state,
  });

  return slot;
});
