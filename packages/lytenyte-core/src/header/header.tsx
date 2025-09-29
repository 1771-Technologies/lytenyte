import { forwardRef, useMemo, type JSX } from "react";
import { useGridRoot } from "../context.js";
import { fastDeepMemo } from "@1771technologies/lytenyte-react-hooks";
import { sizeFromCoord } from "@1771technologies/lytenyte-shared";
import { useGridRowTemplate } from "./use-grid-row-template.js";

const HeaderImpl = forwardRef<HTMLDivElement, JSX.IntrinsicElements["div"]>(
  function Header(props, forwarded) {
    const grid = useGridRoot().grid;

    const xPositions = grid.state.xPositions.useValue();

    const columnVisible = grid.state.columnMeta.useValue();

    const floatingRowEnabled = grid.state.floatingRowEnabled.useValue();
    const floatingRowHeight = grid.state.floatingRowHeight.useValue();
    const headerGroupHeight = grid.state.headerGroupHeight.useValue();
    const headerHeight = grid.state.headerHeight.useValue();
    const rows = grid.internal.headerRows.useValue();

    const gridRowTemplate = useGridRowTemplate(
      rows,
      headerGroupHeight,
      headerHeight,
      floatingRowHeight,
      floatingRowEnabled,
    );

    const countBeforeEnd =
      columnVisible.columnVisibleCenterCount + columnVisible.columnVisibleStartCount;
    const width = grid.state.widthTotal.useValue();
    const gridTemplateColumns = useMemo(() => {
      const items: string[] = [];
      for (let i = 0; i < countBeforeEnd; i++) {
        items.push(`${sizeFromCoord(i, xPositions)}px`);
      }

      items.push("1fr");

      const endCount = xPositions.length - countBeforeEnd - 1;
      for (let i = 0; i < endCount; i++) {
        items.push(`${sizeFromCoord(i + countBeforeEnd, xPositions)}px`);
      }

      return items.join(" ");
    }, [countBeforeEnd, xPositions]);

    return (
      <div
        {...props}
        ref={forwarded}
        role="rowgroup"
        data-ln-header
        style={{
          ...props.style,
          width,
          minWidth: "100%",
          boxSizing: "border-box",
          position: "sticky",
          top: 0,
          zIndex: 10,
          display: "grid",
          gridTemplateRows: gridRowTemplate,
          gridTemplateColumns: gridTemplateColumns,
        }}
      ></div>
    );
  },
);

export const Header = fastDeepMemo(HeaderImpl);
