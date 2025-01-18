import { clsx, sizeFromCoord } from "@1771technologies/js-utils";
import { memo } from "react";
import { getTransform } from "./get-transform";
import { t } from "@1771technologies/grid-design";

export interface CellProps {
  readonly rowIndex: number;
  readonly columnIndex: number;
  readonly rowSpan: number;
  readonly colSpan: number;
  readonly xPositions: Uint32Array;
  readonly yPositions: Uint32Array;
}

function CellImpl({ rowIndex, columnIndex, rowSpan, colSpan, yPositions, xPositions }: CellProps) {
  const height = sizeFromCoord(rowIndex, yPositions, rowSpan);
  const width = sizeFromCoord(columnIndex, xPositions, colSpan);

  const transform = getTransform(xPositions[columnIndex], yPositions[rowIndex]);

  const row =
    rowIndex % 2
      ? css`
          background-color: ${t.colors.backgrounds_row};
        `
      : css`
          background-color: ${t.colors.backgrounds_row_alternate};
        `;
  return (
    <div
      style={{ height, width, transform }}
      className={clsx(
        css`
          grid-row-start: 1;
          grid-row-end: 2;
          grid-column-start: 1;
          grid-column-end: 2;
          box-sizing: border-box;
          border-bottom: 1px solid ${t.colors.borders_row};
          overflow: hidden;
        `,
        row,
      )}
    >
      {rowIndex},{columnIndex}
    </div>
  );
}

export const Cell = memo(CellImpl);
