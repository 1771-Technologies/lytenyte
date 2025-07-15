import { forwardRef, type JSX } from "react";
import { useRowStyle } from "./use-row-style";

interface RowProps {
  readonly rowIndex: number;
  readonly rowLastPinTop: boolean | undefined;
  readonly rowFirstPinBottom: boolean | undefined;
  readonly gridId: string;

  readonly yPositions: Uint32Array;
  readonly rowIsFocusRow: boolean;
}

export const RowReact = forwardRef<HTMLDivElement, JSX.IntrinsicElements["div"] & RowProps>(
  function Row(
    { gridId, rowFirstPinBottom, rowIndex, rowLastPinTop, yPositions, rowIsFocusRow, ...props },
    forwarded,
  ) {
    const styles = useRowStyle(yPositions, rowIndex, rowIsFocusRow, props.style, undefined);
    return (
      <div
        {...props}
        role="row"
        ref={forwarded}
        // Data Attributes
        data-ln-gridid={gridId}
        data-ln-rowindex={rowIndex}
        data-ln-rowtype="normal-row"
        data-ln-last-top-pin={rowLastPinTop}
        data-ln-first-bottom-pin={rowFirstPinBottom}
        data-ln-row
        style={styles}
      />
    );
  },
);
