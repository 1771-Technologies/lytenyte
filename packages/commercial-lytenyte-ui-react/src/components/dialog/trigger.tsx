import { forwardRef, type JSX } from "react";
import { useSlot } from "@1771technologies/lytenyte-hooks-react";
import { useDialogRoot } from "./context.js";
import type { LnComponent } from "../../types.js";

function DialogTriggerBase(
  { render, ...props }: DialogTrigger.Props,
  ref: DialogTrigger.Props["ref"],
) {
  const ctx = useDialogRoot();

  const internalProps: JSX.IntrinsicElements["button"] & { "data-ln-dialog-open": boolean } = {
    onClick: () => ctx.onOpenChange(!ctx.open),
    "data-ln-dialog-open": ctx.open,
    "aria-haspopup": "dialog",
    "aria-controls": ctx.open ? ctx.id : undefined,
  };

  const final = useSlot({
    props: [internalProps, props, { "data-ln-dialog-trigger": "true" }],
    ref: ref,
    slot: render ?? <button />,
    state: {
      open: ctx.open,
      openChange: ctx.onOpenChange,
    },
  });

  return final;
}

export const DialogTrigger = forwardRef(DialogTriggerBase);

export namespace DialogTrigger {
  export type Props = LnComponent<JSX.IntrinsicElements["button"], State>;
  export interface State {
    readonly open: boolean;
    readonly openChange: (b: boolean) => void;
  }
}
