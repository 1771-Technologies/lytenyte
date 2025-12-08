import type { SpanLayout } from "@1771technologies/lytenyte-shared";
import type { Piece } from "../../hooks/use-piece.js";
import type { RowMeta } from "../../rows/row/context.js";
import { memo } from "react";

interface CellSpacerCenterProps {
  readonly bounds: Piece<SpanLayout>;
  readonly xPositions: Uint32Array;
  readonly rowMeta: RowMeta;
  readonly visibleStartCount: number;
}

function CellSpacerCenterBase({
  rowMeta,
  xPositions,
  bounds,
  visibleStartCount,
}: CellSpacerCenterProps) {
  const colStartEnd = bounds.useValue((x) => x.colStartEnd);

  if (visibleStartCount > 0) return null;

  const colBounds = rowMeta.bounds;
  const colOffset = rowMeta.layout.cells.findIndex(
    (c) => c.colIndex + c.colSpan - 1 >= colBounds[0] && !c.isDeadCol,
  );
  const offset = xPositions[colOffset - colStartEnd];

  return <div style={{ display: "inline-block", width: offset, height: 0 }} />;
}

export const CellSpacerCenter = memo(CellSpacerCenterBase);
