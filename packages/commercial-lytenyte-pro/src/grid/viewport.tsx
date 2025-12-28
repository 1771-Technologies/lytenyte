import { forwardRef, type JSX } from "react";
import { useGridRoot } from "../context.js";
import { Viewport as Core } from "@1771technologies/lytenyte-core/yinternal";

export const Viewport = forwardRef<HTMLDivElement, JSX.IntrinsicElements["div"]>(
  function Viewport(props, forwarded) {
    const ctx = useGridRoot();
    const cellSelectionMode = ctx.grid.state.cellSelectionMode.useValue();

    return <Core {...props} data-ln-has-cell-selection={cellSelectionMode !== "none"} ref={forwarded}></Core>;
  },
);
