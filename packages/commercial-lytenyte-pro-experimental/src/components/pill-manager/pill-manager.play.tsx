import "@1771technologies/lytenyte-design/light-dark.css";
import "./pill-manager.css";
import { PillManager } from "./root.js";
import { useState } from "react";
import type { PillRowSpec } from "./types";
import type { Column } from "../../types";

interface GridSpec {
  readonly column: { groupable?: boolean };
}

const columns: Column<GridSpec>[] = [
  { id: "age", name: "bob", groupPath: ["Alpha", "Beta"], type: "number" },
  { id: "marital", groupPath: ["Alpha"] },
  { id: "default", groupPath: ["Top Dog"] },
  { id: "housing" },
  { id: "loan" },
  { id: "contact", groupPath: ["Alpha", "Beta", "Carlson"] },
  { id: "day", groupPath: ["Alpha", "Beta"] },
  { id: "month", groupPath: ["Alpha"] },
  { id: "duration" },
  { id: "campaign" },
  { id: "pdays", groupPath: ["Carlson"] },
  { id: "previous", groupPath: ["Carlson", "Delta"] },
  { id: "poutcome" },
  { id: "y" },
];

export default function Demo() {
  const [state, setState] = useState<PillRowSpec[]>([
    {
      id: "columns",
      type: "columns",
      label: "Columns",
      pills: columns.map((x) => ({ ...x, active: !x.hide, movable: true })),
    },
  ]);

  return (
    <div style={{ display: "flex", gap: 8, flexDirection: "column" }}>
      <PillManager
        rows={state}
        onActiveChange={(p) => {
          setState((prev) => {
            const next = [...prev];
            next.splice(p.index, 1, p.row);

            return next;
          });
        }}
      />
    </div>
  );
}
