import type { ColumnEnterpriseReact } from "@1771technologies/grid-types";
import { SortManager } from "../src/sort-manager/sort-manager";
import { makeStore } from "@1771technologies/grid-store-enterprise";
import { t } from "@1771technologies/grid-design";

const columns: ColumnEnterpriseReact<any>[] = [
  { id: "age", type: "number" },
  { id: "job" },
  { id: "balance", type: "number" },
  { id: "education" },
  { id: "marital" },
  { id: "default" },
  { id: "housing" },
  { id: "loan" },
  { id: "contact" },
  { id: "day" },
  { id: "month" },
  { id: "duration" },
  { id: "campaign" },
  { id: "pdays" },
  { id: "previous" },
  { id: "poutcome" },
  { id: "y" },
];

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
