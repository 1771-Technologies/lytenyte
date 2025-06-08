import { Positioner, type PositionerProps } from "../positioner/positioner.js";
import { useTooltipRoot } from "./context.js";

export function TooltipPositioner(props: PositionerProps) {
  const ctx = useTooltipRoot();

  return <Positioner {...props} active={ctx.open} anchor={props.anchor ?? ctx.trigger} />;
}
