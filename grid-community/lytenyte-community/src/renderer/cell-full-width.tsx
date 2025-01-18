import { memo } from "react";

export interface CellFullWidthProps {
  readonly rowIndex: number;
  readonly yPositions: Uint32Array;
}

function CellFullWidthImpl({ rowIndex }: CellFullWidthProps) {
  return <div>Full width {rowIndex}</div>;
}
export const CellFullWidth = memo(CellFullWidthImpl);
