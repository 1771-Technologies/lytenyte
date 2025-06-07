import type { PropsWithChildren } from "react";
import { createPortal } from "react-dom";

export interface PortalProps {
  readonly target?: HTMLElement;
}
export function Portal({ target, children }: PropsWithChildren<PortalProps>) {
  const el = target || document.body;

  return createPortal(children, el);
}
