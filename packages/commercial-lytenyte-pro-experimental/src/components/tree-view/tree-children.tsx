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
}: TreeViewChildParams<T>) {
  const depth = row.depth;

  if (row.kind === "branch")
    return (
      <div
        data-ln-tree-view-cell={row.kind}
        data-ln-tree-view-cell-expanded={row.kind === "branch" && row.expanded}
        data-ln-tree-view-cell-expandable={row.kind === "branch" ? row.expandable : undefined}
        style={{ "--ln-row-depth": depth } as CSSProperties}
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
    <div data-ln-tree-view-cell={row.kind} style={{ "--ln-row-depth": depth } as CSSProperties}>
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
