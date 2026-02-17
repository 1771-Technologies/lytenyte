import type { CSSProperties } from "react";
import type { TreeViewChildParams, TreeViewItem } from "./types";
import { Checkbox } from "../checkbox/checkbox.js";

export function TreeChildren<T extends TreeViewItem>({
  row,
  toggle,
  selectEnabled: selection,
  indeterminate,
  selected,
  handleSelect,
  dragProps,
  isOver,
  isBefore,
}: TreeViewChildParams<T>) {
  const depth = row.depth;

  const draggable = !!dragProps.draggable;

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
        {selection && (
          <Checkbox
            checked={selected}
            indeterminate={indeterminate}
            onClick={(e) => handleSelect({ target: e.target, shiftKey: e.shiftKey })}
          />
        )}
        <div>{row.key}</div>
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
      {selection && (
        <Checkbox
          checked={selected}
          indeterminate={indeterminate}
          onClick={(e) => handleSelect({ target: e.target, shiftKey: e.shiftKey })}
        />
      )}
      {row.data.name ?? row.data.id}
    </div>
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
