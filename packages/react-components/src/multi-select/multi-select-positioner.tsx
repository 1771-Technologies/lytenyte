import { useTransitionedOpen } from "@1771technologies/lytenyte-react-hooks";
import { Positioner, type PositionerProps } from "../positioner/positioner.js";
import { useEffect } from "react";
import { useMultiSelectRoot } from "./context.js";

export function MultiSelectPositioner(props: PositionerProps) {
  const ctx = useMultiSelectRoot();
  const anchor = ctx.isDrop ? ctx.toggle : ctx.input;

  const { shouldMount, open, toggle, state } = useTransitionedOpen({
    initial: ctx.state.open,
    timeEnter: ctx.timeEnter,
    timeExit: ctx.timeExit,
  });

  useEffect(() => {
    if (open === ctx.state.open) return;
    toggle(ctx.state.open);
  }, [ctx.state.open, open, toggle]);

  // Reset the focus. Also ensure the input element is focused.
  useEffect(() => {
    if (!ctx.isDrop) return;
    const active = document.activeElement;
    if (shouldMount) {
      ctx.input?.focus();
    }

    return () => (active as HTMLElement)?.focus();
  }, [ctx.input, ctx.isDrop, shouldMount]);

  return shouldMount ? (
    <Positioner
      {...props}
      anchor={props.anchor ?? anchor}
      data-ln-select-options-state={state}
    ></Positioner>
  ) : null;
}
