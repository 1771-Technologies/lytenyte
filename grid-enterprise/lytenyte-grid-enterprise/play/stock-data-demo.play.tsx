import { GridFrame } from "@1771technologies/grid-components";
import { LyteNyteGrid, useLyteNyte } from "../src";
import { stockColumns } from "../stock-data/columns";

export default function StockDataDemo() {
  const grid = useLyteNyte({
    gridId: "stock-demo",
    columns: stockColumns,
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
