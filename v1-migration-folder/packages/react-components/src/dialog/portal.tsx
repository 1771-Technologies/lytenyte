import type { PropsWithChildren } from "react";
import { useDialog } from "./root.use-dialog";
import { createPortal } from "react-dom";

export interface DialogPortalProps {
  readonly target?: HTMLElement | string;
  readonly enabled?: boolean;
}

export function DialogPortal({
  target,
  enabled = true,
  children,
}: PropsWithChildren<DialogPortalProps>) {
  const { shouldMount } = useDialog();

  if (!shouldMount) return null;
  if (!enabled) return <>{children}</>;

  const element = target
    ? typeof target === "string"
      ? (document.querySelector(target) as HTMLElement)
      : target
    : document.body;

  return createPortal(<>{children}</>, element);
}
