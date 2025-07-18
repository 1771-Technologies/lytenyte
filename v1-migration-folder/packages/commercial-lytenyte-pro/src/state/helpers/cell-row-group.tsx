import type { CellRendererParams } from "../../+types";

export function CellRowGroup<T>({ column, row, grid }: CellRendererParams<T>) {
  if (grid.api.rowIsLeaf(row)) return <div />;

  const multi = grid.state.rowGroupDisplayMode.get() === "multi-column";
  if (multi) {
    const index = grid.api.rowGroupColumnIndex(column);
    if (index !== row.depth) return <div />;
  }

  return (
    <div
      onClick={() => grid.api.rowGroupToggle(row)}
      style={{
        display: "flex",
        alignItems: "center",
        width: "100%",
        height: "100%",
        paddingInline: "8px",
        boxSizing: "border-box",
      }}
    >
      {row.key}
    </div>
  );
}
