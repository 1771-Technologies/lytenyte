import "./cell.css";

import { clsx } from "@1771technologies/js-utils";
import { memo } from "react";
import { useCellStyle } from "./use-cell-style";
import { useCellRenderer } from "./use-cell-renderer";
import { useCellEvents } from "./use-cell-events";
import { useCellPositionChange } from "./use-cell-position-change";
import type { ApiCoreReact, ColumnCoreReact } from "@1771technologies/grid-types/core-react";
import type { RowNodeCore, RowPinCore } from "@1771technologies/grid-types/core";
import Skeleton from "./skeleton-cell";
import { ErrorCellRenderer } from "./error-cell-renderer";
import { COLUMN_MARKER_ID } from "@1771technologies/grid-constants";

export interface CellProps {
  readonly api: ApiCoreReact<any>;
  readonly rowIndex: number;
  readonly columnIndex: number;
  readonly column: ColumnCoreReact<any>;
  readonly rowSpan: number;
  readonly colSpan: number;
  readonly rowPin: RowPinCore;
  readonly rowNode: RowNodeCore<any>;
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

  const isLoading = rowNode.loading && rowNode.data == null;
  const isError = rowNode.error && rowNode.data === null;

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
      {!isLoading && !isError && (
        <Renderer api={api} column={column} columnIndex={columnIndex} row={rowNode} />
      )}
      {isLoading && <Skeleton />}
      {isError &&
        ((columnIndex === 0 && column.id !== COLUMN_MARKER_ID) ||
          (api.getState().columnsVisible.peek()?.[0].id === COLUMN_MARKER_ID &&
            columnIndex === 1)) && <ErrorCellRenderer api={api as any} />}
    </div>
  );
}

export const Cell = memo(CellImpl);
