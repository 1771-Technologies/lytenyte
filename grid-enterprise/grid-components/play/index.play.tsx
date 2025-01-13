import { makeStore } from "@1771technologies/grid-store-enterprise";
import { bankColumns } from "./helpers";
import { GridProvider } from "../src/provider/grid-provider";
import { ColumnTree } from "../src/column-manager/column-tree";

const grid = makeStore({
  columns: bankColumns,
  columnBase: { sortable: true },
});

export default function Home() {
  return (
    <GridProvider grid={grid}>
      <div style={{ width: "100vw", height: "100vh" }}>
        <ColumnTree />
      </div>
    </GridProvider>
  );
}
