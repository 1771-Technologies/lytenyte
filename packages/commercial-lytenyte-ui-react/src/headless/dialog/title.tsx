import { forwardRef, type JSX } from "react";
import type { SlotComponent } from "../../hooks/use-slot/+types.use-slot";
import { useSlot } from "../../hooks/use-slot/use-slot.js";
import { useDialogRoot } from "./context.js";

export interface TitleState {
  readonly id: string;
}

export interface TitleProps {
  readonly render?: SlotComponent<TitleState>;
}

function TitleBase(
  { render, ...props }: Omit<JSX.IntrinsicElements["h2"], "id"> & TitleProps,
  ref: JSX.IntrinsicElements["h2"]["ref"],
) {
  const ctx = useDialogRoot();

  const internalProps: JSX.IntrinsicElements["h2"] = {
    id: ctx.titleId,
  };

  const final = useSlot({
    props: [internalProps, props, { "data-ln-dialog-title": "true" }],
    ref: ref,
    slot: render ?? <h2 />,
    state: {
      id: ctx.titleId,
    },
  });

  return final;
}

export const Title = forwardRef(TitleBase);
