import { Portal, type PortalProps } from "../portal/portal.js";
import type { PositionerProps } from "../positioner/positioner.js";
import { TooltipPanel } from "./panel.js";
import { TooltipPositioner } from "./positioner.js";
import { TooltipRoot } from "./root.js";
import { TooltipGroup } from "./group.js";
import { TooltipTrigger } from "./trigger.js";
import { ArrowSvg } from "../popover/arrow.js";

export const Tooltip = {
  Group: TooltipGroup,
  Root: TooltipRoot,
  Trigger: TooltipTrigger,
  Panel: TooltipPanel,
  Portal: Portal,
  Positioner: TooltipPositioner,
  Arrow: ArrowSvg,
};

export type { TooltipRootProps } from "./root.js";
export type { TooltipGroupProps } from "./group.js";
export type { TooltipPanelProps } from "./panel.js";
export type { TooltipTriggerProps } from "./trigger.js";
export type TooltipPositionerProps = PositionerProps;
export type TooltipPortalProps = PortalProps;
