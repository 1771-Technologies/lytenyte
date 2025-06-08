import type { PropsWithChildren } from "react";
import { createPortal } from "react-dom";
import { useDialog } from "../dialog/root.use-dialog";

export interface PortalProps {
  readonly target?: HTMLElement;
}
export function Portal({ target, children }: PropsWithChildren<PortalProps>) {
  // Will be null if we are not inside of a dialog.
  const inDialog = useDialog();

  const el = target ?? inDialog?.dialog ?? document.body;

  return createPortal(children, el);
}
