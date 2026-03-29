import { forwardRef, Fragment, memo, useMemo, type JSX, type ReactNode } from "react";
import { RowChildrenDefault } from "../row-children-default.js";
import type { LayoutRow } from "@1771technologies/lytenyte-shared";
import { useRoot } from "../../../root/root-context.js";
import { RowsSection } from "./rows-section.js";
import { CellSelectionTop } from "../../range-selection/cell-selection-container.js";
import { useGridIdContext } from "../../../root/contexts/grid-id.js";
import { useRowView } from "../../../root/contexts/row-view.js";
import { useRowCountsContext } from "../../../root/contexts/grid-areas/row-counts-context.js";
import { useOffsetContext } from "../../../root/contexts/grid-areas/offset-context.js";

export const RowsTop = memo(
  forwardRef<HTMLDivElement, RowsTop.Props>(function RowsTop(
    { children = RowChildrenDefault, ...props },
    forwarded,
  ) {
    const id = useGridIdContext();
    const { totalHeaderHeight: top } = useRoot();
    const rowView = useRowView();

    const { topCount } = useRowCountsContext();
    const { topOffset, headerHeight } = useOffsetContext();

    const height = topOffset - headerHeight;

    const rows = useMemo(() => {
      const rows: ReactNode[] = [];

      for (let i = 0; i < rowView.top.length; i++) {
        rows.push(<Fragment key={rowView.top[i].id}>{children(rowView.top[i])}</Fragment>);
      }

      return rows;
    }, [children, rowView.top]);

    if (height <= 0) return null;

    return (
      <RowsSection
        {...props}
        ref={forwarded}
        rowFirst={topCount || -1}
        rowLast={topCount}
        role="rowgroup"
        data-ln-rows-top
        data-ln-gridid={id}
        style={{
          height,
          position: "sticky",
          top,
          zIndex: 4,
          minWidth: "100%",
          ...props.style,
        }}
      >
        <CellSelectionTop />
        {rows}
      </RowsSection>
    );
  }),
);

export namespace RowsTop {
  type Children = (c: LayoutRow) => ReactNode;

  export type Props = Omit<JSX.IntrinsicElements["div"], "children"> & { children?: Children };
}
