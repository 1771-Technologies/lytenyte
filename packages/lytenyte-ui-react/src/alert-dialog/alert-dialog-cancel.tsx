import { forwardRef, useMemo } from "react";
import { useDialogRoot } from "../dialog/dialog-context.js";
import { useClassName } from "../hooks/use-class-name.js";
import { useStyle } from "../hooks/use-style.js";
import { useSlot } from "../hooks/use-slot.js";
import { DATA_ALERT_DIALOG_CANCEL } from "../constants.js";
import type { AlertDialog } from "./alert-dialog.js";

function AlertDialogCancelBase(
  { render, style: providedStyle, className: providedClassName, ...props }: AlertDialog.Cancel.Props,
  ref: AlertDialog.Cancel.Props["ref"],
) {
  const ctx = useDialogRoot();
  const state: AlertDialog.State = useMemo(() => ({ open: ctx.open, modal: true }), [ctx.open]);

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
        [DATA_ALERT_DIALOG_CANCEL]: "",
        onClick: () => ctx.onOpenChange(false),
      },
    ],
    state,
  });

  return slot;
}

export const AlertDialogCancel = forwardRef(AlertDialogCancelBase);
