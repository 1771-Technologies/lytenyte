import { fastDeepMemo } from "@1771technologies/lytenyte-react-hooks";
import type { RowLayout } from "../../+types";
import { RowFullWidth } from "../../grid/row-full-width.js";
import { Row } from "../../grid/row.js";
import { Cell } from "../../grid/cell.js";

export const RowHandler = fastDeepMemo((props: { rows: RowLayout<any>[] }) => {
  return props.rows.map((row) => {
    if (row.kind === "full-width")
      return <RowFullWidth row={row} key={row.id} style={{ background: "white" }} />;

    return (
      <Row key={row.id} row={row} accepted={["row"]}>
        {row.cells.map((cell) => {
          return <Cell cell={cell} key={cell.id}></Cell>;
        })}
      </Row>
    );
  });
});
