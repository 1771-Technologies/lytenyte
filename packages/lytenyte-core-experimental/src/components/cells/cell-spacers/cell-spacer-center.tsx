import type { RowMeta } from "../../rows/row/context.js";
import { memo } from "react";
import { useBounds } from "../../../root/root-context.js";
import { $colStartBound } from "../../../selectors.js";

interface CellSpacerCenterProps {
  readonly xPositions: Uint32Array;
  readonly rowMeta: RowMeta;
  readonly visibleStartCount: number;
}

function CellSpacerCenterBase({ rowMeta, xPositions, visibleStartCount }: CellSpacerCenterProps) {
  const bounds = useBounds();
  const colStartEnd = bounds.useValue((x) => x.colStartEnd);
  const start = bounds.useValue($colStartBound);

  if (visibleStartCount > 0) return null;

  const colOffset = rowMeta.layout.cells.findIndex((c) => c.colIndex + c.colSpan - 1 >= start && !c.isDeadCol);
  const offset = xPositions[colOffset - colStartEnd];

  return <div style={{ display: "inline-block", width: offset, height: 0 }} />;
}

export const CellSpacerCenter = memo(CellSpacerCenterBase);
