import { forwardRef, type JSX } from "react";
import { useSlot, type SlotComponent } from "@1771technologies/lytenyte-react-hooks";
import { useDropComboRoot, type DropComboState } from "./context.js";

export interface DropComboOptionsProps {
  readonly as?: SlotComponent<DropComboState>;
}

export const DropComboOptions = forwardRef<
  HTMLDivElement,
  JSX.IntrinsicElements["div"] & DropComboOptionsProps
>(function DropComboOptions({ as, ...props }, forwarded) {
  const ctx = useDropComboRoot();

  const rendered = useSlot({
    props: [ctx.getListProps(), props],
    slot: as ?? <div />,
    ref: forwarded,
    state: ctx.state,
  });

  return rendered;
});
