import type { RowNode } from "@1771technologies/lytenyte-shared";
import type { CellParamsWithIndex, GridSpec } from "../types";
import type { CSSProperties } from "react";

export const RowGroupCell = <Spec extends GridSpec = GridSpec>({ api, row }: CellParamsWithIndex<Spec>) => {
  const label = getRowLabel(row);

  const depth = row.kind === "branch" ? row.depth : 0;

  return (
    <div
      data-ln-component-group-cell
      data-ln-component-group-cell-expanded={api.rowIsExpanded(row)}
      data-ln-component-group-cell-expandable={api.rowIsExpandable(row)}
      style={{ "--ln-row-depth": depth } as CSSProperties}
    >
      {row.kind === "branch" && row.expandable && (
        <button
          data-ln-component-group-cell-expander
          onClick={() => api.rowGroupToggle(row.id)}
          aria-label="toggle the row group expansion state"
        >
          <CaretRight />
        </button>
      )}
      <div>{label}</div>
    </div>
  );
};

function getRowLabel(row: RowNode<any>) {
  if (row.kind === "leaf") return "";
  if (row.kind === "aggregated") return row.id === "ln-pivot-grand-total" ? "Grand Total" : row.id;

  return row.key === null ? "(blank)" : row.key;
}

function CaretRight() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentcolor" viewBox="0 0 256 256">
      <path d="M181.66,133.66l-80,80A8,8,0,0,1,88,208V48a8,8,0,0,1,13.66-5.66l80,80A8,8,0,0,1,181.66,133.66Z"></path>
    </svg>
  );
}
