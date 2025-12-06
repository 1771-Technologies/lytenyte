import { forwardRef, type JSX } from "react";
import { useSlot } from "@1771technologies/lytenyte-hooks-react";
import { useDialogRoot } from "./context.js";
import type { LnComponent } from "../../types.js";

function DialogTitleBase({ render, ...props }: DialogTitle.Props, ref: DialogTitle.Props["ref"]) {
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

export const DialogTitle = forwardRef(DialogTitleBase);

export namespace DialogTitle {
  export type Props = LnComponent<Omit<JSX.IntrinsicElements["h2"], "id">, State>;

  export interface State {
    readonly id: string;
  }
}
