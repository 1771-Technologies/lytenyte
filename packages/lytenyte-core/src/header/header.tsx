import { forwardRef, type JSX } from "react";
import { useGridRoot } from "../context.js";
import { fastDeepMemo } from "@1771technologies/lytenyte-react-hooks";
import { HeaderReact } from "@1771technologies/lytenyte-shared";

const HeaderImpl = forwardRef<HTMLDivElement, JSX.IntrinsicElements["div"]>(
  function Header(props, forwarded) {
    const grid = useGridRoot().grid;

    const xPositions = grid.state.xPositions.useValue();
    const columnVisible = grid.state.columnMeta.useValue();

    return (
      <HeaderReact
        {...props}
        ref={forwarded}
        floatingRowEnabled={grid.state.floatingRowEnabled.useValue()}
        floatingRowHeight={grid.state.floatingRowHeight.useValue()}
        headerGroupHeight={grid.state.headerGroupHeight.useValue()}
        headerHeight={grid.state.headerHeight.useValue()}
        rows={grid.internal.headerRows.useValue()}
        xPositions={xPositions}
        countBeforeEnd={
          columnVisible.columnVisibleCenterCount + columnVisible.columnVisibleStartCount
        }
        width={grid.state.widthTotal.useValue()}
      />
    );
  },
);

export const Header = fastDeepMemo(HeaderImpl);
