import { useMemo, type CSSProperties, type ReactNode } from "react";
import type { Column, GridSpec, RowNode } from "../../types";
import { TreeView } from "../tree-view/index.js";
import { Checkbox } from "../checkbox/checkbox.js";
import type { Grid } from "../..";

export interface ColumnManagerProps<Spec extends GridSpec = GridSpec> {
  readonly columns: Column<Spec>[];
  readonly onColumnsChange: (change: Column<Spec>[]) => void;
  readonly base?: Grid.ColumnBase<Spec>;
  readonly endElement?: (params: { columns: Column<Spec>[]; row: RowNode<Spec["data"]> }) => ReactNode;
}

export function ColumnManager<Spec extends GridSpec = GridSpec>({
  columns,
  base,
  onColumnsChange,
  endElement,
}: ColumnManagerProps<Spec>) {
  const items = useMemo(() => {
    return columns.map((x) => ({ id: x.id, path: x.groupPath ?? [], name: x.name, column: x }));
  }, [columns]);

  return (
    <TreeView
      items={items}
      rowSelectionEnabled={false}
      draggable
      rowHeight={30}
      rowSelectAllShow={false}
      defaultExpansion
      onItemsReordered={(x) => {
        const columns = x.map((x) => x.column);
        onColumnsChange(columns);
      }}
    >
      {({ row, leafs, toggle, dragProps, isOver, isBefore }) => {
        const depth = row.depth;

        const items = leafs();

        const end = endElement?.({ columns: items.map((x) => x.column), row });

        const isSelected = items.every((x) => !(x.column.hide ?? base?.hide));
        const isIndeterminate = !isSelected && items.some((x) => !(x.column.hide ?? base?.hide));

        const draggable = !!dragProps.draggable;

        const checkbox = (
          <Checkbox
            checked={isSelected}
            indeterminate={isIndeterminate}
            onChange={() => {
              if (isSelected) {
                onColumnsChange(
                  columns.map((x) => {
                    const c = items.find((c) => x.id === c.column.id);
                    if (!c) return x;

                    return { ...c.column, hide: true };
                  }),
                );
              } else {
                onColumnsChange(
                  columns.map((x) => {
                    const c = items.find((c) => x.id === c.column.id);
                    if (!c) return x;

                    return { ...c.column, hide: false };
                  }),
                );
              }
            }}
          />
        );

        if (row.kind === "branch")
          return (
            <div
              data-ln-tree-view-cell={row.kind}
              data-ln-tree-view-cell-expanded={row.kind === "branch" && row.expanded}
              data-ln-tree-view-cell-expandable={row.kind === "branch" ? row.expandable : undefined}
              data-ln-tree-over={isOver}
              data-ln-tree-before={isBefore}
              style={{ "--ln-row-depth": depth } as CSSProperties}
              {...dragProps}
            >
              {row.kind === "branch" && row.expandable && (
                <button
                  data-ln-tree-view-cell-expander
                  aria-label="toggle the row group expansion state"
                  onClick={() => toggle()}
                >
                  {!row.loadingGroup && <CaretRight />}
                </button>
              )}
              {draggable && (
                <div>
                  <DragDots />
                </div>
              )}
              {checkbox}
              <div style={{ flex: "1" }}>{row.key}</div>
              {end}
            </div>
          );

        return (
          <div
            data-ln-tree-view-cell={row.kind}
            data-ln-tree-over={isOver}
            data-ln-tree-before={isBefore}
            style={{ "--ln-row-depth": depth } as CSSProperties}
            {...dragProps}
          >
            {draggable && (
              <div>
                <DragDots />
              </div>
            )}
            {checkbox}
            <div style={{ flex: "1" }}>{row.data.name ?? row.data.id}</div>
            {end}
          </div>
        );
      }}
    </TreeView>
  );
}

function CaretRight() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentcolor" viewBox="0 0 256 256">
      <path d="M181.66,133.66l-80,80A8,8,0,0,1,88,208V48a8,8,0,0,1,13.66-5.66l80,80A8,8,0,0,1,181.66,133.66Z"></path>
    </svg>
  );
}
function DragDots() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentcolor" viewBox="0 0 256 256">
      <path d="M104,60A12,12,0,1,1,92,48,12,12,0,0,1,104,60Zm60,12a12,12,0,1,0-12-12A12,12,0,0,0,164,72ZM92,116a12,12,0,1,0,12,12A12,12,0,0,0,92,116Zm72,0a12,12,0,1,0,12,12A12,12,0,0,0,164,116ZM92,184a12,12,0,1,0,12,12A12,12,0,0,0,92,184Zm72,0a12,12,0,1,0,12,12A12,12,0,0,0,164,184Z"></path>
    </svg>
  );
}
