import { makeStore } from "@1771technologies/grid-store-enterprise";
import { bankColumns } from "./helpers";
import { GridProvider } from "../src/provider/grid-provider";
import { t } from "@1771technologies/grid-design";
import { ColumnMenuDriver } from "../src/column-menu-driver/column-menu-driver";
import { TrashIcon } from "../src/icons/trash-icon";
import { MeasuresIcon } from "../src/column-manager/icons/measures-icon";

const grid = makeStore({
  gridId: "x",
  columns: bankColumns,
  columnBase: {
    sortable: true,
    movable: true,
    measureFuncsAllowed: ["avg"],
    columnMenuGetItems: () => [
      {
        kind: "item",
        action: () => console.log("ir an"),
        id: "x",
        label: "Alpha",
        icon: () => <TrashIcon />,
      },
      {
        kind: "item",
        action: () => console.log("c"),
        id: "v",
        label: "ZZ",
        icon: () => <MeasuresIcon />,
        endIcon: () => <div>X</div>,
      },
      { kind: "separator" },
      {
        kind: "submenu",
        id: "ev",
        label: "Extra",
        children: [
          { kind: "item", label: "for", action: () => {}, id: "bb" },
          { kind: "item", label: "for", action: () => {}, id: "bbc" },
        ],
      },
    ],
  },
  rowGroupModel: ["education", "day"],
  columnPivotModel: ["loan"],
  measureModel: ["poutcome"],
});

export default function Home() {
  return (
    <GridProvider grid={grid}>
      <div style={{ width: "100vw", height: "100vh", background: t.colors.gray_00 }}>
        <button onClick={(e) => grid.api.columnMenuOpen(bankColumns[0], e.currentTarget)}>
          Open Menu
        </button>
        <ColumnMenuDriver />
      </div>
    </GridProvider>
  );
}
