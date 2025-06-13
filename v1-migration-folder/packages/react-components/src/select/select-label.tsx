import { useSlot, type SlotComponent } from "@1771technologies/lytenyte-react-hooks";
import { useSelectRoot, type SelectState } from "./context.js";
import { forwardRef, type JSX } from "react";

export interface SelectLabelProps {
  as?: SlotComponent<SelectState>;
}
export const SelectLabel = forwardRef<
  HTMLLabelElement,
  JSX.IntrinsicElements["label"] & SelectLabelProps
>(function SelectLabel({ as, ...props }, forwarded) {
  const ctx = useSelectRoot();

  const renderer = useSlot({
    props: [ctx.getLabelProps(), ctx.getFocusCaptureProps(), props],
    slot: as ?? <label />,
    ref: forwarded,
    state: ctx.state,
  });

  return renderer;
});
