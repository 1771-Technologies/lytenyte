import { forwardRef, Fragment, memo, useMemo, type JSX, type ReactNode } from "react";
import { RowChildrenDefault } from "../row-children-default.js";
import type { LayoutRow } from "@1771technologies/lytenyte-shared";
import { RowsSection } from "./rows-section.js";
import { CellSelectionBottom } from "../../range-selection/cell-selection-container.js";
import { useGridIdContext } from "../../../root/contexts/grid-id.js";
import { useRowCountsContext } from "../../../root/contexts/grid-areas/row-counts-context.js";
import { useOffsetContext } from "../../../root/contexts/grid-areas/offset-context.js";
import { useRowViewContext } from "../../../root/contexts/row-layout/row-layout-context.js";

export const RowsBottom = memo(
  forwardRef<HTMLDivElement, RowsBottom.Props>(function RowsBottom(
    { children = RowChildrenDefault, ...props },
    forwarded,
  ) {
    const id = useGridIdContext();
    const rowView = useRowViewContext();

    const { topCount, centerCount, bottomCount } = useRowCountsContext();
    const { bottomOffset } = useOffsetContext();

    const rows = useMemo(() => {
      const rows: ReactNode[] = [];

      for (let i = 0; i < rowView.bottom.length; i++) {
        rows.push(<Fragment key={rowView.bottom[i].id}>{children(rowView.bottom[i])}</Fragment>);
      }

      return rows;
    }, [children, rowView.bottom]);

    if (bottomOffset <= 0) return null;

    return (
      <RowsSection
        {...props}
        ref={forwarded}
        rowFirst={centerCount + topCount}
        rowLast={centerCount + bottomCount + topCount}
        role="rowgroup"
        data-ln-rows-bottom
        data-ln-gridid={id}
        style={{
          ...props.style,

          height: bottomOffset,
          boxSizing: "border-box",
          position: "sticky",
          bottom: 0,
          zIndex: 3,
          minWidth: "100%",
        }}
      >
        <CellSelectionBottom />
        {rows}
      </RowsSection>
    );
  }),
);

export namespace RowsBottom {
  type Children = (c: LayoutRow) => ReactNode;

  export type Props = Omit<JSX.IntrinsicElements["div"], "children"> & { children?: Children };
}
