import type { RowLayout, RowNormalRowLayout } from "../../+types.js";
import { Cell } from "../../cells/cell.js";
import { Row } from "../../rows/row/row.js";
import { RowFullWidth } from "../../rows/row-full-width.js";

export const RowHandler = (props: {
  rows: RowLayout<any>[];
  withStyles?: boolean;
  pinned?: boolean;
}) => {
  return props.rows.map((row) => {
    if (row.kind === "full-width") return <RowFullWidth row={row} key={row.id} />;

    return <Memo row={row} key={row.id} withStyles={props.withStyles} pinned={props.pinned} />;
  });
};

function RowFor<T>({
  row,
  withStyles,
  pinned,
}: {
  row: RowNormalRowLayout<T>;
  withStyles?: boolean;
  pinned?: boolean;
}) {
  const styles = withStyles
    ? {
        background: pinned
          ? "rgb(0,0,60)"
          : row.rowIndex % 2 === 0
            ? "rgb(0,0,0)"
            : "rgb(30,30,30)",
        color: "white",
        display: "flex",
        alignItems: "center",
      }
    : undefined;
  return (
    <Row row={row} accepted={["row"]}>
      {row.cells.map((cell) => {
        return <Cell cell={cell} key={cell.id} style={styles} />;
      })}
    </Row>
  );
}
const Memo = RowFor;
