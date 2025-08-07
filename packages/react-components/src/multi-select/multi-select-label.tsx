import { useSlot, type SlotComponent } from "@1771technologies/lytenyte-react-hooks";
import { forwardRef, type JSX } from "react";
import { useMultiSelectRoot, type MultiSelectState } from "./context.js";

export interface MultiSelectLabelProps {
  as?: SlotComponent<MultiSelectState>;
}
export const MultiSelectLabel = forwardRef<
  HTMLLabelElement,
  JSX.IntrinsicElements["label"] & MultiSelectLabelProps
>(function SelectLabel({ as, ...props }, forwarded) {
  const ctx = useMultiSelectRoot();

  const renderer = useSlot({
    props: [ctx.getLabelProps(), ctx.getFocusCaptureProps(), props],
    slot: as ?? <label />,
    ref: forwarded,
    state: ctx.state,
  });

  return renderer;
});
