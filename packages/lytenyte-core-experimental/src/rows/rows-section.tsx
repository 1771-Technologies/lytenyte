import { forwardRef, memo, type JSX } from "react";
import { NativeScroller } from "./scrollers/native-scroller.js";
import { useGridRoot } from "../root/context.js";
import { useRowSource } from "../root/row-source/context.js";
import { useRowLayout } from "../root/layout-rows/row-layout-context.js";

export const RowsTop = memo(
  forwardRef<HTMLDivElement, JSX.IntrinsicElements["div"]>(function RowsTop(props, forwarded) {
    const { id, headerHeightTotal, yPositions } = useGridRoot();
    const source = useRowSource();

    const topCount = source.useTopCount();
    const top = headerHeightTotal;
    const height = yPositions.at(topCount)!;

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
      />
    );
  }),
);

export const RowsCenter = memo(
  forwardRef<HTMLDivElement, JSX.IntrinsicElements["div"]>(function RowsCenter(
    { children, ...props },
    forwarded,
  ) {
    const { id, yPositions } = useGridRoot();
    const source = useRowSource();

    const rowTopCount = source.useTopCount();
    const rowBottomCount = source.useBottomCount();
    const rowCount = source.useRowCount();
    const rowCenterCount = rowCount - rowTopCount - rowBottomCount;

    const rowBottomTotalHeight = yPositions.at(-1)! - yPositions.at(-1 - rowBottomCount)!;
    const rowTopTotalHeight = yPositions.at(rowTopCount)!;
    const height = yPositions.at(-1)! - rowBottomTotalHeight - rowTopTotalHeight;

    const pinSectionHeights = rowBottomTotalHeight + rowTopTotalHeight;

    // TODO continue from here. We want to provide function children to the row sections.
    const l = useRowLayout();
    console.log(l);

    if (height <= 0) {
      return (
        <div role="presentation" style={{ height: `calc(100% - ${pinSectionHeights}px - 4px)` }} />
      );
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
          height,
          minHeight: `calc(100% - ${pinSectionHeights}px - 4px)`,
          minWidth: "100%",
          position: "relative",
        }}
      >
        <NativeScroller>{children}</NativeScroller>
      </RowsSection>
    );
  }),
);

export const RowsBottom = memo(
  forwardRef<HTMLDivElement, JSX.IntrinsicElements["div"]>(function RowsBottom(props, forwarded) {
    const { id, yPositions } = useGridRoot();
    const source = useRowSource();

    const rowTopCount = source.useTopCount();
    const rowBottomCount = source.useBottomCount();
    const rowCount = source.useRowCount();
    const rowCenterCount = rowCount - rowTopCount - rowBottomCount;
    const height = yPositions.at(-1)! - yPositions.at(-1 - rowBottomCount)!;

    if (height <= 0) return null;

    return (
      <RowsSection
        {...props}
        ref={forwarded}
        rowFirst={rowCenterCount + rowTopCount}
        rowLast={rowCenterCount + rowBottomCount + rowTopCount}
        role="rowgroup"
        data-ln-rows-bottom
        data-ln-gridid={id}
        style={{
          ...props.style,

          height,
          boxSizing: "border-box",
          position: "sticky",
          bottom: 0,
          zIndex: 3,
          minWidth: "100%",
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
