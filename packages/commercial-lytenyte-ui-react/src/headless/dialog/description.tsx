import { forwardRef, type JSX } from "react";
import type { SlotComponent } from "../../hooks/use-slot/+types.use-slot";
import { useSlot } from "../../hooks/use-slot/use-slot.js";
import { useDialogRoot } from "./context.js";

export interface DescriptionState {
  readonly id: string;
}

export interface DescriptionProps {
  readonly render?: SlotComponent<DescriptionState>;
}

function DescriptionBase(
  { render, ...props }: Omit<JSX.IntrinsicElements["p"], "id"> & DescriptionProps,
  ref: JSX.IntrinsicElements["p"]["ref"],
) {
  const ctx = useDialogRoot();

  const internalProps: JSX.IntrinsicElements["p"] = {
    id: ctx.descriptionId,
  };

  const final = useSlot({
    props: [internalProps, props, { "data-ln-dialog-description": "true" }],
    ref: ref,
    slot: render ?? <p />,
    state: {
      id: ctx.descriptionId,
    },
  });

  return final;
}

export const Description = forwardRef(DescriptionBase);
