import "@1771technologies/lytenyte-pro/components.css";
import "@1771technologies/lytenyte-pro/light-dark.css";
import { TreeView } from "@1771technologies/lytenyte-pro";
import { items } from "./data.js";

export default function ComponentDemo() {
  return (
    <div style={{ height: "400px" }} className="ln-grid flex items-center justify-center">
      <div className="bg-ln-bg-ui-panel border-ln-border-strong rounded-lg border p-2">
        <div className="w-75 h-75">
          <TreeView items={items} defaultExpansion={0} />
        </div>
      </div>
    </div>
  );
}
