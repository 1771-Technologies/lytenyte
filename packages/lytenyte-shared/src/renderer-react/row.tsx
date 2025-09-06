import { forwardRef, type JSX } from "react";
import { DropWrap, type DropWrapProps } from "@1771technologies/lytenyte-dragon";
import { useRowStyle } from "./use-row-style.js";
import type { RowPin } from "../+types.js";

interface RowProps extends DropWrapProps {
  readonly rowIndex: number;
  readonly rowPin: RowPin;
  readonly topOffset: number;
  readonly rowLastPinTop: boolean | undefined;
  readonly rowFirstPinBottom: boolean | undefined;
  readonly gridId: string;

  readonly yPositions: Uint32Array;
  readonly rowIsFocusRow: boolean;
  readonly hasSpans: boolean;
}

export const RowReact = forwardRef<
  HTMLDivElement,
  Omit<JSX.IntrinsicElements["div"], "onDrop"> & RowProps
>(function Row(
  {
    gridId,
    rowFirstPinBottom,
    rowIndex,
    rowPin,
    topOffset,
    rowLastPinTop,
    yPositions,
    rowIsFocusRow,
    hasSpans,
    ...props
  },
  forwarded,
) {
  const styles = useRowStyle(
    yPositions,
    rowIndex,
    rowPin,
    topOffset,
    rowIsFocusRow,
    hasSpans,
    props.style,
    undefined,
  );

  return (
    <DropWrap
      {...props}
      role="row"
      ref={forwarded}
      // Data Attributes
      data-ln-gridid={gridId}
      data-ln-rowindex={rowIndex}
      data-ln-rowtype="normal-row"
      data-ln-last-top-pin={rowLastPinTop}
      data-ln-first-bottom-pin={rowFirstPinBottom}
      data-ln-alternate={rowIndex % 2 === 1}
      data-ln-row
      style={styles}
    />
  );
});
