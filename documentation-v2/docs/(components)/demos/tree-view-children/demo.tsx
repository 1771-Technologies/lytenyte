import "@1771technologies/lytenyte-pro/components.css";
import "@1771technologies/lytenyte-pro/light-dark.css";
import { TreeView } from "@1771technologies/lytenyte-pro";
import { items as initial } from "./data.js";
import { useState } from "react";
import { TrashIcon } from "@radix-ui/react-icons";

export default function ComponentDemo() {
  const [items, setItems] = useState(initial);

  return (
    <div
      style={{ minHeight: "400px" }}
      className="ln-grid flex flex-col items-center justify-center gap-4 py-4 md:flex-row"
    >
      <div className="bg-ln-bg-ui-panel border-ln-border-strong rounded-lg border p-2">
        <div className="w-75 h-75">
          <TreeView items={items} defaultExpansion={0} rowSelectionEnabled={false} rowSelectAllShow={false}>
            {({ row, toggle }) => {
              if (row.kind === "branch") {
                return (
                  <div style={{ paddingInlineStart: row.depth * 16 }} className="flex items-center gap-1">
                    <button
                      data-ln-tree-view-cell-expander
                      aria-label="toggle the row group expansion state"
                      onClick={() => toggle()}
                    >
                      <CaretRight />
                    </button>
                    <div>{row.key}</div>
                  </div>
                );
              }

              return (
                <div className="flex w-full items-center" style={{ paddingInlineStart: row.depth * 16 + 20 }}>
                  <div className="flex-1">{row.data.name ?? row.data.id}</div>
                  <button
                    data-ln-button="secondary"
                    data-ln-icon
                    data-ln-size="md"
                    onClick={() => {
                      setItems((prev) => prev.filter((x) => x.id !== row.data.id));
                    }}
                  >
                    <TrashIcon />
                  </button>
                </div>
              );
            }}
          </TreeView>
        </div>
      </div>
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
