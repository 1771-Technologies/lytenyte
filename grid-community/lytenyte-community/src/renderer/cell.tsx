import { clsx, sizeFromCoord } from "@1771technologies/js-utils";
import { memo, useMemo, type CSSProperties } from "react";
import { getTransform } from "./get-transform";
import { t } from "@1771technologies/grid-design";
import type { ApiCommunityReact, ColumnCommunityReact } from "@1771technologies/grid-types";
import { CellRendererDefault } from "./renderers/cell-renderer-default";

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
  const height = sizeFromCoord(rowIndex, yPositions, rowSpan);
  const width = sizeFromCoord(columnIndex, xPositions, colSpan);

  const row = rowIndex % 2 ? rowClx : rowAltClx;

  const renderers = sx.cellRenderers.peek();
  const Renderer = useMemo(() => {
    const base = api.getState().columnBase.peek();
    const renderKey = column.cellRenderer ?? base.cellRenderer;
    if (!renderKey) return CellRendererDefault;

    if (typeof renderKey === "string") {
      const El = renderers[renderKey];
      if (!El) throw new Error(`Renderer with name ${renderKey} is not present in grid renderers.`);
      return El;
    }
    return renderKey;
  }, [api, column.cellRenderer, renderers]);

  const rowNode = api.rowByIndex(rowIndex);

  const pinStart = column.pin === "start";
  const pinEnd = column.pin === "end";

  const viewportWidth = sx.internal.viewportInnerWidth.use();
  const styles = useMemo(() => {
    const transform = getTransform(xPositions[columnIndex], yPositions[rowIndex]);
    const style = { height, width, transform } as CSSProperties;

    if (pinStart) style.insetInlineStart = "0px";
    if (pinEnd) {
      style.insetInlineStart = "0px";
      const x = xPositions[columnIndex] - xPositions.at(-1)! + viewportWidth;

      style.transform = getTransform(x, yPositions[rowIndex]);
    }

    return style;
  }, [
    columnIndex,
    height,
    pinEnd,
    pinStart,
    rowIndex,
    viewportWidth,
    width,
    xPositions,
    yPositions,
  ]);

  if (!rowNode) return null;
  return (
    <div
      style={styles}
      className={clsx(
        rowBaseClx,
        row,
        (pinStart || pinEnd) &&
          css`
            position: sticky;
            z-index: 2;
          `,
      )}
    >
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
