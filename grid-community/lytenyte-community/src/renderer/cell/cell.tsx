import { clsx } from "@1771technologies/js-utils";
import { memo } from "react";
import type { ApiCommunityReact, ColumnCommunityReact } from "@1771technologies/grid-types";
import { useCellStyle } from "./use-cell-style";
import { useCellRenderer } from "./use-cell-renderer";
import type { RowNode, RowPin } from "@1771technologies/grid-types/community";
import { rowAltClx, rowBaseClx, rowClx } from "./cell-classes";

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
  readonly isFirstCell: boolean;
  readonly isLastCell: boolean;
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
    rowNode.id,
  );

  return (
    <div style={cx.style} className={clsx(rowBaseClx, row, cx.className)}>
      <Renderer api={api} column={column} columnIndex={columnIndex} row={rowNode} />
    </div>
  );
}

export const Cell = memo(CellImpl);
