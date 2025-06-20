import { useTransitionedOpen } from "@1771technologies/lytenyte-react-hooks";
import { Positioner, type PositionerProps } from "../positioner/positioner.js";
import { useSelectRoot } from "./context.js";
import { useEffect } from "react";

export function SelectPositioner(props: PositionerProps) {
  const ctx = useSelectRoot();
  const anchor = ctx.input;

  const { shouldMount, open, toggle, state } = useTransitionedOpen({
    initial: ctx.state.open,
    timeEnter: ctx.timeEnter,
    timeExit: ctx.timeExit,
  });

  useEffect(() => {
    if (open === ctx.state.open) return;
    toggle(ctx.state.open);
  }, [ctx.state.open, open, toggle]);

  return shouldMount ? (
    <Positioner
      {...props}
      anchor={props.anchor ?? anchor}
      data-ln-select-options-state={state}
    ></Positioner>
  ) : null;
}
