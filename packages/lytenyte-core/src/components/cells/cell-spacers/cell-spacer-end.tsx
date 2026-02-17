import { memo } from "react";
import { $colEndBound, $colEndStart } from "../../../selectors.js";
import { useBounds } from "../../../root/root-context.js";

interface CellSpacerEndProps {
  readonly viewportWidth: number;
  readonly visibleEndCount: number;
  readonly xPositions: Uint32Array;
}
function CellSpacerEndBase({ viewportWidth, visibleEndCount, xPositions }: CellSpacerEndProps) {
  const bounds = useBounds();
  const colCenterEnd = bounds.useValue($colEndBound);
  const colEndStart = bounds.useValue($colEndStart);

  const startOffset = xPositions[colCenterEnd];
  let offset = xPositions[colEndStart] - startOffset;

  if (xPositions.at(-1)! < viewportWidth) {
    offset = viewportWidth - xPositions.at(-1)!;
  }

  if (visibleEndCount === 0) return null;

  return <div style={{ display: "inline-block", width: offset, height: 0 }} />;
}

export const CellSpacerEnd = memo(CellSpacerEndBase);
