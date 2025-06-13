import { useTransitionedOpen } from "@1771technologies/lytenyte-react-hooks";
import { Positioner, type PositionerProps } from "../positioner/positioner";
import { useSelectRoot } from "./context";
import { useEffect } from "react";

export function SelectPositioner(props: PositionerProps) {
  const ctx = useSelectRoot();
  const anchor = ctx.input;

  const { shouldMount, open, toggle } = useTransitionedOpen({
    initial: ctx.state.open,
    timeEnter: ctx.timeEnter,
    timeExit: ctx.timeExit,
  });

  useEffect(() => {
    if (open === ctx.state.open) return;
    toggle(ctx.state.open);
  }, [ctx.state.open, open, toggle]);

  return shouldMount ? <Positioner {...props} anchor={props.anchor ?? anchor}></Positioner> : null;
}
