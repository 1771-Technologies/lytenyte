import { fastDeepMemo } from "@1771technologies/lytenyte-react-hooks";
import type { RowLayout, RowNormalRowLayout } from "../../+types";
import { Cell } from "../../cells/cell";
import { Row } from "../../rows/row/row";
import { RowFullWidth } from "../../rows/row-full-width";

export const RowHandler = fastDeepMemo((props: { rows: RowLayout<any>[] }) => {
  return props.rows.map((row) => {
    if (row.kind === "full-width") return <RowFullWidth row={row} key={row.id} />;

    return <RowFor row={row} key={row.id} />;
  });
});

function RowFor<T>({ row }: { row: RowNormalRowLayout<T> }) {
  return (
    <Row row={row} accepted={["row"]}>
      {row.cells.map((cell) => {
        return <Cell cell={cell} key={cell.id} />;
      })}
    </Row>
  );
}
