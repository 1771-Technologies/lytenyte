import type { PropsWithChildren } from "react";
import { TooltipProvider } from "@1771technologies/react-tooltip";
import { cc } from "../component-configuration";

export const LngTooltip = (props: PropsWithChildren) => {
  const tooltip = cc.tooltip.use();
  return <TooltipProvider {...tooltip}>{props.children}</TooltipProvider>;
};
