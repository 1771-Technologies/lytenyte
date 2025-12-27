import { useTheme } from "@1771technologies/play-frame";
import "@1771technologies/lytenyte-design/design.css";
import "@1771technologies/lytenyte-design/font.css";
import "@1771technologies/lytenyte-design/dark.css";
import "@1771technologies/lytenyte-design/light.css";
import "@1771technologies/lytenyte-design/teal.css";
import "@1771technologies/lytenyte-design/term.css";

import "../../main.css";
import { useMemo, useRef } from "react";
import { Grid } from "../index.js";
import { UseTreeDataSource } from "../data-source-tree/use-tree-data-source.js";
import { RowGroupCell } from "../components/row-group-cell.js";

const columns: Grid.Column[] = [
  {
    id: "x",
  },
];
export default function Experimental() {
  const ds = UseTreeDataSource({
    data: {
      one: { x: 12 },
      two: {
        x: 12,
        fire: {
          x: 11,
        },
        axel: {
          x: 12,
          timer: {
            x: 1,
            fly: {
              y: 1,
              x: 0.5,
            },
          },
        },
      },
    },
  });
  const { resolvedTheme } = useTheme();

  const ref = useRef<Grid.API>(null);
  return (
    <>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div
          className={"ln-grid " + (resolvedTheme === "light" ? "ln-light" : "ln-dark")}
          style={{ height: "90vh", width: "90vw" }}
        >
          <Grid
            columns={columns}
            rowSource={ds}
            ref={ref}
            rowGroupColumn={useMemo(() => {
              return {
                cellRenderer: RowGroupCell,
              };
            }, [])}
          />
        </div>
      </div>
    </>
  );
}
