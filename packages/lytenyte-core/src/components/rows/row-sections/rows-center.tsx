import { forwardRef, Fragment, memo, useMemo, type JSX, type ReactNode } from "react";
import { NativeScroller } from "../scrollers/native-scroller.js";
import { RowChildrenDefault } from "../row-children-default.js";
import { RowsSection } from "./rows-section.js";
import type { LayoutRow } from "@1771technologies/lytenyte-shared";
import { CellSelectionCenter } from "../../range-selection/cell-selection-container.js";
import { useGridId } from "../../../root/contexts/grid-id.js";
import { useFocusNonReactive } from "../../../root/contexts/focus-position.js";
import { useRowLayout, useRowView } from "../../../root/contexts/row-view.js";
import { useGridSections } from "../../../root/contexts/grid-sections-context.js";
import { useRoot } from "../../../internal.js";

export const RowsCenter = memo(
  forwardRef<HTMLDivElement, RowsCenter.Props>(function RowsCenter(
    { children = RowChildrenDefault, ...props },
    forwarded,
  ) {
    const id = useGridId();
    const rowView = useRowView();
    const focus = useFocusNonReactive().get();
    const rowLayout = useRowLayout();

    const { yPositions } = useRoot();

    const {
      topCount: rowTopCount,
      centerCount: rowCenterCount,
      topOffset,
      bottomOffset,
      headerHeight,
    } = useGridSections();

    const topHeight = topOffset - headerHeight;
    const pinSectionHeights = topHeight + bottomOffset;
    const centerHeight = yPositions.at(-1)! - bottomOffset - topHeight;

    const layoutRows = useMemo(() => {
      if (focus?.kind !== "cell" && focus?.kind !== "full-width") return rowView.center;

      const layout = rowLayout.layoutByIndex(focus.rowIndex);
      if (layout?.rowPin || !layout) return rowView.center;

      if (layout.rowIndex < rowView.center[0].rowIndex) return [layout, ...rowView.center];
      else if (layout.rowIndex > rowView.center.at(-1)!.rowIndex) return [...rowView.center, layout];

      return rowView.center;
    }, [focus, rowLayout, rowView.center]);

    const rows = useMemo(() => {
      const rows: ReactNode[] = [];

      for (let i = 0; i < layoutRows.length; i++) {
        rows.push(<Fragment key={layoutRows[i].id}>{children(layoutRows[i])}</Fragment>);
      }

      return rows;
    }, [children, layoutRows]);

    if (centerHeight <= 0) {
      return <div role="presentation" style={{ height: `calc(100% - ${pinSectionHeights}px - 0px)` }} />;
    }
    return (
      <RowsSection
        {...props}
        rowFirst={rowTopCount}
        rowLast={rowCenterCount + rowTopCount}
        ref={forwarded}
        role="rowgroup"
        data-ln-rows-center
        data-ln-gridid={id}
        style={{
          ...props.style,
          height: centerHeight,
          minHeight: `calc(100% - ${pinSectionHeights}px - 0px)`,
          minWidth: "100%",
          position: "relative",
        }}
      >
        <NativeScroller>
          <CellSelectionCenter />
          {rows}
        </NativeScroller>
      </RowsSection>
    );
  }),
);

export namespace RowsCenter {
  type Children = (c: LayoutRow) => ReactNode;

  export type Props = Omit<JSX.IntrinsicElements["div"], "children"> & { children?: Children };
}
