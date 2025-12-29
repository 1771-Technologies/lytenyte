import type { RowLayout, RowNormalRowLayout } from "../../+types.js";
import { Row } from "../../grid/row.js";
import { Cell } from "../../grid/cell.js";
import { RowFullWidth } from "../../grid/row-full-width.js";

export const RowHandler = (props: { rows: RowLayout<any>[]; withStyles?: boolean; pinned?: boolean }) => {
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
          ? "light-dark(rgb(200,200,200), rgb(0,0,60))"
          : row.rowIndex % 2 === 0
            ? "light-dark(white, rgb(0,0,0))"
            : "light-dark(rgb(252, 243, 243), rgb(30,30,30))",
        color: "light-dark(black, white)",
        display: "flex",
        alignItems: "center",
        borderTop: row.rowIndex !== 0 ? "1px solid light-dark(gray, #444242)" : undefined,
        borderRight: "1px solid light-dark(gray, #444242)",
        paddingInline: "16px",
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
