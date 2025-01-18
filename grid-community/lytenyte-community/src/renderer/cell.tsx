import { memo } from "react";

export interface CellProps {
  readonly rowIndex: number;
  readonly columnIndex: number;
  readonly rowSpan: number;
  readonly colSpan: number;
}

function CellImpl({ rowIndex, columnIndex, rowSpan, colSpan }: CellProps) {
  return (
    <div
      className={css`
        grid-row-start: 1;
        grid-row-end: 2;
        grid-column-start: 1;
        grid-column-end: 2;
      `}
    >
      {rowIndex},{columnIndex}
    </div>
  );
}

export const Cell = memo(CellImpl);
