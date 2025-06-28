import { forwardRef, type JSX } from "react";
import { useForkRef, useSlot, type SlotComponent } from "@1771technologies/lytenyte-react-hooks";
import { useMultiSelectRoot, type MultiSelectState } from "./context.js";

export interface MultiSelectToggleProps {
  as?: SlotComponent<MultiSelectState>;
}

export const MultiSelectToggle = forwardRef<
  HTMLButtonElement,
  JSX.IntrinsicElements["button"] & MultiSelectToggleProps
>(function MultiSelectToggle({ as, ...props }, forwarded) {
  const ctx = useMultiSelectRoot();

  const ref = useForkRef(ctx.setToggle, forwarded);
  const slot = useSlot({
    props: [ctx.getToggleProps(), props, { "data-ln-select-open": ctx.state.open }],
    ref: ref,
    slot: as ?? <button />,
    state: ctx.state,
  });

  return slot;
});
