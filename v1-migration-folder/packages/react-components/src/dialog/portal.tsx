import type { PropsWithChildren } from "react";
import { useDialog } from "./root.use-dialog.js";
import { createPortal } from "react-dom";

export interface DialogPortalProps {
  readonly target?: HTMLElement | string;
  readonly enabled?: boolean;
  readonly keepMounted?: boolean;
}

export const DialogPortal = ({
  target,
  enabled = true,
  keepMounted = false,
  children,
}: PropsWithChildren<DialogPortalProps>) => {
  const { shouldMount } = useDialog();

  if (!shouldMount && !keepMounted) return null;
  if (!enabled) return <>{children}</>;

  const element = target
    ? typeof target === "string"
      ? (document.querySelector(target) as HTMLElement)
      : target
    : document.body;

  return createPortal(<>{children}</>, element);
};
