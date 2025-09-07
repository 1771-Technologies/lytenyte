import { forwardRef, type JSX } from "react";
import { fastDeepMemo } from "@1771technologies/lytenyte-react-hooks";
import { useGridRoot } from "../context.js";
import { NativeScroller } from "./scrollers/native-scroller.js";
import { RowsBottomReact, RowsCenterReact, RowsTopReact } from "@1771technologies/lytenyte-shared";
import {
  CellSelectionBottom,
  CellSelectionCenter,
  CellSelectionTop,
} from "../cell-selection/cell-selection-containers.js";

export const RowsTop = fastDeepMemo(
  forwardRef<HTMLDivElement, JSX.IntrinsicElements["div"]>(function RowsTop(props, forwarded) {
    const cx = useGridRoot().grid;
    const view = cx.view.useValue().rows;

    const topCount = cx.state.rowDataStore.rowTopCount.useValue();
    return (
      <RowsTopReact
        {...props}
        rowFirst={topCount || -1}
        rowLast={topCount}
        ref={forwarded}
        top={cx.internal.headerHeightTotal.useValue()}
        height={view.rowTopTotalHeight}
      >
        {props.children}
        <CellSelectionTop />
      </RowsTopReact>
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

    return (
      <RowsCenterReact
        {...props}
        ref={forwarded}
        rowFirst={cx.state.rowDataStore.rowTopCount.useValue()}
        rowLast={rowCenterCount + cx.state.rowDataStore.rowTopCount.useValue()}
        height={view.rowCenterTotalHeight}
        pinSectionHeights={view.rowBottomTotalHeight + view.rowTopTotalHeight}
      >
        <NativeScroller>
          <CellSelectionCenter />
          {children}
        </NativeScroller>
      </RowsCenterReact>
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

    return (
      <RowsBottomReact
        {...props}
        ref={forwarded}
        rowFirst={rowCenterCount + rowTopCount}
        rowLast={rowCenterCount + rowBottomCount + rowTopCount}
        height={view.rowBottomTotalHeight}
      >
        <CellSelectionBottom />
        {props.children}
      </RowsBottomReact>
    );
  }),
);
