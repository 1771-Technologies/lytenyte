import type { PropsWithChildren } from "react";
import { Portal, type PortalProps } from "../portal/portal.js";

export const MultiSelectPortal = (props: PropsWithChildren<PortalProps>) => {
  return <Portal {...props} />;
};
