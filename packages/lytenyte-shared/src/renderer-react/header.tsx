import { forwardRef, type JSX } from "react";
import { useGridRowTemplate } from "./use-grid-row-template";

interface HeaderProps {
  readonly width: number;
  readonly headerHeight: number;
  readonly headerGroupHeight: number;
  readonly floatingRowHeight: number;
  readonly floatingRowEnabled: boolean;
  readonly rows: number;
}

export const HeaderReact = forwardRef<HTMLDivElement, JSX.IntrinsicElements["div"] & HeaderProps>(
  function Header(
    {
      width,
      headerGroupHeight,
      headerHeight,
      rows,
      floatingRowEnabled,
      floatingRowHeight,
      ...props
    },
    forwarded,
  ) {
    const gridRowTemplate = useGridRowTemplate(
      rows,
      headerGroupHeight,
      headerHeight,
      floatingRowHeight,
      floatingRowEnabled,
    );

    return (
      <div
        {...props}
        ref={forwarded}
        role="rowgroup"
        data-ln-header
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
