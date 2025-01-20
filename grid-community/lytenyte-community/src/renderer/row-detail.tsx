import type { ApiCommunityReact } from "@1771technologies/grid-types";
import type { RowNode, RowPin } from "@1771technologies/grid-types/community";
import { RowDetailDefault } from "./renderers/row-detail-default";
import { useMemo } from "react";
import { getTransform } from "./get-transform";
import { sizeFromCoord } from "@1771technologies/js-utils";
import { t } from "@1771technologies/grid-design";

export interface RowDetailProps {
  readonly api: ApiCommunityReact<any>;
  readonly row: RowNode<any>;
  readonly yPositions: Uint32Array;
  readonly rowIndex: number;
  readonly height: number;
  readonly rowPin: RowPin;
}

export function RowDetail({ api, row, rowPin, yPositions, rowIndex, height }: RowDetailProps) {
  const sx = api.getState();
  const width = sx.internal.viewportInnerWidth.use();

  const Renderer = sx.rowDetailRenderer.use() ?? RowDetailDefault;

  const style = useMemo(() => {
    const isTop = rowPin === "top";
    const isBot = rowPin === "bottom";

    const rowCount = sx.internal.rowCount.peek();
    const rowTopCount = sx.internal.rowTopCount.peek();
    const rowBotCount = sx.internal.rowBottomCount.peek();

    const firstBotIndex = rowCount - rowBotCount;

    const offset = sizeFromCoord(rowIndex, yPositions) - height;

    const y = isBot
      ? yPositions[rowIndex] - yPositions[firstBotIndex]
      : isTop
        ? yPositions[rowIndex]
        : yPositions[rowIndex] - yPositions[rowTopCount];

    const transform = getTransform(0, y + offset);

    return { width, height, transform };
  }, [
    height,
    rowIndex,
    rowPin,
    sx.internal.rowBottomCount,
    sx.internal.rowCount,
    sx.internal.rowTopCount,
    width,
    yPositions,
  ]);

  return (
    <div
      style={style}
      className={css`
        box-sizing: border-box;
        background-color: ${t.colors.borders_ui_panel};
      `}
    >
      <Renderer api={api} row={row} />
    </div>
  );
}
