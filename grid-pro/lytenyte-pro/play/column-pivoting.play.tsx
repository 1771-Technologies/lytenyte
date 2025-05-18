const columns: ColumnProReact[] = [
  { id: "age", type: "number" },
  { id: "job", rowGroupable: true },
  { id: "balance", type: "number" },
  { id: "education", rowGroupable: true },
  { id: "marital", columnPivotable: true },
];

export function ColumnPivoting() {}

import { useClientDataSource } from "../src/use-client-data-source";
import { useLyteNytePro } from "../src/use-lytenyte";
import { LyteNyteGrid } from "../src";
import type { ColumnProReact } from "../src/types";
import { bankDataSmall } from "./data/bank-data-small";
import { useId } from "react";

export default function Play() {
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
    <div
      className={css`
        display: flex;
        flex-direction: column;
      `}
      style={{ width: "100vw", height: "100vh" }}
    >
      <div
        className={css`
          width: 100%;
        `}
      >
        <div
          className={css`
            padding: 20px;
            width: 200px;
          `}
        ></div>
      </div>
      <div
        className={css`
          flex: 1;
        `}
      >
        <LyteNyteGrid grid={grid} />
      </div>
    </div>
  );
}
