import { forwardRef, type JSX } from "react";
import { useSlot, type SlotComponent } from "@1771technologies/lytenyte-react-hooks";
import { useMultiSelectRoot, type MultiSelectState } from "./context.js";

export interface MultiSelectOptionsProps {
  readonly as?: SlotComponent<MultiSelectState>;
}

export const MultiSelectOptions = forwardRef<
  HTMLDivElement,
  JSX.IntrinsicElements["div"] & MultiSelectOptionsProps
>(function MultiSelectOptions({ as, ...props }, forwarded) {
  const ctx = useMultiSelectRoot();

  const rendered = useSlot({
    props: [ctx.getListProps(), props],
    slot: as ?? <div />,
    ref: forwarded,
    state: ctx.state,
  });

  return rendered;
});
