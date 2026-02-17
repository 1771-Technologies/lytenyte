import "@1771technologies/lytenyte-pro/components.css";
import "@1771technologies/lytenyte-pro/light-dark.css";
import type { Grid } from "@1771technologies/lytenyte-pro";
import { TreeView } from "@1771technologies/lytenyte-pro/components";
import { items } from "./data.js";
import { useMemo, useState } from "react";

export default function ComponentDemo() {
  const [rowsSelected, setSelection] = useState<Grid.T.RowSelectionLinked>({
    kind: "linked",
    selected: false,
    children: new Map([
      ["src", { id: "src", children: new Map([["src-index", { id: "src-index", selected: true }]]) }],
    ]),
  });

  const selectedRows = useMemo(() => {
    const selected = items.filter((item) => {
      const path = item.path;

      let node: Grid.T.RowSelectionLinked | Grid.T.RowSelectNode = rowsSelected;
      let selection = node.selected;

      // Find the node in the tree that is the closest match to our path. Path
      // IDs are joined by a '/' in the tree view. Once we've found our node
      // We check if it is selected.
      for (let i = 0; i < path.length; i++) {
        const p = path.slice(0, i + 1).join("/");
        const n: Grid.T.RowSelectNode | undefined = node.children?.get(p);
        if (!n) break;

        node = n;
        if (node.selected != undefined) selection = node.selected;
      }

      if (node.children?.get(item.id)?.selected !== undefined)
        selection = node.children.get(item.id)!.selected!;

      return !!selection;
    });

    return selected;
  }, [rowsSelected]);

  return (
    <div
      style={{ minHeight: "400px" }}
      className="ln-grid flex flex-col items-center justify-center gap-4 py-4 md:flex-row"
    >
      <div className="bg-ln-bg-ui-panel border-ln-border-strong rounded-lg border p-2">
        <div className="w-75 h-75">
          <TreeView
            items={items}
            defaultExpansion={0}
            rowSelection={rowsSelected}
            onRowSelectionChange={setSelection}
          />
        </div>
      </div>
      <div className="border-ln-border-strong rounded-lg border p-2">
        <div className="w-75 h-75 overflow-auto">
          <h3 className="text-center text-lg font-semibold">Selected Rows</h3>
          <ul>
            {selectedRows.map((x) => {
              const name = x.path.join(" / ") + " / " + (x.name ?? x.id);

              return <li key={name}>{name}</li>;
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
