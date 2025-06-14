import { useSlot, type SlotComponent } from "@1771technologies/lytenyte-react-hooks";
import { forwardRef, type JSX } from "react";
import { useMultiSelectRoot, type MultiSelectState } from "./context.js";

export interface MultiSelectPanelProps {
  readonly as?: SlotComponent<MultiSelectState>;
}

export const MultiSelectPanel = forwardRef<
  HTMLDivElement,
  JSX.IntrinsicElements["div"] & MultiSelectPanelProps
>(function MultiSelectPanel({ as, ...props }, forwarded) {
  const ctx = useMultiSelectRoot();

  const slot = useSlot({
    props: [ctx.getFocusCaptureProps(), props],
    ref: forwarded,
    slot: as ?? <div />,
    state: ctx.state,
  });

  return slot;
});
