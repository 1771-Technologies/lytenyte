import { hide, show } from "./tooltip-api.js";

export { TooltipDriver } from "./driver.js";
export type { UseTooltipArgs } from "./use-tooltip.js";
export { useTooltip } from "./use-tooltip.js";
export type { Tooltip } from "./+types.js";

export const tooltipApi = {
  hide,
  show,
};
