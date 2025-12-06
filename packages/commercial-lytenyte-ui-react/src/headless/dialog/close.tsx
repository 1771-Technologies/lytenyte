import { forwardRef, type JSX } from "react";
import { useSlot } from "../../hooks/use-slot/use-slot.js";
import { useDialogRoot } from "./context.js";
import type { LnComponent } from "../../types.js";
import { useLnStyle } from "../provider.js";

function DialogCloseImpl({ render, ...props }: DialogClose.Props, ref: DialogClose.Props["ref"]) {
  const ctx = useDialogRoot();

  const internalProps: JSX.IntrinsicElements["button"] = {
    "aria-label": "Close dialog",
    onClick: () => ctx.onOpenChange(false),
  };
  const s = useLnStyle().Dialog?.Close;

  const final = useSlot({
    props: [s, internalProps, props, { "data-ln-dialog-close": true }],
    ref: ref,
    slot: render ?? <button />,
    state: {
      open: ctx.open,
      openChange: ctx.onOpenChange,
    },
  });

  return final;
}

export const DialogClose = forwardRef(DialogCloseImpl);

export namespace DialogClose {
  export type Props = LnComponent<JSX.IntrinsicElements["button"], State>;
  export type State = {
    readonly open: boolean;
    readonly openChange: (b: boolean) => void;
  };
}
