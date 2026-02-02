//#start
import "@1771technologies/lytenyte-pro-experimental/light-dark.css";
import {
  computeField,
  Grid,
  useClientDataSource,
  type RowSourceClient,
} from "@1771technologies/lytenyte-pro-experimental";
import { stockData } from "@1771technologies/grid-sample-data/stock-data-smaller";
import {
  PercentCell,
  CurrencyCell,
  SymbolCell,
  CompactNumberCell,
  CurrencyLabel,
  PercentLabel,
  CompactNumberLabel,
} from "./components.jsx";
import { useMemo, useState } from "react";
import { sum } from "es-toolkit";

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
  //!next 3
  const [rect, setRect] = useState<Grid.T.DataRect[]>([
    { rowStart: 1, rowEnd: 4, columnStart: 1, columnEnd: 2 },
  ]);

  return (
    <>
      <div className="ln-grid ln-cell:text-xs ln-cell:font-light ln-header:text-xs" style={{ height: 500 }}>
        <Grid
          columns={columns}
          columnBase={base}
          rowSource={ds}
          cellSelectionMode="range"
          cellSelections={rect}
          onCellSelectionChange={setRect} //!
        />
      </div>
      <div className="border-ln-border flex h-fit items-center border-t">
        {rect.length > 0 && <StatusBar rect={rect[0]} source={ds} />}
      </div>
    </>
  );
}

function StatusBar({ rect, source }: { rect: Grid.T.DataRect; source: RowSourceClient }) {
  const selectedNumberColumns = useMemo(() => {
    const selected: Grid.Column<GridSpec>[] = [];
    for (let i = rect.columnStart; i < rect.columnEnd; i++) {
      const col = columns[i];

      if (col.type === "number") selected.push(col);
    }

    return selected;
  }, [rect.columnEnd, rect.columnStart]);

  const summedValues = useMemo(() => {
    const result = Object.fromEntries(selectedNumberColumns.map((x) => [x.id, []])) as Record<
      string,
      number[]
    >;
    for (let i = rect.rowStart; i < rect.rowEnd; i++) {
      const row = source.rowByIndex(i).get();

      if (!row) continue;

      for (const c of selectedNumberColumns) {
        const value = computeField(c.field ?? c.id, row);
        if (typeof value === "number") result[c.id].push(value);
      }
    }

    return result;
  }, [rect.rowEnd, rect.rowStart, selectedNumberColumns, source]);

  if (selectedNumberColumns.length === 0) return null;

  return (
    <div className="flex w-full flex-wrap items-center justify-center gap-4 px-2 py-2">
      {Object.entries(summedValues).map(([id, values]) => {
        const avg = sum(values) / values.length;
        const column = columns.find((x) => x.id === id)!;

        return (
          <div className="flex items-center justify-center gap-2 text-xs" key={id}>
            <span className="text-ln-text-dark text-nowrap font-semibold">
              Avg. {column?.name ?? column.id}:
            </span>
            {(id === "price" || id === "eps") && <CurrencyLabel value={avg} />}
            {id === "change" && <PercentLabel value={avg} />}
            {id === "volume" && <CompactNumberLabel value={avg} />}
          </div>
        );
      })}
    </div>
  );
}
