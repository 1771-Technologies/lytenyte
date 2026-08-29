import { forwardRef } from "react";
import { DialogContent } from "../dialog/dialog-content.js";
import { DATA_ALERT_DIALOG_CONTENT } from "../constants.js";
import type { AlertDialog } from "./alert-dialog.js";

function AlertDialogContentBase(props: AlertDialog.Content.Props, ref: AlertDialog.Content.Props["ref"]) {
  return <DialogContent role="alertdialog" {...{ [DATA_ALERT_DIALOG_CONTENT]: "" }} {...props} ref={ref} />;
}

export const AlertDialogContent = forwardRef(AlertDialogContentBase);
