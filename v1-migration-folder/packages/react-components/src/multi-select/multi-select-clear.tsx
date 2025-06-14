import { forwardRef, type JSX } from "react";
import { useSlot, type SlotComponent } from "@1771technologies/lytenyte-react-hooks";
import { useMultiSelectRoot, type MultiSelectState } from "./context.js";

export interface MultiSelectClearProps {
  as?: SlotComponent<MultiSelectState>;
}

export const MultiSelectClear = forwardRef<
  HTMLButtonElement,
  JSX.IntrinsicElements["button"] & MultiSelectClearProps
>(function MultiSelectClear({ as, ...props }, forwarded) {
  const ctx = useMultiSelectRoot();

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
