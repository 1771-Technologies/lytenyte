import type { ColumnProReact } from "@1771technologies/grid-types/pro-react";
import { LyteNyteGrid, useClientDataSource, useLyteNytePro } from "../src";
import { bankDataSmall } from "./data/bank-data-small";
import { useId } from "react";

const columns: ColumnProReact[] = [
  { id: "age", type: "number" },
  { id: "job", rowGroupable: true },
  { id: "balance", type: "number" },
  { id: "education", rowGroupable: true },
  { id: "marital", columnPivotable: true },
];

export default function App() {
  const ds = useClientDataSource({
    data: bankDataSmall,
  });

  const grid = useLyteNytePro({
    gridId: useId(),
    rowDataSource: ds,
    columns,
    rowGroupModel: ["job", "education"],

    columnPivotModeIsOn: true,
    columnPivotModel: ["marital"],

    measureModel: {
      balance: { fn: "sum" },
    },
  });

  return (
    <div>
      <div style={{ height: 500, display: "flex", flexDirection: "column" }}>
        <div style={{ flex: "1" }}>
          <LyteNyteGrid grid={grid} />
        </div>
      </div>
    </div>
  );
}
