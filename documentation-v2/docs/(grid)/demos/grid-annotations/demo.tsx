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
import { useMemo, useState } from "react";

export interface GridSpec {
  readonly data: SaleDataItem;
}

export const columns: Grid.Column<GridSpec>[] = [
  { id: "date", name: "Date", cellRenderer: DateCell, width: 110 },
  { id: "product", name: "Product", width: 160 },
  { id: "unitPrice", name: "Price", type: "number", width: 80, cellRenderer: NumberCell },
  { id: "country", name: "Country", cellRenderer: CountryCell, width: 150 },
  { id: "revenue", name: "Revenue", width: 80, type: "number", cellRenderer: ProfitCell },
  { id: "profit", name: "Profit", width: 80, type: "number", cellRenderer: ProfitCell },
  { id: "productCategory", name: "Category", width: 120 },
  { id: "cost", name: "Cost", width: 80, type: "number", cellRenderer: CostCell },
  { id: "orderQuantity", name: "Quantity", type: "number", width: 60 },
  { id: "customerGender", name: "Gender", cellRenderer: GenderCell, width: 100 },
  { id: "age", name: "Age", type: "number", width: 80 },
  { id: "ageGroup", name: "Age Group", cellRenderer: AgeGroup, width: 160 },
  { id: "state", name: "State", width: 150 },
  { id: "subCategory", name: "Sub-Category", width: 160 },
];

const base: Grid.ColumnBase<GridSpec> = { width: 120 };

const colIndexMap = new Map(columns.map((c, i) => [c.id, i]));

const HIGHLIGHTS = [
  {
    colId: "orderQuantity",
    render: () => (
      <div
        style={{
          position: "absolute",
          inset: 0,
          border: "1px solid #3b82f6",
          background: "rgba(59, 130, 246, 0.1)",
          boxSizing: "border-box",
        }}
      />
    ),
  },
  {
    colId: "unitPrice",
    render: () => (
      <div
        style={{
          position: "absolute",
          inset: 0,
          border: "1px solid #8b5cf6",
          background: "rgba(139, 92, 246, 0.1)",
          boxSizing: "border-box",
        }}
      />
    ),
  },
  {
    colId: "cost",
    render: () => (
      <div
        style={{
          position: "absolute",
          inset: 0,
          border: "1px solid #f91616",
          background: "rgba(249, 115, 22, 0.1)",
          boxSizing: "border-box",
        }}
      />
    ),
  },
  {
    colId: "revenue",
    render: () => (
      <div
        style={{
          position: "absolute",
          inset: 0,
          border: "1px solid #22c55e",
          background: "rgba(34, 197, 94, 0.1)",
          boxSizing: "border-box",
        }}
      />
    ),
  },
  {
    colId: "profit",
    render: () => (
      <div
        style={{
          position: "absolute",
          inset: 0,
          border: "1px solid #10b981",
          background: "rgba(16, 185, 129, 0.1)",
          boxSizing: "border-box",
        }}
      />
    ),
  },
] satisfies { colId: string; render: Grid.Annotation<GridSpec>["render"] }[];

export default function GridDemo() {
  const [annotations, setAnnotations] = useState<Grid.Annotation<GridSpec>[]>([]);
  const ds = useClientDataSource<GridSpec>({ data: salesData });

  return (
    <div className="ln-grid" style={{ height: 500 }}>
      <Grid
        columns={columns}
        columnBase={base}
        rowSource={ds}
        annotations={annotations}
        events={useMemo<Grid.Events<GridSpec>>(() => {
          return {
            cell: {
              mouseEnter: ({ layout }) => {
                const rowStart = layout.rowIndex;
                const rowEnd = rowStart + 1;

                setAnnotations(
                  HIGHLIGHTS.map(({ colId, render }) => {
                    const colStart = colIndexMap.get(colId)!;
                    return {
                      id: `highlight-${colId}`,
                      anchor: { kind: "range", rowStart, rowEnd, colStart, colEnd: colStart + 1 },
                      render,
                    };
                  }),
                );
              },
              mouseLeave: () => setAnnotations([]),
            },
          };
        }, [])}
      />
    </div>
  );
}
