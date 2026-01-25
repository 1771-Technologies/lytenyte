import "@1771technologies/lytenyte-pro-experimental/pill-manager.css";
import "@1771technologies/lytenyte-pro-experimental/components.css";
import "@1771technologies/lytenyte-pro-experimental/light-dark.css";
import { salesData, type SaleDataItem } from "@1771technologies/grid-sample-data/sales-data";
import {
  computeField,
  Grid,
  PillManager,
  RowGroupCell,
  useClientDataSource,
} from "@1771technologies/lytenyte-pro-experimental";
import {
  AgeGroup,
  CostCell,
  CountryCell,
  DateCell,
  GenderCell,
  NumberCell,
  ProfitCell,
} from "./components.jsx";
import { sum } from "es-toolkit";
import { useMemo, useState } from "react";

export interface GridSpec {
  readonly data: SaleDataItem;
  readonly column: {
    pivotable?: boolean;
  };
}

export const columns: Grid.Column<GridSpec>[] = [
  { id: "date", name: "Date", cellRenderer: DateCell, width: 110 },
  { id: "customerAge", name: "Age", type: "number", width: 80 },
  { id: "ageGroup", name: "Age Group", cellRenderer: AgeGroup, width: 110, pivotable: true },
  { id: "customerGender", name: "Gender", cellRenderer: GenderCell, width: 80, pivotable: true },
  { id: "country", name: "Country", cellRenderer: CountryCell, width: 150, pivotable: true },
  { id: "orderQuantity", name: "Quantity", type: "number", width: 60 },
  { id: "unitPrice", name: "Price", type: "number", width: 80, cellRenderer: NumberCell },
  { id: "cost", name: "Cost", width: 80, type: "number", cellRenderer: CostCell },
  { id: "revenue", name: "Revenue", width: 80, type: "number", cellRenderer: ProfitCell },
  { id: "profit", name: "Profit", width: 80, type: "number", cellRenderer: ProfitCell },
  { id: "state", name: "State", width: 150, pivotable: true },
  { id: "product", name: "Product", width: 160, pivotable: true },
  { id: "productCategory", name: "Category", width: 120, pivotable: true },
  { id: "subCategory", name: "Sub-Category", width: 160, pivotable: true },
];

const base: Grid.ColumnBase<GridSpec> = { width: 120 };

const group: Grid.RowGroupColumn<GridSpec> = {
  cellRenderer: RowGroupCell,
  width: 200,
};

const aggSum: Grid.T.Aggregator<GridSpec["data"]> = (field, data) => {
  const values = data.map((x) => computeField<number>(field, x));
  return sum(values);
};

export default function PivotDemo() {
  const [colPivots, setColPivots] = useState<PillManager.T.PillItem[]>(() =>
    columns
      .filter((x) => x.pivotable)
      .map((x) => ({ id: x.id, name: x.name ?? x.id, active: x.id === "ageGroup" })),
  );
  const [rowPivots, setRowPivots] = useState<PillManager.T.PillItem[]>(() => {
    const pivotables = columns
      .filter((x) => x.pivotable)
      .map((x) => ({
        id: x.id,
        name: x.name ?? x.id,
        active: x.id === "country",
      }));

    const active = [...pivotables.filter((x) => x.active)];
    const notActive = [...pivotables.filter((x) => !x.active)];

    return [...active, ...notActive];
  });

  const ds = useClientDataSource<GridSpec>({
    data: salesData,
    pivotMode: true,
    pivotModel: {
      columns: colPivots.filter((x) => x.active),
      rows: rowPivots.filter((x) => x.active),
      measures: [
        {
          dim: { id: "profit", name: "Profit", type: "number", cellRenderer: ProfitCell, width: 120 },
          fn: "sum",
        },
      ],
    },
    aggregateFns: { sum: aggSum },
  });

  const pillRows = useMemo<PillManager.T.PillRow[]>(() => {
    const colPivotPills = colPivots.map((x) => {
      return {
        id: x.id,
        active: x.active,
        movable: x.active,
        name: x.name ?? x.id,
        data: x,
        removable: true,
      };
    });
    const rowPivotPills = rowPivots.map((x) => {
      return {
        id: x.id,
        active: x.active,
        movable: x.active,
        name: x.name ?? x.id,
        data: x,
        removable: true,
      };
    });
    return [
      {
        id: "column-pivots",
        label: "Column Pivots",
        type: "column-pivots",
        pills: colPivotPills,
        // accepts: ["row-pivots"],
      },
      {
        id: "row-pivots",
        label: "Row Pivots",
        type: "row-pivots",
        pills: rowPivotPills,
        // accepts: ["column-pivots"],
      },
    ];
  }, [colPivots, rowPivots]);

  const pivotProps = ds.usePivotProps();
  return (
    <>
      <div>
        <PillManager
          rows={pillRows}
          onPillItemActiveChange={(p) => {
            if (p.row.id === "column-pivots") {
              setColPivots((prev) => {
                return prev.map((x) => {
                  if (x.id === p.item.id) return { ...x, active: p.item.active };
                  return x;
                });
              });
            } else if (p.row.id === "row-pivots") {
              setRowPivots((prev) => {
                return prev.map((x) => {
                  if (x.id === p.item.id) return { ...x, active: p.item.active };
                  return x;
                });
              });
            }
          }}
          onPillRowChange={(ev) => {
            for (const changed of ev.changed) {
              const activeFirst = changed.pills.filter((x) => x.active);
              const nonActive = changed.pills.filter((x) => !x.active);
              if (changed.id === "column-pivots") {
                setColPivots([...activeFirst, ...nonActive]);
              }
              if (changed.id === "row-pivots") {
                setRowPivots([...activeFirst, ...nonActive]);
              }
            }
          }}
        />
      </div>
      <div className="ln-grid" style={{ height: 500 }}>
        <Grid columns={columns} rowSource={ds} columnBase={base} rowGroupColumn={group} {...pivotProps} />
      </div>
    </>
  );
}
