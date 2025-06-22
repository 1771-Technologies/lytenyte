import { forwardRef, useMemo, type CSSProperties, type JSX } from "react";
import { fastDeepMemo } from "@1771technologies/lytenyte-react-hooks";
import type { RowNormalRowLayout } from "../../+types";
import { useGridRoot } from "../context";
import { SCROLL_WIDTH_VARIABLE_USE, VIEWPORT_WIDTH_VARIABLE_USE } from "../+constants";
import { getTranslate } from "@1771technologies/lytenyte-shared";

export interface RowProps {
  readonly row: RowNormalRowLayout;
}

const RowImpl = forwardRef<HTMLDivElement, JSX.IntrinsicElements["div"] & RowProps>(function Rows(
  { row, ...props },
  forwarded,
) {
  const cx = useGridRoot().grid;

  const yPositions = cx.state.yPositions.useValue();
  const height = yPositions[row.rowIndex + 1] - yPositions[row.rowIndex];

  const styles = useMemo(() => {
    const styles: CSSProperties = {
      boxSizing: "border-box",
      height,
      width: SCROLL_WIDTH_VARIABLE_USE,
      minWidth: VIEWPORT_WIDTH_VARIABLE_USE,
      display: "grid",
      gridTemplateColumns: "0px",
      gridTemplateRows: "0px",
    };

    if (!row.rowPin) {
      Object.assign(styles, {
        gridColumnStart: "1",
        gridColumnEnd: "2",
        gridRowStart: "1",
        gridRowEnd: "2",
        transform: getTranslate(0, yPositions[row.rowIndex]),
      });
    }

    return { ...props.style, ...styles };
  }, [height, props.style, row.rowIndex, row.rowPin, yPositions]);

  return <div {...props} ref={forwarded} style={styles} />;
});

export const Row = fastDeepMemo(RowImpl);
