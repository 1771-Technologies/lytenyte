import type { PropsWithChildren } from "react";
import { Portal, type PortalProps } from "../portal/portal";

export const SelectPortal = (props: PropsWithChildren<PortalProps>) => {
  return <Portal {...props} />;
};
