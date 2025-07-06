import { forwardRef, type CSSProperties, type JSX } from "react";
import { fastDeepMemo } from "@1771technologies/lytenyte-react-hooks";
import { useGridRoot } from "../context";

export const RowsTop = fastDeepMemo(
  forwardRef<HTMLDivElement, JSX.IntrinsicElements["div"]>(function RowsTop(props, forwarded) {
    const cx = useGridRoot().grid;
    const view = cx.view.useValue().rows;
    const height = view.rowTopTotalHeight;

    const top = cx.internal.headerHeightTotal.useValue();
    const topCount = cx.state.rowDataStore.rowTopCount.useValue();

    if (height <= 0) return null;

    return (
      <div
        {...props}
        ref={forwarded}
        role="rowgroup"
        data-ln-rows-top
        data-ln-row-first={0}
        data-ln-row-last={topCount - 1}
        style={
          {
            ...props.style,

            height,
            position: "sticky",
            top,
            zIndex: 3,
            minWidth: "100%",
          } as CSSProperties
        }
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
    const height = view.rowCenterTotalHeight;

    const rowCenterCount = cx.state.rowDataStore.rowCenterCount.useValue();
    const rowTopCount = cx.state.rowDataStore.rowTopCount.useValue();
    const yPos = cx.state.yPositions.useValue();

    if (height <= 0) return <div style={{ flex: "1" }} role="presentation" />;

    const offset = yPos[view.rowFirstCenter] - view.rowTopTotalHeight;
    return (
      <div
        {...props}
        ref={forwarded}
        data-ln-rows-center
        data-ln-row-first={rowTopCount}
        data-ln-row-last={rowCenterCount + rowTopCount - 1}
        style={
          {
            ...props.style,
            height,
            minHeight: height,
            flex: 1,
            minWidth: "100%",
          } as CSSProperties
        }
      >
        <div role="rowgroup" style={{ transform: `translate3d(0px, ${offset}px, 0px)` }}>
          {children}
        </div>
      </div>
    );
  }),
);

export const RowsBottom = fastDeepMemo(
  forwardRef<HTMLDivElement, JSX.IntrinsicElements["div"]>(function RowsBottom(props, forwarded) {
    const cx = useGridRoot().grid;
    const view = cx.view.useValue().rows;
    const height = view.rowBottomTotalHeight;

    const rowCenterCount = cx.state.rowDataStore.rowCenterCount.useValue();
    const rowTopCount = cx.state.rowDataStore.rowTopCount.useValue();
    const rowBottomCount = cx.state.rowDataStore.rowBottomCount.useValue();

    if (height <= 0) return null;
    return (
      <div
        {...props}
        ref={forwarded}
        role="rowgroup"
        data-ln-rows-bottom
        data-ln-row-first={rowCenterCount + rowTopCount}
        data-ln-row-last={rowCenterCount + rowBottomCount + rowTopCount - 1}
        style={
          {
            ...props.style,

            height,
            position: "sticky",
            bottom: 0,
            zIndex: 3,
            minWidth: "100%",
          } as CSSProperties
        }
      ></div>
    );
  }),
);
