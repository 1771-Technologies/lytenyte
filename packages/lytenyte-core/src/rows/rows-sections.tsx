import { forwardRef, memo, type JSX } from "react";
import { useGridRoot } from "../context.js";
import { NativeScroller } from "./scrollers/native-scroller.js";

export const RowsTop = memo(
  forwardRef<HTMLDivElement, JSX.IntrinsicElements["div"]>(function RowsTop(props, forwarded) {
    const { grid, gridId } = useGridRoot();
    const view = grid.view.useValue().rows;

    const topCount = grid.state.rowDataStore.rowTopCount.useValue();
    const top = grid.internal.headerHeightTotal.useValue();
    const height = view.rowTopTotalHeight;

    if (height <= 0) return null;
    return (
      <RowsSection
        {...props}
        ref={forwarded}
        rowFirst={topCount || -1}
        rowLast={topCount}
        role="rowgroup"
        data-ln-rows-top
        data-ln-gridid={gridId}
        style={{
          height,
          position: "sticky",
          top,
          zIndex: 4,
          minWidth: "100%",
          ...props.style,
        }}
      />
    );
  }),
);

export const RowsCenter = memo(
  forwardRef<HTMLDivElement, JSX.IntrinsicElements["div"]>(function RowsCenter(
    { children, ...props },
    forwarded,
  ) {
    const { grid, gridId } = useGridRoot();
    const view = grid.view.useValue().rows;

    const rowCenterCount = grid.state.rowDataStore.rowCenterCount.useValue();
    const rowFirst = grid.state.rowDataStore.rowTopCount.useValue();
    const rowLast = rowCenterCount + grid.state.rowDataStore.rowTopCount.useValue();
    const height = view.rowCenterTotalHeight;
    const pinSectionHeights = view.rowBottomTotalHeight + view.rowTopTotalHeight;

    if (height <= 0) {
      return <div role="presentation" style={{ height: `calc(100% - ${pinSectionHeights}px - 4px)` }} />;
    }

    return (
      <RowsSection
        {...props}
        rowFirst={rowFirst}
        rowLast={rowLast}
        ref={forwarded}
        role="rowgroup"
        data-ln-rows-center
        data-ln-gridid={gridId}
        style={{
          height,
          minHeight: `calc(100% - ${pinSectionHeights}px - 4px)`,
          minWidth: "100%",
          position: "relative",
          ...props.style,
        }}
      >
        <NativeScroller>{children}</NativeScroller>
      </RowsSection>
    );
  }),
);

export const RowsBottom = memo(
  forwardRef<HTMLDivElement, JSX.IntrinsicElements["div"]>(function RowsBottom(props, forwarded) {
    const { grid, gridId } = useGridRoot();
    const view = grid.view.useValue().rows;

    const rowCenterCount = grid.state.rowDataStore.rowCenterCount.useValue();
    const rowTopCount = grid.state.rowDataStore.rowTopCount.useValue();
    const rowBottomCount = grid.state.rowDataStore.rowBottomCount.useValue();
    const height = view.rowBottomTotalHeight;

    if (height <= 0) return null;

    return (
      <RowsSection
        {...props}
        ref={forwarded}
        rowFirst={rowCenterCount + rowTopCount}
        rowLast={rowCenterCount + rowBottomCount + rowTopCount}
        role="rowgroup"
        data-ln-rows-bottom
        data-ln-gridid={gridId}
        style={{
          height,
          boxSizing: "border-box",
          position: "sticky",
          bottom: 0,
          zIndex: 3,
          minWidth: "100%",
          ...props.style,
        }}
      />
    );
  }),
);

interface RowSectionProps {
  readonly rowFirst: number;
  readonly rowLast: number;
}

const RowsSection = forwardRef<HTMLDivElement, JSX.IntrinsicElements["div"] & RowSectionProps>(
  function RowsSection({ rowFirst, rowLast, ...props }, forwarded) {
    return (
      <div
        {...props}
        ref={forwarded}
        role="rowgroup"
        data-ln-row-first={rowFirst}
        data-ln-row-last={rowLast}
      />
    );
  },
);
