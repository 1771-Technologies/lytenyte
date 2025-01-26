import type { CellSelectionRect } from "@1771technologies/grid-types/enterprise";
import { useMemo, type CSSProperties } from "react";
import { useGrid } from "../use-grid";
import { clsx, sizeFromCoord } from "@1771technologies/js-utils";
import { t } from "@1771technologies/grid-design";
import { getTransform } from "@1771technologies/lytenyte-grid-community/internal";

export function CellStyleRow({
  rect,
  isRowPinnedTop,
  isDeselect,
  isRowPinnedBottom,
}: {
  rect: CellSelectionRect;
  isRowPinnedTop?: boolean;
  isDeselect?: boolean;
  isRowPinnedBottom?: boolean;
}) {
  const { state, api } = useGrid();

  const xPositions = state.columnPositions.use();
  const yPositions = state.internal.rowPositions.use();
  const rtl = state.rtl.use();

  const startCount = state.columnVisibleStartCount.use();
  const centerCount = state.columnVisibleCenterCount.use();
  const paginate = state.paginate.use();
  const currentPage = state.paginateCurrentPage.use();

  const rowCount = state.internal.rowCount.use();
  const rowTopCount = state.internal.rowTopCount.use();
  const rowBotCount = state.internal.rowBottomCount.use();
  const vpWidth = state.internal.viewportInnerWidth.use();

  const style = useMemo(() => {
    const isStart = rect.columnStart < startCount;
    const isEnd = rect.columnStart >= startCount + centerCount;
    const isTop = isRowPinnedTop;
    const isBot = isRowPinnedBottom;

    const columnIndex = rect.columnStart;
    const rowIndex = rect.rowStart;

    const width = sizeFromCoord(rect.columnStart, xPositions, rect.columnEnd - rect.columnStart);
    const height = sizeFromCoord(rect.rowStart, yPositions, rect.rowEnd - rect.rowStart);

    const firstBotIndex = rowCount - rowBotCount;

    let paginateOffset = 0;
    if (paginate) {
      const [rowStart] = api.paginateRowStartAndEndForPage(currentPage);
      paginateOffset = yPositions[rowStart];
    }

    const x = isEnd
      ? xPositions[columnIndex] - xPositions.at(-1)! + vpWidth
      : xPositions[columnIndex];

    const y = isBot
      ? yPositions[rowIndex] - yPositions[firstBotIndex]
      : isTop
        ? yPositions[rowIndex]
        : yPositions[rowIndex] - yPositions[rowTopCount] - paginateOffset;

    const transform = getTransform(x * (rtl ? -1 : 1), y);
    const style = { height, width, transform } as CSSProperties;

    if (isStart || isEnd) {
      style.insetInlineStart = "0px";
      style.position = "sticky";
      style.zIndex = 2;
    }

    if (isTop || isBot) {
      style.position = "sticky";
      style.top = "0px";
      style.zIndex = isStart ? 4 : 3;
    }

    return style;
  }, [
    api,
    centerCount,
    currentPage,
    isRowPinnedBottom,
    isRowPinnedTop,
    paginate,
    rect.columnEnd,
    rect.columnStart,
    rect.rowEnd,
    rect.rowStart,
    rowBotCount,
    rowCount,
    rowTopCount,
    rtl,
    startCount,
    vpWidth,
    xPositions,
    yPositions,
  ]);

  return (
    <div
      style={style}
      className={clsx(
        css`
          grid-column-start: 1;
          grid-column-end: 2;
          grid-row-start: 1;
          grid-row-end: 2;
          background-color: ${t.colors.primary_30};
          border: 1px solid ${t.colors.primary_50};
        `,
        isDeselect &&
          css`
            background-color: ${t.colors.system_red_30};
            border: 1px solid ${t.colors.system_red_50};
          `,
      )}
    />
  );
}
