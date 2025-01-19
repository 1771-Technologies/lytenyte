import { clsx } from "@1771technologies/js-utils";
import { memo } from "react";
import { t } from "@1771technologies/grid-design";
import type { ApiCommunityReact, ColumnCommunityReact } from "@1771technologies/grid-types";
import { useCellStyle } from "./cell/use-cell-style";
import { useCellRenderer } from "./cell/use-cell-renderer";
import type { RowNode, RowPin } from "@1771technologies/grid-types/community";

export interface CellProps {
  readonly api: ApiCommunityReact<any>;
  readonly rowIndex: number;
  readonly columnIndex: number;
  readonly column: ColumnCommunityReact<any>;
  readonly rowSpan: number;
  readonly colSpan: number;
  readonly rowPin: RowPin;
  readonly rowNode: RowNode<any>;
  readonly xPositions: Uint32Array;
  readonly yPositions: Uint32Array;
}

function CellImpl({
  rowIndex,
  columnIndex,
  rowSpan,
  colSpan,
  yPositions,
  xPositions,
  column,
  rowNode,
  rowPin,
  api,
}: CellProps) {
  const row = rowIndex % 2 ? rowClx : rowAltClx;

  const Renderer = useCellRenderer(api, column);

  const cx = useCellStyle(
    api,
    xPositions,
    yPositions,
    columnIndex,
    rowIndex,
    colSpan,
    rowSpan,
    column,
    rowPin,
  );

  return (
    <div style={cx.style} className={clsx(rowBaseClx, row)}>
      <Renderer api={api} column={column} columnIndex={columnIndex} row={rowNode} />
    </div>
  );
}

export const Cell = memo(CellImpl);

const rowBaseClx = css`
  grid-row-start: 1;
  grid-row-end: 2;
  grid-column-start: 1;
  grid-column-end: 2;
  box-sizing: border-box;
  border-bottom: 1px solid ${t.colors.borders_row};
  overflow: hidden;
`;

const rowClx = css`
  background-color: ${t.colors.backgrounds_row};
`;
const rowAltClx = css`
  background-color: ${t.colors.backgrounds_row_alternate};
`;
