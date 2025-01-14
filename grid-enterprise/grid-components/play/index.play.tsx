import { makeStore } from "@1771technologies/grid-store-enterprise";
import { bankColumns } from "./helpers";
import { GridProvider } from "../src/provider/grid-provider";
import { ColumnTree } from "../src/column-manager/column-tree/column-tree";
import { RowGroupsBox } from "../src/column-manager/box-drop-zone/row-groups-box";
import { ColumnPivotsBox } from "../src/column-manager/box-drop-zone/column-pivots-box";
import { MeasuresBox } from "../src/column-manager/box-drop-zone/measures-box";
import { ValuesBox } from "../src/column-manager/box-drop-zone/values-box";

const grid = makeStore({
  gridId: "x",
  columns: bankColumns,
  columnBase: { sortable: true, movable: true, measureFunc: "avg", measureFuncsAllowed: ["avg"] },
  rowGroupModel: ["education", "day"],
  columnPivotModel: ["loan"],
  measureModel: ["poutcome"],
});

export default function Home() {
  return (
    <GridProvider grid={grid}>
      <div style={{ width: "100vw", height: "100vh" }}>
        <div
          className={css`
            display: grid;
            grid-template-columns: 400px 400px;
            height: 100%;
          `}
        >
          <div>
            <ColumnTree />
          </div>
          <div
            className={css`
              padding-block: 24px;
              display: flex;
              flex-direction: column;
              gap: 24px;
            `}
          >
            <RowGroupsBox />
            <ColumnPivotsBox />
            <MeasuresBox />
            <ValuesBox />
          </div>
        </div>
      </div>
    </GridProvider>
  );
}
