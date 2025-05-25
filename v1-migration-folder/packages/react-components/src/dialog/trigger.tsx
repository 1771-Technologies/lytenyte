import { forwardRef, type JSX } from "react";
import type { OpenState } from "./use-transition-effect.js";
import { useSlot, type SlotComponent } from "@1771technologies/lytenyte-react-hooks";
import { useDialog } from "./root.use-dialog.js";

export interface DialogTriggerProps {
  readonly as?: SlotComponent<OpenState>;
}

export const DialogTrigger = forwardRef<
  HTMLButtonElement,
  JSX.IntrinsicElements["button"] & DialogTriggerProps
>(function DialogTrigger({ as, ...props }, forwarded) {
  const ctx = useDialog();

  const defaultProps: JSX.IntrinsicElements["button"] & { "data-dialog-state": OpenState } = {
    onClick: () => {
      ctx.onOpenChange(!ctx.open);
    },
    "data-dialog-state": ctx.state,
    "aria-haspopup": "dialog",
    "aria-expanded": ctx.shouldMount,
  };

  const renderedSlot = useSlot({
    props: [defaultProps, props],
    ref: forwarded,
    slot: as ?? <button />,
    state: ctx.state,
  });

  return renderedSlot;
});
