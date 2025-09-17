import { forwardRef, useMemo, type JSX } from "react";
import { useGridRowTemplate } from "./use-grid-row-template.js";
import { sizeFromCoord } from "../utils/size-from-coord.js";

interface HeaderProps {
  readonly width: number;
  readonly headerHeight: number;
  readonly headerGroupHeight: number;
  readonly floatingRowHeight: number;
  readonly floatingRowEnabled: boolean;
  readonly countBeforeEnd: number;
  readonly xPositions: Uint32Array;
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
      xPositions,
      countBeforeEnd,
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
