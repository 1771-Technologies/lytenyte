import { memo } from "react";

export interface CellFullWidthProps {
  readonly rowIndex: number;
}

function CellFullWidthImpl({ rowIndex }: CellFullWidthProps) {
  return <div>Full width {rowIndex}</div>;
}
export const CellFullWidth = memo(CellFullWidthImpl);
