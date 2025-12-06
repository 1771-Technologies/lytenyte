import { forwardRef, type JSX } from "react";
import { useSlot } from "../../hooks/use-slot/use-slot.js";
import { useDialogRoot } from "./context.js";
import type { LnComponent } from "../../types.js";
import { useLnStyle } from "../provider.js";

function DialogDescriptionBase(
  { render, ...props }: DialogDescription.Props,
  ref: DialogDescription.Props["ref"],
) {
  const ctx = useDialogRoot();

  const s = useLnStyle().Dialog?.Description;
  const internalProps: JSX.IntrinsicElements["p"] = {
    id: ctx.descriptionId,
  };

  const final = useSlot({
    props: [s, internalProps, props, { "data-ln-dialog-description": "true" }],
    ref: ref,
    slot: render ?? <p />,
    state: {
      id: ctx.descriptionId,
    },
  });

  return final;
}

export const DialogDescription = forwardRef(DialogDescriptionBase);

export namespace DialogDescription {
  export type Props = LnComponent<Omit<JSX.IntrinsicElements["p"], "id">, State>;

  export interface State {
    readonly id: string;
  }
}
