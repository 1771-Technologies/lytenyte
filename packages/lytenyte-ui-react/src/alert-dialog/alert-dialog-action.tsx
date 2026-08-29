import { forwardRef, useMemo } from "react";
import { useDialogRoot } from "../dialog/dialog-context.js";
import { useClassName } from "../hooks/use-class-name.js";
import { useStyle } from "../hooks/use-style.js";
import { useSlot } from "../hooks/use-slot.js";
import { DATA_ALERT_DIALOG_ACTION } from "../constants.js";
import type { AlertDialog } from "./alert-dialog.js";

function AlertDialogActionBase(
  { render, style: providedStyle, className: providedClassName, ...props }: AlertDialog.Action.Props,
  ref: AlertDialog.Action.Props["ref"],
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
        [DATA_ALERT_DIALOG_ACTION]: "",
        onClick: () => ctx.onOpenChange(false),
      },
    ],
    state,
  });

  return slot;
}

export const AlertDialogAction = forwardRef(AlertDialogActionBase);
