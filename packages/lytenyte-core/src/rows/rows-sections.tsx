import { forwardRef, type JSX } from "react";
import { fastDeepMemo } from "@1771technologies/lytenyte-react-hooks";
import { useGridRoot } from "../context.js";
import { NativeScroller } from "./scrollers/native-scroller.js";

export const RowsTop = fastDeepMemo(
  forwardRef<HTMLDivElement, JSX.IntrinsicElements["div"]>(function RowsTop(props, forwarded) {
    const cx = useGridRoot().grid;
    const view = cx.view.useValue().rows;

    const topCount = cx.state.rowDataStore.rowTopCount.useValue();
    const top = cx.internal.headerHeightTotal.useValue();
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
        style={{
          ...props.style,
          height,
          position: "sticky",
          top,
          zIndex: 4,
          minWidth: "100%",
        }}
      />
    );
  }),
);

export const RowsCenter = fastDeepMemo(
  forwardRef<HTMLDivElement, JSX.IntrinsicElements["div"]>(function RowsCenter(
    { children, ...props },
    forwarded,
  ) {
    const cx = useGridRoot().grid;
    const view = cx.view.useValue().rows;

    const rowCenterCount = cx.state.rowDataStore.rowCenterCount.useValue();
    const rowFirst = cx.state.rowDataStore.rowTopCount.useValue();
    const rowLast = rowCenterCount + cx.state.rowDataStore.rowTopCount.useValue();
    const height = view.rowCenterTotalHeight;
    const pinSectionHeights = view.rowBottomTotalHeight + view.rowTopTotalHeight;

    if (height <= 0) {
      return (
        <div role="presentation" style={{ height: `calc(100% - ${pinSectionHeights}px - 4px)` }} />
      );
    }

    return (
      <RowsSection
        {...props}
        rowFirst={rowFirst}
        rowLast={rowLast}
        ref={forwarded}
        role="rowgroup"
        data-ln-rows-center
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

export const RowsBottom = fastDeepMemo(
  forwardRef<HTMLDivElement, JSX.IntrinsicElements["div"]>(function RowsBottom(props, forwarded) {
    const cx = useGridRoot().grid;
    const view = cx.view.useValue().rows;

    const rowCenterCount = cx.state.rowDataStore.rowCenterCount.useValue();
    const rowTopCount = cx.state.rowDataStore.rowTopCount.useValue();
    const rowBottomCount = cx.state.rowDataStore.rowBottomCount.useValue();
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
