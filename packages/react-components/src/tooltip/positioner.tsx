import { useTransitionedOpen } from "@1771technologies/lytenyte-react-hooks";
import { Positioner, type PositionerProps } from "../positioner/positioner.js";
import { useTooltipRoot } from "./context.js";
import { useEffect } from "react";

export function TooltipPositioner(props: PositionerProps) {
  const ctx = useTooltipRoot();

  const { shouldMount, open, toggle, state } = useTransitionedOpen({
    initial: ctx.open,
    timeEnter: ctx.mountTime,
    timeExit: ctx.unmountTime,
  });

  useEffect(() => {
    if (open === ctx.open) return;
    toggle(ctx.open);
  }, [ctx.open, open, toggle]);

  return shouldMount ? (
    <Positioner {...props} anchor={props.anchor ?? ctx.trigger} data-ln-tooltip-state={state} />
  ) : null;
}
