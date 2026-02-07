import "@1771technologies/lytenyte-design/light-dark.css";
import "../../../css/pill-manager.css";
import { PillManager } from "./root.js";
import { useState } from "react";
import type { PillRowSpec } from "./types";
import type { Column } from "../../types";

interface GridSpec {
  readonly column: { grouped?: boolean };
}

const columns: Column<GridSpec>[] = [
  { id: "age", name: "bob", groupPath: ["Alpha", "Beta"], type: "number" },
  { id: "marital", groupPath: ["Alpha"] },
  { id: "default", groupPath: ["Top Dog"] },
  { id: "housing" },
  { id: "loan" },
  { id: "contact", groupPath: ["Alpha", "Beta", "Carlson"], grouped: true },
  { id: "day", groupPath: ["Alpha", "Beta"] },
  { id: "month", groupPath: ["Alpha"], grouped: true },
  { id: "duration", grouped: true },
  { id: "campaign", grouped: true },
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
      pills: columns.map((x) => ({ ...x, active: !x.hide, movable: true, tags: ["groupable"] })),
    },
    {
      id: "group",
      type: "row-pivots",
      label: "Row Groups",
      accepts: ["groupable"],
      pills: columns.filter((x) => x.grouped).map((x) => ({ ...x, active: true, movable: true })),
    },
  ]);

  return (
    <div style={{ display: "flex", gap: 8, flexDirection: "column" }}>
      <div style={{ height: "200px" }}>
        <PillManager
          rows={state}
          onPillRowChange={(p) => {
            setState(p.full);
          }}
          onPillItemThrown={(x) => {
            setState((prev) => {
              const next = [...prev];
              next[x.index] = {
                ...next[x.index],
                pills: next[x.index].pills.filter((item) => item.id !== x.item.id),
              };

              return next;
            });
          }}
          onPillItemActiveChange={(p) => {
            setState((prev) => {
              const next = [...prev];
              next.splice(p.index, 1, p.row);

              return next;
            });
          }}
        />
      </div>
      <div style={{ height: "200px", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ width: 400 }}>
          <PillManager
            orientation="vertical"
            rows={state}
            onPillRowChange={(p) => {
              setState(p.full);
            }}
            onPillItemThrown={(x) => {
              setState((prev) => {
                const next = [...prev];
                next[x.index] = {
                  ...next[x.index],
                  pills: next[x.index].pills.filter((item) => item.id !== x.item.id),
                };

                return next;
              });
            }}
            onPillItemActiveChange={(p) => {
              setState((prev) => {
                const next = [...prev];
                next.splice(p.index, 1, p.row);

                return next;
              });
            }}
          />
        </div>
      </div>
    </div>
  );
}
