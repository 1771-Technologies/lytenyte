import { forwardRef, type JSX } from "react";
import { Panel } from "../listbox/panel.js";
import { useGridBoxContext } from "./context.js";
import { DropWrap } from "@1771technologies/lytenyte-core/yinternal";

export const GridBoxPanel = forwardRef<
  HTMLDivElement,
  Omit<JSX.IntrinsicElements["div"], "onDrop">
>(function GridBoxPanel(props, forwarded) {
  const ctx = useGridBoxContext();

  return (
    <DropWrap
      {...props}
      accepted={ctx.accepted}
      data-ln-orientation={ctx.orientation}
      onDrop={ctx.onRootDrop}
      ref={forwarded}
      as={<Panel />}
    />
  );
});
