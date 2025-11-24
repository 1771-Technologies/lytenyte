import { forwardRef, type JSX } from "react";
import type { SlotComponent } from "../../hooks/use-slot/+types.use-slot";
import { useSlot } from "../../hooks/use-slot/use-slot.js";
import { useDialogRoot } from "./context.js";

export interface CloseState {
  readonly open: boolean;
  readonly openChange: (b: boolean) => void;
}

export interface CloseProps {
  readonly render?: SlotComponent<CloseState>;
}

function CloseImpl(
  { render, ...props }: JSX.IntrinsicElements["button"] & CloseProps,
  ref: JSX.IntrinsicElements["button"]["ref"],
) {
  const ctx = useDialogRoot();

  const internalProps: JSX.IntrinsicElements["button"] = {
    "aria-label": "Close dialog",
    onClick: () => ctx.onOpenChange(false),
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

export const Close = forwardRef(CloseImpl);
