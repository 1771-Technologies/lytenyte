import { SortManager } from "../src/sort-manager/sort-manager";
import { makeStore } from "@1771technologies/grid-store-enterprise";
import { t } from "@1771technologies/grid-design";
import { columns } from "./helpers";

const grid = makeStore({
  columns,
  columnBase: { sortable: true },
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
        <SortManager grid={grid} />
      </div>
    </>
  );
}
