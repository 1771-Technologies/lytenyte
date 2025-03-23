import { makeStore } from "@1771technologies/grid-store-enterprise";
import { bankColumns } from "./helpers";
import { GridProvider } from "../src/provider/grid-provider";
import { ColumnManagerFrame } from "../src/column-manager/column-manager-frame";
import { t } from "@1771technologies/grid-design";

const grid = makeStore({
  gridId: "x",
  columns: bankColumns,
  columnBase: { sortable: true, movable: true, measureFnsAllowed: ["avg"] },
  rowGroupModel: ["education", "day"],
  columnPivotModel: ["loan"],
  measureModel: ["poutcome"],
});

export default function Home() {
  return (
    <GridProvider grid={grid}>
      <div style={{ width: "100vw", height: "100vh", background: t.colors.gray_00 }}>
        <div
          className={css`
            display: grid;
            grid-template-columns: 460px 400px;
            height: 100%;
          `}
        >
          <ColumnManagerFrame showPivotToggle />
        </div>
      </div>
    </GridProvider>
  );
}
