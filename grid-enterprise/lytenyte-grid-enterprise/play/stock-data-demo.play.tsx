import { GridFrame } from "@1771technologies/grid-components";
import { LyteNyteGrid, useClientDataSource, useLyteNyte } from "../src";
import { stockColumns } from "../stock-data/columns";
import { stockData } from "../stock-data/stocks";

export default function StockDataDemo() {
  const ds = useClientDataSource({
    data: stockData,
  });
  const grid = useLyteNyte({
    gridId: "stock-demo",
    columnBase: {
      sortable: true,
      resizable: true,
      movable: true,

      columnMenuGetItems: () => [
        {
          kind: "item",
          action: () => console.log("ABC"),
          id: "cx",
          label: "Try",
        },
      ],
    },
    columns: stockColumns,
    rowDataSource: ds,
  });

  return (
    <div
      className={css`
        flex: 1;
        display: flex;
        flex-direction: column;
        height: 100vh;
      `}
    >
      <GridFrame grid={grid}>
        <LyteNyteGrid grid={grid} />
      </GridFrame>
    </div>
  );
}
