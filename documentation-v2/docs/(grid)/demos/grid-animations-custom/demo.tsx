import "@1771technologies/lytenyte-pro/components.css";
import "@1771technologies/lytenyte-pro/light-dark.css";
import { salesData, type SaleDataItem } from "@1771technologies/grid-sample-data/sales-data";
import { Grid, useClientDataSource } from "@1771technologies/lytenyte-pro";
import {
  AgeGroup,
  CostCell,
  CountryCell,
  DateCell,
  GenderCell,
  NumberCell,
  ProfitCell,
} from "./components.jsx";
import { useMemo, useState } from "react";

export interface GridSpec {
  readonly data: SaleDataItem;
}

const initialColumns: Grid.Column<GridSpec>[] = [
  { id: "date", name: "Date", cellRenderer: DateCell, width: 110 },
  { id: "age", name: "Age", type: "number", width: 80 },
  { id: "ageGroup", name: "Age Group", cellRenderer: AgeGroup, width: 160 },
  { id: "customerGender", name: "Gender", cellRenderer: GenderCell, width: 100 },
  { id: "country", name: "Country", cellRenderer: CountryCell, width: 150 },
  { id: "orderQuantity", name: "Quantity", type: "number", width: 60 },
  { id: "unitPrice", name: "Price", type: "number", width: 80, cellRenderer: NumberCell },
  { id: "cost", name: "Cost", width: 80, type: "number", cellRenderer: CostCell },
  { id: "revenue", name: "Revenue", width: 80, type: "number", cellRenderer: ProfitCell },
  { id: "profit", name: "Profit", width: 80, type: "number", cellRenderer: ProfitCell },
  { id: "state", name: "State", width: 150 },
  { id: "product", name: "Product", width: 160 },
  { id: "productCategory", name: "Category", width: 120 },
  { id: "subCategory", name: "Sub-Category", width: 160 },
];

const base: Grid.ColumnBase<GridSpec> = { width: 120 };

// Stable IDs keyed by object identity so row move animations track correctly across shuffles.
const rowIdMap = new Map(salesData.map((item, i) => [item, String(i)]));
const leafIdFn = (d: SaleDataItem) => rowIdMap.get(d) ?? "unknown";

const rowAnimate = {
  move: {
    duration: 500,
    // Spring-like overshoot so rows settle with a slight bounce.
    easing: "cubic-bezier(0.34, 1.56, 0.64, 1)",
  },
  enter: {
    duration: 300,
    easing: "ease-out",
    type: () => [
      { opacity: 0, transform: "translateY(20px)" },
      { opacity: 1, transform: "translateY(0)" },
    ],
  },
  exit: {
    duration: 200,
    easing: "ease-in",
    type: () => [
      { opacity: 1, transform: "translateY(0)" },
      { opacity: 0, transform: "translateY(-20px)" },
    ],
  },
};

const columnAnimate = {
  move: {
    duration: 500,
    easing: "cubic-bezier(0.34, 1.56, 0.64, 1)",
  },
  enter: {
    duration: 250,
    easing: "ease-out",
    type: () => [
      { opacity: 0, transform: "translateX(-12px)" },
      { opacity: 1, transform: "translateX(0)" },
    ],
  },
  exit: {
    duration: 200,
    easing: "ease-in",
    type: () => [
      { opacity: 1, transform: "translateX(0)" },
      { opacity: 0, transform: "translateX(12px)" },
    ],
  },
};

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function GridDemo() {
  const [rowData, setRowData] = useState([...salesData]);
  const [hideAdults, setHideAdults] = useState(false);
  const [columns, setColumns] = useState(initialColumns);
  const [hideCountry, setHideCountry] = useState(false);

  const displayData = useMemo(
    () => (hideAdults ? rowData.filter((r) => r.ageGroup !== "Adults (35-64)") : rowData),
    [rowData, hideAdults],
  );

  const displayColumns = useMemo(
    () => columns.map((c) => (c.id === "country" ? { ...c, hide: hideCountry } : c)),
    [columns, hideCountry],
  );

  const ds = useClientDataSource<GridSpec>({ data: displayData, leafIdFn });

  return (
    <>
      <div className="border-ln-border flex gap-4 border-b px-2 py-2">
        <button data-ln-button="website" data-ln-size="mx" onClick={() => setRowData((d) => shuffle(d))}>
          Shuffle Rows
        </button>
        <button data-ln-button="website" data-ln-size="mx" onClick={() => setColumns((c) => shuffle(c))}>
          Shuffle Columns
        </button>
        <button data-ln-button="website" data-ln-size="mx" onClick={() => setHideAdults((h) => !h)}>
          Toggle Adults
        </button>
        <button data-ln-button="website" data-ln-size="mx" onClick={() => setHideCountry((h) => !h)}>
          Toggle Country
        </button>
      </div>
      <div className="ln-grid" style={{ height: 500 }}>
        {/*!next */}
        <Grid
          columns={displayColumns}
          columnBase={base}
          rowSource={ds}
          rowAnimate={rowAnimate}
          columnAnimate={columnAnimate}
        />
      </div>
    </>
  );
}
