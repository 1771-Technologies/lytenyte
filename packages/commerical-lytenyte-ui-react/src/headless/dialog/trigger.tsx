import { forwardRef, type JSX } from "react";
import type { SlotComponent } from "../../hooks/use-slot/+types.use-slot";
import { useSlot } from "../../hooks/use-slot/use-slot.js";
import { useDialogRoot } from "./context.js";

export interface TriggerState {
  readonly open: boolean;
  readonly openChange: (b: boolean) => void;
}

export interface TriggerProps {
  readonly render?: SlotComponent<TriggerState>;
}

function TriggerImpl(
  { render, ...props }: JSX.IntrinsicElements["button"] & TriggerProps,
  ref: JSX.IntrinsicElements["button"]["ref"],
) {
  const ctx = useDialogRoot();

  const internalProps: JSX.IntrinsicElements["button"] & { "data-dialog-open": boolean } = {
    onClick: () => ctx.onOpenChange(!ctx.open),
    "data-dialog-open": ctx.open,
    "aria-haspopup": "dialog",
    "aria-controls": ctx.open ? ctx.id : undefined,
  };

  const final = useSlot({
    props: [internalProps, props],
    ref: ref,
    slot: render ?? <button />,
    state: {
      open: ctx.open,
      openChange: ctx.onOpenChange,
    },
  });

  return final;
}

export const Trigger = forwardRef(TriggerImpl);
