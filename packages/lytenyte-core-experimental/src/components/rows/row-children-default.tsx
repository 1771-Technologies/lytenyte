import { memo } from "react";
import { RowFullWidth } from "./row-full-width.js";
import { Row } from "./row/row.js";
import type { LayoutRow, LayoutRowWithCells } from "@1771technologies/lytenyte-shared";
import { Cell } from "../cells/cell.js";

export function RowChildrenDefault(row: LayoutRow) {
  if (row.kind === "full-width") return <RowFullWidth row={row} />;

  return <RowWithCellRenderer row={row} />;
}

const RowWithCellRenderer = memo(({ row }: { row: LayoutRowWithCells }) => {
  return (
    <Row key={row.id} row={row}>
      {row.cells.map((cell) => {
        return <Cell cell={cell} key={cell.id} />;
      })}
    </Row>
  );
});
