import { useTheme } from "@1771technologies/play-frame";
import "@1771technologies/lytenyte-design/fonts.css";
import "../../css/grid-full.css";

import { useMemo, useRef } from "react";
import { Grid } from "../index.js";
import { useTreeDataSource } from "../data-source-tree/use-tree-data-source.js";
import { RowGroupCell } from "../components/row-group-cell.js";

const columns: Grid.Column[] = [
  {
    id: "x",
  },
];
export default function Experimental() {
  const ds = useTreeDataSource({
    filter: (v) => v.x > 1,
    data: {
      one: { x: 12 },
      two: {
        x: 11,
        fire: {
          x: 11,
        },
        axel: {
          x: 12,
          cooked: {
            x: 12,
          },
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
