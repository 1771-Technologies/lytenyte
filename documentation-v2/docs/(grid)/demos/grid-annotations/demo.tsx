import "@1771technologies/lytenyte-pro/components.css";
import "@1771technologies/lytenyte-pro/light-dark.css";
import { salesData, type SaleDataItem } from "@1771technologies/grid-sample-data/sales-data";
import { Grid } from "@1771technologies/lytenyte-pro";
import { useClientDataSource } from "@1771technologies/lytenyte-pro";
import {
  AgeGroup,
  CostCell,
  CountryCell,
  DateCell,
  GenderCell,
  NumberCell,
  ProfitCell,
} from "./components.jsx";

export interface GridSpec {
  readonly data: SaleDataItem;
}

export const columns: Grid.Column<GridSpec>[] = [
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

const borderAnnotation: Grid.Annotation<GridSpec> = {
  id: "range-highlight",
  anchor: {
    kind: "range",
    rowStart: 2,
    rowEnd: 4,
    colStart: 1,
    colEnd: 3,
  },
  render: () => (
    <div
      style={{
        position: "absolute",
        inset: 0,
        border: "2px dashed #3b82f6",
        background: "rgba(59, 130, 246, 0.08)",
        boxSizing: "border-box",
      }}
    />
  ),
};

const annotations: Grid.Annotation<GridSpec>[] = [borderAnnotation];

const base: Grid.ColumnBase<GridSpec> = { width: 120 };

export default function GridDemo() {
  const ds = useClientDataSource<GridSpec>({
    data: salesData,
  });

  return (
    <div className="ln-grid" style={{ height: 500 }}>
      {/*!next */}
      <Grid columns={columns} columnBase={base} rowSource={ds} annotations={annotations} />
    </div>
  );
}
