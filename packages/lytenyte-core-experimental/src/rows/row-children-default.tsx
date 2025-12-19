import { memo } from "react";
import { Cell } from "../cells/cell.js";
import type { LayoutRow, LayoutRowWithCells } from "../layout.js";
import { RowFullWidth } from "./row-full-width.js";
import { Row } from "./row/row.js";

export function RowChildrenDefault(row: LayoutRow<any>) {
  if (row.kind === "full-width") return <RowFullWidth row={row} />;

  return <RowWithCellRenderer row={row} />;
}

const RowWithCellRenderer = memo(({ row }: { row: LayoutRowWithCells<any> }) => {
  return (
    <Row row={row}>
      {row.cells.map((cell) => {
        return <Cell cell={cell} key={cell.id} />;
      })}
    </Row>
  );
});
