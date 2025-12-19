import type { RowMeta } from "../../rows/row/context.js";
import { memo } from "react";
import { useBounds } from "../../../root/root-context.js";
import { $colStartBound } from "../../../selectors.js";

interface CellSpacerStartProps {
  readonly xPositions: Uint32Array;
  readonly rowMeta: RowMeta;
  readonly visibleStartCount: number;
}

function CellSpacerStartBase({ xPositions: x, rowMeta, visibleStartCount }: CellSpacerStartProps) {
  const bounds = useBounds();
  const start = bounds.useValue($colStartBound);
  const colStartEnd = bounds.useValue((x) => x.colStartEnd);

  if (visibleStartCount === 0) return null;

  const colOffset = rowMeta.layout.cells.findIndex(
    (c) => !c.colPin && c.colIndex + c.colSpan - 1 >= start && !c.isDeadCol,
  );
  const offset = x[colOffset] - x[colStartEnd];

  return <div style={{ display: "inline-block", width: Number.isNaN(offset) ? 0 : offset, height: 0 }} />;
}

export const CellSpacerStart = memo(CellSpacerStartBase);
