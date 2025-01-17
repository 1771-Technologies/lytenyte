import { makeStore } from "@1771technologies/grid-store-enterprise";
import { t } from "@1771technologies/grid-design";
import { columns } from "./helpers";
import { FilterContainer } from "../src/filters/filter-container/filter-container";
import { GridProvider } from "../src/provider/grid-provider";
import { FilterMenuDriver } from "../src/filter-menu-driver/filter-menu-driver";

const grid = makeStore({
  columns,
  columnBase: { sortable: true, filterSupportsIn: true, filterSupportsSimple: true },
  gridId: "x",
});

export default function Home() {
  return (
    <GridProvider grid={grid}>
      <div>
        <button onClick={(e) => grid.api.columnFilterMenuOpen(columns[1], e.currentTarget)}>
          Open Filter Menu
        </button>
        <FilterMenuDriver />
        <div
          className={css`
            width: 700px;
            height: 600px;
            background-color: ${t.colors.backgrounds_default};
          `}
        >
          <FilterContainer
            api={grid.api}
            column={columns[0]}
            showInFilter
            getTreeFilterItems={() => [
              {
                kind: "leaf",
                label: "Same",
                value: "Bob",
              },
              {
                kind: "leaf",
                label: "Cross",
                value: "BX",
              },
            ]}
          />
        </div>
      </div>
    </GridProvider>
  );
}
