import { forwardRef, type JSX } from "react";
import {
  RowsTop as RowsTopCore,
  RowsBottom as RowsBottomCore,
  RowsCenter as RowsCenterCore,
  NativeScroller,
} from "@1771technologies/lytenyte-core/yinternal";
import {
  CellSelectionBottom,
  CellSelectionCenter,
  CellSelectionTop,
} from "../cell-selection/cell-selection-containers.js";

export const RowsTop = forwardRef<HTMLDivElement, JSX.IntrinsicElements["div"]>(
  function RowsTop(props, forwarded) {
    return (
      <RowsTopCore {...props} ref={forwarded}>
        {props.children}
        <CellSelectionTop />
      </RowsTopCore>
    );
  },
);

export const RowsCenter = forwardRef<HTMLDivElement, JSX.IntrinsicElements["div"]>(
  function RowsCenter({ children, ...props }, forwarded) {
    return (
      <RowsCenterCore {...props} ref={forwarded}>
        <NativeScroller>
          <CellSelectionCenter />
          {children}
        </NativeScroller>
      </RowsCenterCore>
    );
  },
);

export const RowsBottom = forwardRef<HTMLDivElement, JSX.IntrinsicElements["div"]>(
  function RowsBottom(props, forwarded) {
    return (
      <RowsBottomCore {...props} ref={forwarded}>
        <CellSelectionBottom />
        {props.children}
      </RowsBottomCore>
    );
  },
);
