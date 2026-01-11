//#start
import "./demo.css";
import "@1771technologies/lytenyte-pro-experimental/light-dark.css";
import { Grid, useClientDataSource } from "@1771technologies/lytenyte-pro-experimental";
import { stockData } from "@1771technologies/grid-sample-data/stock-data-smaller";
import { PercentCell, CurrencyCell, SymbolCell, CompactNumberCell } from "./components.jsx";
import { useMemo } from "react";

type StockData = (typeof stockData)[number];

export interface GridSpec {
  readonly data: StockData;
}

const columns: Grid.Column<GridSpec>[] = [
  { field: 0, id: "symbol", name: "Symbol", cellRenderer: SymbolCell, width: 220 },
  { field: 3, id: "price", type: "number", name: "Price", cellRenderer: CurrencyCell, width: 110 },
  { field: 5, id: "change", type: "number", name: "Change", cellRenderer: PercentCell, width: 130 },
  { field: 11, id: "eps", name: "EPS", type: "number", cellRenderer: CurrencyCell, width: 130 },
  { field: 6, id: "volume", name: "Volume", type: "number", cellRenderer: CompactNumberCell, width: 130 },
];
//#end

const base: Grid.ColumnBase<GridSpec> = { widthFlex: 1 };

export default function CellSelection() {
  const ds = useClientDataSource({ data: stockData });

  return (
    <div className="ln-grid ln-cell:text-xs ln-cell:font-light ln-header:text-xs" style={{ height: 500 }}>
      <Grid
        columns={columns}
        columnBase={base}
        rowSource={ds}
        cellSelectMode="range"
        events={useMemo<Grid.Events<GridSpec>>(
          () => ({
            viewport: {
              keyDown: async (ev, vp, api) => {
                if (ev.key === "c" && (ev.metaKey || ev.ctrlKey)) {
                  const rect = api.cellSelections()?.[0];
                  if (!rect) return;
                  const v = await api.exportData({ rect });

                  vp.classList.add("copy-flash");

                  const asString = v.data.map((x) => `${x.join(", ")}`).join("\n");
                  await navigator.clipboard.writeText(asString);

                  setTimeout(() => vp.classList.remove("copy-flash"), 1000);
                }
              },
            },
          }),
          [],
        )}
      />
    </div>
  );
}
