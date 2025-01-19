import { clsx } from "@1771technologies/js-utils";
import { memo } from "react";
import { t } from "@1771technologies/grid-design";
import type { ApiCommunityReact, ColumnCommunityReact } from "@1771technologies/grid-types";
import { useCellStyle } from "./cell/use-cell-style";
import { useCellRenderer } from "./cell/use-cell-renderer";

export interface CellProps {
  readonly api: ApiCommunityReact<any>;
  readonly rowIndex: number;
  readonly columnIndex: number;
  readonly column: ColumnCommunityReact<any>;
  readonly rowSpan: number;
  readonly colSpan: number;
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
  api,
}: CellProps) {
  const sx = api.getState();

  const row = rowIndex % 2 ? rowClx : rowAltClx;

  const Renderer = useCellRenderer(api, column);

  const viewportWidth = sx.internal.viewportInnerWidth.use();
  const style = useCellStyle(
    xPositions,
    yPositions,
    columnIndex,
    rowIndex,
    colSpan,
    rowSpan,
    column,
    viewportWidth,
  );

  const rowNode = api.rowByIndex(rowIndex);
  if (!rowNode) return null;
  return (
    <div style={style} className={clsx(rowBaseClx, row)}>
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
