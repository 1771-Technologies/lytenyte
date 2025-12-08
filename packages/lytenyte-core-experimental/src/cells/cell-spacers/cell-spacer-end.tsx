import type { SpanLayout } from "@1771technologies/lytenyte-shared";
import type { Piece } from "../../hooks/use-piece.js";
import { memo } from "react";

interface CellSpacerEndProps {
  readonly bounds: Piece<SpanLayout>;
  readonly viewportWidth: number;
  readonly visibleEndCount: number;
  readonly xPositions: Uint32Array;
}
function CellSpacerEndBase({
  bounds,
  viewportWidth,
  visibleEndCount,
  xPositions,
}: CellSpacerEndProps) {
  const colCenterEnd = bounds.useValue((x) => x.colCenterEnd);
  const colEndStart = bounds.useValue((x) => x.colEndStart);

  const startOffset = xPositions[colCenterEnd];
  let offset = xPositions[colEndStart] - startOffset;

  if (xPositions.at(-1)! < viewportWidth) {
    offset = viewportWidth - xPositions.at(-1)!;
  }

  if (visibleEndCount === 0) return null;

  return <div style={{ display: "inline-block", width: offset, height: 0 }} />;
}

export const CellSpacerEnd = memo(CellSpacerEndBase);
