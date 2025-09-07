import { forwardRef, type JSX } from "react";
import { useGridRoot } from "../context.js";
import { fastDeepMemo } from "@1771technologies/lytenyte-react-hooks";
import { RowsContainerReact } from "@1771technologies/lytenyte-shared";

export const RowsContainer = fastDeepMemo(
  forwardRef<HTMLDivElement, JSX.IntrinsicElements["div"]>(function Rows(props, forwarded) {
    const ctx = useGridRoot().grid;

    return (
      <RowsContainerReact
        {...props}
        ref={forwarded}
        height={ctx.state.heightTotal.useValue()}
        width={ctx.state.widthTotal.useValue()}
        viewportHeight={ctx.state.viewportHeightInner.useValue()}
        viewportWidth={ctx.state.viewportWidthInner.useValue()}
      />
    );
  }),
);
