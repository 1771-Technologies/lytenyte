import type { ApiCommunityReact } from "@1771technologies/grid-types";
import type { RowNode, RowPin } from "@1771technologies/grid-types/community";
import { memo, useMemo } from "react";
import { getTransform } from "./get-transform";
import { clsx, sizeFromCoord } from "@1771technologies/js-utils";
import { t } from "@1771technologies/grid-design";
import { cellSelected } from "./cell/cell-classes";

export interface CellFullWidthProps {
  readonly api: ApiCommunityReact<any>;
  readonly rowPin: RowPin;
  readonly row: RowNode<any>;
  readonly rowIndex: number;
  readonly yPositions: Uint32Array;
}

function CellFullWidthImpl({ row, rowIndex, rowPin, yPositions, api }: CellFullWidthProps) {
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
        : yPositions[rowIndex] - yPositions[rowTopCount];

    const transform = getTransform(0, y);

    return { style: { transform, height } };
  }, [
    rowIndex,
    rowPin,
    sx.internal.rowBottomCount,
    sx.internal.rowCount,
    sx.internal.rowTopCount,
    yPositions,
  ]);

  const rowClx =
    rowIndex % 2 === 1
      ? css`
          background-color: ${t.colors.backgrounds_row};
        `
      : css`
          background-color: ${t.colors.backgrounds_row_alternate};
        `;

  const Renderer = sx.rowFullWidthRenderer.use() ?? DefaultRenderer;

  const selected = sx.rowSelectionSelectedIds.use();
  const isSelected = selected.has(row.id);

  return (
    <div
      data-lng1771-is-first-cell
      data-lng1771-is-last-cell
      style={{ width, ...cx.style }}
      className={clsx(
        rowClx,
        css`
          position: sticky;
          inset-inline-start: 0px;
          grid-column-start: 1;
          grid-column-end: 2;
          grid-row-start: 1;
          grid-row-end: 2;
          border-bottom: 1px solid ${t.colors.borders_row};
          box-sizing: border-box;
        `,
        isSelected && cellSelected,
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
