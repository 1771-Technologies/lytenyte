import { forwardRef, Fragment, memo, useMemo, type JSX, type ReactNode } from "react";
import { RowChildrenDefault } from "../row-children-default.js";
import { RowsSection } from "./rows-section.js";
import type { LayoutRow } from "@1771technologies/lytenyte-shared";
import { CellSelectionCenter } from "../../range-selection/cell-selection-container.js";
import { useGridIdContext } from "../../../root/contexts/grid-id.js";
import { useFocusNonReactive } from "../../../root/contexts/focus-position.js";
import { useRowCountsContext } from "../../../root/contexts/grid-areas/row-counts-context.js";
import { useOffsetContext } from "../../../root/contexts/grid-areas/offset-context.js";
import {
  useRowLayoutContext,
  useRowViewContext,
} from "../../../root/contexts/row-layout/row-layout-context.js";
import { useYCoordinates } from "../../../root/contexts/coordinates.js";
import { SyncScroller } from "../scrollers/sync-scroller.js";
import { useSuppressScrollFlashContext } from "../../../root/contexts/viewport/viewport-context.js";
import { NativeScroller } from "../scrollers/native-scroller.js";
import { useAnimationLayouts } from "../rows-container/animation-layout-provider.js";

export const RowsCenter = memo(
  forwardRef<HTMLDivElement, RowsCenter.Props>(function RowsCenter(
    { children = RowChildrenDefault, ...props },
    forwarded,
  ) {
    const id = useGridIdContext();
    const focus = useFocusNonReactive().get();

    const rowView = useRowViewContext();
    const rowLayout = useRowLayoutContext();

    const yPositions = useYCoordinates();

    const { topCount, centerCount } = useRowCountsContext();
    const { topOffset, bottomOffset, headerHeight } = useOffsetContext();

    const topHeight = topOffset - headerHeight;
    const pinSectionHeights = topHeight + bottomOffset;
    const centerHeight = yPositions.at(-1)! - bottomOffset - topHeight;

    const { additionalLayouts } = useAnimationLayouts();

    const layoutRows = useMemo(() => {
      if (focus?.kind !== "cell" && focus?.kind !== "full-width")
        return [...rowView.center, ...additionalLayouts];

      const layout = rowLayout.layoutByIndex(focus.rowIndex);
      if (layout?.rowPin || !layout) return rowView.center;

      const additional = additionalLayouts.filter((x) => x.id !== layout.id);

      if (layout.rowIndex < rowView.center[0].rowIndex) return [layout, ...rowView.center, ...additional];
      else if (layout.rowIndex > rowView.center.at(-1)!.rowIndex)
        return [...rowView.center, layout, ...additional];

      return [...rowView.center, ...additional];
    }, [focus, rowLayout, rowView.center, additionalLayouts]);

    const rows = useMemo(() => {
      const rows: ReactNode[] = [];

      for (let i = 0; i < layoutRows.length; i++) {
        rows.push(<Fragment key={layoutRows[i].id}>{children(layoutRows[i])}</Fragment>);
      }

      return rows;
    }, [children, layoutRows]);

    const suppressWhitespace = useSuppressScrollFlashContext();

    const Scroller = suppressWhitespace ? SyncScroller : NativeScroller;

    if (centerHeight <= 0) {
      return <div role="presentation" style={{ height: `calc(100% - ${pinSectionHeights}px - 0px)` }} />;
    }
    return (
      <RowsSection
        {...props}
        rowFirst={topCount}
        rowLast={centerCount + topCount}
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
        <Scroller>
          <CellSelectionCenter />
          {rows}
        </Scroller>
      </RowsSection>
    );
  }),
);

export namespace RowsCenter {
  type Children = (c: LayoutRow) => ReactNode;

  export type Props = Omit<JSX.IntrinsicElements["div"], "children"> & { children?: Children };
}
