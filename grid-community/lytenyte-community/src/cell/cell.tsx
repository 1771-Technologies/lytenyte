import "./cell.css";

import { clsx } from "@1771technologies/js-utils";
import { memo } from "react";
import type { ApiCommunityReact, ColumnCommunityReact } from "@1771technologies/grid-types";
import { useCellStyle } from "./use-cell-style";
import { useCellRenderer } from "./use-cell-renderer";
import type { RowNode, RowPin } from "@1771technologies/grid-types/community";
import { useCellEvents } from "./use-cell-events";
import { useCellPositionChange } from "./use-cell-position-change";

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
  readonly paginateOffset: number;
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
  paginateOffset,
}: CellProps) {
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
    paginateOffset,
  );

  const events = useCellEvents(api, column, rowNode, rowIndex, columnIndex);

  const isGroup = api.rowIsGroup(rowNode);
  const isExpanded = isGroup && api.rowGroupIsExpanded(rowNode);

  const { handleRef, onFocus } = useCellPositionChange(
    api,
    rowIndex,
    columnIndex,
    rowSpan,
    colSpan,
  );

  return (
    <div
      style={cx.style}
      ref={handleRef}
      role="gridcell"
      aria-expanded={isGroup ? isExpanded : undefined}
      aria-rowspan={rowSpan}
      aria-colspan={colSpan}
      aria-rowindex={rowIndex + 1}
      aria-colindex={columnIndex + 1}
      data-lng1771-colid={column.id}
      data-lng1771-rowid={rowNode.id}
      data-lng1771-rowindex={rowIndex}
      data-lng1771-colindex={rowIndex}
      className={clsx(
        "lng1771-cell",
        rowIndex % 2 === 1 && "lng1771-cell--alternate",
        cx.className,
      )}
      tabIndex={-1}
      {...events}
      onFocus={onFocus}
    >
      <Renderer api={api} column={column} columnIndex={columnIndex} row={rowNode} />
    </div>
  );
}

export const Cell = memo(CellImpl);
