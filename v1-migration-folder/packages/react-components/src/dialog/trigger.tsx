import { forwardRef, type JSX } from "react";
import type { OpenState } from "./use-transition-effect";
import { useSlot, type SlotComponent } from "@1771technologies/lytenyte-react-hooks";
import { useDialog } from "./root.use-dialog";

export interface DialogTriggerProps {
  readonly slot?: SlotComponent<OpenState>;
}

export const DialogTrigger = forwardRef<
  HTMLButtonElement,
  JSX.IntrinsicElements["button"] & DialogTriggerProps
>(function DialogTrigger({ slot, ...props }, forwarded) {
  const ctx = useDialog();
  const defaultProps: JSX.IntrinsicElements["button"] & { "data-dialog-state": OpenState } = {
    onClick: () => {
      ctx.onOpenChange(!ctx.open);
    },
    "data-dialog-state": ctx.state,
  };

  const renderedSlot = useSlot({
    props: [defaultProps, props],
    ref: forwarded,
    slot: slot ?? <button />,
    state: ctx.state,
  });

  return renderedSlot;
});
