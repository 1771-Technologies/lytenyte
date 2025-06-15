import { useTransitionedOpen } from "@1771technologies/lytenyte-react-hooks";
import { Positioner, type PositionerProps } from "../positioner/positioner.js";
import { useMenuRoot } from "./contexts/context-menu-root.js";
import { useMenuId } from "./contexts/context-id.js";
import { useEffect } from "react";
import { useSubmenu } from "./contexts/context-submenu.js";

export function MeneSubmenuPositioner(props: PositionerProps) {
  const ctx = useMenuRoot();
  const subCtx = useSubmenu();
  const id = useMenuId();

  const isActive = ctx.activeIds.includes(id);

  const { shouldMount, toggle, open } = useTransitionedOpen({
    initial: isActive,
    timeEnter: ctx.timeEnter,
    timeExit: ctx.timeExit,
  });

  useEffect(() => {
    if (open === isActive) return;

    toggle(isActive);
  }, [isActive, open, toggle]);

  return shouldMount ? (
    <Positioner
      {...props}
      side={props.side ?? "end"}
      align={props.align ?? "start"}
      anchor={props.anchor ?? subCtx.trigger}
    ></Positioner>
  ) : null;
}
