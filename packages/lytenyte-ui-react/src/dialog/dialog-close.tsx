import { forwardRef, useMemo } from "react";
import { useDialogRoot } from "./dialog-context.js";
import { useClassName } from "../hooks/use-class-name.js";
import { useStyle } from "../hooks/use-style.js";
import { useSlot } from "../hooks/use-slot.js";
import type { Dialog } from "./dialog.js";
import { DATA_DIALOG_CLOSE } from "../constants.js";

function DialogCloseBase(
  { render, style: providedStyle, className: providedClassName, ...props }: Dialog.Close.Props,
  ref: Dialog.Close.Props["ref"],
) {
  const ctx = useDialogRoot();
  const state: Dialog.State = useMemo(() => ({ open: ctx.open, modal: ctx.modal }), [ctx.modal, ctx.open]);

  const className = useClassName(providedClassName, state);
  const style = useStyle(providedStyle, state);

  const slot = useSlot({
    slot: render ?? <button />,
    ref,
    props: [
      props,
      {
        className,
        style,
        [DATA_DIALOG_CLOSE]: "",
        onClick: () => ctx.onOpenChange(false),
      },
    ],
    state,
  });

  return slot;
}

export const DialogClose = forwardRef(DialogCloseBase);
