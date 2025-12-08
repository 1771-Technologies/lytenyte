import type { SpanLayout } from "@1771technologies/lytenyte-shared";
import type { Piece } from "../../hooks/use-piece.js";
import type { RowMeta } from "../../rows/row/context.js";
import { memo } from "react";

interface CellSpacerStartProps {
  readonly bounds: Piece<SpanLayout>;
  readonly xPositions: Uint32Array;
  readonly rowMeta: RowMeta;
  readonly visibleStartCount: number;
}

function CellSpacerStartBase({
  xPositions: x,
  rowMeta,
  bounds,
  visibleStartCount,
}: CellSpacerStartProps) {
  const [start] = rowMeta.bounds;
  const colStartEnd = bounds.useValue((x) => x.colStartEnd);

  if (visibleStartCount === 0) return null;

  const colOffset = rowMeta.layout.cells.findIndex(
    (c) => !c.colPin && c.colIndex + c.colSpan - 1 >= start && !c.isDeadCol,
  );
  const offset = x[colOffset] - x[colStartEnd];

  return (
    <div style={{ display: "inline-block", width: Number.isNaN(offset) ? 0 : offset, height: 0 }} />
  );
}

export const CellSpacerStart = memo(CellSpacerStartBase);
