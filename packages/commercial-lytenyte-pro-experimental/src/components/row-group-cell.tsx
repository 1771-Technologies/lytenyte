import type { RowAggregated, RowGroup, RowLeaf, RowNode } from "@1771technologies/lytenyte-shared";
import type { API, CellParamsWithIndex, GridSpec } from "../types";
import type { CSSProperties, ReactNode, SVGProps } from "react";

export const RowGroupCell = <Spec extends GridSpec = GridSpec>({
  api,
  row,
  leafLabel,
  groupLabel,
  aggLabel,
}: CellParamsWithIndex<Spec> & {
  leafLabel?: (row: RowLeaf<Spec["data"]>, api: API<Spec>) => ReactNode;
  groupLabel?: (row: RowGroup, api: API<Spec>) => ReactNode;
  aggLabel?: (row: RowAggregated, api: API<Spec>) => ReactNode;
}) => {
  const label = getRowLabel(row, api, leafLabel, groupLabel, aggLabel);

  const depth = row.depth;

  return (
    <div
      data-ln-component-group-cell={row.kind}
      data-ln-component-group-cell-depth={depth}
      data-ln-component-group-cell-expanded={api.rowIsGroup(row) && row.expanded}
      data-ln-component-group-cell-expandable={api.rowIsGroup(row) ? row.expandable : undefined}
      style={{ "--ln-row-depth": depth } as CSSProperties}
    >
      {row.kind === "branch" && row.expandable && (
        <button
          data-ln-component-group-cell-expander
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            api.rowGroupToggle(row.id);
          }}
          aria-label="toggle the row group expansion state"
          disabled={row.loadingGroup}
        >
          {row.loadingGroup && <LoadingSpinner />}
          {!row.loadingGroup && <CaretRight />}
        </button>
      )}
      <div>{label}</div>
    </div>
  );
};

function getRowLabel(
  row: RowNode<any>,
  api: API<any>,
  leafLabel?: (row: RowLeaf<any>, api: API<any>) => ReactNode,
  groupLabel?: (row: RowGroup, api: API<any>) => ReactNode,
  aggLabel?: (row: RowAggregated, api: API<any>) => ReactNode,
) {
  if (row.kind === "leaf") return leafLabel?.(row, api) ?? "";
  if (row.kind === "aggregated")
    return aggLabel?.(row, api) ?? (row.id === "ln-pivot-grand-total" ? "Grand Total" : row.id);

  return groupLabel?.(row, api) ?? (!row.key ? "(blank)" : row.key);
}

function CaretRight() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentcolor" viewBox="0 0 256 256">
      <path d="M181.66,133.66l-80,80A8,8,0,0,1,88,208V48a8,8,0,0,1,13.66-5.66l80,80A8,8,0,0,1,181.66,133.66Z"></path>
    </svg>
  );
}

function LoadingSpinner(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z"
        opacity={0.25}
      ></path>
      <path
        fill="currentColor"
        d="M12,4a8,8,0,0,1,7.89,6.7A1.53,1.53,0,0,0,21.38,12h0a1.5,1.5,0,0,0,1.48-1.75,11,11,0,0,0-21.72,0A1.5,1.5,0,0,0,2.62,12h0a1.53,1.53,0,0,0,1.49-1.3A8,8,0,0,1,12,4Z"
      >
        <animateTransform
          attributeName="transform"
          dur="0.75s"
          repeatCount="indefinite"
          type="rotate"
          values="0 12 12;360 12 12"
        ></animateTransform>
      </path>
    </svg>
  );
}
