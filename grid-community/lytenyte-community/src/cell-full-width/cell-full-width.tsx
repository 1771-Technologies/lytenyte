import "./cell-full-width.css";

import type { ApiCommunityReact } from "@1771technologies/grid-types";
import type { RowNode, RowPin } from "@1771technologies/grid-types/community";
import { memo, useMemo } from "react";
import { clsx, sizeFromCoord } from "@1771technologies/js-utils";
import { useCellFullWidthFocus } from "./use-cell-full-width-focus";
import { useFullWidthEvents } from "./use-full-width-events";
import { getTransform } from "../get-transform";

export interface CellFullWidthProps {
  readonly api: ApiCommunityReact<any>;
  readonly rowPin: RowPin;
  readonly row: RowNode<any>;
  readonly rowIndex: number;
  readonly yPositions: Uint32Array;
  readonly paginateOffset: number;
  readonly colCount: number;
}

function CellFullWidthImpl({
  row,
  rowIndex,
  rowPin,
  colCount,
  yPositions,
  api,
  paginateOffset,
}: CellFullWidthProps) {
  const sx = api.getState();
  const width = sx.internal.viewportInnerWidth.use();

  const cx = useMemo(() => {
    const isTop = rowPin === "top";
    const isBot = rowPin === "bottom";

    const height = sizeFromCoord(rowIndex, yPositions);
    const rowCount = sx.internal.rowCount.peek();
    const rowTopCount = sx.internal.rowTopCount.peek();
    const rowBotCount = sx.internal.rowBottomCount.peek();

    const firstBotIndex = rowCount - rowBotCount;

    const y = isBot
      ? yPositions[rowIndex] - yPositions[firstBotIndex]
      : isTop
        ? yPositions[rowIndex]
        : yPositions[rowIndex] - yPositions[rowTopCount] - paginateOffset;

    const transform = getTransform(0, y);

    return { style: { transform, height } };
  }, [
    paginateOffset,
    rowIndex,
    rowPin,
    sx.internal.rowBottomCount,
    sx.internal.rowCount,
    sx.internal.rowTopCount,
    yPositions,
  ]);

  const Renderer = sx.rowFullWidthRenderer.use() ?? DefaultRenderer;

  const selected = sx.rowSelectionSelectedIds.use();
  const isSelected = selected.has(row.id);

  const { handleRef, onFocus } = useCellFullWidthFocus(api, rowIndex);
  const events = useFullWidthEvents(api, row);

  return (
    <div
      role="gridcell"
      ref={handleRef}
      aria-colindex={1}
      aria-colspan={colCount}
      aria-rowindex={rowIndex + 1}
      aria-rowspan={1}
      tabIndex={-1}
      style={{ width, ...cx.style }}
      {...events}
      onFocus={onFocus}
      className={clsx(
        "lng1771-cell__full-width",
        rowIndex % 2 === 1 && "lng1771-cell__full-width--alternate",
        isSelected && "lng1771-cell__full-width--selected",
      )}
    >
      <Renderer api={api} row={row} />
    </div>
  );
}
export const CellFullWidth = memo(CellFullWidthImpl);

function DefaultRenderer() {
  return <div>Not Implemented</div>;
}
