import { makeStore } from "@1771technologies/grid-store-enterprise";
import { t } from "@1771technologies/grid-design";
import { columns } from "./helpers";
import { FilterContainer } from "../src/filters/filter-container/filter-container";

const grid = makeStore({
  columns,
  columnBase: { sortable: true },
  gridId: "x",
});

export default function Home() {
  return (
    <>
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
    </>
  );
}
