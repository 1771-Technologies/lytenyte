import type { RowAggregated, RowGroup, RowLeaf, RowNode } from "@1771technologies/lytenyte-shared";
import type { API, CellParamsWithIndex, GridSpec } from "../types";
import type { CSSProperties, ReactNode, SVGProps } from "react";
import { useSlot, type SlotComponent } from "../hooks/use-slot/index.js";

export const RowGroupCell = <Spec extends GridSpec = GridSpec>({
  api,
  row,
  leafLabel,
  groupLabel,
  aggLabel,
  expansionSlot,
}: CellParamsWithIndex<Spec> & {
  leafLabel?: (row: RowLeaf<Spec["data"]>, api: API<Spec>) => ReactNode;
  groupLabel?: (row: RowGroup, api: API<Spec>) => ReactNode;
  aggLabel?: (row: RowAggregated, api: API<Spec>) => ReactNode;
  expansionSlot?: SlotComponent<{ readonly row: RowGroup; readonly api: API<Spec> }>;
}) => {
  const label = getRowLabel(row, api, leafLabel, groupLabel, aggLabel);

  const depth = row.depth;

  const slot = useSlot({
    slot:
      row.kind === "branch" && row.expandable
        ? (expansionSlot ?? (
            <button
              data-ln-component-group-cell-expander
              data-ln-component-group-cell-error={!!row.errorGroup}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();

                if (row.errorGroup) {
                  // Retry will be defined on the server data source
                  if ((api as any).retry) (api as any).retry();
                } else {
                  api.rowGroupToggle(row.id);
                }
              }}
              aria-label="toggle the row group expansion state"
              disabled={row.loadingGroup}
            >
              {row.loadingGroup && !row.errorGroup && <LoadingSpinner />}
              {!row.loadingGroup && !row.errorGroup && <CaretRight />}
              {!!row.errorGroup && <WarningIcon />}
            </button>
          ))
        : undefined,
    state: { row, api },
  });

  return (
    <div
      data-ln-component-group-cell={row.kind}
      data-ln-component-group-cell-depth={depth}
      data-ln-component-group-cell-expanded={api.rowIsGroup(row) && row.expanded}
      data-ln-component-group-cell-expandable={api.rowIsGroup(row) ? row.expandable : undefined}
      style={{ "--ln-row-depth": depth } as CSSProperties}
    >
      {slot}
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

function WarningIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="currentcolor"
      viewBox="0 0 256 256"
      {...props}
    >
      <path d="M236.8,188.09,149.35,36.22h0a24.76,24.76,0,0,0-42.7,0L19.2,188.09a23.51,23.51,0,0,0,0,23.72A24.35,24.35,0,0,0,40.55,224h174.9a24.35,24.35,0,0,0,21.33-12.19A23.51,23.51,0,0,0,236.8,188.09ZM222.93,203.8a8.5,8.5,0,0,1-7.48,4.2H40.55a8.5,8.5,0,0,1-7.48-4.2,7.59,7.59,0,0,1,0-7.72L120.52,44.21a8.75,8.75,0,0,1,15,0l87.45,151.87A7.59,7.59,0,0,1,222.93,203.8ZM120,144V104a8,8,0,0,1,16,0v40a8,8,0,0,1-16,0Zm20,36a12,12,0,1,1-12-12A12,12,0,0,1,140,180Z"></path>
    </svg>
  );
}
