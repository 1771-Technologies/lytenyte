import { forwardRef, useMemo, type JSX } from "react";
import { useGridRoot } from "../context";
import { fastDeepMemo } from "@1771technologies/lytenyte-react-hooks";

const HeaderImpl = forwardRef<HTMLDivElement, JSX.IntrinsicElements["div"]>(
  function Header(props, forwarded) {
    const grid = useGridRoot().grid;

    const width = grid.state.widthTotal.useValue();

    const rows = grid.internal.headerRows.useValue();
    const headerHeight = grid.state.headerHeight.useValue();
    const headerGroupHeight = grid.state.headerGroupHeight.useValue();

    const gridRowTemplate = useMemo(() => {
      const template = [];
      for (let i = 0; i < rows - 1; i++) template.push(`${headerGroupHeight}px`);
      template.push(`${headerHeight}px`);

      return template.join(" ");
    }, [headerGroupHeight, headerHeight, rows]);

    return (
      <div
        {...props}
        ref={forwarded}
        style={{
          ...props.style,
          width,
          boxSizing: "border-box",
          position: "sticky",
          top: 0,
          zIndex: 10,
          display: "grid",
          gridTemplateRows: gridRowTemplate,
        }}
      ></div>
    );
  },
);

export const Header = fastDeepMemo(HeaderImpl);
