import { useMemo } from "react";
import { DialogRoot } from "../dialog/dialog-root.js";
import { useDialogRoot, DialogRootProvider } from "../dialog/dialog-context.js";
import type { AlertDialog } from "./alert-dialog.js";

function AlertDialogContextOverride({ children }: { children: React.ReactNode }) {
  const parent = useDialogRoot();

  const overridden = useMemo(() => ({ ...parent, closeOnEscape: false }), [parent]);

  return <DialogRootProvider value={overridden}>{children}</DialogRootProvider>;
}

export function AlertDialogRoot({ open, defaultOpen, onOpenChange, children }: AlertDialog.Props) {
  return (
    <DialogRoot open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange} modal dismissible={false}>
      <AlertDialogContextOverride>{children}</AlertDialogContextOverride>
    </DialogRoot>
  );
}
