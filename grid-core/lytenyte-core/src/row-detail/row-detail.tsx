import "./row-detail.css";

import { useMemo } from "react";
import { getTransform } from "../utils/get-transform";
import { sizeFromCoord } from "@1771technologies/js-utils";
import type { ApiCoreReact } from "@1771technologies/grid-types/core-react";
import type { RowNodeCore, RowPinCore } from "@1771technologies/grid-types/core";

export interface RowDetailProps {
  readonly api: ApiCoreReact<any>;
  readonly row: RowNodeCore<any>;
  readonly yPositions: Uint32Array;
  readonly rowIndex: number;
  readonly height: number;
  readonly rowPin: RowPinCore;
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
    <div style={style} className="lng1771-row-detail">
      <Renderer api={api} row={row} />
    </div>
  );
}

function RowDetailDefault() {
  return <div>Not Implemented</div>;
}
